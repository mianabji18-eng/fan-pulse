import { createClient } from '@/lib/supabase/server';

import Link from 'next/link';
import styles from './page.module.css';

export default async function PredictionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className={styles.container}>Inicia sesión para ver tus predicciones.</div>;
  }

  // Get user's predictions
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id);

  const matchIds = predictions?.map((p: any) => p.match_id) || [];

  let matches: any[] = [];
  if (matchIds.length > 0) {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .in('id', matchIds)
      .order('match_date', { ascending: false })
      .order('match_time', { ascending: false });
    matches = data || [];
  }

  const predictionsByMatchId = (predictions || []).reduce((acc: any, p: any) => {
    acc[p.match_id] = p;
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tus Predicciones</h1>
        <p className={styles.subtitle}>Historial de predicciones que has registrado.</p>
      </header>

      <div className={styles.matchesList}>
        {matches?.map((match) => {
          const prediction = predictionsByMatchId[match.id];
          return (
            <div key={match.id} className={styles.matchCard}>
              <Link href={`/matches/${match.id}`} className={styles.matchLinkWrapper}>
                <div className={styles.teamsRow}>
                  <div className={styles.team}>
                    <div className={styles.flagPlaceholder}>{match.home_country_id.toUpperCase()}</div>
                    <span>{match.home_country_id.toUpperCase()}</span>
                  </div>
                  <div className={styles.vs}>VS</div>
                  <div className={styles.team}>
                    <div className={styles.flagPlaceholder}>{match.away_country_id.toUpperCase()}</div>
                    <span>{match.away_country_id.toUpperCase()}</span>
                  </div>
                </div>
                <div className={styles.matchInfo}>
                  {new Date(match.match_date).toLocaleDateString()} - {match.match_time} | {match.phase}
                </div>
                
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tu Predicción</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {prediction?.pred_home_score ?? '-'} : {prediction?.pred_away_score ?? '-'}
                  </p>
                  {prediction.graded_at && (
                    <p style={{ marginTop: '0.5rem', color: '#30d158', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      +{prediction.points_earned} puntos obtenidos
                    </p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
        {matches?.length === 0 && (
          <p className={styles.empty}>Aún no has registrado ninguna predicción.</p>
        )}
      </div>
    </div>
  );
}
