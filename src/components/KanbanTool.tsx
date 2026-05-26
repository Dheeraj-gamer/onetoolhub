import React, { useState, useEffect } from 'react';
import { Trello, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { KanbanCard } from '../types';

export default function KanbanTool() {
  const [cards, setCards] = useState<KanbanCard[]>(() => {
    const saved = localStorage.getItem('onetool_kanban');
    return saved ? JSON.parse(saved) : [
      { id: 'k1', title: 'Compile Base64 Encoders', description: 'Double check translation speeds and encoding lengths.', status: 'todo' },
      { id: 'k2', title: 'Verify BMI Health sliders', description: 'Match WHO guidelines on target ranges.', status: 'progress' },
      { id: 'k3', title: 'Double check SIP compound math formulas', description: 'Run test ledger vectors to ensure accuracy.', status: 'done' }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('onetool_kanban', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const card: KanbanCard = {
      id: Math.random().toString(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      status: 'todo'
    };
    setCards([...cards, card]);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const moveCard = (id: string, newStatus: 'todo' | 'progress' | 'done') => {
    setCards(cards.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const columns: { id: 'todo' | 'progress' | 'done'; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-150 border-zinc-250 dark:bg-zinc-950/40 dark:border-zinc-800' },
    { id: 'progress', title: 'In Progress', color: 'bg-indigo-50/40 border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-950/30' },
    { id: 'done', title: 'Completed', color: 'bg-emerald-50/40 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-950/30' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Trello className="w-6 h-6 text-indigo-500" />
            Kanban Board
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Visualise engineering workflows, sprint logs, and operations by dragging and steering items.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task Card
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCard} className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Task Card Creator</h4>
          <div>
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Conduct compound interest audit..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl py-2 px-3 text-xs outline-none dark:text-white"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Description</label>
            <textarea
              placeholder="Provide a quick list of details..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl py-2 px-3 text-xs outline-none dark:text-white resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer">
              Add Card
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="border border-zinc-200 dark:border-zinc-850 text-zinc-500 text-xs py-2 px-4 rounded-xl cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Kanban Board columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colCards = cards.filter(c => c.status === col.id);
          return (
            <div key={col.id} className={`flex flex-col border p-4.5 rounded-2xl h-[500px] overflow-hidden ${col.color}`}>
              <div className="flex justify-between items-center mb-4 pl-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">{col.title}</span>
                <span className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 px-2.5 py-0.5 rounded-full font-extrabold">{colCards.length}</span>
              </div>

              <div className="space-y-3 overflow-y-auto flex-grow pr-1">
                {colCards.length === 0 ? (
                  <p className="text-zinc-400 text-xs py-10 text-center font-mono border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl">Drop cards here</p>
                ) : (
                  colCards.map((c) => (
                    <div 
                      key={c.id} 
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-4 rounded-xl shadow-xs hover:shadow-xs transition-all duration-200 cursor-default group"
                    >
                      <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-150 leading-snug">{c.title}</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{c.description}</p>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-850">
                        <button 
                          onClick={() => deleteCard(c.id)} 
                          className="text-zinc-450 hover:text-red-500 transition-colors"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => moveCard(c.id, col.id === 'done' ? 'progress' : 'todo')}
                              className="p-1 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded cursor-pointer"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => moveCard(c.id, col.id === 'todo' ? 'progress' : 'done')}
                              className="p-1 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded cursor-pointer"
                              title="Move Right"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
