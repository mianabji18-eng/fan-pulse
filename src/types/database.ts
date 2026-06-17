// ============================================================
// Fan Pulse — Database Types (aligned with Supabase schema)
// ============================================================

export type UserRow = {
  id: string;
  username: string;
  avatar_url: string | null;
  country_id: string;
  total_points: number;
  prediction_points: number;
  checkin_points: number;
  streak_count: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
};

export type MatchStatus = 'upcoming' | 'live' | 'finished';
export type PredictionWinner = 'home' | 'away' | 'draw';
export type CheckInStatus = 'pending' | 'approved' | 'rejected';
export type BadgeTrigger = 'checkin_count' | 'prediction_exact' | 'streak' | 'total_points' | 'early_bird' | 'all_matches';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type StadiumRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
};

export type MatchRow = {
  id: string;
  match_date: string;
  match_time: string;
  home_country_id: string;
  away_country_id: string;
  stadium_id: string;
  phase: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  predictions_locked: boolean;
  created_at: string;
};

export type PredictionRow = {
  id: string;
  user_id: string;
  match_id: string;
  pred_home_score: number;
  pred_away_score: number;
  pred_winner: PredictionWinner;
  points_earned: number | null;
  is_exact: boolean;
  submitted_at: string;
  graded_at: string | null;
};

export type CheckInRow = {
  id: string;
  user_id: string;
  match_id: string;
  photo_url: string;
  photo_path: string;
  status: CheckInStatus;
  points_earned: number;
  submitted_at: string;
  reviewed_at: string | null;
};

export type BadgeRow = {
  id: string;
  name: string;
  icon: string;
  description: string;
  trigger_type: BadgeTrigger;
  trigger_value: number;
  rarity: BadgeRarity;
};

export type UserBadgeRow = {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
};

export type GroupStandingRow = {
  id: string;
  grupo: string;
  country_id: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

export type LeaderboardRow = {
  id: string;
  username: string;
  avatar_url: string | null;
  country_id: string;
  total_points: number;
  prediction_points: number;
  checkin_points: number;
  streak_count: number;
  rank: number;
};

// ---- Joined / enriched types used by the UI ----
export type MatchWithDetails = MatchRow & {
  stadium: StadiumRow;
  userPrediction?: PredictionRow;
  userCheckIn?: CheckInRow;
};

export type UserProfile = UserRow & {
  badges: (UserBadgeRow & { badge: BadgeRow })[];
  rank?: number;
};
