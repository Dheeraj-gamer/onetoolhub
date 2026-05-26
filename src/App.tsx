import React, { useState, useEffect } from 'react';
import { 
  AppWindow, 
  Search, 
  Moon, 
  Sun, 
  History, 
  User, 
  X, 
  Trash2, 
  TrendingUp, 
  CreditCard, 
  Percent, 
  Calendar, 
  Calculator, 
  BookOpen, 
  Activity, 
  Receipt, 
  CheckSquare, 
  Trello, 
  Hourglass, 
  FilePenLine, 
  CloudSun, 
  Languages, 
  Sparkles, 
  Watch, 
  ArrowLeftRight, 
  AlignLeft, 
  Lock 
} from 'lucide-react';

import { SavedHistory, AppUser } from './types';
import AuthModal from './components/AuthModal';

// Imported Tools components list
import SipCalculator from './components/SipCalculator';
import EmiCalculator from './components/EmiCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import AgeCalculator from './components/AgeCalculator';
import ScientificCalculator from './components/ScientificCalculator';
import GpaCalculator from './components/GpaCalculator';
import BmiCalculator from './components/BmiCalculator';
import IncomeTaxCalculator from './components/IncomeTaxCalculator';
import TodoTool from './components/TodoTool';
import KanbanTool from './components/KanbanTool';
import PomodoroTool from './components/PomodoroTool';
import NotesTool from './components/NotesTool';
import WeatherTool from './components/WeatherTool';
import TranslatorTool from './components/TranslatorTool';
import GeminiAssistantTool from './components/GeminiAssistantTool';
import CalendarTool from './components/CalendarTool';
import ClocksTool from './components/ClocksTool';
import UnitConverter from './components/UnitConverter';
import JsonFormatter from './components/JsonFormatter';
import Base64Converter from './components/Base64Converter';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: 'finance' | 'productivity' | 'math' | 'file' | 'weather' | 'ai';
  icon: React.ReactNode;
}

export default function App() {
  const [activeTool, setActiveTool] = useState<string>('ai-assistant');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('onetool_theme') === 'dark';
  });

  const [history, setHistory] = useState<SavedHistory[]>(() => {
    const saved = localStorage.getItem('onetool_history_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'h1', toolName: 'SIP Calculator', expression: '₹10k @ 12% for 15y', result: '₹50.4 Lakhs', timestamp: '10:30 AM' },
      { id: 'h2', toolName: 'Base64 Tool', expression: 'Text: "OneTool Hub"', result: 'T25lVG9vbCBIdWI=', timestamp: '09:12 AM' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<AppUser>({
    name: 'Guest User',
    email: 'guest@onetool.hub',
    isLoggedIn: false
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('onetool_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('onetool_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('onetool_history_v2', JSON.stringify(history));
  }, [history]);

  const addHistoryItem = (item: SavedHistory) => {
    setHistory([item, ...history]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleLogin = (user: Partial<AppUser>) => {
    setCurrentUser({
      name: user.name || 'User',
      email: user.email || '',
      avatar: user.avatar,
      isLoggedIn: true
    });
  };

  const handleLogout = () => {
    setCurrentUser({
      name: 'Guest User',
      email: 'guest@onetool.hub',
      isLoggedIn: false
    });
  };

  // Define static tool nodes
  const TOOLS_LIST: ToolItem[] = [
    { id: 'ai-assistant', name: 'AI Chat Advisor', description: 'Ask questions & generate equations using Gemini', category: 'ai', icon: <Sparkles className="w-4.5 h-4.5" /> },
    { id: 'sip-cal', name: 'SIP Investment Estimator', description: 'Compound savings calculation dashboard', category: 'finance', icon: <TrendingUp className="w-4.5 h-4.5" /> },
    { id: 'emi-cal', name: 'EMI Loan Calculator', description: 'Calculate mortgage & auto repayment streams', category: 'finance', icon: <CreditCard className="w-4.5 h-4.5" /> },
    { id: 'compound-interest', name: 'Compound Interest Calc', description: 'Calculate long-term visual compound gains', category: 'finance', icon: <Percent className="w-4.5 h-4.5" /> },
    { id: 'income-tax', name: 'Income Tax Estimator', description: 'Model progressive deduction brackets in India', category: 'finance', icon: <Receipt className="w-4.5 h-4.5" /> },
    { id: 'scientific-cal', name: 'Scientific Calculator', description: 'Trig functions, logarithms, and powers', category: 'math', icon: <Calculator className="w-4.5 h-4.5" /> },
    { id: 'age-cal', name: 'Age & Date difference', description: 'Precision Gregorian days, hours, and offsets', category: 'math', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'gpa-cal', name: 'GPA Semester ranker', description: 'Log marks, credit weights, and cumulative marks', category: 'math', icon: <BookOpen className="w-4.5 h-4.5" /> },
    { id: 'bmi-cal', name: 'BMI Health tracker', description: 'Assess body composition WHO metrics', category: 'math', icon: <Activity className="w-4.5 h-4.5" /> },
    { id: 'todo', name: 'Todo Checklist Grid', description: 'Stay organized with priority-sorted actions', category: 'productivity', icon: <CheckSquare className="w-4.5 h-4.5" /> },
    { id: 'kanban', name: 'Kanban Operations board', description: 'Guide sprint pipelines and todo cards', category: 'productivity', icon: <Trello className="w-4.5 h-4.5" /> },
    { id: 'pomodoro', name: 'Pomodoro Study clock', description: '25-minute deep focus intervals with alert', category: 'productivity', icon: <Hourglass className="w-4.5 h-4.5" /> },
    { id: 'notebook', name: 'Smart Write Notebook', description: 'Custom-colored markdown notebook sheets', category: 'productivity', icon: <FilePenLine className="w-4.5 h-4.5" /> },
    { id: 'calendar', name: 'Milestones Calendar', description: 'Interactive semester deadline agenda planner', category: 'productivity', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'clocks', name: 'World Clocks & stopwatch', description: 'UTC timezone list and lap stopwatch', category: 'productivity', icon: <Watch className="w-4.5 h-4.5" /> },
    { id: 'weather', name: 'Smart Local Weather', description: 'Gemini grounded 3-day meteorological forecasts', category: 'weather', icon: <CloudSun className="w-4.5 h-4.5" /> },
    { id: 'translator', name: 'Neural Language Translator', description: 'Translate Spanish, French, and Hindi', category: 'weather', icon: <Languages className="w-4.5 h-4.5" /> },
    { id: 'unit-converter', name: 'Universal Unit Converter', description: 'Length, mass, and digital bytes conversion', category: 'file', icon: <ArrowLeftRight className="w-4.5 h-4.5" /> },
    { id: 'json-formatter', name: 'JSON Beautifier / Parser', description: 'Format and validate raw nested string streams', category: 'file', icon: <AlignLeft className="w-4.5 h-4.5" /> },
    { id: 'base64', name: 'Base64 Encoder / Decoder', description: 'Safe UTF-8 encryption encoding matrices', category: 'file', icon: <Lock className="w-4.5 h-4.5" /> }
  ];

  // Filters based on top global search bar
  const filteredTools = TOOLS_LIST.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActiveTabComponent = () => {
    switch (activeTool) {
      case 'sip-cal':
        return <SipCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'emi-cal':
        return <EmiCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'compound-interest':
        return <CompoundInterestCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'age-cal':
        return <AgeCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'scientific-cal':
        return <ScientificCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'gpa-cal':
        return <GpaCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'bmi-cal':
        return <BmiCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'income-tax':
        return <IncomeTaxCalculator onAddHistory={addHistoryItem} onNavigate={setActiveTool} />;
      case 'todo':
        return <TodoTool />;
      case 'kanban':
        return <KanbanTool />;
      case 'pomodoro':
        return <PomodoroTool />;
      case 'notebook':
        return <NotesTool />;
      case 'weather':
        return <WeatherTool />;
      case 'translator':
        return <TranslatorTool />;
      case 'ai-assistant':
        return <GeminiAssistantTool />;
      case 'calendar':
        return <CalendarTool />;
      case 'clocks':
        return <ClocksTool />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'base64':
        return <Base64Converter />;
      default:
        return <GeminiAssistantTool />;
    }
  };

  const getCategoryThemeColor = (cat: string) => {
    switch (cat) {
      case 'finance': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
      case 'productivity': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20';
      case 'math': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
      case 'file': return 'text-purple-500 bg-purple-50 dark:bg-purple-950/20';
      case 'weather': return 'text-sky-500 bg-sky-550/10 dark:bg-sky-950/20';
      case 'ai': return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';
      default: return 'text-zinc-500 bg-zinc-50';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-200">
      
      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Primary Left Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 flex flex-col justify-between transform transition-transform duration-250 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100 dark:border-zinc-800">
            <h1 className="flex items-center gap-2 font-black text-zinc-900 dark:text-zinc-50 text-base font-sans select-none tracking-tight">
              <AppWindow className="w-5.5 h-5.5 text-indigo-505 text-indigo-500" />
              OneTool Hub
            </h1>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close layout navigation menu" className="p-1.5 border border-zinc-100 dark:border-zinc-800 rounded-lg lg:hidden cursor-pointer dark:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Categories Navigation List */}
          <nav className="p-3.5 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider pl-2 block mb-2">Smart Tools Directory</span>
              <ul className="space-y-1">
                {TOOLS_LIST.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => {
                        setActiveTool(t.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                        activeTool === t.id 
                        ? 'bg-indigo-650 bg-indigo-550 bg-indigo-500 text-white shadow-xs' 
                        : 'text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <span className={`p-1 rounded-md shrink-0 transition-colors ${
                        activeTool === t.id ? 'bg-white/10 text-white' : getCategoryThemeColor(t.category).split(' ')[0]
                      }`}>
                        {t.icon}
                      </span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* User profile capsule info at bottom */}
        <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 hover:opacity-85 text-left select-none outline-none cursor-pointer"
            >
              <img 
                src={currentUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full border border-indigo-400"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-550 dark:text-zinc-300 truncate max-w-[120px]">{currentUser.name}</span>
                <span className="block text-[9px] text-zinc-400 font-mono italic truncate max-w-[120px]">{currentUser.isLoggedIn ? 'Live Cloud Synced' : 'Offline Profiling'}</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Grid display area */}
      <div className="flex-grow lg:pl-64 flex flex-col min-w-0 transition-all duration-200">
        
        {/* Global Dashboard Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              aria-label="Open sidebar menu navigation"
              className="p-1 px-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl hover:bg-zinc-100 lg:hidden font-black text-xs cursor-pointer dark:text-white"
            >
              MENU
            </button>

            {/* Comprehensive search text-field */}
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tools & calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 pl-9 pr-3.5 w-60 text-xs outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          {/* Quick theme selectors */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              aria-label="Toggle eye-care dark theme mode"
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 cursor-pointer transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setShowHistory(!showHistory)} 
              aria-label="Open calculations saved history ledger"
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 cursor-pointer transition-all flex items-center gap-1 text-xs font-mono"
            >
              <History className="w-4 h-4" /> <span>{history.length}</span>
            </button>
          </div>
        </header>

        {/* Core application body viewport */}
        <main className="p-4 lg:p-6.5 max-w-7xl mx-auto w-full flex-grow space-y-6">
          
          {/* If there's an active global search query, show search utility results lists */}
          {searchQuery ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5.5 space-y-3.5">
              <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100 uppercase tracking-widest pl-1">Matched Search Results ({filteredTools.length})</h3>
              {filteredTools.length === 0 ? (
                <p className="text-zinc-400 text-xs py-10 text-center font-mono">No matching tools found. Type other keywords.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredTools.map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => {
                        setActiveTool(t.id);
                        setSearchQuery('');
                      }}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl hover:border-indigo-500 cursor-pointer transition-all"
                    >
                      <div className="flex gap-2.5 items-center">
                        <span className={`p-2 rounded-xl text-center ${getCategoryThemeColor(t.category)}`}>{t.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100 leading-tight">{t.name}</h4>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">{t.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Render active tool panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5.5 lg:p-7 shadow-xs">
            {getActiveTabComponent()}
          </div>
        </main>
      </div>

      {/* Right Saved Operations History Side Panel overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setShowHistory(false)} className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity" />
          
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between h-full z-10 p-5.5">
            <div className="space-y-4 flex-grow overflow-y-auto pr-1">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5"><History className="w-4 h-4 text-indigo-500" /> Saved Calculations</h3>
                <button onClick={() => setShowHistory(false)} aria-label="Close calculation history shelf" className="p-1 px-2.5 border border-zinc-200 dark:hover:bg-zinc-50 dark:border-zinc-800 rounded-lg text-[10px] uppercase font-bold text-zinc-500 cursor-pointer dark:text-white">Close</button>
              </div>

              <div className="space-y-2.5 pt-2">
                {history.length === 0 ? (
                  <p className="text-zinc-400 text-xs py-10 text-center font-mono">No actions logged. Complete calculators copy events to save records!</p>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="bg-zinc-50 dark:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 relative group shadow-2xs">
                      <span className="text-[9px] uppercase font-mono bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-500 px-2 py-0.5 rounded-md font-bold">{h.toolName}</span>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-2 font-mono truncate">{h.expression}</p>
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm font-mono mt-0.5">{h.result}</div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-100/50 dark:border-zinc-800/40">
                        <span className="text-[9px] text-zinc-400 font-mono tracking-wider">{h.timestamp}</span>
                        <button 
                          onClick={() => handleRemoveHistoryItem(h.id)} 
                          className="text-zinc-400 hover:text-red-500 p-1"
                          title="Delete history card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="w-full bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-950 dark:text-rose-455 text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Trash2 className="w-4 h-4" /> Clear All Saved Cards
              </button>
            )}
          </div>
        </div>
      )}

      {/* Authenticated user sync portal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
