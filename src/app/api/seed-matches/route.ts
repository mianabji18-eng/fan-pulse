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
    // In production, you would verify the user is an admin or require a secret key
    const authHeader = request.headers.get('authorization');
    if (process.env.SEED_SECRET && authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // 2. Perform the bulk insert
    // Supabase allows bulk inserts by passing an array of objects
    const { data, error } = await supabase
      .from('matches')
      .upsert(matchesData, { onConflict: 'id' }) // Upsert to avoid duplicates if run twice
      .select();

    if (error) {
      console.error('Error seeding matches:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully seeded ${matchesData.length} matches!`,
      inserted: data?.length || 0
    });
  } catch (error: any) {
    console.error('Exception during seeding:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
