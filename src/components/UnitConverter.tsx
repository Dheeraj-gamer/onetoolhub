import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Settings, Copy } from 'lucide-react';

interface UnitOption {
  code: string;
  name: string;
  factor: number; // Factor relative to primary base unit
}

const UNIT_GROUPS: Record<string, { label: string; units: UnitOption[] }> = {
  length: {
    label: 'Length (Base: Meter)',
    units: [
      { code: 'm', name: 'Meters (m)', factor: 1 },
      { code: 'km', name: 'Kilometers (km)', factor: 1000 },
      { code: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
      { code: 'inch', name: 'Inches (in)', factor: 0.0254 },
      { code: 'ft', name: 'Feet (ft)', factor: 0.3048 },
      { code: 'mile', name: 'Miles (mi)', factor: 1609.34 }
    ]
  },
  weight: {
    label: 'Weight & Mass (Base: Kilogram)',
    units: [
      { code: 'kg', name: 'Kilograms (kg)', factor: 1 },
      { code: 'g', name: 'Grams (g)', factor: 0.001 },
      { code: 'lb', name: 'Pounds (lb)', factor: 0.453592 },
      { code: 'oz', name: 'Ounces (oz)', factor: 0.0283495 }
    ]
  },
  digital: {
    label: 'Data Storage (Base: Byte)',
    units: [
      { code: 'b', name: 'Bytes (B)', factor: 1 },
      { code: 'kb', name: 'Kilobytes (KB)', factor: 1024 },
      { code: 'mb', name: 'Megabytes (MB)', factor: 1024 * 1024 },
      { code: 'gb', name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      { code: 'tb', name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 }
    ]
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<'length' | 'weight' | 'digital'>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [sourceUnit, setSourceUnit] = useState('m');
  const [targetUnit, setTargetUnit] = useState('km');
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset selections on category flip
    const activeGroup = UNIT_GROUPS[category];
    if (activeGroup && activeGroup.units[0]) {
      setSourceUnit(activeGroup.units[0].code);
      setTargetUnit(activeGroup.units[1] ? activeGroup.units[1].code : activeGroup.units[0].code);
    }
  }, [category]);

  useEffect(() => {
    const group = UNIT_GROUPS[category];
    if (!group) return;

    const srcNode = group.units.find(u => u.code === sourceUnit);
    const tgtNode = group.units.find(u => u.code === targetUnit);

    if (srcNode && tgtNode) {
      // Convert source unit to base unit, then convert base unit to target unit
      const baseValue = inputValue * srcNode.factor;
      const finalValue = baseValue / tgtNode.factor;
      setConvertedValue(parseFloat(finalValue.toFixed(8)));
    }
  }, [inputValue, sourceUnit, targetUnit, category]);

  const handleSwap = () => {
    const temp = sourceUnit;
    setSourceUnit(targetUnit);
    setTargetUnit(temp);
    setInputValue(convertedValue);
  };

  const handleCopy = () => {
    const text = `${inputValue} ${sourceUnit} = ${convertedValue} ${targetUnit}\nCalculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="unit-converter" className="space-y-6">
      <div className="flex flex-col md:flex-row items-add items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-indigo-500" />
            Universal Unit Converter
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Perform realtime measurements convert operations across weight, digital bytes, and length.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied conversion!' : 'Copy Value'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-50/50 dark:bg-zinc-800/20 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex gap-2 flex-wrap mb-4">
        {Object.keys(UNIT_GROUPS).map((gKey) => (
          <button
            key={gKey}
            onClick={() => setCategory(gKey as any)}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              category === gKey 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {gKey}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Input Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs relative">
          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Convert From</label>
          <div className="flex gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="flex-grow bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none font-bold font-mono dark:text-white"
            />
            <select
              value={sourceUnit}
              onChange={(e) => setSourceUnit(e.target.value)}
              className="w-40 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 outline-none cursor-pointer text-xs dark:text-white focus:border-indigo-500"
            >
              {UNIT_GROUPS[category]?.units.map((u) => (
                <option key={u.code} value={u.code}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs relative">
          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Converted To</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={convertedValue}
              className="flex-grow bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none font-bold font-mono dark:text-white"
              readOnly
            />
            <select
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              className="w-40 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 outline-none cursor-pointer text-xs dark:text-white focus:border-indigo-500"
            >
              {UNIT_GROUPS[category]?.units.map((u) => (
                <option key={u.code} value={u.code}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleSwap}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-6 rounded-xl cursor-pointer flex items-center gap-1.5 duration-150 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" /> Swap Input Units
        </button>
      </div>
    </div>
  );
}
