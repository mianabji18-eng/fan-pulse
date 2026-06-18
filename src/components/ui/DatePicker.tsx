'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DatePickerProps = {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  availableDates?: string[]; // Arrays of YYYY-MM-DD
};

// Helper to get local "Today" string
export const getLocalTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DatePicker({ selectedDate, onDateChange, availableDates = [] }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Base viewing month on selectedDate (or today if none)
  const initialDateObj = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
  const [viewMonth, setViewMonth] = useState(initialDateObj.getMonth());
  const [viewYear, setViewYear] = useState(initialDateObj.getFullYear());

  const todayStr = getLocalTodayStr();

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Sync view month when selectedDate changes from outside
  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate + 'T12:00:00');
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  }, [selectedDate]);

  const handlePrevDay = () => {
    if (!availableDates.length) return;
    const sorted = [...availableDates].sort();
    const idx = sorted.indexOf(selectedDate);
    if (idx > 0) {
      onDateChange(sorted[idx - 1]);
    } else {
      // If we don't strictly require availableDates to navigate
      const prevDate = new Date(selectedDate + 'T12:00:00');
      prevDate.setDate(prevDate.getDate() - 1);
      const prevStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth()+1).padStart(2,'0')}-${String(prevDate.getDate()).padStart(2,'0')}`;
      onDateChange(prevStr);
    }
  };

  const handleNextDay = () => {
    if (!availableDates.length) return;
    const sorted = [...availableDates].sort();
    const idx = sorted.indexOf(selectedDate);
    if (idx !== -1 && idx < sorted.length - 1) {
      onDateChange(sorted[idx + 1]);
    } else {
      const nextDate = new Date(selectedDate + 'T12:00:00');
      nextDate.setDate(nextDate.getDate() + 1);
      const nextStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth()+1).padStart(2,'0')}-${String(nextDate.getDate()).padStart(2,'0')}`;
      onDateChange(nextStr);
    }
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const onSelectDay = (dateStr: string) => {
    onDateChange(dateStr);
    setIsOpen(false);
  };

  const displayDateStr = (dateStr: string) => {
    if (dateStr === todayStr) return 'Hoy';
    const dateObj = new Date(dateStr + 'T12:00:00');
    return dateObj.toLocaleDateString('es', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Generate calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  
  // Adjust to make Monday the first day (optional, keeping Sunday for simplicity or adjust here)
  const emptyCells = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 1 (Mon) -> 0 empty, 0 (Sun) -> 6 empty (if Mon start)
  const adjustedEmptyCells = firstDayOfWeek; // using Sunday start

  const calendarDays = [];
  for (let i = 0; i < adjustedEmptyCells; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dayNames = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

  return (
    <div className="relative z-50 w-full" ref={containerRef}>
      {/* Top Navigator */}
      <div className="flex items-center justify-between bg-slate-800/50 rounded-2xl shadow-sm border border-white/10 px-4 py-3 backdrop-blur-sm">
        <button 
          onClick={handlePrevDay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/50 hover:bg-slate-700 disabled:opacity-30 transition-colors"
        >
          <span className="text-gray-400 font-bold">‹</span>
        </button>
        
        <div 
          className="flex items-center gap-2 cursor-pointer font-bold text-gray-200 select-none hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="capitalize">{displayDateStr(selectedDate)}</span>
          <motion.span 
            className="text-[10px] text-gray-500 flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
          >
            ▼
          </motion.span>
        </div>

        <button 
          onClick={handleNextDay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/50 hover:bg-slate-700 disabled:opacity-30 transition-colors"
        >
          <span className="text-gray-400 font-bold">›</span>
        </button>
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-gray-400">‹</button>
              <span className="font-bold text-white tracking-wide">{monthNames[viewMonth]} {viewYear}</span>
              <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-gray-400">›</button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {dayNames.map(day => (
                <span key={day} className="text-xs font-bold text-gray-500 uppercase">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={idx} className="h-8" />;
                const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === todayStr;
                const hasMatch = availableDates.includes(dateStr);
                
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectDay(dateStr)}
                    className={`h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                      ${isSelected ? 'bg-[#E3003F] text-white shadow-lg font-bold' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}
                      ${isToday && !isSelected ? 'text-[#E3003F] font-black' : ''}
                    `}
                  >
                    {day}
                    {hasMatch && !isSelected && (
                       <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
