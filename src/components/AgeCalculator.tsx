import React, { useState, useEffect } from 'react';
import { Calendar, Copy, Share2, HelpCircle, ArrowRight, Hourglass } from 'lucide-react';
import { SavedHistory } from '../types';

interface AgeCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function AgeCalculator({ onAddHistory, onNavigate }: AgeCalculatorProps) {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [years, setYears] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [totalMonths, setTotalMonths] = useState<number>(0);
  const [totalWeeks, setTotalWeeks] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!birthDate || !targetDate) return;

    const b = new Date(birthDate);
    const t = new Date(targetDate);

    if (t < b) {
      // guard negative ages
      setYears(0); setMonths(0); setDays(0);
      setTotalDays(0); setTotalWeeks(0); setTotalHours(0);
      return;
    }

    // Comprehensive elapsed calculation
    let diffYears = t.getFullYear() - b.getFullYear();
    let diffMonths = t.getMonth() - b.getMonth();
    let diffDays = t.getDate() - b.getDate();

    if (diffDays < 0) {
      diffMonths -= 1;
      // Get days in the previous month of targetDate
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      diffDays += prevMonth.getDate();
    }

    if (diffMonths < 0) {
      diffYears -= 1;
      diffMonths += 12;
    }

    setYears(diffYears);
    setMonths(diffMonths);
    setDays(diffDays);

    // Cumulative stats
    const msDiff = t.getTime() - b.getTime();
    const totSecs = Math.floor(msDiff / 1000);
    const totMins = Math.floor(totSecs / 60);
    const totHours = Math.floor(totMins / 60);
    const totDays = Math.floor(totHours / 24);
    const totWeeks = Math.floor(totDays / 7);
    const totMonthsVal = diffYears * 12 + diffMonths;

    setTotalSeconds(totSecs);
    setTotalMinutes(totMins);
    setTotalHours(totHours);
    setTotalDays(totDays);
    setTotalWeeks(totWeeks);
    setTotalMonths(totMonthsVal);
  }, [birthDate, targetDate]);

  const handleCopy = () => {
    const text = `Age Calculation:
Birth Date: ${birthDate}
Reference Date: ${targetDate}
Exact Age: ${years} Years, ${months} Months, ${days} Days
Cumulative Days: ${totalDays.toLocaleString()} Days
Cumulative Weeks: ${totalWeeks.toLocaleString()} Weeks
Cumulative Hours: ${totalHours.toLocaleString()} Hours
Cumulative Seconds: ${totalSeconds.toLocaleString()} Seconds
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'Age Calculator',
      expression: `Born ${birthDate}`,
      result: `${years}y ${months}m ${days}d`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div id="age-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-500" />
            Age Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Calculate precise differences in years, months, weeks, days, hours, and seconds between key dates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied Details!' : 'Copy Results'}
          </button>
          <button onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> {shared ? 'Linked!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">Age at Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/45 p-3.5 rounded-xl border border-zinc-100">
            <h5 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">Did you know?</h5>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Leap years add a 366th day in February every 4 years. This precise engine calculates date offsets by dynamically adding month indexes.
            </p>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Calculated Age Result</h3>
            
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 p-3 rounded-xl">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{years}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">Years</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 p-3 rounded-xl">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{months}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">Months</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 p-3 rounded-xl">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{days}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">Days</div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Cumulative Metric Timelines</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans">Total Months</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{totalMonths.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans">Total Weeks</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{totalWeeks.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans">Total Days</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{totalDays.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs col-span-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans">Total Hours</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{totalHours.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs col-span-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans">Total Minutes</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{totalMinutes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border border-zinc-100 dark:border-zinc-800/60 p-2.5 rounded-xl font-mono text-xs col-span-2 md:col-span-1 bg-zinc-50 dark:bg-zinc-800/30">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-sans flex items-center gap-1">
                  <Hourglass className="w-3 h-3 text-indigo-500 animate-spin" /> Seconds Elapsed
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">{totalSeconds.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Based on standard Gregorian calendars</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-bold">100% Precise</span>
          </div>
        </div>
      </div>

      {/* Related calculators */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Student Tools & Calculators</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('scientific-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Scientific Calculator <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('gpa-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            GPA Grading Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
