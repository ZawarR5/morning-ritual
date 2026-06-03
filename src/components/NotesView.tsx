import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Edit3, Check, StickyNote } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesViewProps {
  isOpen: boolean;
  onClose: () => void;
}

function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem("mr_notes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem("mr_notes", JSON.stringify(notes));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotesView({ isOpen, onClose }: NotesViewProps) {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const persist = (updated: Note[]) => {
    setNotes(updated);
    saveNotes(updated);
  };

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "",
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    setEditTitle("");
    setEditContent("");
    setEditingNote(newNote);
  };

  const handleEdit = (note: Note) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditingNote(note);
  };

  const handleDelete = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;
    const now = new Date().toISOString();
    const updated = notes.map((n) =>
      n.id === editingNote.id
        ? { ...n, title: editTitle, content: editContent, updatedAt: now }
        : n
    );
    if (!notes.find((n) => n.id === editingNote.id)) {
      updated.push({ ...editingNote, title: editTitle, content: editContent, updatedAt: now });
    }
    persist(updated);
    setEditingNote(null);
  };

  const sorted = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!editingNote) onClose(); }}
            className="fixed inset-0 bg-black z-[190] cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0b0b0c] border-l border-white/10 z-[200] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <StickyNote className="w-5 h-5 text-[#D1FF26]" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
                  Notes
                </span>
                <span className="text-[10px] text-zinc-600 font-mono bg-white/5 px-2 py-0.5 rounded">
                  {notes.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editing mode */}
            {editingNote ? (
              <div className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-serif text-white placeholder-zinc-600 focus:outline-none focus:border-[#D1FF26]/50 transition-colors"
                  autoFocus
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your note..."
                  className="flex-1 w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-[#D1FF26]/50 transition-colors font-sans leading-relaxed"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingNote(null)}
                    className="flex-1 py-3 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 text-xs font-mono tracking-wider uppercase bg-[#D1FF26] text-[#0b0b0c] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(209,255,38,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              /* Notes list */
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center select-none">
                    <StickyNote className="w-10 h-10 text-zinc-700 mb-4" />
                    <p className="text-sm text-zinc-500 font-sans">No notes yet</p>
                    <p className="text-[11px] text-zinc-600 font-sans mt-1">
                      Tap + to create your first note
                    </p>
                  </div>
                ) : (
                  sorted.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-[#D1FF26]/20 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3" onClick={() => handleEdit(note)}>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base text-white truncate">
                            {note.title || "Untitled"}
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 font-sans leading-relaxed">
                            {note.content || "Empty note"}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono mt-2 tracking-wider">
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(note); }}
                            className="p-1.5 text-zinc-500 hover:text-[#D1FF26] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Add button */}
            {!editingNote && (
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleAdd}
                  className="w-full py-3 text-xs font-mono tracking-wider uppercase bg-[#D1FF26] text-[#0b0b0c] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(209,255,38,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
