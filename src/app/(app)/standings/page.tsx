import { createClient } from '@/lib/supabase/server';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { GroupStandingRow } from '@/types/database';
import styles from './page.module.css';

export const revalidate = 60; // Revalidate every 60 seconds (or 0 for dynamic)

export default async function StandingsPage() {
  const supabase = await createClient();

  // Fetch all standings from the database
  const { data: standingsData, error } = await supabase
    .from('grupo_posiciones')
    .select('*')
    .order('pts', { ascending: false })
    .order('dg', { ascending: false })
    .order('gf', { ascending: false });

  if (error) {
    console.error('Error fetching standings:', error);
  }

  const standings: GroupStandingRow[] = standingsData || [];

  // Group the data by 'grupo'
  const groups: Record<string, GroupStandingRow[]> = standings.reduce((acc, row) => {
    if (!acc[row.grupo]) {
      acc[row.grupo] = [];
    }
    acc[row.grupo].push(row);
    return acc;
  }, {} as Record<string, GroupStandingRow[]>);

  // If the database is empty (no finishes yet), we might want to generate empty groups based on our seed
  const groupNames = [
    'Group A', 'Group B', 'Group C', 'Group D',
    'Group E', 'Group F', 'Group G', 'Group H',
    'Group I', 'Group J', 'Group K', 'Group L'
  ];

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Fase de Grupos</h1>
        <p className={styles.subtitle}>Sigue en vivo la clasificación de las 48 selecciones hacia los dieciseisavos de final.</p>
      </header>

      <div className={styles.gridContainer}>
        {groupNames.map(groupName => {
          const groupStandings = groups[groupName] || [];
          return (
            <StandingsTable 
              key={groupName} 
              groupName={groupName} 
              standings={groupStandings} 
            />
          );
        })}
      </div>
    </div>
  );
}
