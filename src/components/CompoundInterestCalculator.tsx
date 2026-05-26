import React, { useState, useEffect } from 'react';
import { Percent, Copy, Share2, Download, HelpCircle, ArrowRight } from 'lucide-react';
import { SavedHistory } from '../types';

interface CompoundInterestCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function CompoundInterestCalculator({ onAddHistory, onNavigate }: CompoundInterestCalculatorProps) {
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [years, setYears] = useState<number>(10);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // compounded monthly default

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [accumulatedInterest, setAccumulatedInterest] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const P = principal;
    const PMT = monthlyAddition;
    const r = interestRate / 100;
    const n = compoundFrequency;
    const t = years;

    // Compound interest formula with monthly additions (contributions made at end of month)
    // A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    const compPower = Math.pow(1 + r/n, n * t);
    const principalCompound = P * compPower;
    
    let additionCompound = 0;
    if (r > 0) {
      // If PMT is monthly, we adapt the contribution compounding formula
      // Note: Assuming contributions are monthly (12 additions per year)
      const monthlyRate = r / 12;
      const totalMonths = t * 12;
      additionCompound = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
      additionCompound = PMT * t * 12;
    }

    const totalVal = principalCompound + additionCompound;
    const invested = P + (PMT * t * 12);
    const interest = Math.max(0, totalVal - invested);

    setFutureValue(Math.round(totalVal));
    setTotalInvested(Math.round(invested));
    setAccumulatedInterest(Math.round(interest));
  }, [principal, monthlyAddition, interestRate, years, compoundFrequency]);

  const handleCopy = () => {
    const text = `Compound Interest Projection:
Initial Principal: ₹${principal.toLocaleString('en-IN')}
Monthly Contribution: ₹${monthlyAddition.toLocaleString('en-IN')}
Annual Interest Rate: ${interestRate}%
Time Horizon: ${years} Years
Compounding Frequency: ${compoundFrequency === 12 ? 'Monthly' : compoundFrequency === 4 ? 'Quarterly' : 'Annually'}
Total Invested Capital: ₹${totalInvested.toLocaleString('en-IN')}
Total Interest Earned: ₹${accumulatedInterest.toLocaleString('en-IN')}
Final Projected Value: ₹${futureValue.toLocaleString('en-IN')}
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'Compound Interest',
      expression: `₹${principal.toLocaleString('en-IN')} + ₹${monthlyAddition}/m @ ${interestRate}%`,
      result: `₹${futureValue.toLocaleString('en-IN')}`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDownloadPDF = () => {
    alert(`Downloading Compound Interest Analysis for ₹${principal} base... (Simulated PDF download succeeded)`);
  };

  return (
    <div id="compound-interest" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Percent className="w-6 h-6 text-emerald-500" />
            Compound Interest Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Project high compounding wealth gains over long timelines using customized interest rates and periodic deposits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> {shared ? 'Linked!' : 'Share'}
          </button>
          <button onClick={handleDownloadPDF} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Initial Principal (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Monthly Contribution (₹)</label>
              <input
                type="number"
                value={monthlyAddition}
                onChange={(e) => setMonthlyAddition(Number(e.target.value))}
                className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={interestRate}
                step={0.1}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Compound Frequency</label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                className="w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-500 dark:text-white cursor-pointer"
              >
                <option value={12}>Compounded Monthly</option>
                <option value={4}>Compounded Quarterly</option>
                <option value={1}>Compounded Annually</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Investment Horizon ({years}y)</label>
              <span className="text-xs font-mono text-zinc-400">{years} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Step-by-Step Formula</h4>
            <div className="bg-white dark:bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-150 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-450 space-y-1">
              <div>Projected growth formula combines initial sum compound with periodic contributions compound:</div>
              <code className="text-[11px] font-mono text-emerald-500 block py-1">Value = [P * (1 + r/n)^(nt)] + [PMT * (((1 + r_m)^m - 1) / r_m)]</code>
              <div>Where compounding compounding is triggered monthly <strong className="text-zinc-700 dark:text-zinc-300">r_m = r/12</strong> for total sequence months <strong className="text-zinc-700 dark:text-zinc-300">m = t*12</strong>.</div>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/55 dark:border-emerald-950/40 text-center">
              <span className="text-xs text-zinc-500 dark:text-zinc-450 uppercase tracking-wider block mb-1">Accrued Future Balance</span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹{futureValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  Total Capital Invested
                </span>
                <span className="font-bold text-zinc-950 dark:text-zinc-50 font-mono">₹{totalInvested.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Compounded Earned Interest
                </span>
                <span className="font-bold text-emerald-500 font-mono">₹{accumulatedInterest.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Custom SVG horizontal stacked breakdown bar */}
            <div className="pt-4">
              <div className="h-4 w-full bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${(totalInvested / futureValue) * 100}%` }} 
                  className="bg-zinc-400 transition-all duration-500" 
                />
                <div 
                  style={{ width: `${(accumulatedInterest / futureValue) * 100}%` }} 
                  className="bg-emerald-500 transition-all duration-500" 
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400 mt-2 font-mono">
                <span>Invested: {Math.round((totalInvested / futureValue) * 100 || 0)}%</span>
                <span>Interest: {Math.round((accumulatedInterest / futureValue) * 100 || 0)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Interest is {Math.round((accumulatedInterest / (totalInvested || 1)) * 100)}% of principal</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-bold">Standard compounding</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">What is the difference between simple and compound interest?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Simple interest pays interest only on your base principal sum. Compound interest earns interest on previous interest rewards, resulting in compounding growth curve.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">How does compounding frequency impact returns?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Interest compounded monthly rewards slightly higher yields than interest compounded quarterly or annually because interest tokens are reinvested sooner.
            </p>
          </div>
        </div>
      </div>

      {/* Related section */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Financial Calculators</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('sip-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            SIP Investment Calculator <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('income-tax')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Income Tax Estimator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
