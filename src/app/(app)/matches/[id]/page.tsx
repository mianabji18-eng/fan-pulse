import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { COUNTRY_MAP } from '@/lib/data/countries';
import Link from 'next/link';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { CheckInUploader } from '@/components/checkin/CheckInUploader';
import styles from './page.module.css';

// Helper to fix Windows emoji flag rendering by using Twemoji SVG
const getTwemojiUrl = (emoji: string) => {
  if (!emoji || emoji === '🏳️') return '';
  const codePoints = Array.from(emoji).map(c => c.codePointAt(0)?.toString(16)).join('-');
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoints}.svg`;
};

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

  // Fetch match details
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();

  if (!match) {
    console.error('Match not found or error:', matchError);
    return notFound();
  }

  // Fetch stadium separately
  const { data: stadium } = await supabase
    .from('stadiums')
    .select('name, city, capacity')
    .eq('id', match.stadium_id)
    .single();

  // Attach stadium to match to keep the rest of the code working
  if (stadium) {
    match.stadiums = stadium;
  }

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

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Prediction Logic: Not allowed if match is finished or in the past
  let predictionMessage = null;
  if (match.status === 'finished' || match.match_date < todayStr) {
    predictionMessage = 'El tiempo para predecir ha finalizado.';
  }

  // Check-in Logic: Only allowed on the exact day of the match and if not finished
  let checkInMessage = null;
  if (match.status === 'finished' || match.match_date < todayStr) {
    checkInMessage = 'El tiempo para hacer check-in ha finalizado.';
  } else if (match.match_date > todayStr) {
    checkInMessage = 'El check-in estará disponible el día del partido.';
  }

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
          <span className={styles.flag}>
            {homeCountry?.flag ? (
              <img src={getTwemojiUrl(homeCountry.flag)} alt={homeCountry.name} style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} />
            ) : '🏳️'}
          </span>
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
          <span className={styles.flag}>
            {awayCountry?.flag ? (
              <img src={getTwemojiUrl(awayCountry.flag)} alt={awayCountry.name} style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} />
            ) : '🏳️'}
          </span>
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
                isLocked={true}
              />
              {prediction.graded_at && (
                <div className={styles.pointsEarned}>
                  +{prediction.points_earned} pts
                </div>
              )}
            </>
          ) : predictionMessage ? (
            <div className={styles.actionEmpty}>
              <p>{predictionMessage}</p>
            </div>
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
          ) : checkInMessage ? (
            <div className={styles.actionEmpty}>
              <p>{checkInMessage}</p>
            </div>
          ) : (
            <div className={styles.actionEmpty}>
              <CheckInUploader matchId={match.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
