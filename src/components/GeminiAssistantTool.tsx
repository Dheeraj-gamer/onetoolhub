import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, User, HelpCircle, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function GeminiAssistantTool() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('onetool_assistant_chats');
    return saved ? JSON.parse(saved) : [
      { id: '1', sender: 'bot', text: 'Hello! I am your AI-powered companion on OneTool Hub. How can I help you compile equations, calculate mortgage rate EMIs, convert lengths, or plan files today?', timestamp: new Date().toLocaleTimeString() }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('onetool_assistant_chats', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve AI completion.');
      }

      const json = await response.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: json.reply,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Error connecting to conversational matrix: ${err.message || 'Environmental disconnect.'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptStarter = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div id="ai-assistant" className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          AI Chat Companion
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Power up mathematical projections, coding structures, and translations with server-side Gemini intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left conversational chat column */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between h-[520px] shadow-xs">
          {/* Chat scroll viewport */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-indigo-500'
                }`}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 text-zinc-800 rounded-tl-none border border-zinc-250 dark:border-zinc-700/80'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className="text-[9px] text-zinc-400 tracking-wider font-mono mt-1 block px-2 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 max-w-fit">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form write fields */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4.5">
            <input
              type="text"
              placeholder="Ask anything about compound calculation, translation, GPA structures..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl flex items-center justify-center cursor-pointer duration-150 transition-colors shrink-0"
              disabled={loading}
              aria-label="Send message to AI Companion"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* Right prompt suggestions column */}
        <div className="lg:col-span-4 bg-zinc-100/40 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500" /> Prompt Starters
          </h3>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => handlePromptStarter('Explain how reducing loan balance EMI interest calculation works.')}
              className="w-full text-left bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between"
            >
              <span>Explain Loan EMI Reduction</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            <button
              onClick={() => handlePromptStarter('Draft a professional French request email template.')}
              className="w-full text-left bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between"
            >
              <span>Draft French Request Email</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            <button
              onClick={() => handlePromptStarter('Compare compound interest on ₹10000 at 8% vs 10% rate.')}
              className="w-full text-left bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between"
            >
              <span>Compare Compound Interest Plans</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
