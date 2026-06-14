// ============================================================
// Fan Pulse — Theme Utilities
// Applies country-based CSS custom properties to the document root
// ============================================================

import { type Country, COUNTRY_MAP } from '@/lib/data/countries';

/**
 * Apply country theme to <html data-theme="...">
 * and set CSS custom properties for --c1, --c2, --c3 + RGB variants
 */
export function applyCountryTheme(countryId: string): void {
  if (typeof document === 'undefined') return;

  const country = COUNTRY_MAP[countryId];
  if (!country) return;

  const root = document.documentElement;

  // data-theme attribute (matches CSS selectors in variables.css)
  root.setAttribute('data-theme', countryId);

  // Also set inline custom properties for runtime overrides
  root.style.setProperty('--c1', country.c1);
  root.style.setProperty('--c2', country.c2);
  root.style.setProperty('--c3', country.c3);
  root.style.setProperty('--c1-rgb', country.c1rgb);
  root.style.setProperty('--c2-rgb', country.c2rgb);
  root.style.setProperty('--c3-rgb', country.c3rgb);
}

/**
 * Flash overlay animation when switching themes
 */
export function flashTheme(): void {
  if (typeof document === 'undefined') return;

  const flash = document.getElementById('theme-flash');
  if (!flash) return;

  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 400);
}

/**
 * Apply theme with flash animation
 */
export function switchTheme(countryId: string): void {
  flashTheme();
  setTimeout(() => applyCountryTheme(countryId), 50);
}

/**
 * Get theme from localStorage or fallback
 */
export function getSavedTheme(): string {
  if (typeof localStorage === 'undefined') return 'usa';
  return localStorage.getItem('fp_country') ?? 'usa';
}

export function saveTheme(countryId: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('fp_country', countryId);
}

export { type Country };
