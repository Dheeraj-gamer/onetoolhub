import React, { useState } from 'react';
import { Calculator, Copy, HelpCircle, CornerDownLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { SavedHistory } from '../types';

interface ScientificCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function ScientificCalculator({ onAddHistory, onNavigate }: ScientificCalculatorProps) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [copied, setCopied] = useState(false);

  const [memoryValue, setMemoryValue] = useState(0);

  const handleKey = (key: string) => {
    if (isEvaluated) {
      if ('0123456789.('.includes(key)) {
        setExpression(key);
        setDisplayValue(key);
      } else {
        setExpression(displayValue + ' ' + key + ' ');
        setDisplayValue(displayValue + ' ' + key + ' ');
      }
      setIsEvaluated(false);
      return;
    }

    if (displayValue === '0' && '0123456789'.includes(key)) {
      setExpression(key);
      setDisplayValue(key);
    } else {
      setExpression((prev) => prev + key);
      setDisplayValue((prev) => prev === '0' ? key : prev + key);
    }
  };

  const handleOperator = (op: string) => {
    setIsEvaluated(false);
    setExpression((prev) => prev + ' ' + op + ' ');
    setDisplayValue((prev) => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    setExpression('');
    setDisplayValue('0');
    setIsEvaluated(false);
  };

  const handleBackspace = () => {
    if (displayValue.length <= 1) {
      setDisplayValue('0');
      setExpression('');
    } else {
      const newVal = displayValue.slice(0, -1).trim();
      setDisplayValue(newVal === '' ? '0' : newVal);
      setExpression(newVal);
    }
  };

  const handleEvaluate = () => {
    try {
      // Safely replace words with mathematical functions before evaluating
      // e.g. sin(x) -> Math.sin(x), log(x) -> Math.log10(x)
      let cleanedExpr = expression
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\s*\(/gi, 'Math.sin(')
        .replace(/cos\s*\(/gi, 'Math.cos(')
        .replace(/tan\s*\(/gi, 'Math.tan(')
        .replace(/ln\s*\(/gi, 'Math.log(')
        .replace(/log\s*\(/gi, 'Math.log10(')
        .replace(/sqrt\s*\(/gi, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Simple JavaScript eval sandboxed as much as client-side can do safely
      const evalResult = new Function(`return (${cleanedExpr})`)();
      const finalVal = parseFloat(Number(evalResult).toFixed(8)).toString();

      setDisplayValue(finalVal);
      setIsEvaluated(true);

      onAddHistory({
        id: Math.random().toString(),
        toolName: 'Scientific Calculator',
        expression: expression,
        result: finalVal,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      setDisplayValue('Expression Error');
    }
  };

  const handleScientificFunction = (func: string) => {
    setIsEvaluated(false);
    setExpression((prev) => prev + func + '(');
    setDisplayValue((prev) => prev === '0' ? func + '(' : prev + func + '(');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="scientific-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-500" />
            Scientific Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Perform precision algebraic equations, trigonometry mappings, logarithmic curves, and mathematical operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 text-zinc-700 dark:text-zinc-350 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-4 h-4" /> {copied ? 'Result Copied!' : 'Copy Value'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator Body */}
        <div className="lg:col-span-8 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          {/* Display screen */}
          <div className="bg-zinc-900/90 rounded-2xl p-4 text-right border border-zinc-800/80">
            <div className="text-zinc-500 font-mono text-xs overflow-x-auto min-h-[1.5rem] tracking-wider whitespace-nowrap">
              {expression || ' '}
            </div>
            <div className="text-white font-mono text-3xl font-extrabold mt-1 overflow-x-auto select-all whitespace-nowrap">
              {displayValue}
            </div>
          </div>

          {/* Keypad Grid layout */}
          <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
            {/* Memory & Trig Row */}
            <button onClick={() => setMemoryValue(parseFloat(displayValue) || 0)} className="bg-zinc-900 text-indigo-400 font-semibold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">MS</button>
            <button onClick={() => { setDisplayValue(memoryValue.toString()); setExpression(memoryValue.toString()); }} className="bg-zinc-900 text-indigo-400 font-semibold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">MR</button>
            <button onClick={() => handleScientificFunction('sin')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">sin</button>
            <button onClick={() => handleScientificFunction('cos')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">cos</button>
            <button onClick={() => handleScientificFunction('tan')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">tan</button>
            <button onClick={() => handleKey('π')} className="hidden md:block bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">π</button>

            {/* Scientific log/root Row */}
            <button onClick={() => handleScientificFunction('log')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">log</button>
            <button onClick={() => handleScientificFunction('ln')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">ln</button>
            <button onClick={() => handleScientificFunction('sqrt')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">√</button>
            <button onClick={() => handleOperator('^')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">xʸ</button>
            <button onClick={() => handleKey('e')} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">e</button>
            <button onClick={() => handleKey('(')} className="hidden md:block bg-zinc-900 text-zinc-450 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">(</button>

            {/* General Operators */}
            <button onClick={handleClear} className="bg-rose-950/40 text-rose-400 font-extrabold py-3.5 rounded-xl hover:bg-rose-950/60 text-xs border border-rose-950 cursor-pointer col-span-2 md:col-span-1">CLEAR</button>
            <button onClick={handleBackspace} className="bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs flex justify-center items-center cursor-pointer"><CornerDownLeft className="w-4 h-4" /></button>
            <button onClick={() => handleKey(')')} className="bg-zinc-900 text-zinc-450 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">)</button>
            <button onClick={() => handleOperator('/')} className="bg-indigo-950 text-indigo-300 font-bold py-3.5 rounded-xl hover:bg-indigo-900 text-base cursor-pointer">÷</button>
            <button onClick={() => handleKey('(')} className="md:hidden bg-zinc-900 text-zinc-400 font-bold py-3.5 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">(</button>

            {/* Standard Rows */}
            <button onClick={() => handleKey('7')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">7</button>
            <button onClick={() => handleKey('8')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">8</button>
            <button onClick={() => handleKey('9')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">9</button>
            <button onClick={() => handleOperator('*')} className="bg-indigo-950 text-indigo-300 font-bold py-4 rounded-xl hover:bg-indigo-900 text-base cursor-pointer">×</button>
            <button onClick={() => handleKey('π')} className="md:hidden bg-zinc-900 text-zinc-400 font-bold py-4 rounded-xl hover:bg-zinc-850 text-xs cursor-pointer">π</button>

            <button onClick={() => handleKey('4')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">4</button>
            <button onClick={() => handleKey('5')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">5</button>
            <button onClick={() => handleKey('6')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">6</button>
            <button onClick={() => handleOperator('-')} className="bg-indigo-950 text-indigo-300 font-bold py-4 rounded-xl hover:bg-indigo-900 text-base cursor-pointer">-</button>
            <span className="hidden md:block bg-transparent" />

            <button onClick={() => handleKey('1')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">1</button>
            <button onClick={() => handleKey('2')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">2</button>
            <button onClick={() => handleKey('3')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">3</button>
            <button onClick={() => handleOperator('+')} className="bg-indigo-950 text-indigo-300 font-bold py-4 rounded-xl hover:bg-indigo-900 text-base cursor-pointer">+</button>
            <span className="hidden md:block bg-transparent" />

            {/* Bottom Row */}
            <button onClick={() => handleKey('0')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer col-span-2">0</button>
            <button onClick={() => handleKey('.')} className="bg-zinc-850 text-white font-extrabold py-4 rounded-xl hover:bg-zinc-800 text-sm cursor-pointer">.</button>
            <button onClick={handleEvaluate} className="bg-emerald-600 text-white font-extrabold py-4 rounded-xl hover:bg-emerald-500 text-base col-span-2 cursor-pointer border border-emerald-500/30">=</button>
          </div>
        </div>

        {/* Math Instructions Panel */}
        <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Formula Explanations</h3>
          
          <div className="space-y-3.5 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="p-3 bg-white dark:bg-zinc-850 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-indigo-500 dark:text-indigo-400">Trig Functions</span>
              <p className="mt-1">Evaluates default radian coordinates. For example, compute <code className="font-mono text-zinc-800 dark:text-zinc-200">sin(π/2)</code> to get <code className="font-mono font-bold">1</code>.</p>
            </div>
            <div className="p-3 bg-white dark:bg-zinc-850 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-indigo-500 dark:text-indigo-400">Exponent Powers</span>
              <p className="mt-1">The caret operator (<code className="font-mono text-zinc-850 dark:text-zinc-200">^</code>) triggers compounding exponents. Example: <code className="font-mono text-zinc-800 dark:text-zinc-200">2^3</code> results in <code className="font-mono font-bold">8</code>.</p>
            </div>
            <div className="p-3 bg-white dark:bg-zinc-850 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-indigo-500 dark:text-indigo-400">Logarithm Scales</span>
              <p className="mt-1">Use <code className="font-mono">log(x)</code> for standard Base-10 logarithms, and <code className="font-mono">ln(x)</code> for natural logs (Base-e).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related section */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Academic Calculators</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('gpa-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            GPA Study Tracker <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('age-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Age Date Difference <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
