import React, { useState } from 'react';
import { Languages, Volume2, Copy, ArrowLeftRight } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese (Mandarin)' }
];

export default function TranslatorTool() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch translation translation output.');
      }
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (err: any) {
      setError(err.message || 'Translation server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const s = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(s);
    setText(translatedText);
    setTranslatedText(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTTS = () => {
    if (!translatedText) return;
    try {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      alert('Speech Synthesis API is restricted within this preview environment.');
    }
  };

  return (
    <div id="translator" className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Languages className="w-6 h-6 text-indigo-500" />
          Smart Translator
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Perform multi-way linguistic translation leveraging advanced state neural semantic maps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Source Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-transparent py-1 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            
            <button 
              onClick={handleSwap} 
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 cursor-pointer transition-colors"
              title="Swap Languages"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 min-h-[180px] flex flex-col justify-between shadow-xs">
            <textarea
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-800 dark:text-zinc-100 outline-none resize-none focus:ring-0 leading-relaxed min-h-[120px]"
            />
            <div className="flex justify-between items-center pt-2 text-[10px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
              <span>{text.length}/2000 characters</span>
              <button
                type="button"
                onClick={handleTranslate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded-lg cursor-pointer transition-colors"
                disabled={loading}
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Target Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-transparent py-1 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>

            <span className="text-[10px] font-mono text-zinc-400 pr-2">Neural Output</span>
          </div>

          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 min-h-[180px] flex flex-col justify-between shadow-xs">
            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center py-10">
                <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <p className="text-red-500 text-xs py-10 text-center font-mono">{error}</p>
            ) : (
              <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed min-h-[120px] whitespace-pre-wrap">
                {translatedText || <span className="text-zinc-400 italic">Translated content displays here.</span>}
              </p>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-mono">Neural translation standard</span>
              <div className="flex gap-2">
                <button
                  onClick={handleTTS}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 transition-colors"
                  title="Speak details"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 transition-colors"
                  title="Copy details"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
