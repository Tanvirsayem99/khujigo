'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AdminRole, AdminUser } from '@/types';
import { ApiError, clearTokens, getTokens, onAuthFailure, setTokens } from '@/lib/api/client';
import {
  loginAdmin as loginAdminRequest,
  loginCustomer as loginCustomerRequest,
  meAdmin,
  meCustomer,
  registerCustomer as registerCustomerRequest,
  revokeRefreshToken,
  updateMeCustomer,
} from '@/lib/api/endpoints';
import { toAdminUser, toCustomerUser } from '@/lib/api/mappers';
import type { ApiAdmin, ApiCustomer } from '@/lib/api/types';
import { revalidateSession } from '@/lib/hooks/api';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  division?: string;
  district?: string;
  area?: string;
  address?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  /** True while stored tokens are being exchanged for profiles on first load. */
  isAuthLoading: boolean;

  customer: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (emailOrPhone: string, password: string) => Promise<AuthResult>;
  registerCustomer: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    division?: string;
    district?: string;
  }) => Promise<AuthResult>;
  updateCustomerProfile: (data: Partial<CustomerUser>) => Promise<AuthResult>;
  logoutCustomer: () => Promise<void>;

  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminRole: AdminRole | null;
  loginAdmin: (email: string, password: string) => Promise<AuthResult>;
  logoutAdmin: () => Promise<void>;
  hasPermission: (requiredRole: AdminRole | AdminRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Restore any existing sessions from their stored tokens.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const jobs: Promise<void>[] = [];

      if (getTokens('CUSTOMER')) {
        jobs.push(
          meCustomer()
            .then((profile) => {
              if (!cancelled) setCustomer(profile);
            })
            .catch(() => clearTokens('CUSTOMER')),
        );
      }

      if (getTokens('ADMIN')) {
        jobs.push(
          meAdmin()
            .then((profile) => {
              if (!cancelled) setAdminUser(toAdminUser(profile));
            })
            .catch(() => clearTokens('ADMIN')),
        );
      }

      await Promise.all(jobs);
      if (!cancelled) setIsAuthLoading(false);
    };

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  // A failed refresh anywhere means that session is gone.
  useEffect(
    () =>
      onAuthFailure((subject) => {
        if (subject === 'ADMIN') setAdminUser(null);
        else setCustomer(null);
      }),
    [],
  );

  // ---------------------------------------------------------- customer auth

  const loginCustomer = useCallback(
    async (emailOrPhone: string, password: string): Promise<AuthResult> => {
      try {
        const tokens = await loginCustomerRequest(emailOrPhone, password);
        setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType,
        });
        setCustomer(toCustomerUser(tokens.user as ApiCustomer));
        await revalidateSession();
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return {
            success: false,
            error: 'ইমেইল/ফোন নম্বর অথবা পাসওয়ার্ড সঠিক নয়।',
          };
        }
        return {
          success: false,
          error: 'লগইন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
        };
      }
    },
    [],
  );

  const registerCustomer = useCallback(
    async (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      address?: string;
      division?: string;
      district?: string;
    }): Promise<AuthResult> => {
      try {
        const tokens = await registerCustomerRequest({
          ...data,
          // The form allows phone-only signups; the API needs an email.
          email: data.email?.trim() || `${data.phone}@khujigo.user`,
        });
        setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType,
        });
        setCustomer(toCustomerUser(tokens.user as ApiCustomer));
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return {
            success: false,
            error: 'এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।',
          };
        }
        if (error instanceof ApiError && error.status === 400) {
          return {
            success: false,
            error: 'অনুগ্রহ করে নাম, সঠিক ১১ ডিজিটের মোবাইল নম্বর ও পাসওয়ার্ড দিন।',
          };
        }
        return {
          success: false,
          error: 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।',
        };
      }
    },
    [],
  );

  const updateCustomerProfile = useCallback(
    async (data: Partial<CustomerUser>): Promise<AuthResult> => {
      try {
        setCustomer(await updateMeCustomer(data));
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return {
            success: false,
            error: 'এই ইমেইল বা ফোন নম্বর অন্য একটি অ্যাকাউন্টে ব্যবহৃত হচ্ছে।',
          };
        }
        return {
          success: false,
          error: 'প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।',
        };
      }
    },
    [],
  );

  const logoutCustomer = useCallback(async () => {
    const tokens = getTokens('CUSTOMER');
    setCustomer(null);
    clearTokens('CUSTOMER');
    revalidateSession();
    if (tokens) {
      try {
        await revokeRefreshToken('CUSTOMER', tokens.refreshToken);
      } catch {
        // Already logged out locally; revoking is best effort.
      }
    }
  }, []);

  // ------------------------------------------------------------- admin auth

  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const tokens = await loginAdminRequest(email, password);
        setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType,
        });
        setAdminUser(toAdminUser(tokens.user as ApiAdmin));
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return {
            success: false,
            error: 'Invalid admin credentials or unauthorized account.',
          };
        }
        return {
          success: false,
          error: 'Could not reach the admin service. Please try again.',
        };
      }
    },
    [],
  );

  const logoutAdmin = useCallback(async () => {
    const tokens = getTokens('ADMIN');
    setAdminUser(null);
    clearTokens('ADMIN');
    if (tokens) {
      try {
        await revokeRefreshToken('ADMIN', tokens.refreshToken);
      } catch {
        // best effort
      }
    }
  }, []);

  const hasPermission = useCallback(
    (requiredRole: AdminRole | AdminRole[]) => {
      if (!adminUser) return false;
      if (adminUser.role === 'SUPER_ADMIN') return true;
      const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return allowed.includes(adminUser.role);
    },
    [adminUser],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthLoading,
      customer,
      isCustomerLoggedIn: !!customer,
      loginCustomer,
      registerCustomer,
      updateCustomerProfile,
      logoutCustomer,
      adminUser,
      isAdminLoggedIn: !!adminUser,
      adminRole: adminUser ? adminUser.role : null,
      loginAdmin,
      logoutAdmin,
      hasPermission,
    }),
    [
      isAuthLoading,
      customer,
      loginCustomer,
      registerCustomer,
      updateCustomerProfile,
      logoutCustomer,
      adminUser,
      loginAdmin,
      logoutAdmin,
      hasPermission,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
