'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSavedTheme, applyCountryTheme } from '@/lib/utils/theme';
import styles from '../register/page.module.css';

// ============================================================
// Fan Pulse — Login Page
// ============================================================

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        // Restore saved country theme
        const savedCountry = data.user.user_metadata?.country_id ?? getSavedTheme();
        applyCountryTheme(savedCountry);
        router.push('/home');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Credenciales incorrectas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Logo strip */}
      <div className={styles.logoStrip}>
        <span className={styles.trophy}>🏆</span>
        <span className={styles.brand}>Fan Pulse</span>
        <span className={styles.year}>2026</span>
      </div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={styles.formCard}
      >
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Bienvenido de vuelta ⚽</h1>
          <p className={styles.formSubtitle}>El Mundial te espera. Inicia sesión y compite.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              className="input-field"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.errorMsg} role="alert">{error}</p>}

          <button
            type="submit"
            id="login-submit-btn"
            className="btn btn-primary btn-w-full"
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : 'Entrar al estadio 🏟️'}
          </button>
        </form>

        <p className={styles.loginLink}>
          ¿No tienes cuenta?{' '}
          <a href="/register">Regístrate gratis</a>
        </p>
      </motion.div>
    </div>
  );
}
