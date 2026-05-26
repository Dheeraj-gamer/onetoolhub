import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../types';

export default function CalendarTool() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('onetool_events');
    return saved ? JSON.parse(saved) : [
      { id: 'ev1', title: 'Compile EMI interest ledger targets', date: '2026-05-28', time: '10:00 AM', location: 'Virtual meeting / Meet' },
      { id: 'ev2', title: 'Review GPA semester performance review', date: '2026-05-30', time: '02:30 PM', location: 'Counseling Office' }
    ];
  });

  const [dateField, setDateField] = useState('');
  const [titleField, setTitleField] = useState('');
  const [timeField, setTimeField] = useState('12:00 PM');
  const [locField, setLocField] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('onetool_events', JSON.stringify(events));
  }, [events]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleField.trim() || !dateField) return;
    const fresh: CalendarEvent = {
      id: Math.random().toString(),
      title: titleField.trim(),
      date: dateField,
      time: timeField,
      location: locField ? locField.trim() : undefined
    };
    setEvents([...events, fresh]);
    setTitleField('');
    setDateField('');
    setLocField('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Basic monthly offsets for custom view rendering
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get total days in currently displayed month
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // weekday offset (0-6)

  const blanks = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div id="calendar" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-500" />
            Productivity Calendar
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Map out critical milestones, financial deadlines, exams, and translation intervals.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Event
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Event Scheduler</h4>
          <div>
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Event Summary</label>
            <input
              type="text"
              placeholder="e.g. Compound savings final review"
              value={titleField}
              onChange={(e) => setTitleField(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs outline-none dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Date</label>
              <input
                type="date"
                value={dateField}
                onChange={(e) => setDateField(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-2 text-xs outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={timeField}
                onChange={(e) => setTimeField(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-2 text-xs outline-none dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Location / Join Link</label>
            <input
              type="text"
              placeholder="Optional meet room..."
              value={locField}
              onChange={(e) => setLocField(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs outline-none dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer">
              Schedule Event
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs py-2 px-4 rounded-xl cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Month Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 font-mono">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div className="flex gap-1.5">
              <button onClick={handlePrevMonth} className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer transition-colors" aria-label="Previous month filter">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer transition-colors" aria-label="Next month filter">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 bg-zinc-50 dark:bg-zinc-950/45 p-1 rounded-xl border border-zinc-100 dark:border-zinc-800/60 font-mono text-[10px] text-zinc-400 font-extrabold text-center mb-2 uppercase tracking-wider">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {blanks.map((_, idx) => (
              <div key={`blank-${idx}`} className="py-2.5 text-transparent select-none">-</div>
            ))}
            {daysArray.map((day) => {
              // Convert day to YYYY-MM-DD
              const doubleMonth = (currentMonth + 1).toString().padStart(2, '0');
              const doubleDay = day.toString().padStart(2, '0');
              const dateKey = `${currentYear}-${doubleMonth}-${doubleDay}`;
              const dayHasEvents = events.some(e => e.date === dateKey);

              return (
                <div 
                  key={`day-${day}`} 
                  className={`py-2 rounded-lg relative font-bold text-zinc-800 dark:text-zinc-250 border transition-all ${
                    dayHasEvents 
                    ? 'border-indigo-150 bg-indigo-50/50 dark:border-indigo-950/50 dark:bg-indigo-950/20 text-indigo-550' 
                    : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                  title={`${dayHasEvents ? 'Has Scheduled Milestones' : ''}`}
                >
                  {day}
                  {dayHasEvents && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Scheduled Agenda lists */}
        <div className="lg:col-span-5 bg-zinc-50/50 dark:bg-zinc-800/10 p-5 rounded-3xl border border-zinc-150 dark:border-zinc-800/80 max-h-[460px] overflow-y-auto">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Agenda Schedules</h3>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-zinc-400 text-xs py-10 text-center font-mono">No milestones scheduled this month.</p>
            ) : (
              events.map((e) => (
                <div key={e.id} className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-xl flex items-start justify-between gap-3 shadow-xs">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-mono bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-bold">{e.date}</span>
                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight pr-1">{e.title}</h4>
                    <div className="flex gap-3 text-[10px] text-zinc-400 flex-wrap items-center">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-400" /> {e.time}</span>
                      {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-400 truncate max-w-[120px]" /> {e.location}</span>}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(e.id)} 
                    className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
