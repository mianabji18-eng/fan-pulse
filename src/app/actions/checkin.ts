'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitCheckIn(formData: FormData) {
  const matchId = formData.get('match_id') as string;
  const file = formData.get('photo') as File;

  if (!matchId || !file || file.size === 0) {
    return { error: 'Debes proporcionar un partido y una foto.' };
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'El archivo debe ser una imagen.' };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Debes iniciar sesión para hacer check-in.' };
  }

  // Check if check-in already exists
  const { data: existingCheckIn } = await supabase
    .from('check_ins')
    .select('id')
    .eq('user_id', user.id)
    .eq('match_id', matchId)
    .single();

  if (existingCheckIn) {
    return { error: 'Ya hiciste check-in para este partido.' };
  }

  // Upload photo to Supabase Storage
  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${matchId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('checkins')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return { error: 'Error al subir la foto.' };
  }

  const { data: publicUrlData } = supabase.storage
    .from('checkins')
    .getPublicUrl(filePath);

  const photoUrl = publicUrlData.publicUrl;

  // Insert check-in record
  const { error: insertError } = await supabase.from('check_ins').insert({
    user_id: user.id,
    match_id: matchId,
    photo_url: photoUrl,
    photo_path: filePath,
    status: 'pending',
    points_earned: 0
  });

  if (insertError) {
    console.error('Error inserting check_in:', insertError);
    return { error: 'Error al registrar el check-in.' };
  }

  // BADGE LOGIC: Check total check-ins for the user
  const { count: checkInCount } = await supabase
    .from('check_ins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (checkInCount) {
    // Fetch all checkin badges
    const { data: badges } = await supabase
      .from('badges')
      .select('*')
      .eq('trigger_type', 'checkin_count')
      .lte('trigger_value', checkInCount);

    if (badges && badges.length > 0) {
      // Get user's existing badges
      const { data: existingUserBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      const existingBadgeIds = new Set(existingUserBadges?.map(ub => ub.badge_id) || []);

      const newBadges = badges.filter(b => !existingBadgeIds.has(b.id));

      if (newBadges.length > 0) {
        const badgeInserts = newBadges.map(b => ({
          user_id: user.id,
          badge_id: b.id
        }));

        await supabase.from('user_badges').insert(badgeInserts);
      }
    }
  }

  revalidatePath('/checkin');
  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  
  return { success: true };
}
