import React, { useState, useEffect } from 'react';
import { Receipt, Copy, HelpCircle, ArrowRight, Table } from 'lucide-react';
import { SavedHistory } from '../types';

interface IncomeTaxCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function IncomeTaxCalculator({ onAddHistory, onNavigate }: IncomeTaxCalculatorProps) {
  const [annualIncome, setAnnualIncome] = useState<number>(800000);
  const [deductions, setDeductions] = useState<number>(150000);

  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [takeHomePay, setTakeHomePay] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const taxable = Math.max(0, annualIncome - deductions);
    setTaxableIncome(taxable);

    // Simplified progressive tax brackets logic (similar to standard progressive schedules)
    // Bracket 1: up to ₹2.5L: 0%
    // Bracket 2: ₹2.5L to ₹5L: 5%
    // Bracket 3: ₹5L to ₹10L: 20%
    // Bracket 4: over ₹10L: 30%
    let calcTax = 0;
    if (taxable > 1000000) {
      calcTax += (taxable - 1000000) * 0.3;
      calcTax += 500000 * 0.2; // bracket 3
      calcTax += 250000 * 0.05; // bracket 2
    } else if (taxable > 500000) {
      calcTax += (taxable - 500000) * 0.2;
      calcTax += 250000 * 0.05;
    } else if (taxable > 250000) {
      calcTax += (taxable - 250000) * 0.05;
    }

    setTotalTax(Math.round(calcTax));
    const finalRate = annualIncome > 0 ? (calcTax / annualIncome) * 100 : 0;
    setEffectiveRate(parseFloat(finalRate.toFixed(1)));
    setTakeHomePay(Math.round(annualIncome - calcTax));
  }, [annualIncome, deductions]);

  const handleCopy = () => {
    const text = `Income Tax Details:
Gross Annual Income: ₹${annualIncome.toLocaleString('en-IN')}
Deductions & Exemptions: ₹${deductions.toLocaleString('en-IN')}
Taxable Base: ₹${taxableIncome.toLocaleString('en-IN')}
Deducted Annual Income Tax: ₹${totalTax.toLocaleString('en-IN')}
Effective Tax Rate: ${effectiveRate}%
Net Annual Take Home: ₹${takeHomePay.toLocaleString('en-IN')}
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'Income Tax Estimator',
      expression: `₹${annualIncome.toLocaleString('en-IN')} income (-₹${deductions.toLocaleString('en-IN')})`,
      result: `₹${totalTax.toLocaleString('en-IN')} tax`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div id="income-tax-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-500" />
            Income Tax Estimator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Determine your taxable base, progressive bracket limits, tax rebates, and final net takeaway ratios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 text-zinc-700 dark:text-zinc-350 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-4 h-4" /> {copied ? 'Deductions Copied!' : 'Copy Results'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Gross Annual Income (₹)</label>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-28 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={20000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>₹1 Lakh</span>
              <span>₹25 Lakhs</span>
              <span>₹50 Lakhs</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Deductions / Rebates Exemption (₹)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={5000}
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>₹0 Exemptions</span>
              <span>₹2.5 Lakhs</span>
              <span>₹5 Lakhs Exemption</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Progressive Tax Bracket Rules</h4>
            <div className="overflow-x-auto bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-150 dark:border-zinc-800">
              <table className="w-full text-left text-[11px] border-collapse font-sans">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold bg-zinc-50 dark:bg-zinc-850">
                    <th className="p-2">Taxable Income Slab (₹)</th>
                    <th className="p-2">Standard Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-zinc-650 dark:text-zinc-350 font-mono">
                  <tr>
                    <td className="p-2">Up to ₹2,50,000</td>
                    <td className="p-2 font-semibold text-zinc-400">Exempt (0%)</td>
                  </tr>
                  <tr>
                    <td className="p-2">₹2,50,001 to ₹5,00,000</td>
                    <td className="p-2 font-semibold text-emerald-500">5% Slab</td>
                  </tr>
                  <tr>
                    <td className="p-2">₹5,00,001 to ₹10,00,000</td>
                    <td className="p-2 font-semibold text-amber-500">20% Slab</td>
                  </tr>
                  <tr>
                    <td className="p-2">Above ₹10,00,000</td>
                    <td className="p-2 font-semibold text-rose-550">30% Slab</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/55 dark:border-emerald-950/40 text-center">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">Total Estimated Income Tax</span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹{totalTax.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Effective Tax Rate
                </span>
                <span className="font-bold text-indigo-500 font-mono">{effectiveRate}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  Net Take Home Salary
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono">₹{takeHomePay.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-bold mb-1">
                <span>Deduction Ratios</span>
                <span className="font-mono text-zinc-400">Effective: {effectiveRate}%</span>
              </div>
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${100 - effectiveRate}%` }} className="bg-emerald-500" title="Take Home Ratio" />
                <div style={{ width: `${effectiveRate}%` }} className="bg-rose-500" title="Tax Burden Ratio" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Progressive bracket estimation only</span>
            <span className="text-zinc-550 font-bold">Tax Slab Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
