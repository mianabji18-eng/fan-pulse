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

  // Adjust dates back by 1 day to fix the timezone/offset issue in the DB
  const adjustedMatches = (matches ?? []).map(m => {
    const d = new Date(m.match_date + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return { ...m, match_date: d.toISOString().split('T')[0] };
  });

  // Fetch group standings
  const { data: standings } = await supabase
    .from('vw_group_standings')
    .select('*')
    .order('grupo', { ascending: true })
    .order('pts', { ascending: false })
    .order('dg', { ascending: false })
    .order('gf', { ascending: false });

  return (
    <MatchesClient 
      initialMatches={adjustedMatches} 
      initialStandings={standings ?? []} 
    />
  );
}
