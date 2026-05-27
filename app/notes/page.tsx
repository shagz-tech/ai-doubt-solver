"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { loadState, saveState, AppState, subjectColors, SUBJECTS } from "@/lib/store";

export default function NotesPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => { setState(loadState()); }, []);

  const saveNote = () => {
    if (!title.trim() || !content.trim()) { alert("Title aur content dono bharo!"); return; }
    const newState: AppState = {
      ...state!,
      notes: [{ id: Date.now(), title, content, subject, time: new Date().toLocaleDateString("en-IN") }, ...state!.notes],
    };
    saveState(newState);
    setState(newState);
    setModal(false);
    setTitle(""); setContent(""); setSubject("");
  };

  const deleteNote = (id: number) => {
    if (!confirm("Note delete karein?")) return;
    const newState = { ...state!, notes: state!.notes.filter((n) => n.id !== id) };
    saveState(newState);
    setState(newState);
  };

  const noteColors = ["border-t-violet-500", "border-t-green-500", "border-t-amber-500", "border-t-rose-500", "border-t-cyan-500"];

  if (!state) return null;

  return (
    <main className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">My Notes 📝</h1>
          <p className="text-sm text-zinc-400 mt-1">Apne important notes yahan save karo</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all"
        >
          <Plus size={16} /> New Note
        </button>
      </div>

      {state.notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <div className="text-5xl mb-4">📓</div>
          <p className="text-base font-medium">Koi notes nahi abhi tak.</p>
          <p className="text-sm mt-1">New Note button se banao!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {state.notes.map((n, i) => (
            <div key={n.id} className={`bg-zinc-900 border border-zinc-800 border-t-2 ${noteColors[i % noteColors.length]} rounded-2xl p-4 hover:border-zinc-700 transition-all`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm leading-snug">{n.title}</h3>
                <button onClick={() => deleteNote(n.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{n.content}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${subjectColors[n.subject] || "bg-zinc-700 text-zinc-400"}`}>
                  {n.subject || "General"}
                </span>
                <span className="text-xs text-zinc-600">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-base mb-4">📝 New Note</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-3" />
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-3 text-zinc-300">
              <option value="">Subject select karo</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Note content..." rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 resize-none mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-all">Cancel</button>
              <button onClick={saveNote} className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all">Save Note</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
