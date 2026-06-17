const fs = require('fs');

const raw = [
  // GRUPO A
  { id: 'mex', group: 'A' }, { id: 'rsa', group: 'A' }, { id: 'kor', group: 'A' }, { id: 'cze', group: 'A' },
  // GRUPO B
  { id: 'can', group: 'B' }, { id: 'bih', group: 'B' }, { id: 'qat', group: 'B' }, { id: 'sui', group: 'B' },
  // GRUPO C
  { id: 'bra', group: 'C' }, { id: 'mar', group: 'C' }, { id: 'hai', group: 'C' }, { id: 'sco', group: 'C' },
  // GRUPO D
  { id: 'usa', group: 'D' }, { id: 'par', group: 'D' }, { id: 'aus', group: 'D' }, { id: 'tur', group: 'D' },
  // GRUPO E
  { id: 'ger', group: 'E' }, { id: 'cuw', group: 'E' }, { id: 'civ', group: 'E' }, { id: 'ecu', group: 'E' },
  // GRUPO F
  { id: 'ned', group: 'F' }, { id: 'jpn', group: 'F' }, { id: 'swe', group: 'F' }, { id: 'tun', group: 'F' },
  // GRUPO G
  { id: 'bel', group: 'G' }, { id: 'egy', group: 'G' }, { id: 'irn', group: 'G' }, { id: 'nzl', group: 'G' },
  // GRUPO H
  { id: 'esp', group: 'H' }, { id: 'cpv', group: 'H' }, { id: 'sau', group: 'H' }, { id: 'uru', group: 'H' },
  // GRUPO I
  { id: 'fra', group: 'I' }, { id: 'sen', group: 'I' }, { id: 'irq', group: 'I' }, { id: 'nor', group: 'I' },
  // GRUPO J
  { id: 'arg', group: 'J' }, { id: 'alg', group: 'J' }, { id: 'aut', group: 'J' }, { id: 'jor', group: 'J' },
  // GRUPO K
  { id: 'por', group: 'K' }, { id: 'cod', group: 'K' }, { id: 'uzb', group: 'K' }, { id: 'col', group: 'K' },
  // GRUPO L
  { id: 'eng', group: 'L' }, { id: 'cro', group: 'L' }, { id: 'gha', group: 'L' }, { id: 'pan', group: 'L' }
];

const data = JSON.parse(fs.readFileSync('src/lib/data/world_cup_2026_groups.json', 'utf8'));

const resolve = (id) => {
  if (id === 'MEX') return 'mex';
  if (id === 'CAN') return 'can';
  if (id === 'USA') return 'usa';
  if (id && id.length === 2 && /[A-L]/.test(id[0]) && /[1-4]/.test(id[1])) {
    const group = id[0];
    const index = parseInt(id[1]) - 1;
    const groupTeams = raw.filter(c => c.group === group);
    return groupTeams[index].id;
  }
  return id;
};

data.forEach(m => {
  m.local = resolve(m.local);
  m.visitante = resolve(m.visitante);
});

fs.writeFileSync('src/lib/data/world_cup_2026_groups.json', JSON.stringify(data, null, 2));
console.log("JSON updated successfully");
