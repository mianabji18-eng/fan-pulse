import { createClient } from '@/lib/supabase/server';
import { COUNTRY_MAP } from '@/lib/data/countries';
import styles from './page.module.css';

export const revalidate = 300; // revalidate every 5 minutes

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // In a real scenario, this queries the materialized view.
  // If the view isn't created, we fallback to querying 'users' and ordering.
  // For safety, we query the users table directly since materialized views might not be synced in dev.
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, country_id, total_points, prediction_points, checkin_points')
    .order('total_points', { ascending: false })
    .limit(50);

  const { data: { user } } = await supabase.auth.getUser();

  if (error) {
    return <div className={styles.container}>Error al cargar la tabla de líderes.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🏆 Leaderboard</h1>
        <p className={styles.subtitle}>Los mejores fans del Mundial 2026</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Fan</th>
              <th className={styles.hideMobile}>Pts. Predicciones</th>
              <th className={styles.hideMobile}>Pts. Check-in</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u, index) => {
              const country = COUNTRY_MAP[u.country_id];
              const isMe = user?.id === u.id;
              
              return (
                <tr key={u.id} className={isMe ? styles.currentUser : ''}>
                  <td className={styles.rank}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && index + 1}
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.flag} title={country?.name}>{country?.flag ?? '🌍'}</span>
                      <span className={styles.username}>
                        {u.username} {isMe && '(Tú)'}
                      </span>
                    </div>
                  </td>
                  <td className={styles.hideMobile}>{u.prediction_points}</td>
                  <td className={styles.hideMobile}>{u.checkin_points}</td>
                  <td className={styles.totalPoints}>{u.total_points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users?.length === 0 && (
          <p className={styles.empty}>Aún no hay usuarios en la tabla de líderes.</p>
        )}
      </div>
    </div>
  );
}
