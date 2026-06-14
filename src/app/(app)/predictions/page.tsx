import { createClient } from '@/lib/supabase/server';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import styles from './page.module.css';

export default async function PredictionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className={styles.container}>Inicia sesión para ver tus predicciones.</div>;
  }

  // Get upcoming matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'upcoming')
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  // Get user's predictions
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id);

  const predictionsByMatchId = (predictions || []).reduce((acc: any, p: any) => {
    acc[p.match_id] = p;
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tus Predicciones</h1>
        <p className={styles.subtitle}>Gana puntos acertando resultados y ganadores.</p>
      </header>

      <div className={styles.matchesList}>
        {matches?.map((match) => {
          const prediction = predictionsByMatchId[match.id];
          return (
            <div key={match.id} className={styles.matchCard}>
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
              
              <PredictionForm 
                matchId={match.id} 
                initialHomeScore={prediction?.pred_home_score ?? null}
                initialAwayScore={prediction?.pred_away_score ?? null}
                isLocked={match.predictions_locked}
              />
            </div>
          );
        })}
        {matches?.length === 0 && (
          <p className={styles.empty}>No hay partidos próximos para predecir.</p>
        )}
      </div>
    </div>
  );
}
