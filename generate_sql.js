const fs = require('fs');

const raw = [
  // GRUPO A
  { id: 'mex', old: 'MEX' }, { id: 'rsa', old: 'A2' }, { id: 'kor', old: 'A3' }, { id: 'cze', old: 'A4' },
  // GRUPO B
  { id: 'can', old: 'CAN' }, { id: 'bih', old: 'B2' }, { id: 'qat', old: 'B3' }, { id: 'sui', old: 'B4' },
  // GRUPO C
  { id: 'bra', old: 'C1' }, { id: 'mar', old: 'C2' }, { id: 'hai', old: 'C3' }, { id: 'sco', old: 'C4' },
  // GRUPO D
  { id: 'usa', old: 'USA' }, { id: 'par', old: 'D2' }, { id: 'aus', old: 'D3' }, { id: 'tur', old: 'D4' },
  // GRUPO E
  { id: 'ger', old: 'E1' }, { id: 'cuw', old: 'E2' }, { id: 'civ', old: 'E3' }, { id: 'ecu', old: 'E4' },
  // GRUPO F
  { id: 'ned', old: 'F1' }, { id: 'jpn', old: 'F2' }, { id: 'swe', old: 'F3' }, { id: 'tun', old: 'F4' },
  // GRUPO G
  { id: 'bel', old: 'G1' }, { id: 'egy', old: 'G2' }, { id: 'irn', old: 'G3' }, { id: 'nzl', old: 'G4' },
  // GRUPO H
  { id: 'esp', old: 'H1' }, { id: 'cpv', old: 'H2' }, { id: 'sau', old: 'H3' }, { id: 'uru', old: 'H4' },
  // GRUPO I
  { id: 'fra', old: 'I1' }, { id: 'sen', old: 'I2' }, { id: 'irq', old: 'I3' }, { id: 'nor', old: 'I4' },
  // GRUPO J
  { id: 'arg', old: 'J1' }, { id: 'alg', old: 'J2' }, { id: 'aut', old: 'J3' }, { id: 'jor', old: 'J4' },
  // GRUPO K
  { id: 'por', old: 'K1' }, { id: 'cod', old: 'K2' }, { id: 'uzb', old: 'K3' }, { id: 'col', old: 'K4' },
  // GRUPO L
  { id: 'eng', old: 'L1' }, { id: 'cro', old: 'L2' }, { id: 'gha', old: 'L3' }, { id: 'pan', old: 'L4' }
];

let sql = '';
raw.forEach(r => {
  sql += `UPDATE public.matches SET home_country_id = '${r.id}' WHERE home_country_id = '${r.old}';\n`;
  sql += `UPDATE public.matches SET away_country_id = '${r.id}' WHERE away_country_id = '${r.old}';\n`;
});

sql += `\nDELETE FROM public.equipos WHERE id IN (${raw.map(r => `'${r.old}'`).join(', ')});\n`;

fs.writeFileSync('update_matches.sql', sql);
console.log("SQL generated!");
