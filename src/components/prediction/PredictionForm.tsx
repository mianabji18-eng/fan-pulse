'use client';

import { useState, useTransition } from 'react';
import { submitPrediction } from '@/app/actions/predictions';
import styles from './PredictionForm.module.css';

interface PredictionFormProps {
  matchId: string;
  initialHomeScore: number | null;
  initialAwayScore: number | null;
  isLocked: boolean;
}

export function PredictionForm({ matchId, initialHomeScore, initialAwayScore, isLocked }: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(initialHomeScore ?? 0);
  const [awayScore, setAwayScore] = useState(initialAwayScore ?? 0);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('match_id', matchId);
      formData.append('pred_home_score', homeScore.toString());
      formData.append('pred_away_score', awayScore.toString());

      const result = await submitPrediction(formData);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Predicción guardada!' });
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.scoresRow}>
        <div className={styles.scoreInputGroup}>
          <button 
            type="button" 
            className={styles.adjustBtn} 
            onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
            disabled={isLocked || isPending}
          >
            -
          </button>
          <input 
            type="number" 
            className={styles.scoreInput}
            value={homeScore}
            readOnly
          />
          <button 
            type="button" 
            className={styles.adjustBtn} 
            onClick={() => setHomeScore(homeScore + 1)}
            disabled={isLocked || isPending}
          >
            +
          </button>
        </div>
        
        <span className={styles.divider}>-</span>
        
        <div className={styles.scoreInputGroup}>
          <button 
            type="button" 
            className={styles.adjustBtn} 
            onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
            disabled={isLocked || isPending}
          >
            -
          </button>
          <input 
            type="number" 
            className={styles.scoreInput}
            value={awayScore}
            readOnly
          />
          <button 
            type="button" 
            className={styles.adjustBtn} 
            onClick={() => setAwayScore(awayScore + 1)}
            disabled={isLocked || isPending}
          >
            +
          </button>
        </div>
      </div>

      {!isLocked && (
        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={isPending}
        >
          {isPending ? 'Guardando...' : 'Guardar Predicción'}
        </button>
      )}

      {message && (
        <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
          {message.text}
        </div>
      )}
      
      {isLocked && (
        <div className={styles.lockedMessage}>
          🔒 Las predicciones están cerradas para este partido.
        </div>
      )}
    </form>
  );
}
