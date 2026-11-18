import React, { useState } from 'react';
import { NoteItem } from '../types/cat';
import { FileText, Plus, Trash2, X } from 'lucide-react';

interface NotesPanelProps {
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onClose: () => void;
  catName: string;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onClose,
  catName,
}) => {
  const [selectedId, setSelectedId] = useState<string>(notes[0]?.id || '');
  const currentNote = notes.find((n) => n.id === selectedId) || notes[0];

  const handleCreateNew = () => {
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title: 'New Note',
      content: '',
      updatedAt: Date.now(),
    };
    onSaveNote(newNote);
    setSelectedId(newNote.id);
  };

  const handleTitleChange = (val: string) => {
    if (!currentNote) return;
    onSaveNote({ ...currentNote, title: val, updatedAt: Date.now() });
  };

  const handleContentChange = (val: string) => {
    if (!currentNote) return;
    onSaveNote({ ...currentNote, content: val, updatedAt: Date.now() });
  };

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 flex flex-col z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <FileText size={16} className="text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100">{catName}'s Sticky Notes</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateNew}
            className="p-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs flex items-center gap-0.5 px-1.5 transition-colors"
            title="New Note"
          >
            <Plus size={12} /> New
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Note Tabs Bar */}
      {notes.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 custom-scrollbar">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedId(n.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] whitespace-nowrap font-medium transition-colors ${
                selectedId === n.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {n.title || 'Untitled'}
            </button>
          ))}
        </div>
      )}

      {/* Editor Body */}
      {currentNote ? (
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-2 py-1 text-xs font-bold text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <textarea
            value={currentNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Type your notes here..."
            className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed custom-scrollbar"
          />

          <div className="flex justify-end">
            <button
              onClick={() => {
                onDeleteNote(currentNote.id);
                if (notes.length > 1) {
                  const next = notes.find((n) => n.id !== currentNote.id);
                  if (next) setSelectedId(next.id);
                }
              }}
              className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-1 py-0.5"
            >
              <Trash2 size={10} /> Delete Note
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          No note selected. Click 'New' to write.
        </div>
      )}
    </div>
  );
};
