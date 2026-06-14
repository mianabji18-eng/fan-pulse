'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

// ============================================================
// Fan Pulse — Bottom Navigation Bar
// ============================================================

const NAV_ITEMS = [
  { href: '/home',        icon: '🏠', label: 'Inicio',       id: 'nav-home'        },
  { href: '/matches',     icon: '📅', label: 'Partidos',     id: 'nav-matches'     },
  { href: '/predictions', icon: '🔮', label: 'Predicciones', id: 'nav-predictions' },
  { href: '/checkin',     icon: '📸', label: 'Check-in',     id: 'nav-checkin'     },
  { href: '/leaderboard', icon: '🏆', label: 'Ranking',      id: 'nav-leaderboard' },
  { href: '/profile',     icon: '👤', label: 'Perfil',       id: 'nav-profile'     },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            id={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {isActive && <span className={styles.activeDot} />}
          </Link>
        );
      })}
    </nav>
  );
}
