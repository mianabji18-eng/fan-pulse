import { createClient } from '@/lib/supabase/server';
import { CheckInUploader } from '@/components/checkin/CheckInUploader';
import styles from './page.module.css';

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ matchId?: string }>;
}) {
  const { matchId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className={styles.container}>Inicia sesión para hacer check-in.</div>;
  }

  // Get active matches (upcoming or live)
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .in('status', ['upcoming', 'live'])
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  // Get user's check-ins
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', user.id);

  const checkedInMatchIds = new Set(checkIns?.map((c) => c.match_id));

  // If a specific match is selected
  const selectedMatch = matches?.find(m => m.id === matchId) || matches?.[0];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 Fan Check-in</h1>
        <p className={styles.subtitle}>Sube una foto viendo el partido y gana puntos + insignias.</p>
      </header>

      {matches && matches.length > 0 ? (
        <div className={styles.card}>
          <div className={styles.matchSelector}>
            <label className={styles.label}>Selecciona el partido:</label>
            {/* Since it's a server component we can just use links or a simple form.
                For simplicity we'll just list them out as cards if it's not a lot,
                or a dropdown that redirects on change. We'll use simple cards here for better UX. */}
            
            <div className={styles.matchesList}>
              {matches.map(match => {
                const hasCheckedIn = checkedInMatchIds.has(match.id);
                return (
                  <div key={match.id} className={`${styles.matchItem} ${match.id === selectedMatch?.id ? styles.selected : ''}`}>
                    <a href={`/checkin?matchId=${match.id}`} className={styles.matchLink}>
                      {match.home_country_id.toUpperCase()} vs {match.away_country_id.toUpperCase()}
                      {hasCheckedIn && <span className={styles.badge}>✅ Listo</span>}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.uploadSection}>
            {selectedMatch && checkedInMatchIds.has(selectedMatch.id) ? (
              <div className={styles.alreadyCheckedIn}>
                <span className={styles.successIcon}>🎉</span>
                <p>Ya hiciste check-in para este partido.</p>
                <p className={styles.small}>¡Sigue así para desbloquear más insignias!</p>
              </div>
            ) : selectedMatch ? (
              <>
                <h3 className={styles.uploadTitle}>
                  {selectedMatch.home_country_id.toUpperCase()} vs {selectedMatch.away_country_id.toUpperCase()}
                </h3>
                <CheckInUploader matchId={selectedMatch.id} />
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <p className={styles.empty}>No hay partidos activos en este momento para hacer check-in.</p>
      )}
    </div>
  );
}
