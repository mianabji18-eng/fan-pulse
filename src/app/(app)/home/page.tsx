import { createClient } from '@/lib/supabase/server';
import { COUNTRY_MAP } from '@/lib/data/countries';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import type { Metadata } from 'next';

// ============================================================
// Fan Pulse — Home Dashboard (Server Component)
// ============================================================

export const metadata: Metadata = {
  title: 'Inicio · Fan Pulse 2026',
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch user profile + live matches
  const [profileResult, matchesResult, leaderboardResult] = await Promise.all([
    supabase
      .from('users')
      .select('username, country_id, total_points, prediction_points, checkin_points, streak_count')
      .eq('id', user.id)
      .single(),
    supabase
      .from('matches')
      .select('*')
      .in('status', ['live', 'upcoming'])
      .order('match_date', { ascending: true })
      .limit(5),
    supabase
      .from('leaderboard')
      .select('username, country_id, total_points, rank')
      .order('rank', { ascending: true })
      .limit(5),
  ]);

  const profile = profileResult.data;
  const matches = matchesResult.data ?? [];
  const leaders = leaderboardResult.data ?? [];
  const country = profile ? COUNTRY_MAP[profile.country_id] : null;

  const liveMatch = matches.find(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 3);

  return (
    <div className={styles.page}>
      {/* ---- Header ---- */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.greeting}>¡Hola, {profile?.username ?? 'Fan'}! 👋</p>
          <div className={styles.countryBadge}>
            <span>{country?.flag ?? '🌍'}</span>
            <span>{country?.name ?? 'Fan'}</span>
          </div>
        </div>
        <a href="/profile" className={styles.avatarBtn} id="home-profile-link" aria-label="Ver perfil">
          <span className={styles.avatarEmoji}>{country?.flag ?? '⚽'}</span>
        </a>
      </header>

      {/* ---- Points Bento Grid ---- */}
      <section className={styles.bentoGrid} aria-label="Tus estadísticas">
        <div className={`${styles.bentoCard} ${styles.bentoTotal}`}>
          <span className={styles.bentoIcon}>⭐</span>
          <p className={styles.bentoValue}>{(profile?.total_points ?? 0).toLocaleString()}</p>
          <p className={styles.bentoLabel}>Puntos totales</p>
        </div>
        <div className={`${styles.bentoCard} ${styles.bentoPred}`}>
          <span className={styles.bentoIcon}>🔮</span>
          <p className={styles.bentoValue}>{profile?.prediction_points ?? 0}</p>
          <p className={styles.bentoLabel}>Predicciones</p>
        </div>
        <div className={`${styles.bentoCard} ${styles.bentoCheckin}`}>
          <span className={styles.bentoIcon}>📸</span>
          <p className={styles.bentoValue}>{profile?.checkin_points ?? 0}</p>
          <p className={styles.bentoLabel}>Check-ins</p>
        </div>
        <div className={`${styles.bentoCard} ${styles.bentoStreak}`}>
          <span className={styles.bentoIcon}>🔥</span>
          <p className={styles.bentoValue}>{profile?.streak_count ?? 0}</p>
          <p className={styles.bentoLabel}>Racha</p>
        </div>
      </section>

      {/* ---- Live Match Banner ---- */}
      {liveMatch && (
        <section className={styles.liveBanner} aria-label="Partido en vivo">
          <div className={styles.livePill}>
            <span className="pulse-dot" />
            EN VIVO
          </div>
          <div className={styles.liveTeams}>
            <div className={styles.liveTeam}>
              <span className={styles.liveFlag}>
                {COUNTRY_MAP[liveMatch.home_country_id]?.flag ?? '🏳️'}
              </span>
              <span className={styles.liveScore}>{liveMatch.home_score ?? 0}</span>
            </div>
            <span className={styles.liveDivider}>–</span>
            <div className={styles.liveTeam}>
              <span className={styles.liveScore}>{liveMatch.away_score ?? 0}</span>
              <span className={styles.liveFlag}>
                {COUNTRY_MAP[liveMatch.away_country_id]?.flag ?? '🏳️'}
              </span>
            </div>
          </div>
          <p className={styles.livePhase}>{liveMatch.phase}</p>
          <a href={`/matches/${liveMatch.id}`} className="btn btn-sm btn-primary" id="home-live-details">
            Ver detalles →
          </a>
        </section>
      )}

      {/* ---- Upcoming Matches ---- */}
      <section className={styles.section}>
        <div className="section-header">
          <h2>Próximos partidos</h2>
          <a href="/matches" id="home-see-all-matches">Ver todos</a>
        </div>
        <div className={styles.matchList}>
          {upcomingMatches.map(match => (
            <a
              key={match.id}
              href={`/matches/${match.id}`}
              className={styles.matchRow}
              id={`home-match-${match.id}`}
            >
              <span className={styles.matchPhase}>{match.phase}</span>
              <div className={styles.matchTeams}>
                <span>{COUNTRY_MAP[match.home_country_id]?.flag ?? '🏳️'}</span>
                <span className={styles.matchVs}>vs</span>
                <span>{COUNTRY_MAP[match.away_country_id]?.flag ?? '🏳️'}</span>
              </div>
              <span className={styles.matchDate}>
                {new Date(match.match_date + 'T' + match.match_time).toLocaleDateString('es', {
                  weekday: 'short', month: 'short', day: 'numeric'
                })}
              </span>
            </a>
          ))}
          {upcomingMatches.length === 0 && (
            <p className={styles.emptyState}>No hay partidos próximos disponibles.</p>
          )}
        </div>
      </section>

      {/* ---- Mini Leaderboard ---- */}
      <section className={styles.section}>
        <div className="section-header">
          <h2>Ranking global</h2>
          <a href="/leaderboard" id="home-see-leaderboard">Ver ranking</a>
        </div>
        <div className={styles.leaderList}>
          {leaders.map((leader, i) => (
            <div key={leader.username} className={styles.leaderRow}>
              <span className={`${styles.rank} ${i < 3 ? styles[`rank${i+1}` as keyof typeof styles] : ''}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${leader.rank}`}
              </span>
              <span className={styles.leaderFlag}>
                {COUNTRY_MAP[leader.country_id]?.flag ?? '🌍'}
              </span>
              <span className={styles.leaderName}>{leader.username}</span>
              <span className={styles.leaderPts}>{leader.total_points.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Quick Action Buttons ---- */}
      <section className={styles.quickActions} aria-label="Acciones rápidas">
        <a href="/predictions" className="btn btn-secondary" id="home-predict-btn">
          🔮 Hacer predicción
        </a>
        <a href="/checkin" className="btn btn-primary" id="home-checkin-btn">
          📸 Check-in partido
        </a>
      </section>
    </div>
  );
}
