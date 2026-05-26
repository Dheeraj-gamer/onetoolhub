import React, { useState, useEffect, useRef } from 'react';
import { Hourglass, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

export default function PomodoroTool() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished, toggle mode !
            const nextMode = mode === 'focus' ? 'break' : 'focus';
            setMode(nextMode);
            const nextLength = nextMode === 'focus' ? focusLength : breakLength;
            setMinutes(nextLength);
            setSeconds(0);
            
            // Trigger simulated sound alert
            triggerAudioAlert();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds, mode, focusLength, breakLength]);

  const triggerAudioAlert = () => {
    // Standard chemical web audio synthesizer beep to make it fully authentic!
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 beep
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, 800);
    } catch (e) {
      // Fallback
      alert(`🔔 Period alarm! Switching to ${mode === 'focus' ? 'Break' : 'Focus'} cycle.`);
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMode('focus');
    setMinutes(focusLength);
    setSeconds(0);
  };

  const updateLengths = (type: 'focus' | 'break', value: number) => {
    if (value < 1 || value > 60) return;
    if (type === 'focus') {
      setFocusLength(value);
      if (mode === 'focus') {
        setMinutes(value);
        setSeconds(0);
      }
    } else {
      setBreakLength(value);
      if (mode === 'break') {
        setMinutes(value);
        setSeconds(0);
      }
    }
  };

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute circular SVG remaining timeline stroke
  const totalSeconds = mode === 'focus' ? focusLength * 60 : breakLength * 60;
  const currentSecondsRemaining = minutes * 60 + seconds;
  const strokeDash = (currentSecondsRemaining / totalSeconds) * 283; // 2 * Math.PI * r where r=45

  return (
    <div id="pomodoro" className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Hourglass className="w-6 h-6 text-rose-500" />
          Pomodoro Productivity Timer
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Stay highly focused during study blocks and rejuvenate during short breaks. Features custom beep indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Timer Dial visual */}
        <div className="lg:col-span-7 bg-zinc-950 p-6 rounded-3xl border border-zinc-900 flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
          
          {/* Overlay Status Badge */}
          <div className="mb-4">
            <span className={`px-4.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
              mode === 'focus' 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {mode === 'focus' ? '🔥 Deep Study block' : '☕ Relaxing Break'}
            </span>
          </div>

          <div className="relative flex justify-center items-center select-none py-4">
            <svg viewBox="0 0 100 100" className="w-56 h-56 transform -rotate-90">
              <circle cx="50" cy="50" r="45" stroke="#27272a" strokeWidth="3" fill="none" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke={mode === 'focus' ? '#f43f5e' : '#10b981'} 
                strokeWidth="4.5" 
                fill="none" 
                strokeDasharray="283"
                strokeDashoffset={283 - strokeDash}
                className="transition-all duration-1000 stroke-linecap-round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black font-mono text-white tracking-tight">{formatTime(minutes, seconds)}</span>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
                {isActive ? 'Keep Studying' : 'Stalled'}
              </span>
            </div>
          </div>

          {/* Controls Button Row */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={handleStartPause} 
              aria-label={isActive ? "Pause Focus Timer" : "Start Focus Timer"}
              className={`p-4 rounded-full text-white font-black transition-all cursor-pointer ${
                isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <button 
              onClick={handleReset} 
              aria-label="Reset study chronometer"
              className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 transition-all cursor-pointer border border-zinc-700"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Settings Columns */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-6">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Studying Settings</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs text-zinc-500 mb-1.5 font-bold">
                <span>Focus Duration</span>
                <span className="font-mono text-zinc-400">{focusLength} Mins</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateLengths('focus', focusLength - 5)} className="w-10 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 py-1.5 rounded-lg text-xs font-bold font-mono dark:text-white cursor-pointer">-5</button>
                <div className="flex-grow bg-zinc-50 dark:bg-zinc-950/40 rounded-lg text-center flex items-center justify-center font-mono font-bold text-sm border border-zinc-100 dark:border-zinc-800/80 dark:text-white">{focusLength}m</div>
                <button onClick={() => updateLengths('focus', focusLength + 5)} className="w-10 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 py-1.5 rounded-lg text-xs font-bold font-mono dark:text-white cursor-pointer">+5</button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs text-zinc-500 mb-1.5 font-bold">
                <span>Break Duration</span>
                <span className="font-mono text-zinc-400">{breakLength} Mins</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateLengths('break', breakLength - 1)} className="w-10 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 py-1.5 rounded-lg text-xs font-bold font-mono dark:text-white cursor-pointer">-1</button>
                <div className="flex-grow bg-zinc-50 dark:bg-zinc-950/40 rounded-lg text-center flex items-center justify-center font-mono font-bold text-sm border border-zinc-100 dark:border-zinc-800/80 dark:text-white">{breakLength}m</div>
                <button onClick={() => updateLengths('break', breakLength + 1)} className="w-10 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 py-1.5 rounded-lg text-xs font-bold font-mono dark:text-white cursor-pointer">+1</button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-100">
              <Bell className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-800 dark:text-zinc-300 block mb-0.5">Audible alert cues enabled</strong>
                When timer counts reach 00:00, physical frequency oscillations are triggered.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
