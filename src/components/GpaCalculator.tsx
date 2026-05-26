import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Copy, Trophy, HelpCircle, ArrowRight } from 'lucide-react';
import { SavedHistory } from '../types';

interface CourseNode {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface GpaCalculatorProps {
  onAddHistory: (item: SavedHistory) => void;
  onNavigate: (toolId: string) => void;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export default function GpaCalculator({ onAddHistory, onNavigate }: GpaCalculatorProps) {
  const [courses, setCourses] = useState<CourseNode[]>([
    { id: '1', name: 'Mathematics II', grade: 'A', credits: 4 },
    { id: '2', name: 'Computer Architecture', grade: 'B+', credits: 3 },
    { id: '3', name: 'General Physics labs', grade: 'A-', credits: 2 },
  ]);

  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseGrade, setNewCourseGrade] = useState('A');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const addCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCourseName.trim() || `Course #${courses.length + 1}`;
    const node: CourseNode = {
      id: Math.random().toString(),
      name,
      grade: newCourseGrade,
      credits: newCourseCredits
    };
    setCourses([...courses, node]);
    setNewCourseName('');
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Compute stats
  let totalCredits = 0;
  let totalGradePoints = 0;

  courses.forEach((c) => {
    const points = GRADE_POINTS[c.grade] ?? 4.0;
    totalCredits += c.credits;
    totalGradePoints += points * c.credits;
  });

  const cumulativeGpa = totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0.0;

  const handleCopy = () => {
    const coursesStr = courses.map(c => `• ${c.name}: ${c.grade} (${c.credits} Credits)`).join('\n');
    const text = `Academic GPA Summary:\n${coursesStr}\nTotal Credits: ${totalCredits}\nCalculated cumulative GPA: ${cumulativeGpa}\nCalculated via OneTool Hub`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onAddHistory({
      id: Math.random().toString(),
      toolName: 'GPA Calculator',
      expression: `${courses.length} courses, ${totalCredits} credits`,
      result: `${cumulativeGpa} GPA`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div id="gpa-calculator" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            GPA Calculator
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Build your semester grade projection, aggregate credit weights, and check overall CGPA ranks easily.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer">
            <Copy className="w-4 h-4" /> {copied ? 'GPA copied!' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Course List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Add Course / Subject</h3>
            <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1 block font-sans">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs outline-none focus:border-amber-500 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1 block font-sans">Grade</label>
                <select
                  value={newCourseGrade}
                  onChange={(e) => setNewCourseGrade(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-2 text-xs outline-none cursor-pointer dark:text-white focus:border-amber-500"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1 block font-sans">Credits</label>
                <select
                  value={newCourseCredits}
                  onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-2 text-xs outline-none cursor-pointer dark:text-white focus:border-amber-500"
                >
                  {[1, 2, 3, 4, 5].map((cr) => (
                    <option key={cr} value={cr}>{cr} Credits</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-xs md:col-span-4 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Plus className="w-4 h-4" /> Add Subject to Term Ledger
              </button>
            </form>
          </div>

          {/* Active Ledger */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl overflow-hidden p-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Active Semester Courses Card</h3>
            {courses.length === 0 ? (
              <p className="text-zinc-400 text-xs py-6 text-center">No subjects logged. Enter details above to track sem grades!</p>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-2.5">
                {courses.map((c) => (
                  <div key={c.id} className="flex justify-between items-center pt-2.5 first:pt-0">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{c.name}</h4>
                      <div className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        <span className="font-mono bg-zinc-100 dark:bg-zinc-800/80 py-0.5 px-1.5 rounded font-semibold text-zinc-700 dark:text-zinc-350">{c.grade}</span> 
                        <span className="mx-1.5">•</span>
                        <span>{c.credits} Credits</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="text-zinc-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      title="Remove course mapping"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Cumulative Outputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-5">
            <div className="p-5.5 bg-amber-50/50 dark:bg-amber-950/10 rounded-xl border border-amber-100/55 dark:border-amber-950/40 text-center relative overflow-hidden">
              <Trophy className="w-12 h-12 text-amber-550 text-amber-550/30 dark:text-amber-550/20 absolute -right-3 -top-3 rotate-12" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1 font-bold">Cumulative Term GPA</span>
              <span className="text-5xl font-black text-amber-500 font-mono tracking-tight">{cumulativeGpa.toFixed(2)}</span>
              <div className="text-[11px] text-zinc-400 mt-2">
                Rank profile: {cumulativeGpa >= 3.6 ? 'Summa Cum Laude 👑' : cumulativeGpa >= 3.2 ? 'Dean\'s list 🌟' : cumulativeGpa >= 2.0 ? 'Passing' : 'Needs tutoring support'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-center text-xs">
              <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg font-mono">
                <span className="text-[10px] text-zinc-400 font-sans block">Total Credits</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-lg mt-0.5">{totalCredits} credits</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg font-mono">
                <span className="text-[10px] text-zinc-400 font-sans block">Courses Enrolled</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-lg mt-0.5">{courses.length} modules</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
            <span>Scale matching standard 4.0 weighted metrics</span>
            <span className="text-zinc-550 font-bold ml-1 hover:underline cursor-pointer" onClick={() => alert('Scale Weights:\n- A+/A: 4.0\n- A-: 3.7\n- B+: 3.3\n- B: 3.0\n- B-: 2.7\n- C+: 2.3\n- C: 2.0\n- D: 1.0\n- F: 0.0')}>See Grade Map</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50/50 dark:bg-zinc-800/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          University GPA System FAQ
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">What is a weighted credit credit hour?</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              A weighted credit tells how much impact a course holds. For instance, an 'A' grade in a 4-credit course counts twice as heavily as an 'A' in a 2-credit course.
            </p>
          </div>
        </div>
      </div>

      {/* Related section */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">Related Student Portals</h4>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onNavigate('scientific-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Scientific Calculator <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate('age-cal')} className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 py-1.5 px-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1 cursor-pointer">
            Age Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
