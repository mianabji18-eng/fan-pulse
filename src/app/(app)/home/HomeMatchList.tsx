'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRY_MAP, COUNTRIES } from '@/lib/data/countries';
import Link from 'next/link';

type Match = {
  id: string;
  match_date: string;
  match_time: string;
  home_country_id: string;
  away_country_id: string;
  stadium_id: string;
  phase: string;
  status: 'upcoming' | 'live' | 'finished';
  home_score: number | null;
  away_score: number | null;
};

// Helper to fix Windows emoji flag rendering by using Twemoji SVG
const getTwemojiUrl = (emoji: string) => {
  if (!emoji || emoji === '🏳️') return '';
  const codePoints = Array.from(emoji).map(c => c.codePointAt(0)?.toString(16)).join('-');
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoints}.svg`;
};

// Helper to resolve placeholders (e.g. "A2") to the actual country
const resolveCountry = (id: string) => {
  if (COUNTRY_MAP[id]) return COUNTRY_MAP[id];
  if (id && id.length === 2 && /[A-L]/.test(id[0]) && /[1-4]/.test(id[1])) {
    const group = id[0];
    const index = parseInt(id[1]) - 1;
    const groupTeams = COUNTRIES.filter(c => c.group === group);
    if (groupTeams[index]) return groupTeams[index];
  }
  return null;
};

import { DatePicker, getLocalTodayStr } from '@/components/ui/DatePicker';

export function HomeMatchList({ matches }: { matches: Match[] }) {
  const todayStr = getLocalTodayStr();
  const uniqueDates = Array.from(new Set(matches.map(m => m.match_date))).sort();
  
  // Find index of today, or the closest upcoming date
  let initialIndex = uniqueDates.indexOf(todayStr);
  if (initialIndex === -1) {
    initialIndex = uniqueDates.findIndex(d => d > todayStr);
    if (initialIndex === -1) initialIndex = uniqueDates.length - 1;
    if (initialIndex === -1) initialIndex = 0;
  }

  // Selected date is now managed by a string, defaulting to what we found
  const [selectedDate, setSelectedDate] = useState(uniqueDates[initialIndex] || todayStr);

  if (!matches || matches.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay partidos disponibles.</div>;
  }

  const dayMatches = matches.filter(m => m.match_date === selectedDate);

  // Group by phase/group
  const groupedMatches = dayMatches.reduce((acc, match) => {
    let groupName = match.phase;
    // If it's group stage, try to extract group from the home team
    if (groupName.toLowerCase().includes('group') || groupName === 'Fase de Grupos') {
      const homeC = resolveCountry(match.home_country_id);
      if (homeC && homeC.group) {
        groupName = `Grupo ${homeC.group}`;
      }
    }
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${m} ${ampm}`;
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Date Navigator Modal Component */}
      <DatePicker 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
        availableDates={uniqueDates} 
      />

      {/* Matches List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {Object.entries(groupedMatches).map(([group, matchArr]) => (
            <div key={group} className="flex flex-col">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg inline-block w-max mb-3 border border-white/5 shadow-sm">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{group}</span>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl shadow-xl border border-white/10 overflow-hidden divide-y divide-white/5 backdrop-blur-sm">
                {matchArr.map(match => (
                  <Link href={`/matches/${match.id}`} key={match.id} className="flex items-center px-4 py-4 hover:bg-slate-800/80 transition-colors group">
                    {/* Status / Time */}
                    <div className="w-12 shrink-0">
                      {match.status === 'finished' ? (
                        <span className="text-[11px] font-bold text-gray-400 bg-slate-900/80 px-2 py-1 rounded-md border border-white/5">FT</span>
                      ) : match.status === 'live' ? (
                        <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]">LIVE</span>
                      ) : (
                         <span className="text-[11px] font-medium text-gray-500">
                           {/* Intentionally left blank, time is in middle */}
                         </span>
                      )}
                    </div>

                    {/* Teams and Score/Time */}
                    <div className="flex-1 flex items-center justify-center gap-4">
                      {/* Home Team */}
                      <div className="flex items-center justify-end gap-3 flex-1">
                        <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                          {resolveCountry(match.home_country_id)?.name ?? match.home_country_id}
                        </span>
                        <span className="w-6 h-4 flex items-center justify-center shrink-0 drop-shadow-md">
                          {resolveCountry(match.home_country_id)?.flag ? (
                            <img src={getTwemojiUrl(resolveCountry(match.home_country_id)!.flag)} alt="flag" className="w-full h-full object-contain" />
                          ) : '🏳️'}
                        </span>
                      </div>

                      {/* Score or Time */}
                      <div className="w-20 flex justify-center shrink-0">
                        {match.status === 'finished' || match.status === 'live' ? (
                          <span className="text-sm font-bold font-mono text-white bg-slate-900/60 px-3 py-1 rounded-md border border-white/5">
                            {match.home_score ?? 0} - {match.away_score ?? 0}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400 bg-slate-900/60 px-2 py-1 rounded-md border border-white/5">
                            {formatTime(match.match_time)}
                          </span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-start gap-3 flex-1">
                        <span className="w-6 h-4 flex items-center justify-center shrink-0 drop-shadow-md">
                          {resolveCountry(match.away_country_id)?.flag ? (
                            <img src={getTwemojiUrl(resolveCountry(match.away_country_id)!.flag)} alt="flag" className="w-full h-full object-contain" />
                          ) : '🏳️'}
                        </span>
                        <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                          {resolveCountry(match.away_country_id)?.name ?? match.away_country_id}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Icon (Star) */}
                    <div className="w-8 flex justify-end shrink-0">
                       <span className="text-gray-600 group-hover:text-yellow-400 transition-colors">★</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedMatches).length === 0 && (
             <div className="text-center py-8 text-gray-500">No hay partidos para esta fecha.</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
