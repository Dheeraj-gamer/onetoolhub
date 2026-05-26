import React, { useState, useEffect } from 'react';
import { FilePenLine, Plus, Trash2, Search, Tag, Eye } from 'lucide-react';
import { Note } from '../types';

const NOTE_COLORS = [
  'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900',
  'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900',
  'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900',
  'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900',
  'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900'
];

export default function NotesTool() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('onetool_notes');
    return saved ? JSON.parse(saved) : [
      { id: 'n1', title: 'Calculations for SIP compounding targets', content: 'We need around 12% returns compounding over 15 years to match ₹50 Lakh retirement goals. Check SIP Calculator projections to map additions.', tags: ['finance', 'retirement'], updatedAt: '26/05/2026, 04:30 PM', color: NOTE_COLORS[0] },
      { id: 'n2', title: 'French translation phrases logs', description: 'Important business greetings list.', content: 'Bonjour - Good morning / Hello\nS\'il vous plaît - Please\nMerci beaucoup - Thank you very much\nRun through Translator page to expand translation ledger.', tags: ['translator', 'french'], updatedAt: '26/05/2026, 03:15 PM', color: NOTE_COLORS[1] }
    ];
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('onetool_notes', JSON.stringify(notes));
  }, [notes]);

  const handleCreate = () => {
    const fresh: Note = {
      id: Math.random().toString(),
      title: 'Untilted Note',
      content: '',
      tags: [],
      updatedAt: new Date().toLocaleString(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
    };
    setNotes([fresh, ...notes]);
    setActiveNote(fresh);
    setTitle('Untilted Note');
    setContent('');
    setTag('');
  };

  const handleSaveActive = () => {
    if (!activeNote) return;
    const splitTags = tag.split(',').map(s => s.trim()).filter(Boolean);
    const updated = notes.map(n => n.id === activeNote.id ? {
      ...n,
      title: title.trim() || 'Untitled Note',
      content,
      tags: splitTags,
      color: selectedColor,
      updatedAt: new Date().toLocaleString()
    } : n);
    setNotes(updated);
    // Find revised card and re-set
    const match = updated.find(n => n.id === activeNote.id);
    if (match) {
      setActiveNote(match);
      alert('Note saved successfully.');
    }
  };

  const handleDelete = (id: string) => {
    const filterList = notes.filter(n => n.id !== id);
    setNotes(filterList);
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  const filteredNotes = notes.filter(n => {
    const term = search.toLowerCase();
    return n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term) || n.tags.some(t => t.toLowerCase().includes(term));
  });

  return (
    <div id="notes-notebook" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FilePenLine className="w-6 h-6 text-indigo-500" />
            Smart Notebook
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Store, catalog, search, and manage your rich text files. Backed up instantly to local memory vaults.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side listing column */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search title, keyword, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-zinc-400 text-xs py-10 text-center font-mono">No notes logged. Tap "+" to write ideas!</p>
            ) : (
              filteredNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNote(n);
                    setTitle(n.title);
                    setContent(n.content);
                    setTag(n.tags.join(', '));
                    setSelectedColor(n.color);
                  }}
                  className={`border p-4 rounded-xl cursor-pointer transition-all duration-200 ${n.color} ${
                    activeNote?.id === n.id 
                    ? 'ring-2 ring-indigo-550 ring-indigo-500' 
                    : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug truncate pr-2">{n.title}</h4>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }} 
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{n.content || 'Empty note content...'}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-zinc-100/50 dark:border-zinc-800/40">
                    <div className="flex gap-1 flex-wrap">
                      {n.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] bg-white/65 dark:bg-zinc-900/60 font-semibold py-0.5 px-2 rounded-md scale-95 origin-left text-zinc-550 text-zinc-700 dark:text-zinc-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] text-zinc-450 text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 shrink-0"><Eye className="w-3 h-3" /> {n.updatedAt.split(',')[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right edit form column */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5.5 shadow-xs">
          {activeNote ? (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 font-bold text-sm tracking-tight outline-none focus:border-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Tags (Comma Separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="e.g. math, study, checklist"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Color selectors */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">Note Theme Color</label>
                <div className="flex gap-2">
                  {NOTE_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${col.split(' ')[0]} ${
                        selectedColor === col ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Notebook Body</label>
                <textarea
                  placeholder="Start writing down thoughts, summaries..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-3.5 text-xs outline-none dark:text-white resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-400">Logged values save on sync</span>
                <button
                  type="button"
                  onClick={handleSaveActive}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-5 rounded-lg cursor-pointer transition-colors"
                >
                  Save & Sync Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-400">
              <FilePenLine className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-xs font-mono">Select an existing note from the list, or tap "+" above to write thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
