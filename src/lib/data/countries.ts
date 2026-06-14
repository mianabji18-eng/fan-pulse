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
  { id: 'usa', name: 'United States',   flag: '🇺🇸', c1: '#B22234', c2: '#3C3B6E', c3: '#FFFFFF', group: 'A' },
  { id: 'can', name: 'Canada',          flag: '🇨🇦', c1: '#FF0000', c2: '#FFFFFF', c3: '#FF0000', group: 'A' },
  { id: 'mex', name: 'Mexico',          flag: '🇲🇽', c1: '#006847', c2: '#FFFFFF', c3: '#CE1126', group: 'A' },
  { id: 'civ', name: "Côte d'Ivoire",   flag: '🇨🇮', c1: '#F77F00', c2: '#FFFFFF', c3: '#009A44', group: 'A' },
  { id: 'ecu', name: 'Ecuador',         flag: '🇪🇨', c1: '#FFD100', c2: '#003893', c3: '#EF3340', group: 'A' },
  { id: 'arg', name: 'Argentina',       flag: '🇦🇷', c1: '#74ACDF', c2: '#FFFFFF', c3: '#74ACDF', group: 'B' },
  { id: 'bra', name: 'Brazil',          flag: '🇧🇷', c1: '#009C3B', c2: '#FFDF00', c3: '#002776', group: 'B' },
  { id: 'gha', name: 'Ghana',           flag: '🇬🇭', c1: '#006B3F', c2: '#FCD116', c3: '#EF3340', group: 'B' },
  { id: 'ven', name: 'Venezuela',       flag: '🇻🇪', c1: '#CF142B', c2: '#F4E20D', c3: '#00247D', group: 'B' },
  { id: 'fra', name: 'France',          flag: '🇫🇷', c1: '#002395', c2: '#FFFFFF', c3: '#ED2939', group: 'C' },
  { id: 'eng', name: 'England',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', c1: '#CF091E', c2: '#FFFFFF', c3: '#CF091E', group: 'C' },
  { id: 'cmr', name: 'Cameroon',        flag: '🇨🇲', c1: '#007A5E', c2: '#CE1126', c3: '#FCD116', group: 'C' },
  { id: 'chl', name: 'Chile',           flag: '🇨🇱', c1: '#D52B1E', c2: '#FFFFFF', c3: '#003DA5', group: 'C' },
  { id: 'ger', name: 'Germany',         flag: '🇩🇪', c1: '#DD0000', c2: '#000000', c3: '#FFCE00', group: 'D' },
  { id: 'esp', name: 'Spain',           flag: '🇪🇸', c1: '#AA151B', c2: '#F1BF00', c3: '#AA151B', group: 'D' },
  { id: 'pol', name: 'Poland',          flag: '🇵🇱', c1: '#FFFFFF', c2: '#DC143C', c3: '#FFFFFF', group: 'D' },
  { id: 'par', name: 'Paraguay',        flag: '🇵🇾', c1: '#D52B1E', c2: '#FFFFFF', c3: '#009900', group: 'D' },
  { id: 'por', name: 'Portugal',        flag: '🇵🇹', c1: '#006600', c2: '#FF0000', c3: '#006600', group: 'E' },
  { id: 'ned', name: 'Netherlands',     flag: '🇳🇱', c1: '#AE1C28', c2: '#FFFFFF', c3: '#21468B', group: 'E' },
  { id: 'sui', name: 'Switzerland',     flag: '🇨🇭', c1: '#D52B1E', c2: '#FFFFFF', c3: '#D52B1E', group: 'E' },
  { id: 'bol', name: 'Bolivia',         flag: '🇧🇴', c1: '#D52B1E', c2: '#F9E300', c3: '#007A3D', group: 'E' },
  { id: 'bel', name: 'Belgium',         flag: '🇧🇪', c1: '#FAE042', c2: '#000000', c3: '#EF3340', group: 'F' },
  { id: 'cro', name: 'Croatia',         flag: '🇭🇷', c1: '#FF0000', c2: '#FFFFFF', c3: '#0000FF', group: 'F' },
  { id: 'aut', name: 'Austria',         flag: '🇦🇹', c1: '#ED2939', c2: '#FFFFFF', c3: '#ED2939', group: 'F' },
  { id: 'crc', name: 'Costa Rica',      flag: '🇨🇷', c1: '#002B7F', c2: '#FFFFFF', c3: '#CE1126', group: 'F' },
  { id: 'uru', name: 'Uruguay',         flag: '🇺🇾', c1: '#75AADB', c2: '#FFFFFF', c3: '#75AADB', group: 'G' },
  { id: 'col', name: 'Colombia',        flag: '🇨🇴', c1: '#FCD116', c2: '#003087', c3: '#CE1126', group: 'G' },
  { id: 'den', name: 'Denmark',         flag: '🇩🇰', c1: '#C60C30', c2: '#FFFFFF', c3: '#C60C30', group: 'G' },
  { id: 'pan', name: 'Panama',          flag: '🇵🇦', c1: '#FFFFFF', c2: '#D21034', c3: '#005293', group: 'G' },
  { id: 'sen', name: 'Senegal',         flag: '🇸🇳', c1: '#00853F', c2: '#FDEF42', c3: '#E31B23', group: 'H' },
  { id: 'mar', name: 'Morocco',         flag: '🇲🇦', c1: '#C1272D', c2: '#006233', c3: '#C1272D', group: 'H' },
  { id: 'ser', name: 'Serbia',          flag: '🇷🇸', c1: '#C6363C', c2: '#0C4076', c3: '#FFFFFF', group: 'H' },
  { id: 'jam', name: 'Jamaica',         flag: '🇯🇲', c1: '#000000', c2: '#FED100', c3: '#009B3A', group: 'H' },
  { id: 'jpn', name: 'Japan',           flag: '🇯🇵', c1: '#BC002D', c2: '#FFFFFF', c3: '#BC002D', group: 'I' },
  { id: 'kor', name: 'South Korea',     flag: '🇰🇷', c1: '#CD2E3A', c2: '#FFFFFF', c3: '#003478', group: 'I' },
  { id: 'ukr', name: 'Ukraine',         flag: '🇺🇦', c1: '#005BBB', c2: '#FFD500', c3: '#005BBB', group: 'I' },
  { id: 'nzl', name: 'New Zealand',     flag: '🇳🇿', c1: '#00247D', c2: '#FFFFFF', c3: '#CC142B', group: 'I' },
  { id: 'aus', name: 'Australia',       flag: '🇦🇺', c1: '#00008B', c2: '#FFFFFF', c3: '#FF0000', group: 'J' },
  { id: 'irn', name: 'Iran',            flag: '🇮🇷', c1: '#239F40', c2: '#FFFFFF', c3: '#DA0000', group: 'J' },
  { id: 'tur', name: 'Turkey',          flag: '🇹🇷', c1: '#E30A17', c2: '#FFFFFF', c3: '#E30A17', group: 'J' },
  { id: 'ind', name: 'Indonesia',       flag: '🇮🇩', c1: '#CE1126', c2: '#FFFFFF', c3: '#CE1126', group: 'J' },
  { id: 'sau', name: 'Saudi Arabia',    flag: '🇸🇦', c1: '#006C35', c2: '#FFFFFF', c3: '#006C35', group: 'K' },
  { id: 'qat', name: 'Qatar',           flag: '🇶🇦', c1: '#8D1B3D', c2: '#FFFFFF', c3: '#8D1B3D', group: 'K' },
  { id: 'hun', name: 'Hungary',         flag: '🇭🇺', c1: '#CE2939', c2: '#FFFFFF', c3: '#477050', group: 'K' },
  { id: 'irq', name: 'Iraq',            flag: '🇮🇶', c1: '#CE1126', c2: '#FFFFFF', c3: '#007A3D', group: 'K' },
  { id: 'egy', name: 'Egypt',           flag: '🇪🇬', c1: '#CE1126', c2: '#FFFFFF', c3: '#000000', group: 'L' },
  { id: 'nig', name: 'Nigeria',         flag: '🇳🇬', c1: '#008751', c2: '#FFFFFF', c3: '#008751', group: 'L' },
  { id: 'slo', name: 'Slovenia',        flag: '🇸🇮', c1: '#003DA5', c2: '#FFFFFF', c3: '#E32212', group: 'L' },
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
