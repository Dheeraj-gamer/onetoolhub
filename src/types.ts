export type ToolCategory =
  | 'finance'
  | 'health'
  | 'productivity'
  | 'student'
  | 'weather'
  | 'notes'
  | 'calendar'
  | 'file-tools'
  | 'converter'
  | 'clock'
  | 'translator'
  | 'ai';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  iconName: string; // Used to map to Lucide icons dynamically
  description: string;
  slug: string;
  keywords: string[];
  trending?: boolean;
}

// User types for auth
export interface AppUser {
  email: string;
  name: string;
  avatar?: string;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
}

// Custom interfaces for utility contents
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  color: string;
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category?: 'personal' | 'work' | 'reminder' | 'urgent';
  location?: string;
}

export interface SavedHistory {
  id: string;
  toolName: string;
  expression: string;
  result: string;
  timestamp: string;
}

export interface WorldClockConfig {
  id: string;
  city: string;
  timeZone: string;
}

export interface AlarmItem {
  id: string;
  time: string; // "24:00"
  label: string;
  active: boolean;
  days: string[]; // ["Mon", "Tue"...]
}
