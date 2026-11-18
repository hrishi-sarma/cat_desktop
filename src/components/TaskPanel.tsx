import React, { useState } from 'react';
import { TaskItem } from '../types/cat';
import { Plus, Check, Trash2, X, Sparkles, AlertCircle } from 'lucide-react';

interface TaskPanelProps {
  tasks: TaskItem[];
  onAddTask: (text: string, priority: 'low' | 'medium' | 'high', isDaily: boolean) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClose: () => void;
  catName: string;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClose,
  catName,
}) => {
  const [newText, setNewText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDaily, setIsDaily] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddTask(newText.trim(), priority, isDaily);
    setNewText('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 flex flex-col z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100">
            {catName}'s Tasks ({completedCount}/{tasks.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Add new task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-0.5 active:scale-95 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
          <div className="flex items-center gap-1">
            <span>Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded px-1 py-0.5 text-[10px]"
            >
              <option value="low">Low (+10 XP)</option>
              <option value="medium">Medium (+20 XP)</option>
              <option value="high">High (+35 XP)</option>
            </select>
          </div>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Daily Task</span>
          </label>
        </div>
      </form>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
            <AlertCircle size={24} className="mb-1 opacity-50" />
            <p>No tasks right now.</p>
            <p className="text-[10px] text-slate-600">Add a task to earn rewards!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-800/80 text-slate-500 line-through'
                  : 'bg-slate-800/70 border-slate-700/60 text-slate-200 hover:border-slate-600'
              }`}
            >
              <div
                onClick={() => onToggleTask(task.id)}
                className="flex items-center gap-2 flex-1 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-500 hover:border-indigo-400'
                  }`}
                >
                  {task.completed && <Check size={12} strokeWidth={3} />}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-snug">{task.text}</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[9px]">
                    <span
                      className={`px-1 rounded font-semibold uppercase ${
                        task.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.isDaily && (
                      <span className="text-indigo-400 font-medium">Daily</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
                title="Delete Task"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
