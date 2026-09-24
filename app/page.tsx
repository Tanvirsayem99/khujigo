import HomePageContent from '@/components/storefront/HomePageContent';
import { getHomeData } from '@/lib/server/home';

// The homepage is rendered on the server so the LCP image URL — and the rest of
// the above-the-fold catalogue — is part of the initial HTML instead of arriving
// after hydration over the visitor's (slow) connection.
//
// `revalidate` serves that HTML from cache and refreshes it in the background,
// which keeps the API's ~1s response time off the critical path. `fetchCache`
// makes the underlying API reads cacheable for that window, so admin edits show
// up within a minute.
export const revalidate = 60;
export const fetchCache = 'default-cache';

export default async function HomePage() {
  const data = await getHomeData();

  return <HomePageContent data={data} />;
}
