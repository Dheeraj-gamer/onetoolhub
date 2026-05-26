import React, { useState } from 'react';
import { AlignLeft, Copy, Trash, Check, AlertCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [inputVal, setInputVal] = useState('{"name":"OneTool Hub","description":"An all-in-one smart utility platform","features":["Calculators","AI Assistant","Translator"],"active":true}');
  const [formattedVal, setFormattedVal] = useState('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setErrorLog(null);
    try {
      if (!inputVal.trim()) return;
      const parsed = JSON.parse(inputVal);
      const str = JSON.stringify(parsed, null, indentSize);
      setFormattedVal(str);
    } catch (e: any) {
      setErrorLog(e.message || 'Malformed JSON string token detected.');
      setFormattedVal('');
    }
  };

  const handleMinify = () => {
    setErrorLog(null);
    try {
      if (!inputVal.trim()) return;
      const parsed = JSON.parse(inputVal);
      const str = JSON.stringify(parsed);
      setFormattedVal(str);
    } catch (e: any) {
      setErrorLog(e.message || 'Malformed JSON string token detected.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="json-formatter" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <AlignLeft className="w-6 h-6 text-indigo-500" />
            JSON Formatter & Validator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Format, minify, highlight, parse, and validate complex JSON strings into readable indentation structures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Json Copied!' : 'Copy Formatted'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1.5 font-sans">Raw JSON Input</span>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-zinc-400">Spacing:</span>
              <select 
                value={indentSize} 
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="text-[10px] font-bold bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded py-0.5 px-1 cursor-pointer dark:text-white"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          </div>

          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 font-mono text-xs dark:text-white resize-none leading-relaxed h-[300px] outline-none focus:border-indigo-500"
          />

          <div className="flex gap-2.5">
            <button
              onClick={handleFormat}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
            >
              Beautify JSON
            </button>
            <button
              onClick={handleMinify}
              className="bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
            >
              Minify String
            </button>
          </div>
        </div>

        {/* Output Text Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1.5 font-sans">Formatted Output</span>
            <span className="text-[10px] font-mono text-zinc-400">Read-Only</span>
          </div>

          <div className="relative">
            <textarea
              value={formattedVal}
              className="w-full bg-zinc-950 text-emerald-400 border border-zinc-800 dark:border-zinc-800 rounded-3xl p-4 font-mono text-xs resize-none leading-relaxed h-[300px] outline-none"
              readOnly
              placeholder="Beautified outcome will be displayed here..."
            />
            {errorLog && (
              <div className="absolute top-4 left-4 right-4 bg-red-950/90 text-red-400 p-3.5 rounded-xl border border-red-900 text-xs font-sans flex items-start gap-2 max-h-[85%] overflow-y-auto">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <span className="font-extrabold">Syntax Parsing Error:</span>
                  <p className="mt-1 font-mono text-[10px] whitespace-pre-wrap">{errorLog}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
