import React, { useState, useEffect } from 'react';
import { CreditCard, Copy, Share2, Download, HelpCircle, ArrowRight, Table } from 'lucide-react';
import { SavedHistory } from '../types';

interface EmiCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

export default function EmiCalculator({ onAddHistory, onNavigate }: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(15); // in Years

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    let calculatedEmi = 0;
    if (r > 0) {
      calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      calculatedEmi = P / n;
    }

    const pay = calculatedEmi * n;
    const interest = pay - P;

    setEmi(Math.round(calculatedEmi));
    setTotalPayment(Math.round(pay));
    setTotalInterest(Math.round(Math.max(0, interest)));
  }, [loanAmount, interestRate, loanTenure]);

  const handleCopy = () => {
    const text = `Loan EMI Details:
Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
Interest Rate: ${interestRate}%
Tenure: ${loanTenure} Years
Monthly EMI: ₹${emi.toLocaleString('en-IN')}
Total Interest Payable: ₹${totalInterest.toLocaleString('en-IN')}
Total Amount: ₹${totalPayment.toLocaleString('en-IN')}
Calculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'EMI Calculator',
      expression: `₹${loanAmount.toLocaleString('en-IN')} @ ${interestRate}% for ${loanTenure}y`,
      result: `₹${emi.toLocaleString('en-IN')}/m`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDownloadPDF = () => {
    alert(`Downloading Loan Amortization Schedule for ₹${loanAmount.toLocaleString('en-IN')}... (Simulated PDF download succeeded)`);
  };

  // SVG circular slice computing
  const total = totalPayment || 1;
  const interestAngle = total > 0 ? (totalInterest / total) * 360 : 180;
  
  const radius = 50;
  const cx = 60;
  const cy = 60;
  const x1 = cx + radius * Math.cos((interestAngle - 90) * Math.PI / 180);
  const y1 = cy + radius * Math.sin((interestAngle - 90) * Math.PI / 180);
  const largeArcFlag = interestAngle > 180 ? 1 : 0;

  return (
    <div id="emi-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            EMI Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Calculate EMI values, interest breakdown dashboards, and customized schedules for home or auto loans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1.5 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> {shared ? 'Linked!' : 'Share'}
          </button>
          <button onClick={handleDownloadPDF} className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Amortization
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-28 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-indigo-505 accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>₹1 Lakh</span>
              <span>₹50 Lakhs</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={interestRate}
                step={0.1}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>2%</span>
              <span>11%</span>
              <span>20%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Loan Tenure (Years)</label>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-24 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 text-xs outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Formula Explanation</h4>
            <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-150 dark:border-zinc-800">
              <code className="text-xs font-mono text-indigo-500 dark:text-indigo-400 block mb-1">E = P * r * (1 + r)^n / ((1 + r)^n - 1)</code>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                Where <strong className="text-zinc-700 dark:text-zinc-300">P</strong> is Principal Loan, <strong className="text-zinc-700 dark:text-zinc-300">r</strong> is Monthly Interest Rate, and <strong className="text-zinc-700 dark:text-zinc-300">n</strong> is the count of Tenure Months.
              </p>
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/55 dark:border-indigo-950/40 text-center">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">Monthly EMI</span>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">₹{emi.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-400" />
                Principal Amount
              </span>
              <span className="font-bold text-zinc-950 dark:text-zinc-50 font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Interest Payable
              </span>
              <span className="font-bold text-amber-500 font-mono">₹{totalInterest.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 my-2 pt-3 flex justify-between items-center">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">Total Cost (Amt + Interest)</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono">₹{totalPayment.toLocaleString('en-IN')}</span>
            </div>

            {/* Dynamic Custom SVG Circle */}
            <div className="flex justify-center items-center py-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl relative">
              <svg width="150" height="150" viewBox="0 0 120 120" className="transform rotate-180">
                {/* Background base Circle (Principal) */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#a1a1aa" strokeWidth="18" />
                {/* Overlay slice (Interest) */}
                {interestAngle > 0 && interestAngle < 360 && (
                  <path
                    d={`M ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x1} ${y1} L ${cx} ${cy} Z`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray={`${(interestAngle/360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              <div className="absolute flex flex-col text-center justify-center items-center bg-white dark:bg-zinc-900 rounded-full w-16 h-16 shadow-xs border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">RATE</span>
                <span className="text-sm font-extrabold text-amber-500 font-mono">{interestRate}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Interest is {Math.round((totalInterest / totalPayment) * 100 || 0)}% of total cost</span>
            <span className="text-zinc-500 dark:text-zinc-450 font-bold">Standard Formula</span>
          </div>
        </div>
      </div>

      {/* Simulated Amortization Table */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <Table className="w-4 h-4 text-indigo-500" />
          Prototyped Annual Amortization Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Principal Covered (₹)</th>
                <th className="py-2.5 px-3">Interest Paid (₹)</th>
                <th className="py-2.5 px-3">Total Annual Pay (₹)</th>
                <th className="py-2.5 px-3">Remaining Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-zinc-700 dark:text-zinc-300">
              <tr>
                <td className="py-2.5 px-3">Year 1</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.04).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12 - (loanAmount * 0.04)).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12).toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.96).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Year 2</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.045).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12 - (loanAmount * 0.045)).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12).toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.915).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Year 5</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.06).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12 - (loanAmount * 0.06)).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                <td className="py-2.5 px-3">₹{(emi * 12).toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3">₹{(loanAmount * 0.76).toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">How does a reducing balance interest system work?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Interest is calculated on the remaining loan principal index. As you pay your monthly EMI, the principal reduces, decreasing the absolute interest quotient added the next month.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Can I prepay my loan to save interest costs?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Yes. Principal prepayments bypass standard schedules, significantly reducing the remaining principal and resulting in thousands in interest savings.
            </p>
          </div>
        </div>
      </div>

      {/* Related calculators */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Financial Calculators</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('sip-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            SIP Investment Calculator <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('compound-interest')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Compound Interest Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
