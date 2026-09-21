import type { ApiErrorBody, TokenSubject } from './types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://khujigo-server.onrender.com/api/v1';

/**
 * Tokens are stored per subject, so being signed in as a customer and an admin
 * in the same browser doesn't clobber either session.
 */
const STORAGE: Record<TokenSubject, { access: string; refresh: string }> = {
  CUSTOMER: { access: 'khujigo_customer_access', refresh: 'khujigo_customer_refresh' },
  ADMIN: { access: 'khujigo_admin_access', refresh: 'khujigo_admin_refresh' },
};

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  tokenType: TokenSubject;
}

// ---------------------------------------------------------------- token store

const isBrowser = () => typeof window !== 'undefined';

export function getTokens(subject: TokenSubject): TokenSet | null {
  if (!isBrowser()) return null;
  try {
    const keys = STORAGE[subject];
    const accessToken = window.localStorage.getItem(keys.access);
    const refreshToken = window.localStorage.getItem(keys.refresh);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken, tokenType: subject };
  } catch {
    return null;
  }
}

export function setTokens(tokens: TokenSet): void {
  if (!isBrowser()) return;
  try {
    const keys = STORAGE[tokens.tokenType];
    window.localStorage.setItem(keys.access, tokens.accessToken);
    window.localStorage.setItem(keys.refresh, tokens.refreshToken);
  } catch {
    // storage unavailable (private mode) — the session just won't persist
  }
}

export function clearTokens(subject: TokenSubject): void {
  if (!isBrowser()) return;
  try {
    const keys = STORAGE[subject];
    window.localStorage.removeItem(keys.access);
    window.localStorage.removeItem(keys.refresh);
  } catch {
    // ignore
  }
}

// ------------------------------------------------------- auth failure signal

type AuthFailureListener = (subject: TokenSubject) => void;
const authFailureListeners = new Set<AuthFailureListener>();

/** Subscribe to "the session died" so AuthContext can drop the user. */
export function onAuthFailure(listener: AuthFailureListener): () => void {
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
}

function emitAuthFailure(subject: TokenSubject): void {
  authFailureListeners.forEach((listener) => listener(subject));
}

// -------------------------------------------------------------------- fetch

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function extractMessage(body: unknown, status: number): string {
  const parsed = body as ApiErrorBody | undefined;
  if (parsed?.message) {
    return Array.isArray(parsed.message)
      ? parsed.message.join(', ')
      : parsed.message;
  }
  return `Request failed with status ${status}`;
}

/** Shared so ten parallel 401s trigger a single refresh. */
let refreshInFlight: Promise<TokenSet | null> | null = null;

async function refreshTokens(current: TokenSet): Promise<TokenSet | null> {
  if (refreshInFlight) return refreshInFlight;

  const scope = current.tokenType === 'ADMIN' ? 'admin' : 'customer';

  refreshInFlight = (async () => {
    try {
      const response = await fetch(buildUrl(`/auth/${scope}/refresh`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!response.ok) return null;

      const data = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
        tokenType: TokenSubject;
      };
      const next: TokenSet = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
      };
      setTokens(next);
      return next;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  /**
   * Which audience this endpoint expects. `none` sends no credentials.
   */
  auth?: 'none' | 'customer' | 'admin';
  /**
   * When true, a missing or dead token falls back to an anonymous request
   * instead of ending the session (guest checkout, public review).
   */
  optional?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, query, auth = 'none', optional = false } = options;

  const subject: TokenSubject | null =
    auth === 'admin' ? 'ADMIN' : auth === 'customer' ? 'CUSTOMER' : null;

  const send = (accessToken?: string) =>
    fetch(buildUrl(path, query), {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

  let tokens = subject ? getTokens(subject) : null;
  let response = await send(tokens?.accessToken);

  // One silent refresh attempt when a token we sent turns out to be dead.
  if (response.status === 401 && tokens) {
    const refreshed = await refreshTokens(tokens);

    if (refreshed) {
      tokens = refreshed;
      response = await send(refreshed.accessToken);
    }

    if (!refreshed || response.status === 401) {
      const dead = rotatedSubject(refreshed, tokens);
      clearTokens(dead);
      emitAuthFailure(dead);

      if (!optional) {
        throw new ApiError(401, 'Session expired. Please log in again.');
      }
      // Optional auth: finish the request as a guest.
      response = await send();
    }
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractMessage(payload, response.status),
      payload,
    );
  }

  return payload as T;
}

function rotatedSubject(
  refreshed: TokenSet | null,
  current: TokenSet,
): TokenSubject {
  return refreshed?.tokenType ?? current.tokenType;
}
