'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="btn btn-secondary"
      style={{ width: '100%', marginTop: '1rem', padding: '12px', fontWeight: 'bold', border: '1px solid var(--accent)' }}
    >
      {loading ? 'Saliendo...' : '🚪 Salir de la cuenta'}
    </button>
  );
}
