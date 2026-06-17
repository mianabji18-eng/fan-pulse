// ============================================================
// Fan Pulse — Country / Theme Data (migrated from data.js)
// ============================================================

export type Country = {
  id: string;
  name: string;
  flag: string;
  c1: string; // primary color
  c2: string; // secondary color
  c3: string; // tertiary color
  group: string;
  // Pre-computed RGB for CSS var
  c1rgb: string;
  c2rgb: string;
  c3rgb: string;
};

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0,0,0';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

const raw: Omit<Country, 'c1rgb' | 'c2rgb' | 'c3rgb'>[] = [
  // GRUPO A
  { id: 'mex', name: 'México',        flag: '🇲🇽', c1: '#006847', c2: '#FFFFFF', c3: '#CE1126', group: 'A' },
  { id: 'rsa', name: 'Sudáfrica',     flag: '🇿🇦', c1: '#007749', c2: '#FFB81C', c3: '#E03C31', group: 'A' },
  { id: 'kor', name: 'Corea',         flag: '🇰🇷', c1: '#CD2E3A', c2: '#FFFFFF', c3: '#003478', group: 'A' },
  { id: 'cze', name: 'Chequia',       flag: '🇨🇿', c1: '#D7141A', c2: '#11457E', c3: '#FFFFFF', group: 'A' },

  // GRUPO B
  { id: 'can', name: 'Canadá',        flag: '🇨🇦', c1: '#FF0000', c2: '#FFFFFF', c3: '#FF0000', group: 'B' },
  { id: 'bih', name: 'Bosnia',        flag: '🇧🇦', c1: '#002395', c2: '#FECB00', c3: '#FFFFFF', group: 'B' },
  { id: 'qat', name: 'Qatar',         flag: '🇶🇦', c1: '#8D1B3D', c2: '#FFFFFF', c3: '#8D1B3D', group: 'B' },
  { id: 'sui', name: 'Suiza',         flag: '🇨🇭', c1: '#D52B1E', c2: '#FFFFFF', c3: '#D52B1E', group: 'B' },

  // GRUPO C
  { id: 'bra', name: 'Brasil',        flag: '🇧🇷', c1: '#009C3B', c2: '#FFDF00', c3: '#002776', group: 'C' },
  { id: 'mar', name: 'Marruecos',     flag: '🇲🇦', c1: '#C1272D', c2: '#006233', c3: '#C1272D', group: 'C' },
  { id: 'hai', name: 'Haití',         flag: '🇭🇹', c1: '#00205B', c2: '#D21034', c3: '#FFFFFF', group: 'C' },
  { id: 'sco', name: 'Escocia',       flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', c1: '#005EB8', c2: '#FFFFFF', c3: '#005EB8', group: 'C' },

  // GRUPO D
  { id: 'usa', name: 'EE.UU.',        flag: '🇺🇸', c1: '#B22234', c2: '#3C3B6E', c3: '#FFFFFF', group: 'D' },
  { id: 'par', name: 'Paraguay',      flag: '🇵🇾', c1: '#D52B1E', c2: '#FFFFFF', c3: '#0038A8', group: 'D' },
  { id: 'aus', name: 'Australia',     flag: '🇦🇺', c1: '#00008B', c2: '#FFFFFF', c3: '#FF0000', group: 'D' },
  { id: 'tur', name: 'Turquía',       flag: '🇹🇷', c1: '#E30A17', c2: '#FFFFFF', c3: '#E30A17', group: 'D' },

  // GRUPO E
  { id: 'ger', name: 'Alemania',      flag: '🇩🇪', c1: '#DD0000', c2: '#000000', c3: '#FFCE00', group: 'E' },
  { id: 'cuw', name: 'Curazao',       flag: '🇨🇼', c1: '#002776', c2: '#F9E814', c3: '#FFFFFF', group: 'E' },
  { id: 'civ', name: 'C. de Marfil',  flag: '🇨🇮', c1: '#F77F00', c2: '#FFFFFF', c3: '#009A44', group: 'E' },
  { id: 'ecu', name: 'Ecuador',       flag: '🇪🇨', c1: '#FFD100', c2: '#003893', c3: '#EF3340', group: 'E' },

  // GRUPO F
  { id: 'ned', name: 'Países Bajos',  flag: '🇳🇱', c1: '#AE1C28', c2: '#FFFFFF', c3: '#21468B', group: 'F' },
  { id: 'jpn', name: 'Japón',         flag: '🇯🇵', c1: '#BC002D', c2: '#FFFFFF', c3: '#BC002D', group: 'F' },
  { id: 'swe', name: 'Suecia',        flag: '🇸🇪', c1: '#004B87', c2: '#FFCD00', c3: '#004B87', group: 'F' },
  { id: 'tun', name: 'Túnez',         flag: '🇹🇳', c1: '#E70013', c2: '#FFFFFF', c3: '#E70013', group: 'F' },

  // GRUPO G
  { id: 'bel', name: 'Bélgica',       flag: '🇧🇪', c1: '#FAE042', c2: '#000000', c3: '#EF3340', group: 'G' },
  { id: 'egy', name: 'Egipto',        flag: '🇪🇬', c1: '#CE1126', c2: '#FFFFFF', c3: '#000000', group: 'G' },
  { id: 'irn', name: 'Irán',          flag: '🇮🇷', c1: '#239F40', c2: '#FFFFFF', c3: '#DA0000', group: 'G' },
  { id: 'nzl', name: 'N. Zelanda',    flag: '🇳🇿', c1: '#00247D', c2: '#FFFFFF', c3: '#CC142B', group: 'G' },

  // GRUPO H
  { id: 'esp', name: 'España',        flag: '🇪🇸', c1: '#AA151B', c2: '#F1BF00', c3: '#AA151B', group: 'H' },
  { id: 'cpv', name: 'Cabo Verde',    flag: '🇨🇻', c1: '#003893', c2: '#FFFFFF', c3: '#CF2027', group: 'H' },
  { id: 'sau', name: 'Arabia S.',     flag: '🇸🇦', c1: '#006C35', c2: '#FFFFFF', c3: '#006C35', group: 'H' },
  { id: 'uru', name: 'Uruguay',       flag: '🇺🇾', c1: '#75AADB', c2: '#FFFFFF', c3: '#75AADB', group: 'H' },

  // GRUPO I
  { id: 'fra', name: 'Francia',       flag: '🇫🇷', c1: '#002395', c2: '#FFFFFF', c3: '#ED2939', group: 'I' },
  { id: 'sen', name: 'Senegal',       flag: '🇸🇳', c1: '#00853F', c2: '#FDEF42', c3: '#E31B23', group: 'I' },
  { id: 'irq', name: 'Irak',          flag: '🇮🇶', c1: '#CE1126', c2: '#FFFFFF', c3: '#007A3D', group: 'I' },
  { id: 'nor', name: 'Noruega',       flag: '🇳🇴', c1: '#BA0C2F', c2: '#FFFFFF', c3: '#00205B', group: 'I' },

  // GRUPO J
  { id: 'arg', name: 'Argentina',     flag: '🇦🇷', c1: '#74ACDF', c2: '#FFFFFF', c3: '#74ACDF', group: 'J' },
  { id: 'alg', name: 'Argelia',       flag: '🇩🇿', c1: '#006233', c2: '#FFFFFF', c3: '#D21034', group: 'J' },
  { id: 'aut', name: 'Austria',       flag: '🇦🇹', c1: '#ED2939', c2: '#FFFFFF', c3: '#ED2939', group: 'J' },
  { id: 'jor', name: 'Jordania',      flag: '🇯🇴', c1: '#CE1126', c2: '#000000', c3: '#007A3D', group: 'J' },

  // GRUPO K
  { id: 'por', name: 'Portugal',      flag: '🇵🇹', c1: '#006600', c2: '#FF0000', c3: '#006600', group: 'K' },
  { id: 'cod', name: 'RD Congo',      flag: '🇨🇩', c1: '#007FFF', c2: '#F7D618', c3: '#CE1021', group: 'K' },
  { id: 'uzb', name: 'Uzbekistán',    flag: '🇺🇿', c1: '#0099B5', c2: '#FFFFFF', c3: '#1EB53A', group: 'K' },
  { id: 'col', name: 'Colombia',      flag: '🇨🇴', c1: '#FCD116', c2: '#003087', c3: '#CE1126', group: 'K' },

  // GRUPO L
  { id: 'eng', name: 'Inglaterra',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', c1: '#CF091E', c2: '#FFFFFF', c3: '#CF091E', group: 'L' },
  { id: 'cro', name: 'Croacia',       flag: '🇭🇷', c1: '#FF0000', c2: '#FFFFFF', c3: '#0000FF', group: 'L' },
  { id: 'gha', name: 'Ghana',         flag: '🇬🇭', c1: '#006B3F', c2: '#FCD116', c3: '#EF3340', group: 'L' },
  { id: 'pan', name: 'Panamá',        flag: '🇵🇦', c1: '#FFFFFF', c2: '#D21034', c3: '#005293', group: 'L' },
];

export const COUNTRIES: Country[] = raw.map(c => ({
  ...c,
  c1rgb: hexToRgb(c.c1),
  c2rgb: hexToRgb(c.c2),
  c3rgb: hexToRgb(c.c3),
}));

export const COUNTRY_MAP: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map(c => [c.id, c])
);

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'] as const;

export function getCountry(id: string): Country | undefined {
  return COUNTRY_MAP[id];
}

export function getGroupCountries(group: string): Country[] {
  return COUNTRIES.filter(c => c.group === group);
}
