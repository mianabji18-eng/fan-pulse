const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// World Cup 2026 format: 12 groups of 4 teams.
const groups = {
  'Group A': ['mex', 'usa', 'can', 'arg'], // placeholders
  'Group B': ['bra', 'fra', 'eng', 'esp'],
  'Group C': ['por', 'bel', 'ned', 'ita'],
  'Group D': ['ger', 'uru', 'col', 'chi'],
  'Group E': ['per', 'ecu', 'par', 'ven'],
  'Group F': ['jpn', 'kor', 'aus', 'ksa'],
  'Group G': ['irn', 'qat', 'sen', 'mar'],
  'Group H': ['egy', 'nga', 'cmr', 'ghn'],
  'Group I': ['civ', 'alg', 'tun', 'mli'],
  'Group J': ['usa', 'can', 'mex', 'crc'], // Note: just placeholders
  'Group K': ['pan', 'jam', 'hon', 'slv'],
  'Group L': ['nzl', 'fij', 'sol', 'tah']
};

const matches = [];

// 3 matchdays per group. Round-robin for 4 teams means 6 matches per group.
// 12 groups * 6 matches = 72 matches.
let dateCounter = new Date('2026-06-11T12:00:00Z');

for (const [groupName, teams] of Object.entries(groups)) {
  const matchups = [
    [teams[0], teams[1]],
    [teams[2], teams[3]],
    [teams[0], teams[2]],
    [teams[1], teams[3]],
    [teams[0], teams[3]],
    [teams[1], teams[2]]
  ];

  for (const [home, away] of matchups) {
    matches.push({
      id: crypto.randomUUID(),
      match_date: dateCounter.toISOString().split('T')[0],
      match_time: '12:00:00',
      home_country_id: home,
      away_country_id: away,
      stadium_id: 'estadio-azteca', // placeholder
      phase: 'Group Stage',
      group_name: groupName,
      status: 'upcoming',
      home_score: null,
      away_score: null,
      predictions_locked: false,
      created_at: new Date().toISOString()
    });
    // increment date by 4 hours
    dateCounter.setHours(dateCounter.getHours() + 4);
  }
}

const outputPath = path.join(__dirname, 'world_cup_2026_groups.json');
fs.writeFileSync(outputPath, JSON.stringify(matches, null, 2));
console.log(`Generated ${matches.length} matches to ${outputPath}`);
