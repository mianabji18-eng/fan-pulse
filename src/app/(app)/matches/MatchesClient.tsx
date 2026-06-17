'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRY_MAP, COUNTRIES } from '@/lib/data/countries';
import Link from 'next/link';

// Helper function to resolve placeholders (e.g. "A2") to the actual country
const resolveCountry = (id: string) => {
  if (COUNTRY_MAP[id]) return COUNTRY_MAP[id];
  // If it's a placeholder like 'A2', 'B3'
  if (id && id.length === 2 && /[A-L]/.test(id[0]) && /[1-4]/.test(id[1])) {
    const group = id[0];
    const index = parseInt(id[1]) - 1;
    const groupTeams = COUNTRIES.filter(c => c.group === group);
    if (groupTeams[index]) return groupTeams[index];
  }
  return null;
};

// ============================================================
// Fan Pulse — Match Center (Client Component)
// ============================================================

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

type Standing = {
  grupo: string;
  equipo_id: string;
  equipo_nombre: string;
  codigo_iso: string | null;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

export function MatchesClient({ 
  initialMatches, 
  initialStandings 
}: { 
  initialMatches: Match[], 
  initialStandings: Standing[] 
}) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'groups' | 'bracket'>('calendar');

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString('es', {
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Calendar View
  const renderCalendar = () => {
    // Group by date
    const grouped = initialMatches.reduce((acc, match) => {
      if (!acc[match.match_date]) acc[match.match_date] = [];
      acc[match.match_date].push(match);
      return acc;
    }, {} as Record<string, Match[]>);

    return (
      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([date, matches]) => (
          <div key={date} className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              {formatDate(date)}
            </h3>
            <div className="flex flex-col gap-3">
              {matches.map(match => (
                <Link 
                  key={match.id} 
                  href={`/matches/${match.id}`} 
                  className="relative flex flex-col p-5 rounded-xl bg-slate-800/50 border border-white/10 hover:border-white/20 hover:bg-slate-800/70 transition-all shadow-lg backdrop-blur-sm group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/5">
                      {match.phase}
                    </span>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                      {match.match_time.slice(0, 5)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl drop-shadow-md">{resolveCountry(match.home_country_id)?.flag ?? '🏳️'}</span>
                        <span className="text-base font-bold tracking-tight text-gray-100">
                          {resolveCountry(match.home_country_id)?.name ?? match.home_country_id}
                        </span>
                      </div>
                      <span className="text-2xl font-bold font-mono text-white">
                        {match.home_score !== null ? match.home_score : '-'}
                      </span>
                    </div>
                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl drop-shadow-md">{resolveCountry(match.away_country_id)?.flag ?? '🏳️'}</span>
                        <span className="text-base font-bold tracking-tight text-gray-100">
                          {resolveCountry(match.away_country_id)?.name ?? match.away_country_id}
                        </span>
                      </div>
                      <span className="text-2xl font-bold font-mono text-white">
                        {match.away_score !== null ? match.away_score : '-'}
                      </span>
                    </div>
                  </div>

                  {match.status === 'live' && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> EN VIVO
                    </div>
                  )}
                  {match.status === 'finished' && (
                    <div className="mt-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">
                      Finalizado
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Groups View
  const renderGroups = () => {
    // Group standings by group name
    const grouped = initialStandings.reduce((acc, row) => {
      if (!acc[row.grupo]) acc[row.grupo] = [];
      acc[row.grupo].push(row);
      return acc;
    }, {} as Record<string, Standing[]>);

    return (
      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([grupo, teams]) => (
          <div key={grupo} className="rounded-xl bg-slate-800/50 border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="bg-slate-900 px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{grupo}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900/50 text-gray-400 uppercase tracking-wider text-[11px] border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3 font-semibold">País</th>
                    <th className="px-3 py-3 font-semibold text-center">PJ</th>
                    <th className="px-3 py-3 font-semibold text-center">G</th>
                    <th className="px-3 py-3 font-semibold text-center">E</th>
                    <th className="px-3 py-3 font-semibold text-center">P</th>
                    <th className="px-5 py-3 font-bold text-white text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teams.map((team, idx) => {
                    const isTopTwo = idx < 2;
                    return (
                      <tr key={team.equipo_id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className={`w-1 h-6 rounded-full ${isTopTwo ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-transparent'}`} />
                            <span className="text-xl drop-shadow-sm">
                              {resolveCountry(team.equipo_id)?.flag ?? '🏳️'}
                            </span>
                            <span className="font-bold tracking-tight text-gray-200 group-hover:text-white transition-colors">
                              {resolveCountry(team.equipo_id)?.name ?? team.equipo_nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-center text-gray-400 font-mono text-[13px]">{team.pj}</td>
                        <td className="px-3 py-3.5 text-center text-gray-400 font-mono text-[13px]">{team.g}</td>
                        <td className="px-3 py-3.5 text-center text-gray-400 font-mono text-[13px]">{team.e}</td>
                        <td className="px-3 py-3.5 text-center text-gray-400 font-mono text-[13px]">{team.p}</td>
                        <td className="px-5 py-3.5 text-center font-black text-[15px] font-mono text-white bg-slate-900/30">{team.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {initialStandings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3 bg-slate-800/30 rounded-xl border border-dashed border-white/10">
            <span className="text-3xl">📊</span>
            <p className="text-sm font-medium">No hay datos de grupos disponibles.</p>
          </div>
        )}
      </div>
    );
  };

  // Bracket View
  const renderBracket = () => {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-5 text-center p-8 rounded-xl bg-slate-800/50 border border-white/10 max-w-sm shadow-xl backdrop-blur-sm">
          <span className="text-6xl drop-shadow-lg">🏆</span>
          <div>
            <h3 className="text-xl font-black text-white mb-2">Fase Eliminatoria</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Las llaves se generarán automáticamente cuando finalice la fase de grupos.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[560px] mx-auto min-h-screen bg-slate-950 text-gray-300 pt-8 pb-24 px-5">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-white mb-6 flex items-center gap-3">
          Match Center
          <span className="w-2 h-2 rounded-full bg-[#E3003F]"></span>
        </h1>
        
        {/* Segmented Control */}
        <div className="flex p-1.5 bg-slate-900 border border-white/5 rounded-xl shadow-inner" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'calendar'}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${
              activeTab === 'calendar' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendario
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'groups'}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${
              activeTab === 'groups' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Grupos
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'bracket'}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${
              activeTab === 'bracket' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
            }`}
            onClick={() => setActiveTab('bracket')}
          >
            Llaves
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'groups' && renderGroups()}
            {activeTab === 'bracket' && renderBracket()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

