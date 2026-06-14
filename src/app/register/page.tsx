'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES } from '@/lib/data/countries';
import { applyCountryTheme, saveTheme } from '@/lib/utils/theme';
import styles from './page.module.css';

// ============================================================
// Fan Pulse — Register Page
// Step 1: Credentials → Step 2: Choose your country
// ============================================================

type Step = 'credentials' | 'country';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleCountryHover(countryId: string) {
    applyCountryTheme(countryId);
  }

  function handleCountrySelect(countryId: string) {
    setSelectedCountry(countryId);
    applyCountryTheme(countryId);
    saveTheme(countryId);
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !email.trim() || password.length < 6) {
      setError('Completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setStep('country');
  }

  async function handleRegister() {
    if (!selectedCountry) {
      setError('Selecciona tu país favorito para continuar.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            country_id: selectedCountry,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (data.user) {
        router.push('/home');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar. Inténtalo de nuevo.';
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

      <AnimatePresence mode="wait">
        {step === 'credentials' ? (
          <motion.div
            key="credentials"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={styles.formCard}
          >
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Crea tu cuenta</h1>
              <p className={styles.formSubtitle}>Únete a la comunidad fan del Mundial 2026</p>
            </div>

            <form onSubmit={handleCredentials} className={styles.form} noValidate>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-username">Nombre de fan</label>
                <input
                  id="reg-username"
                  className="input-field"
                  type="text"
                  placeholder="Ej: ElMaestro10"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="reg-email">Correo electrónico</label>
                <input
                  id="reg-email"
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
                <label className="input-label" htmlFor="reg-password">Contraseña</label>
                <input
                  id="reg-password"
                  className="input-field"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              {error && <p className={styles.errorMsg} role="alert">{error}</p>}

              <button type="submit" className="btn btn-primary btn-w-full" id="reg-next-btn">
                Siguiente — Elige tu país →
              </button>
            </form>

            <p className={styles.loginLink}>
              ¿Ya tienes cuenta?{' '}
              <a href="/login">Inicia sesión</a>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="country"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={styles.countryStep}
          >
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>¿Con quién vas? 🌎</h1>
              <p className={styles.formSubtitle}>
                Elige tu selección favorita. Esto personalizará toda tu experiencia.
              </p>
            </div>

            {/* Search */}
            <input
              className="input-field"
              type="search"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="country-search"
              aria-label="Buscar país"
            />

            {/* Country grid */}
            <div className={styles.countryGrid} role="radiogroup" aria-label="Selecciona tu país favorito">
              {filteredCountries.map((country, i) => (
                <motion.button
                  key={country.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.015, duration: 0.2 }}
                  className={`${styles.countryCard} ${selectedCountry === country.id ? styles.selected : ''}`}
                  onMouseEnter={() => handleCountryHover(country.id)}
                  onClick={() => handleCountrySelect(country.id)}
                  role="radio"
                  aria-checked={selectedCountry === country.id}
                  aria-label={country.name}
                  id={`country-${country.id}`}
                  type="button"
                  style={{
                    '--card-c1': country.c1,
                    '--card-c2': country.c2,
                  } as React.CSSProperties}
                >
                  <span className={styles.countryFlag}>{country.flag}</span>
                  <span className={styles.countryName}>{country.name}</span>
                  {selectedCountry === country.id && (
                    <motion.span
                      className={styles.checkmark}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {error && <p className={styles.errorMsg} role="alert">{error}</p>}

            <div className={styles.countryActions}>
              <button
                className="btn btn-secondary"
                onClick={() => setStep('credentials')}
                id="reg-back-btn"
                type="button"
              >
                ← Atrás
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={!selectedCountry || loading}
                id="reg-submit-btn"
                type="button"
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  `¡Entrar al Mundial! 🚀`
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
