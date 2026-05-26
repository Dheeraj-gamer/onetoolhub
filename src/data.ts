import { ToolItem, ToolCategory } from './types';

export const CATEGORIES: { id: ToolCategory; label: string; iconName: string; color: string; desc: string }[] = [
  {
    id: 'finance',
    label: 'Finance Tools',
    iconName: 'DollarSign',
    color: 'from-emerald-500 to-teal-500',
    desc: 'Calculate interest, taxes, SIP investment returns, and loan EMIs.'
  },
  {
    id: 'health',
    label: 'Health & BMI',
    iconName: 'Activity',
    color: 'from-rose-500 to-pink-500',
    desc: 'Measure BMI, check target weights, or biological age indicators.'
  },
  {
    id: 'productivity',
    label: 'Productivity Suite',
    iconName: 'CheckSquare',
    color: 'from-indigo-500 to-blue-500',
    desc: 'Manage workflows with boards, checklist, habitual grids, and custom items.'
  },
  {
    id: 'student',
    label: 'Student Portal',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-orange-500',
    desc: 'Calculate attendance thresholds, GPAs, percentages, or algebra differences.'
  },
  {
    id: 'weather',
    label: 'Smart Weather',
    iconName: 'CloudSun',
    color: 'from-sky-500 to-blue-500',
    desc: 'Real-time precise global local weather reports with intelligent recommendations.'
  },
  {
    id: 'notes',
    label: 'Smart Notebook',
    iconName: 'FileText',
    color: 'from-violet-500 to-fuchsia-500',
    desc: 'Jot down rich text logs, categorize with dynamic tagging index, auto saving.'
  },
  {
    id: 'calendar',
    label: 'Calendar Grid',
    iconName: 'Calendar',
    color: 'from-purple-500 to-indigo-500',
    desc: 'Create, schedule, track events, meetings, tasks, and automatic custom alarms.'
  },
  {
    id: 'file-tools',
    label: 'Developer File Suite',
    iconName: 'FileCode',
    color: 'from-slate-500 to-zinc-700',
    desc: 'Formatter utility, text encoders, parsing text strings into formatted JSON arrays.'
  },
  {
    id: 'converter',
    label: 'Convert & Measure',
    iconName: 'Scale',
    color: 'from-cyan-500 to-blue-600',
    desc: 'Convert length, weight systems, thermal scales, memory sizes, speed rates.'
  },
  {
    id: 'clock',
    label: 'Time & Clocks',
    iconName: 'Clock',
    color: 'from-blue-600 to-violet-600',
    desc: 'Stopwatch, timer intervals, world timezone additions, alarm reminders.'
  },
  {
    id: 'translator',
    label: 'AI Translator',
    iconName: 'Globe',
    color: 'from-pink-500 to-rose-600',
    desc: 'Translate sentences between dozens of languages automatically using dynamic models.'
  },
  {
    id: 'ai',
    label: 'Gemini Assistant',
    iconName: 'Sparkles',
    color: 'from-violet-600 via-indigo-600 to-cyan-500',
    desc: 'Consult a smart, helpful assistant for formulas, computations, translation support.'
  }
];

export const TOOLS: ToolItem[] = [
  // Finance
  {
    id: 'sip-cal',
    name: 'SIP Calculator',
    category: 'finance',
    iconName: 'TrendingUp',
    description: 'Calculate investment wealth growth and future SIP savings returns.',
    slug: 'sip-calculator',
    keywords: ['sip', 'mutual fund', 'investment', 'savings', 'wealth', 'finance'],
    trending: true
  },
  {
    id: 'emi-cal',
    name: 'EMI Calculator',
    category: 'finance',
    iconName: 'CreditCard',
    description: 'Find monthly installments, interest breakdown, and amortizations for home/car loans.',
    slug: 'emi-calculator',
    keywords: ['loan', 'emi', 'mortgage', 'finance', 'calculator', 'interest'],
    trending: true
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    category: 'finance',
    iconName: 'Percent',
    description: 'Project compounding returns with customized regular monthly deposit additions.',
    slug: 'compound-interest',
    keywords: ['compound', 'interest', 'finance', 'returns', 'savings', 'calculator'],
    trending: true
  },
  {
    id: 'income-tax',
    name: 'Income Tax Estimator',
    category: 'finance',
    iconName: 'Receipt',
    description: 'Quickly estimate standard and progressive tax brackets and net salary.',
    slug: 'income-tax',
    keywords: ['tax', 'income', 'salary', 'finance', 'irs', 'tax bracket'],
    trending: false
  },

  // Health
  {
    id: 'bmi-cal',
    name: 'BMI Calculator',
    category: 'health',
    iconName: 'Beef',
    description: 'Calculate Body Mass Index, body type status, and ideal standard target weights.',
    slug: 'bmi-calculator',
    keywords: ['bmi', 'health', 'fitness', 'weight', 'mass index', 'calculator'],
    trending: true
  },

  // Productivity
  {
    id: 'todo-list',
    name: 'Todo Checklist',
    category: 'productivity',
    iconName: 'CheckSquare',
    description: 'Quick checklist to jot tasks, priorities, sort by state with key date tags.',
    slug: 'todo-list',
    keywords: ['todo', 'checklist', 'tasks', 'productivity', 'habits'],
    trending: false
  },
  {
    id: 'kanban',
    name: 'Kanban Workflow Board',
    category: 'productivity',
    iconName: 'Trello',
    description: 'Modern, interactive Kanban board with Todo, In Progress, and Completed columns.',
    slug: 'kanban',
    keywords: ['kanban', 'board', 'productivity', 'scrum', 'tasks', 'workflow'],
    trending: true
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Interval Timer',
    category: 'productivity',
    iconName: 'Hourglass',
    description: 'Elegant study/work session interval timer with built-in custom audio alarms.',
    slug: 'pomodoro',
    keywords: ['pomodoro', 'timer', 'studying', 'focus', 'productivity', 'interval'],
    trending: false
  },

  // Student
  {
    id: 'scientific-cal',
    name: 'Scientific Calculator',
    category: 'student',
    iconName: 'Calculator',
    description: 'Fully responsive calculator equipped with logarithms, trigonometry, powers and percentages.',
    slug: 'scientific-calculator',
    keywords: ['scientific', 'calculator', 'student', 'trig', 'log', 'math'],
    trending: true
  },
  {
    id: 'gpa-cal',
    name: 'GPA Calculator',
    category: 'student',
    iconName: 'GraduationCap',
    description: 'Calculate semester GPA or CGPA using standard credit allocation brackets.',
    slug: 'gpa-calculator',
    keywords: ['gpa', 'student', 'grades', 'cgpa', 'calculator'],
    trending: false
  },
  {
    id: 'age-cal',
    name: 'Age Calculator',
    category: 'student',
    iconName: 'UserCheck',
    description: 'Find precise difference in years, months, weeks, days, and seconds between dates.',
    slug: 'age-calculator',
    keywords: ['age', 'birth', 'date difference', 'calculator', 'days'],
    trending: true
  },

  // Weather
  {
    id: 'weather',
    name: 'Weather Forecast',
    category: 'weather',
    iconName: 'CloudSun',
    description: 'Real-time meteorological indicators with instant local summaries using smart AI grounding.',
    slug: 'weather',
    keywords: ['weather', 'forecast', 'temperature', 'sky', 'rain', 'humidity'],
    trending: true
  },

  // Notes
  {
    id: 'notes',
    name: 'Smart Notebook',
    category: 'notes',
    iconName: 'FilePenLine',
    description: 'Jot ideas instantly, auto-save, filter using categories and multiple note card colors.',
    slug: 'notes',
    keywords: ['notes', 'notebook', 'writing', 'save', 'text'],
    trending: false
  },

  // Calendar
  {
    id: 'calendar',
    name: 'Calendar & Scheduler',
    category: 'calendar',
    iconName: 'CalendarDays',
    description: 'An elegant grid event scheduler, reminder logs, and day details visualization.',
    slug: 'calendar',
    keywords: ['calendar', 'scheduling', 'reminders', 'events', 'planner'],
    trending: false
  },

  // File Tools
  {
    id: 'json-formatter',
    name: 'JSON Beautifier & Formatter',
    category: 'file-tools',
    iconName: 'Braces',
    description: 'Validate, format, compress, or clean nested JSON strings instantly.',
    slug: 'json-formatter',
    keywords: ['json', 'formatter', 'beautifier', 'minify', 'file-tools', 'developer'],
    trending: false
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder / Decoder',
    category: 'file-tools',
    iconName: 'Binary',
    description: 'Convert plain text directly into encrypted base64 strings and vice versa.',
    slug: 'base64-converter',
    keywords: ['base64', 'binary', 'encode', 'decode', 'file-tools', 'text'],
    trending: false
  },

  // Unit Converter
  {
    id: 'unit-converter',
    name: 'Standard Unit Converter',
    category: 'converter',
    iconName: 'Scale',
    description: 'Instant conversion matrix for length, mass weight, temperature layers, or digital memories.',
    slug: 'unit-converter',
    keywords: ['unit', 'converter', 'length', 'weight', 'temperature', 'conversion'],
    trending: true
  },

  // Clocks
  {
    id: 'clocks',
    name: 'Clocks & Time Management',
    category: 'clock',
    iconName: 'Clock8',
    description: 'World timezone clocks, highly detailed stopwatch records, alarms, and countdown timer.',
    slug: 'clocks-and-time',
    keywords: ['clocks', 'stopwatch', 'timer', 'alarm', 'timezone', 'time'],
    trending: false
  },

  // Translation
  {
    id: 'translator',
    name: 'AI-Powered Translator',
    category: 'translator',
    iconName: 'Languages',
    description: 'Multilingual neural translation tool utilizing Gemini models dynamically.',
    slug: 'translator',
    keywords: ['translator', 'spanish', 'french', 'translation', 'ai', 'languages'],
    trending: false
  },

  // AI assistant
  {
    id: 'gemini-assistant',
    name: 'Gemini Chat Companion',
    category: 'ai',
    iconName: 'Sparkles',
    description: 'Consult Gemini for customized formula sheets, code syntax solutions, or algebraic queries.',
    slug: 'gemini-assistant',
    keywords: ['gemini', 'chat', 'ai', 'bot', 'assistant', 'helper'],
    trending: true
  }
];
