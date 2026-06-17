import { createClient } from '@/lib/supabase/server';
import { COUNTRY_MAP } from '@/lib/data/countries';
import Link from 'next/link';
import styles from './page.module.css';
import LogoutButton from './LogoutButton';
import SettingsButton from './SettingsButton';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return <div className={styles.container}>Inicia sesión para ver tu perfil.</div>;
  }

  // Get user details
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get user's badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      unlocked_at,
      badges (
        id,
        name,
        icon,
        description
      )
    `)
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  if (!profile) {
    return <div className={styles.container}>Error al cargar el perfil.</div>;
  }

  const country = COUNTRY_MAP[profile.country_id];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" />
            ) : (
              <span className={styles.avatarFallback}>{profile.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className={styles.countryBadge} title={country?.name}>
            {country?.flag ?? '🏳️'}
          </div>
        </div>
        <h1 className={styles.username}>@{profile.username}</h1>
        <p className={styles.memberSince}>Fan desde {new Date(profile.created_at).getFullYear()}</p>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Puntos Totales</span>
          <span className={styles.statValue}>{profile.total_points}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pts Predicción</span>
          <span className={styles.statValue}>{profile.prediction_points}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pts Check-in</span>
          <span className={styles.statValue}>{profile.checkin_points}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Racha</span>
          <span className={styles.statValue}>🔥 {profile.streak_count}</span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🏅 Mis Insignias</h2>
        </div>
        {userBadges && userBadges.length > 0 ? (
          <div className={styles.badgesGrid}>
            {userBadges.map((ub) => {
              const b = ub.badges as any;
              return (
                <div key={b.id} className={styles.badgeCard} title={b.description}>
                  <div className={styles.badgeIcon}>{b.icon}</div>
                  <div className={styles.badgeName}>{b.name}</div>
                  <div className={styles.badgeDate}>
                    {new Date(ub.unlocked_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Aún no has desbloqueado insignias.</p>
            <Link href="/checkin" className="btn btn-sm btn-secondary">Hacer Check-in</Link>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🛒 Tienda de Premios</h2>
        </div>
        <div className={styles.emptyState}>
          <p>Visita la tienda oficial para canjear tus puntos.</p>
          <Link href="/store" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Ir a la Tienda</Link>
        </div>
      </section>

      <section className={styles.section} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SettingsButton userProfile={profile} userEmail={user?.email || ''} />
        <LogoutButton />
      </section>
    </div>
  );
}
