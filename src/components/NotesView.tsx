import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Edit3, Check, StickyNote, Search, CheckSquare, Square } from "lucide-react";

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      persist(notes.filter((n) => n.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const confirmBatchDelete = () => {
    persist(notes.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
    setBatchDeleteConfirm(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)));
    }
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

  const filtered = [...notes]
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    })
    .sort(
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
              {selectMode ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="text-zinc-400 hover:text-[var(--accent)] transition-colors cursor-pointer"
                  >
                    {selectedIds.size === filtered.length && filtered.length > 0
                      ? <CheckSquare className="w-5 h-5" />
                      : <Square className="w-5 h-5" />}
                  </button>
                  <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-300">
                    {selectedIds.size} selected
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <StickyNote className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
                    Notes
                  </span>
                  <span className="text-[10px] text-zinc-600 font-mono bg-white/5 px-2 py-0.5 rounded">
                    {notes.length}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {!selectMode && !editingNote && notes.length > 0 && (
                  <button
                    onClick={() => setSelectMode(true)}
                    className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 hover:text-[var(--accent)] px-2 py-1 rounded hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Select
                  </button>
                )}
                {selectMode && (
                  <button
                    onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}
                    className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Editing mode */}
            {editingNote ? (
              <div className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-serif text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                  autoFocus
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your note..."
                  className="flex-1 w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-[var(--accent)]/50 transition-colors font-sans leading-relaxed"
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
                    className="flex-1 py-3 text-xs font-mono tracking-wider uppercase bg-[var(--accent)] text-[#0b0b0c] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search bar */}
                <div className="px-4 pt-3 pb-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                    />
                  </div>
                </div>
                {/* Notes list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center select-none">
                      <StickyNote className="w-10 h-10 text-zinc-700 mb-4" />
                      <p className="text-sm text-zinc-500 font-sans">
                        {searchQuery ? "No matching notes" : "No notes yet"}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-sans mt-1">
                        {searchQuery ? "Try a different search" : "Tap + to create your first note"}
                      </p>
                    </div>
                  ) : (
                    filtered.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => selectMode ? toggleSelect(note.id) : handleEdit(note)}
                      className={`rounded-xl p-4 transition-all cursor-pointer ${
                        selectMode
                          ? selectedIds.has(note.id)
                            ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                            : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.04]"
                          : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-[var(--accent)]/20 group"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {selectMode && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(note.id); }}
                            className="mt-0.5 text-zinc-500 hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
                          >
                            {selectedIds.has(note.id)
                              ? <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
                              : <Square className="w-5 h-5" />}
                          </button>
                        )}
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
                        {!selectMode && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(note); }}
                              className="p-1.5 text-zinc-500 hover:text-[var(--accent)] transition-colors cursor-pointer"
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
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>)
            }

            {/* Bottom bar */}
            {!editingNote && (
              <div className="p-4 border-t border-white/10">
                {selectMode ? (
                  <button
                    onClick={() => setBatchDeleteConfirm(true)}
                    disabled={selectedIds.size === 0}
                    className={`w-full py-3 text-xs font-mono tracking-wider uppercase font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedIds.size > 0
                        ? "bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30"
                        : "bg-zinc-900/50 text-zinc-700 border border-zinc-800 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedIds.size})
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="w-full py-3 text-xs font-mono tracking-wider uppercase bg-[var(--accent)] text-[#0b0b0c] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                )}
              </div>
            )}

            {/* Delete confirmation - single */}
            <AnimatePresence>
              {deleteConfirmId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-10"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-6 w-full max-w-xs text-center space-y-4"
                  >
                    <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                      Delete this note?
                    </p>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-2.5 text-xs font-mono tracking-wider uppercase text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="flex-1 py-2.5 text-xs font-mono tracking-wider uppercase bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/30 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Batch delete confirmation */}
            <AnimatePresence>
              {batchDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-10"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-6 w-full max-w-xs text-center space-y-4"
                  >
                    <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                      Delete {selectedIds.size} selected note{selectedIds.size !== 1 ? "s" : ""}?
                    </p>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setBatchDeleteConfirm(false)}
                        className="flex-1 py-2.5 text-xs font-mono tracking-wider uppercase text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmBatchDelete}
                        className="flex-1 py-2.5 text-xs font-mono tracking-wider uppercase bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/30 transition-all cursor-pointer"
                      >
                        Delete All
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
