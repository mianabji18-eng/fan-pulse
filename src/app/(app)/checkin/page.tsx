import { createClient } from '@/lib/supabase/server';

import styles from './page.module.css';

export default async function CheckInPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className={styles.container}>Inicia sesión para ver tus check-ins.</div>;
  }

  // Get user's check-ins
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', user.id);

  const matchIds = checkIns?.map((c: any) => c.match_id) || [];

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

  const checkInsByMatchId = (checkIns || []).reduce((acc: any, c: any) => {
    acc[c.match_id] = c;
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 Historial de Check-ins</h1>
        <p className={styles.subtitle}>Tus momentos capturados apoyando a tu equipo.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.matchesList}>
          {matches?.map((match) => {
            const checkIn = checkInsByMatchId[match.id];
            return (
              <div key={match.id} className={styles.matchItem}>
                <a href={`/matches/${match.id}`} className={styles.matchLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>{match.home_country_id.toUpperCase()} vs {match.away_country_id.toUpperCase()}</span>
                    <span className={styles.badge} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                      {checkIn.status === 'approved' ? '✅ Aprobado' : (checkIn.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente')}
                    </span>
                  </div>
                  
                  {checkIn.photo_url && (
                    <div style={{ 
                      width: '100%', 
                      height: '150px', 
                      backgroundImage: `url(${checkIn.photo_url})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }} />
                  )}
                  
                  {checkIn.points_earned > 0 && (
                    <div style={{ color: '#30d158', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'right' }}>
                      +{checkIn.points_earned} puntos obtenidos
                    </div>
                  )}
                </a>
              </div>
            );
          })}
          {matches?.length === 0 && (
            <p className={styles.empty}>Aún no has registrado ningún check-in.</p>
          )}
        </div>
      </div>
    </div>
  );
}
