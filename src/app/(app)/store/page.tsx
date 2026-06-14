'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PRIZES } from '@/lib/data/prizes';
import styles from './page.module.css';

export default function StorePage() {
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    async function loadPoints() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('total_points').eq('id', user.id).single();
        if (data) {
          setUserPoints(data.total_points);
        }
      }
      setLoading(false);
    }
    loadPoints();
  }, []);

  const handleRedeem = (prizeId: string, cost: number) => {
    if (userPoints === null || userPoints < cost) {
      alert('No tienes suficientes puntos para este premio.');
      return;
    }
    
    setRedeeming(prizeId);
    
    // Simulate redemption process
    setTimeout(() => {
      alert(`¡Canjeaste tu premio con éxito! Se descontaron ${cost} puntos.`);
      setUserPoints(prev => prev! - cost);
      setRedeeming(null);
      // In a real app we'd call a Server Action to process the redemption safely
    }, 1500);
  };

  if (loading) return <div className={styles.container}>Cargando tienda...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🛒 Tienda de Premios</h1>
        <p className={styles.subtitle}>Canjea tus puntos por recompensas exclusivas.</p>
        
        <div className={styles.pointsPill}>
          Tus Puntos: <strong>{userPoints ?? 0}</strong>
        </div>
      </header>

      <div className={styles.grid}>
        {PRIZES.map((prize) => {
          const canAfford = (userPoints ?? 0) >= prize.pointsCost;
          const isRedeeming = redeeming === prize.id;
          
          return (
            <div key={prize.id} className={`${styles.card} ${!canAfford ? styles.locked : ''}`}>
              <div className={styles.imageBox}>
                <span className={styles.icon}>{prize.image}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.topRow}>
                  <span className={styles.typeTag}>{prize.type === 'digital' ? '💻 Digital' : prize.type === 'physical' ? '📦 Físico' : '🎫 Entrada'}</span>
                  <span className={styles.stock}>Quedan {prize.stock}</span>
                </div>
                <h3 className={styles.prizeName}>{prize.name}</h3>
                <p className={styles.description}>{prize.description}</p>
                <div className={styles.actionRow}>
                  <span className={styles.cost}>{prize.pointsCost} pts</span>
                  <button 
                    className={styles.redeemBtn} 
                    disabled={!canAfford || isRedeeming}
                    onClick={() => handleRedeem(prize.id, prize.pointsCost)}
                  >
                    {isRedeeming ? 'Procesando...' : canAfford ? 'Canjear' : 'Faltan Puntos'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
