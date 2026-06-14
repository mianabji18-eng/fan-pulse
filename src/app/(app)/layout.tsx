import { BottomNav } from '@/components/layout/BottomNav';
import { ThemeInitializer } from '@/components/layout/ThemeInitializer';

// ============================================================
// Fan Pulse — Protected App Layout
// Server-side auth check is done by proxy.ts
// ============================================================

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user profile for theme — graceful when Supabase not configured
  let countryId = 'usa';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('country_id')
          .eq('id', user.id)
          .single();
        countryId = profile?.country_id ?? 'usa';
      }
    } catch {
      // Supabase not configured — use default theme
    }
  }

  return (
    <>
      <ThemeInitializer countryId={countryId} />
      <main className="page-wrapper">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
