import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { COUNTRY_MAP } from '@/lib/data/countries';
import Link from 'next/link';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import styles from './page.module.css';

// ============================================================
// Fan Pulse — Match Details Page
// ============================================================

export default async function MatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch match details with stadium info
  const { data: match } = await supabase
    .from('matches')
    .select(`
      *,
      stadiums (
        name,
        city,
        capacity
      )
    `)
    .eq('id', id)
    .single();

  if (!match) return notFound();

  // Fetch current user's prediction and check-in for this match
  const { data: { user } } = await supabase.auth.getUser();
  let prediction = null;
  let checkIn = null;

  if (user) {
    const [predRes, checkInRes] = await Promise.all([
      supabase.from('predictions').select('*').eq('match_id', id).eq('user_id', user.id).single(),
      supabase.from('check_ins').select('*').eq('match_id', id).eq('user_id', user.id).single(),
    ]);
    prediction = predRes.data;
    checkIn = checkInRes.data;
  }

  const homeCountry = COUNTRY_MAP[match.home_country_id];
  const awayCountry = COUNTRY_MAP[match.away_country_id];

  const formattedDate = new Date(match.match_date + 'T' + match.match_time).toLocaleDateString('es', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/matches" className={styles.backBtn}>← Volver</Link>
        <span className={styles.phase}>{match.phase}</span>
        <div style={{ width: '40px' }} /> {/* Spacer */}
      </header>

      {/* Scoreboard */}
      <section className={styles.scoreboard}>
        <div className={styles.team}>
          <span className={styles.flag}>{homeCountry?.flag ?? '🏳️'}</span>
          <span className={styles.teamName}>{homeCountry?.name ?? match.home_country_id}</span>
        </div>
        
        <div className={styles.scoreArea}>
          {match.status === 'upcoming' ? (
            <span className={styles.vs}>VS</span>
          ) : (
            <div className={styles.scoreRow}>
              <span className={styles.score}>{match.home_score ?? 0}</span>
              <span className={styles.scoreDivider}>-</span>
              <span className={styles.score}>{match.away_score ?? 0}</span>
            </div>
          )}
          {match.status === 'live' && <span className={styles.liveTag}><span className="pulse-dot" /> EN VIVO</span>}
          {match.status === 'finished' && <span className={styles.finishedTag}>FINALIZADO</span>}
        </div>

        <div className={styles.team}>
          <span className={styles.flag}>{awayCountry?.flag ?? '🏳️'}</span>
          <span className={styles.teamName}>{awayCountry?.name ?? match.away_country_id}</span>
        </div>
      </section>

      {/* Match Info */}
      <section className={styles.infoCard}>
        <div className={styles.infoRow}>
          <span className={styles.infoIcon}>📅</span>
          <div>
            <p className={styles.infoLabel}>Fecha y Hora</p>
            <p className={styles.infoValue}>{formattedDate}</p>
          </div>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoIcon}>🏟️</span>
          <div>
            <p className={styles.infoLabel}>Estadio</p>
            <p className={styles.infoValue}>{match.stadiums?.name}, {match.stadiums?.city}</p>
          </div>
        </div>
      </section>

      {/* User Actions */}
      <div className={styles.actionsGrid}>
        {/* Prediction Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionHeader}>
            <h3>🔮 Tu Predicción</h3>
            {prediction && <span className={styles.statusPill}>Guardada</span>}
          </div>
          {prediction ? (
            <>
              <div className={styles.actionEmpty}>
                <p>Ya tienes una predicción guardada.</p>
              </div>
              <PredictionForm 
                matchId={match.id} 
                initialHomeScore={prediction.pred_home_score}
                initialAwayScore={prediction.pred_away_score}
                isLocked={match.predictions_locked}
              />
              {prediction.graded_at && (
                <div className={styles.pointsEarned}>
                  +{prediction.points_earned} pts
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.actionEmpty}>
                <p>No has hecho tu predicción para este partido.</p>
              </div>
              <PredictionForm 
                matchId={match.id} 
                initialHomeScore={null}
                initialAwayScore={null}
                isLocked={match.predictions_locked}
              />
            </>
          )}
        </div>

        {/* Check-in Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionHeader}>
            <h3>📸 Check-in</h3>
            {checkIn && <span className={styles.statusPill}>{checkIn.status}</span>}
          </div>
          {checkIn ? (
            <div className={styles.checkInResult}>
              <div className={styles.photoPreview} style={{ backgroundImage: `url(${checkIn.photo_url})` }} />
              {checkIn.status === 'approved' && (
                <div className={styles.pointsEarned}>
                  +{checkIn.points_earned} pts
                </div>
              )}
            </div>
          ) : (
            <div className={styles.actionEmpty}>
              <p>Comparte una foto viendo el partido.</p>
              <Link href={`/checkin`} className="btn btn-sm btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Hacer Check-in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
