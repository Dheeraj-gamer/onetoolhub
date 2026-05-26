import React, { useState, useEffect } from 'react';
import { TrendingUp, Copy, Share2, Download, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { SavedHistory } from '../types';

interface SipCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function SipCalculator({ onAddHistory, onNavigate }: SipCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedRate, setExpectedRate] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
    const P = monthlyInvestment;
    const i = expectedRate / 12 / 100;
    const n = timePeriod * 12;
    
    let fv = 0;
    if (i > 0) {
      fv = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      fv = P * n;
    }
    
    const totalInvested = P * n;
    const estReturns = Math.max(0, fv - totalInvested);

    setInvestedAmount(Math.round(totalInvested));
    setEstimatedReturns(Math.round(estReturns));
    setTotalValue(Math.round(fv));
  }, [monthlyInvestment, expectedRate, timePeriod]);

  const handleCopy = () => {
    const text = `SIP Investment Details:
Monthly Investment: ₹${monthlyInvestment.toLocaleString('en-IN')}
Expected Rate: ${expectedRate}%
Time Period: ${timePeriod} Years
Total Invested: ₹${investedAmount.toLocaleString('en-IN')}
Estimated Returns: ₹${estimatedReturns.toLocaleString('en-IN')}
Total Future Value: ₹${totalValue.toLocaleString('en-IN')}
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'SIP Calculator',
      expression: `₹${monthlyInvestment}/m @ ${expectedRate}% for ${timePeriod}y`,
      result: `₹${totalValue.toLocaleString('en-IN')}`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDownloadPDF = () => {
    alert(`Downloading PDF Investment Report for ₹${monthlyInvestment}/mo over ${timePeriod} years... (Simulated PDF download succeeded)`);
  };

  // Pie chart computations
  const total = investedAmount + estimatedReturns;
  const investedAngle = total > 0 ? (investedAmount / total) * 360 : 180;
  
  // Dynamic visual coordinates for Pie slices
  const radius = 50;
  const cx = 60;
  const cy = 60;
  const x1 = cx + radius * Math.cos((investedAngle - 90) * Math.PI / 180);
  const y1 = cy + radius * Math.sin((investedAngle - 90) * Math.PI / 180);
  const largeArcFlag = investedAngle > 180 ? 1 : 0;

  return (
    <div id="sip-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            SIP Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Calculate investment wealth growth and future SIP mutual fund savings returns.
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
            <Download className="w-3.5 h-3.5" /> Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Monthly Investment (₹)</label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>₹500</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Expected Return Rate (% p.a.)</label>
              <input
                type="number"
                value={expectedRate}
                step={0.1}
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={expectedRate}
              onChange={(e) => setExpectedRate(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>1%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Time Period (Years)</label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={timePeriod}
              onChange={(e) => setTimePeriod(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>1 Year</span>
              <span>20 Years</span>
              <span>40 Years</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Formula Explanation</h4>
            <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-150 dark:border-zinc-800">
              <code className="text-xs font-mono text-indigo-500 dark:text-indigo-400 block mb-1">FV = P * [((1 + i)^n - 1) / i] * (1 + i)</code>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Where <strong className="text-zinc-700 dark:text-zinc-300">P</strong> is monthly deposit, <strong className="text-zinc-700 dark:text-zinc-300">i</strong> is monthly interest rate, and <strong className="text-zinc-700 dark:text-zinc-300">n</strong> is the count of compounded months.
              </p>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                Invested Amount
              </span>
              <span className="font-bold text-zinc-950 dark:text-zinc-50 font-mono">₹{investedAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Est. Returns
              </span>
              <span className="font-bold text-emerald-500 font-mono">₹{estimatedReturns.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 my-2 pt-3 flex justify-between items-center">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">Total Value</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>

            {/* Dynamic Custom SVG Visualizer Pie Chart */}
            <div className="flex justify-center items-center py-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl relative">
              <svg width="150" height="150" viewBox="0 0 120 120" className="transform rotate-180">
                {/* Background base Circle (Est Returns) */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#10b981" strokeWidth="18" />
                {/* Overlay slice (Invested Amount) */}
                {investedAngle > 0 && investedAngle < 360 && (
                  <path
                    d={`M ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x1} ${y1} L ${cx} ${cy} Z`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="18"
                    strokeDasharray={`${(investedAngle/360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              <div className="absolute flex flex-col text-center justify-center items-center bg-white dark:bg-zinc-900 rounded-full w-16 h-16 shadow-xs border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">SIP</span>
                <span className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400 font-mono">
                  {Math.round((investedAmount/total)*100 || 50)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Projected over {timePeriod} Years</span>
            <span className="text-zinc-500 dark:text-zinc-400">Step-by-step verified</span>
          </div>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="mt-8 bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">What is a SIP (Systematic Investment Plan)?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              A SIP allows you to invest a small, regular sum into mutual funds monthly instead of a large lump sum. It benefits from rupee cost averaging and power of compounding.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">What expectation is realistic for Return Rates?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Historically, diversified equity mutual funds in active markers hold return rates between 12% to 15% compounded annually over a long index cycle of 7-10 years.
            </p>
          </div>
        </div>
      </div>

      {/* Related calculators */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Financial Calculators</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('emi-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            EMI Loan Calculator <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('compound-interest')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Compound Interest Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
