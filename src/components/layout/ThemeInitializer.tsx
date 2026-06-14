'use client';

import { useEffect } from 'react';
import { applyCountryTheme, saveTheme } from '@/lib/utils/theme';

// ============================================================
// Fan Pulse — Theme Initializer (Client Component)
// Applies the user's country theme on first render in the app shell
// ============================================================

export function ThemeInitializer({ countryId }: { countryId: string }) {
  useEffect(() => {
    applyCountryTheme(countryId);
    saveTheme(countryId);
  }, [countryId]);

  return null; // Renders nothing — side-effect only
}
