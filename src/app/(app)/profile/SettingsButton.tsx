'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
}

export default function SettingsButton({ userProfile, userEmail }: { userProfile: UserProfile, userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(userProfile.username || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    
    try {
      // Update Auth
      const updates: any = {};
      if (email !== userEmail) updates.email = email;
      if (phone) updates.phone = phone;
      
      if (Object.keys(updates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Update Public Profile
      if (username !== userProfile.username) {
        const { error: profileError } = await supabase
          .from('users')
          .update({ username })
          .eq('id', userProfile.id);
        if (profileError) throw profileError;
      }

      setMessage('Configuración actualizada con éxito. Si cambiaste tu correo, revisa tu bandeja de entrada para confirmarlo.');
      router.refresh();
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary"
        style={{ width: '100%', marginTop: '1rem', padding: '12px', fontWeight: 'bold', border: '1px solid var(--border-card)' }}
      >
        ⚙️ Configuración
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card card-glass" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Configuración</h2>
              <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>✕</button>
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Nombre de Usuario</label>
              <input 
                type="text" 
                className="input-field" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Teléfono (Opcional)</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="+1234567890"
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>

            {message && (
              <div style={{ 
                marginBottom: '1rem', 
                color: message.startsWith('Error') ? '#ff4d4d' : 'var(--primary-color)', 
                fontSize: '0.875rem',
                backgroundColor: message.startsWith('Error') ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: `1px solid ${message.startsWith('Error') ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`
              }}>
                {message}
              </div>
            )}

            <button 
              className="btn btn-primary btn-w-full"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
