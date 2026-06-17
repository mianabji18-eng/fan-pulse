import styles from './StandingsTable.module.css';
import { GroupStandingRow } from '@/types/database';
import Image from 'next/image';

interface StandingsTableProps {
  groupName: string;
  standings: GroupStandingRow[];
}

export function StandingsTable({ groupName, standings }: StandingsTableProps) {
  // Sort standings by points (pts) descending, then goal difference (dg) descending, then goals for (gf) descending
  const sortedStandings = [...standings].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    return b.gf - a.gf;
  });

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3 className={styles.groupTitle}>{groupName}</h3>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colPos}>#</th>
              <th className={styles.colTeam}>País</th>
              <th className={styles.colStat} title="Partidos Jugados">PJ</th>
              <th className={styles.colStat} title="Ganados">G</th>
              <th className={styles.colStat} title="Empatados">E</th>
              <th className={styles.colStat} title="Perdidos">P</th>
              <th className={styles.colStat} title="Goles a Favor">GF</th>
              <th className={styles.colStat} title="Goles en Contra">GC</th>
              <th className={styles.colStat} title="Diferencia de Goles">DG</th>
              <th className={styles.colPts} title="Puntos">PTS</th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((team, index) => {
              const isQualified = index < 2; // Top 2 qualify
              return (
                <tr 
                  key={team.country_id} 
                  className={`${styles.row} ${isQualified ? styles.rowQualified : ''}`}
                >
                  <td className={styles.colPos}>
                    <span className={`${styles.position} ${isQualified ? styles.positionQualified : ''}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className={styles.colTeam}>
                    <div className={styles.teamInfo}>
                      <div className={styles.flagWrapper}>
                        {/* Assuming you have a way to render flags, like an SVG or Image. Using a generic UI element for now */}
                        <div className={styles.flagPlaceholder} data-country={team.country_id}>
                           {team.country_id.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                      <span className={styles.teamName}>{team.country_id.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className={styles.colStat}>{team.pj}</td>
                  <td className={styles.colStat}>{team.g}</td>
                  <td className={styles.colStat}>{team.e}</td>
                  <td className={styles.colStat}>{team.p}</td>
                  <td className={styles.colStat}>{team.gf}</td>
                  <td className={styles.colStat}>{team.gc}</td>
                  <td className={styles.colStat}>{team.dg > 0 ? `+${team.dg}` : team.dg}</td>
                  <td className={styles.colPts}>{team.pts}</td>
                </tr>
              );
            })}
            {sortedStandings.length === 0 && (
              <tr>
                <td colSpan={10} className={styles.emptyState}>
                  No hay datos para este grupo aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
