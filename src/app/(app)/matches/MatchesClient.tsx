'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRY_MAP } from '@/lib/data/countries';
import Link from 'next/link';
import styles from './MatchesClient.module.css';

// ============================================================
// Fan Pulse — Match Center (Client Component)
// ============================================================

type Match = {
  id: string;
  match_date: string;
  match_time: string;
  home_country_id: string;
  away_country_id: string;
  stadium_id: string;
  phase: string;
  status: 'upcoming' | 'live' | 'finished';
  home_score: number | null;
  away_score: number | null;
};

export function MatchesClient({ initialMatches }: { initialMatches: Match[] }) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'groups' | 'bracket'>('calendar');

  // Calendar View
  const renderCalendar = () => {
    // Group by date
    const grouped = initialMatches.reduce((acc, match) => {
      if (!acc[match.match_date]) acc[match.match_date] = [];
      acc[match.match_date].push(match);
      return acc;
    }, {} as Record<string, Match[]>);

    return (
      <div className={styles.calendarContainer}>
        {Object.entries(grouped).map(([date, matches]) => (
          <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateHeader}>
              {new Date(date + 'T12:00:00').toLocaleDateString('es', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </h3>
            <div className={styles.matchList}>
              {matches.map(match => (
                <Link key={match.id} href={`/matches/${match.id}`} className={styles.matchCard}>
                  <div className={styles.matchMeta}>
                    <span className={styles.phase}>{match.phase}</span>
                    <span className={styles.time}>{match.match_time.slice(0, 5)}</span>
                  </div>
                  
                  <div className={styles.teamsRow}>
                    <div className={styles.team}>
                      <span className={styles.flag}>{COUNTRY_MAP[match.home_country_id]?.flag ?? '🏳️'}</span>
                      <span className={styles.teamName}>{COUNTRY_MAP[match.home_country_id]?.name ?? match.home_country_id}</span>
                      <span className={styles.score}>{match.home_score ?? '-'}</span>
                    </div>
                    <div className={styles.team}>
                      <span className={styles.flag}>{COUNTRY_MAP[match.away_country_id]?.flag ?? '🏳️'}</span>
                      <span className={styles.teamName}>{COUNTRY_MAP[match.away_country_id]?.name ?? match.away_country_id}</span>
                      <span className={styles.score}>{match.away_score ?? '-'}</span>
                    </div>
                  </div>

                  {match.status === 'live' && (
                    <div className={styles.liveIndicator}>
                      <span className="pulse-dot" /> EN VIVO
                    </div>
                  )}
                  {match.status === 'finished' && (
                    <div className={styles.finishedIndicator}>Finalizado</div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Groups View (Mock implementation for now)
  const renderGroups = () => {
    const mockGroups = ['A', 'B', 'C', 'D'];
    return (
      <div className={styles.groupsContainer}>
        {mockGroups.map(group => (
          <div key={group} className={styles.groupCard}>
            <div className={styles.groupHeader}>Grupo {group}</div>
            <table className={styles.groupTable}>
              <thead>
                <tr>
                  <th>País</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{COUNTRY_MAP['mex']?.flag} México</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
                <tr>
                  <td>{COUNTRY_MAP['can']?.flag} Canadá</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
                {/* Add more rows as needed for UI mock */}
              </tbody>
            </table>
          </div>
        ))}
        <p className={styles.emptyState}>Simulación de tabla de grupos. Se actualizará con resultados reales.</p>
      </div>
    );
  };

  // Bracket View (Mock implementation)
  const renderBracket = () => {
    return (
      <div className={styles.bracketContainer}>
        <div className={styles.bracketPlaceholder}>
          <span className={styles.bracketIcon}>🏆</span>
          <h3>Fase Eliminatoria</h3>
          <p>Las llaves se generarán cuando terminen los grupos.</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Match Center</h1>
      </header>

      {/* Segmented Control */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'calendar'}
          className={`${styles.tabBtn} ${activeTab === 'calendar' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendario
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'groups'}
          className={`${styles.tabBtn} ${activeTab === 'groups' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Grupos
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'bracket'}
          className={`${styles.tabBtn} ${activeTab === 'bracket' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bracket')}
        >
          Llaves
        </button>
      </div>

      {/* Main Content Area */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'groups' && renderGroups()}
            {activeTab === 'bracket' && renderBracket()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
