import { createClient } from '@/lib/supabase/server';
import { MatchesClient } from './MatchesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match Center · Fan Pulse 2026',
};

// ============================================================
// Fan Pulse — Match Center (Server Component)
// ============================================================

export default async function MatchesPage() {
  const supabase = await createClient();

  // Fetch all matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  return (
    <MatchesClient initialMatches={matches ?? []} />
  );
}
