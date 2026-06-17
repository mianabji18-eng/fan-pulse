import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import matchesData from '@/lib/data/world_cup_2026_groups.json';

// ============================================================
// API Route: Seed Matches
// Endpoint: POST /api/seed-matches
// Description: Bulk inserts 72 group stage matches into the DB.
// ============================================================

export async function POST(request: Request) {
  try {
    // 1. (Optional) Basic Security Check
    const authHeader = request.headers.get('authorization');
    if (process.env.SEED_SECRET && authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Map the Spanish JSON to English DB schema
    const formattedMatches = matchesData.map((item: any) => {
      // Parse fecha_utc into date and time
      const dateObj = new Date(item.fecha_utc);
      const match_date = dateObj.toISOString().split('T')[0];
      const match_time = dateObj.toISOString().split('T')[1].substring(0, 5); // "HH:MM"

      // Map status
      let status = 'upcoming';
      if (item.estado === 'FINALIZADO') status = 'finished';
      else if (item.estado === 'EN CURSO') status = 'live';

      return {
        id: item.id,
        match_date,
        match_time,
        // local y visitante son llaves foráneas a la tabla equipos (e.g. 'MEX', 'A2', 'C4')
        home_country_id: item.local,
        away_country_id: item.visitante,
        stadium_id: item.estadio,
        phase: item.fase, // We map the group directly to phase (e.g. "Grupo A")
        status,
        home_score: item.goles_local,
        away_score: item.goles_visitante,
        predictions_locked: status === 'finished' || status === 'live'
      };
    });

    // 2. Perform the bulk insert
    const { data, error } = await supabase
      .from('matches')
      .upsert(formattedMatches, { onConflict: 'id' }) 
      .select();

    if (error) {
      console.error('Error seeding matches:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully seeded ${formattedMatches.length} matches!`,
      inserted: data?.length || 0
    });
  } catch (error: any) {
    console.error('Exception during seeding:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
