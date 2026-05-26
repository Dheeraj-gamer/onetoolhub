import React, { useState, useEffect, useRef } from 'react';
import { Watch, Timer, Copy, Play, Pause, RotateCcw } from 'lucide-react';

interface ZoneNode {
  name: string;
  label: string;
  offset: number; // in UTC hours
}

const TIMEZONES: ZoneNode[] = [
  { name: 'UTC', label: 'Universal Temps', offset: 0 },
  { name: 'America/New_York', label: 'Eastern Standard Time (EST)', offset: -5 },
  { name: 'Europe/London', label: 'GMT / London UK Time', offset: 0 },
  { name: 'Asia/Kolkata', label: 'Indian Standard Time (IST)', offset: 5.5 },
  { name: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 9 },
  { name: 'America/Los_Angeles', label: 'Pacific Standard Time (PST)', offset: -8 }
];

export default function ClocksTool() {
  const [systemTime, setSystemTime] = useState(new Date());

  // Stopwatch States
  const [swActive, setSwActive] = useState(false);
  const [swTime, setSwTime] = useState(0); // in millisecond increments
  const swRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sysInterval = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    return () => clearInterval(sysInterval);
  }, []);

  useEffect(() => {
    if (swActive) {
      swRef.current = setInterval(() => {
        setSwTime(prev => prev + 10);
      }, 10);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }

    return () => {
      if (swRef.current) clearInterval(swRef.current);
    };
  }, [swActive]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');
    const cStr = centiseconds.toString().padStart(2, '0');

    return `${mStr}:${sStr}.${cStr}`;
  };

  const handleCopyTime = (timeText: string) => {
    navigator.clipboard.writeText(timeText);
  };

  const getTimeForOffset = (offset: number) => {
    // Get UTC date
    const utcDate = new Date(systemTime.getTime() + systemTime.getTimezoneOffset() * 60000);
    // Add offset hours
    const zoneDate = new Date(utcDate.getTime() + offset * 3600000);
    return zoneDate.toLocaleTimeString();
  };

  return (
    <div id="clocks" className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Watch className="w-6 h-6 text-indigo-500" />
          Chronometers & World Clock
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Monitor international timezone clocks and leverage a precise lap stopwatch for study/testing sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side World Clocks Listing */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1 mb-2">timezone monitors</h3>
          
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-3.5">
            {TIMEZONES.map((zone) => {
              const strTime = getTimeForOffset(zone.offset);
              return (
                <div key={zone.name} className="flex justify-between items-center pt-3.5 first:pt-0">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{zone.name}</h4>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">{zone.label}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{strTime}</span>
                    <button 
                      onClick={() => handleCopyTime(`${zone.name}: ${strTime}`)}
                      className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-indigo-500 cursor-pointer"
                      title="Copy Clock Timestamp"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Precise Stopwatch */}
        <div className="lg:col-span-5 bg-zinc-950 rounded-3xl p-6 border border-zinc-900 shadow-2xl flex flex-col justify-between items-center h-fit">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 self-start">
            <Timer className="w-4 h-4 text-emerald-500 animate-pulse" /> Precision Stopwatch
          </span>

          <div className="py-10 select-all font-mono text-4xl font-extrabold text-white tracking-widest bg-zinc-900/40 rounded-2xl w-full text-center border border-zinc-800/60 my-4">
            {formatStopwatch(swTime)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setSwActive(!swActive)}
              aria-label={swActive ? "Pause precise Stopwatch" : "Start precise Stopwatch"}
              className={`p-3.5 rounded-full text-white font-extrabold transition-all cursor-pointer ${
                swActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {swActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => { setSwActive(false); setSwTime(0); }}
              aria-label="Reset stopwatch chronometer to zero"
              className="p-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 transition-all cursor-pointer border border-zinc-750 border-zinc-700"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
