import React, { useState, useEffect } from 'react';
import { Activity, Copy, Share2, HelpCircle, ArrowRight } from 'lucide-react';
import { SavedHistory } from '../types';

interface BmiCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function BmiCalculator({ onAddHistory, onNavigate }: BmiCalculatorProps) {
  const [weight, setWeight] = useState<number>(70); // in kg
  const [height, setHeight] = useState<number>(175); // in cm
  
  const [bmi, setBmi] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [healthyRange, setHealthyRange] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // BMI = weight (kg) / [height (m)]^2
    const heightInMeters = height / 100;
    if (heightInMeters > 0) {
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      const finalBmi = parseFloat(calculatedBmi.toFixed(1));
      setBmi(finalBmi);

      // categories matching WHO standards
      if (finalBmi < 18.5) {
        setCategory('Underweight ⚠️');
      } else if (finalBmi >= 18.5 && finalBmi < 25) {
        setCategory('Normal Weight (Healthy) ✨');
      } else if (finalBmi >= 25 && finalBmi < 30) {
        setCategory('Overweight ⚠️');
      } else {
        setCategory('Obese 🚨');
      }

      // Healthy weight range calculations for the given height
      const lowWeight = Math.round(18.5 * (heightInMeters * heightInMeters));
      const highWeight = Math.round(24.9 * (heightInMeters * heightInMeters));
      setHealthyRange(`${lowWeight} kg - ${highWeight} kg`);
    } else {
      setBmi(0);
      setCategory('N/A');
    }
  }, [weight, height]);

  const handleCopy = () => {
    const text = `Body Mass Index (BMI) Details:
Height: ${height} cm
Weight: ${weight} kg
Calculated BMI: ${bmi}
Classification: ${category}
Ideal Weight Range: ${healthyRange}
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'BMI Calculator',
      expression: `${weight}kg @ ${height}cm`,
      result: `${bmi} (${category.split(' ')[0]})`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div id="bmi-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-500" />
            BMI Health Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Analyze your Body Mass Index (BMI) based on metric indicators, check ideal targets, and follow WHO guidance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 text-zinc-700 dark:text-zinc-350 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-4 h-4" /> {copied ? 'Stats Copied!' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-rose-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={30}
              max={150}
              step={1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>30 kg</span>
              <span>90 kg</span>
              <span>150 kg</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-rose-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={100}
              max={220}
              step={1}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>100 cm</span>
              <span>160 cm</span>
              <span>220 cm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Formula Explanation</h4>
            <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-150 dark:border-zinc-800">
              <code className="text-xs font-mono text-rose-500 block mb-1">BMI = weight (kg) / [height (m)]²</code>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Body Mass Index measures body fatness limits based on height weight columns. It applies to adult men and women over 18 years old.
              </p>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100/55 dark:border-rose-950/40 text-center">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">Your BMI Rank</span>
              <span className="text-5xl font-extrabold text-rose-550 text-rose-600 dark:text-rose-400 font-mono">{bmi}</span>
              <div className="text-xs font-bold text-rose-500 mt-2 font-mono">{category}</div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/80">
              <h5 className="font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Perfect Target Weight Range</h5>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-1 font-mono">{healthyRange}</p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Corresponding to standard body weight densities showing index ranges between 18.5 to 24.9.
              </p>
            </div>

            {/* Custom SVG slider indicator bar to show where BMI falls */}
            <div className="relative pt-4 px-1">
              <div className="h-2.5 w-full bg-linear-to-r from-blue-300 via-emerald-400 to-rose-400 rounded-full" />
              {/* Indicator pinning cursor position */}
              {bmi > 0 && (
                <div 
                  style={{ left: `${Math.min(100, Math.max(0, ((bmi - 14) / 26) * 100))}%` }} 
                  className="absolute top-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/35 transform -translate-x-1/2 transition-all duration-300"
                />
              )}
              <div className="flex justify-between text-[9px] text-zinc-400 mt-2 font-mono">
                <span>Under: &lt;18.5</span>
                <span>Normal: 18.5-25</span>
                <span>Obese: &gt;30</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/85 flex items-center justify-between text-xs text-zinc-400">
            <span>WHO World Health Standard</span>
            <span className="text-emerald-500 font-bold">Safe metric indices</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-rose-500" />
          Health & Nutrition FAQ
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">Are BMI indexes accurate indicators of lean muscle vs fat?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Generally, yes for standard populations. However, BMI does not directly differentiate fat density from muscle density, so high-muscled athletes may score Overweight indices despite having very low body fats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
