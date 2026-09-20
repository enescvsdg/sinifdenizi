import { loadPortal } from '@/lib/data';
import { Portal } from '@/components/portal';
export const dynamic = 'force-dynamic';
export default async function Panel({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; class?: string; child?: string; student?: string }>;
}) {
  const { data, profile, links } = await loadPortal();
  return <Portal data={data} profile={profile} links={links} params={await searchParams} />;
}
