import React, { useState } from 'react';
import { Lock, Unlock, Copy, Trash } from 'lucide-react';

export default function Base64Converter() {
  const [inputText, setInputText] = useState('Welcome to OneTool Hub!');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      if (!inputText.trim()) return;
      // encode UTF-8 safely using unescape/encodeURIComponent
      const utfb = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(utfb);
    } catch (e) {
      setOutputText('Encryption Token Encoding Failure.');
    }
  };

  const handleDecode = () => {
    try {
      if (!inputText.trim()) return;
      const parsedText = decodeURIComponent(escape(atob(inputText)));
      setOutputText(parsedText);
    } catch (e) {
      setOutputText('Malformed Base64 schema. Cannot decode.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="base64-converter" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-500" />
            Base64 Encoder & Decoder
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Encode raw strings into standard web binary representations, or reverse base tokens back to plaintext format.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Token Copied!' : 'Copy Outcome'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Text box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1 font-sans">Raw Text / Base64 Token</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 font-mono text-xs dark:text-white resize-none leading-relaxed h-[200px] outline-none focus:border-indigo-500"
            placeholder="Type words to encode or base64 token to decode..."
          />

          <div className="flex gap-2.5">
            <button
              onClick={handleEncode}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> UTF-8 Encode
            </button>
            <button
              onClick={handleDecode}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" /> Reverse Decode
            </button>
          </div>
        </div>

        {/* Output Text box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1 font-sans">Result Output</span>
            <span className="text-[10px] text-zinc-400 font-mono">Read-Only</span>
          </div>

          <textarea
            value={outputText}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-4 font-mono text-xs text-zinc-700 dark:text-zinc-200 resize-none leading-relaxed h-[200px] outline-none"
            readOnly
            placeholder="Parsed base64 or plain output displays here..."
          />
        </div>
      </div>
    </div>
  );
}
