import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash, Check, Clock, AlertCircle } from 'lucide-react';
import { TodoItem } from '../types';

export default function TodoTool() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('onetool_todos');
    return saved ? JSON.parse(saved) : [
      { id: '1', task: 'Review monthly compound savings rate projections', completed: false, priority: 'high', dueDate: '2026-05-30' },
      { id: '2', task: 'Translate French engineering reports using AI tool', completed: true, priority: 'medium', dueDate: '2026-05-28' },
      { id: '3', task: 'Compare mortgage rate EMIs on OneTool Hub', completed: false, priority: 'low' }
    ];
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('onetool_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const task: TodoItem = {
      id: Math.random().toString(),
      task: input.trim(),
      completed: false,
      priority,
      dueDate: date || undefined
    };
    setTodos([task, ...todos]);
    setInput('');
    setDate('');
  };

  const handleToggle = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-indigo-500" />
          Todo Checklist
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Stay on top of critical daily checklists with sorting, deadlines, and automated progress trackers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input form */}
        <div className="lg:col-span-5 bg-zinc-50/50 dark:bg-zinc-800/15 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 h-fit">
          <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 font-sans">Add Checklist Item</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Task Content</label>
              <input
                type="text"
                placeholder="e.g. Schedule recurring tax audit review..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-indigo-500 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-2 text-xs outline-none cursor-pointer dark:text-white focus:border-indigo-500"
                >
                  <option value="high">High Level</option>
                  <option value="medium">Medium Level</option>
                  <option value="low">Low Level</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-2 text-xs outline-none focus:border-indigo-500 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Task to Grid
            </button>
          </form>
        </div>

        {/* Right Active Checklist List panel */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/30 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Filters</span>
            <div className="flex gap-1">
              {(['all', 'active', 'completed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`py-1 px-2.5 rounded-lg text-[10px] uppercase font-mono tracking-wider font-extrabold transition-all cursor-pointer ${
                    filter === mode 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-550 border border-zinc-100 dark:border-zinc-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredTodos.length === 0 ? (
              <p className="text-zinc-400 text-xs py-10 text-center font-mono">No active checklist cards matched. Create one above!</p>
            ) : (
              filteredTodos.map((t) => (
                <div 
                  key={t.id} 
                  className={`flex items-start justify-between p-3.5 border rounded-xl transition-all duration-200 ${
                    t.completed 
                    ? 'bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-150 dark:border-zinc-850/80 opacity-60' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 hover:border-indigo-100 dark:hover:border-indigo-950/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => handleToggle(t.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 mt-0.5 ${
                        t.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-500'
                      }`}
                    >
                      {t.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed ${t.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                        {t.task}
                      </p>
                      <div className="flex gap-2 mt-1.5 flex-wrap items-center">
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full font-extrabold ${
                          t.priority === 'high' 
                          ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' 
                          : t.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                          : 'bg-zinc-50 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {t.priority}
                        </span>
                        
                        {t.dueDate && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-zinc-450" /> {t.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(t.id)} 
                    className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0"
                    title="Delete item from grid"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
