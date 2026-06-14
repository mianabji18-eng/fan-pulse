'use server';

import { createClient } from '@/lib/supabase/server';
import { deriveWinner } from '@/lib/utils/points';
import { revalidatePath } from 'next/cache';

export async function submitPrediction(formData: FormData) {
  const matchId = formData.get('match_id') as string;
  const homeScoreStr = formData.get('pred_home_score') as string;
  const awayScoreStr = formData.get('pred_away_score') as string;

  if (!matchId || !homeScoreStr || !awayScoreStr) {
    return { error: 'Faltan datos de predicción.' };
  }

  const homeScore = parseInt(homeScoreStr, 10);
  const awayScore = parseInt(awayScoreStr, 10);

  if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
    return { error: 'Marcador inválido.' };
  }

  const predWinner = deriveWinner(homeScore, awayScore);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Debes iniciar sesión para predecir.' };
  }

  // Insert or Update the prediction
  const { error } = await supabase.from('predictions').upsert(
    {
      user_id: user.id,
      match_id: matchId,
      pred_home_score: homeScore,
      pred_away_score: awayScore,
      pred_winner: predWinner,
      submitted_at: new Date().toISOString()
    },
    { onConflict: 'user_id,match_id' }
  );

  if (error) {
    console.error('Error upserting prediction:', error);
    return { error: 'Hubo un error al guardar tu predicción.' };
  }

  revalidatePath('/predictions');
  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  
  return { success: true };
}
