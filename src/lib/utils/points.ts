// ============================================================
// Fan Pulse — Points Calculation Logic
// ============================================================

import type { PredictionRow, MatchRow } from '@/types/database';

export type PredictionResult = {
  winnerPoints: number;
  differencePoints: number;
  exactPoints: number;
  total: number;
  isExact: boolean;
};

export const POINTS = {
  CORRECT_WINNER: 3,
  CORRECT_DIFFERENCE: 5,
  EXACT_SCORE: 10,
  CHECKIN_APPROVED: 50,
} as const;

/**
 * Calculate points for a given prediction vs actual match result.
 * Server-side equivalent of the grade_predictions SQL function.
 */
export function calculatePredictionPoints(
  pred: Pick<PredictionRow, 'pred_home_score' | 'pred_away_score' | 'pred_winner'>,
  match: Pick<MatchRow, 'home_score' | 'away_score'>
): PredictionResult {
  const { home_score, away_score } = match;

  if (home_score === null || away_score === null) {
    return { winnerPoints: 0, differencePoints: 0, exactPoints: 0, total: 0, isExact: false };
  }

  const actualWinner =
    home_score > away_score ? 'home' :
    away_score > home_score ? 'away' : 'draw';

  const winnerPoints = pred.pred_winner === actualWinner ? POINTS.CORRECT_WINNER : 0;

  const actualDiff = home_score - away_score;
  const predDiff   = pred.pred_home_score - pred.pred_away_score;
  const differencePoints = predDiff === actualDiff ? POINTS.CORRECT_DIFFERENCE : 0;

  const isExact = pred.pred_home_score === home_score && pred.pred_away_score === away_score;
  const exactPoints = isExact ? POINTS.EXACT_SCORE : 0;

  return {
    winnerPoints,
    differencePoints,
    exactPoints,
    total: winnerPoints + differencePoints + exactPoints,
    isExact,
  };
}

/**
 * Derive pred_winner from score inputs automatically
 */
export function deriveWinner(home: number, away: number): 'home' | 'away' | 'draw' {
  if (home > away) return 'home';
  if (away > home) return 'away';
  return 'draw';
}

/**
 * Format points for display with + prefix
 */
export function fmtPoints(pts: number): string {
  return pts > 0 ? `+${pts}` : String(pts);
}
