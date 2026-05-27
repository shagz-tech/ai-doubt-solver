"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { loadState, saveState, AppState, LANGUAGES } from "@/lib/store";
import { LogOut, Mail, School, BookOpen, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [state, setState] = useState<AppState | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [userClass, setUserClass] = useState("");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setName(s.name);
    setSchool(s.school);
    setUserClass(s.userClass);
    document.documentElement.className = s.theme === "light" ? "light" : "dark";
  }, []);

  const saveProfile = () => {
    const newState = { ...state!, name: name || "Student", school, userClass };
    saveState(newState);
    setState(newState);
    setEditing(false);
  };

  const updateSetting = (key: keyof AppState, value: any) => {
    const newState = { ...state!, [key]: value };
    saveState(newState);
    setState(newState);
  };

  const toggleTheme = () => {
    const newTheme = state?.theme === "dark" ? "light" : "dark";
    document.documentElement.className = newTheme;
    updateSetting("theme", newTheme);
  };

  const clearAll = () => {
    if (!confirm("Saara data permanently delete ho jayega. Sure?")) return;
    localStorage.removeItem("ads_state");
    window.location.reload();
  };

  if (!state) return null;

  const displayName = session?.user?.name || state.name;
  const displayEmail = session?.user?.email || "";
  const displayAvatar = session?.user?.image || null;

  const stats = [
    { val: state.doubts.length, lbl: "Doubts", icon: "💬", color: "bg-blue-500/10 text-blue-400" },
    { val: state.notes.length, lbl: "Notes", icon: "📝", color: "bg-green-500/10 text-green-400" },
    { val: state.streak, lbl: "Day Streak", icon: "🔥", color: "bg-amber-500/10 text-amber-400" },
    { val: state.points, lbl: "Points", icon: "⭐", color: "bg-violet-500/10 text-violet-400" },
  ];

  return (
    <main className="p-6 flex flex-col gap-5 max-w-2xl">

      {/* Profile Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-violet-600/30 via-purple-600/20 to-zinc-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-500/20 to-transparent" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              {displayAvatar ? (
                <img src={displayAvatar} alt="avatar"
                  className="w-20 h-20 rounded-2xl border-4 border-zinc-900 object-cover" />
              ) : (
                <div className="w-20 h-20 bg-violet-500 rounded-2xl border-4 border-zinc-900 flex items-center justify-center text-white text-3xl font-extrabold">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900" />
            </div>
            <div className="flex gap-2 mb-1">
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all">
                <Edit3 size={12} /> Edit
              </button>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>

          {/* Name & Info */}
          <h2 className="text-xl font-extrabold tracking-tight">{displayName}</h2>
          <div className="flex flex-col gap-1 mt-1.5">
            {displayEmail && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Mail size={11} /> {displayEmail}
              </div>
            )}
            {(state.school || state.userClass) && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <School size={11} /> {state.school} {state.userClass && `• ${state.userClass}`}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {stats.map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="text-xl font-extrabold">{s.val}</div>
                <div className="text-xs opacity-70 mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <BookOpen size={15} className="text-violet-400" />
          <h3 className="font-bold text-sm">Settings</h3>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <p className="text-sm font-semibold">Dark Mode</p>
            <p className="text-xs text-zinc-500 mt-0.5">App ka theme change karo</p>
          </div>
          <button onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-all relative ${state.theme === "dark" ? "bg-violet-500" : "bg-zinc-600"}`}>
            <span className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all ${state.theme === "dark" ? "left-7" : "left-1"}`} />
          </button>
        </div>

        {/* Default Language */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <p className="text-sm font-semibold">Default Language</p>
            <p className="text-xs text-zinc-500 mt-0.5">AI response ki bhasha</p>
          </div>
          <select value={state.defaultLang} onChange={(e) => updateSetting("defaultLang", e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 outline-none">
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Daily Goal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <p className="text-sm font-semibold">Daily Goal</p>
            <p className="text-xs text-zinc-500 mt-0.5">Kitne doubts solve karne hain daily</p>
          </div>
          <select value={state.dailyGoal} onChange={(e) => updateSetting("dailyGoal", parseInt(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 outline-none">
            <option value={3}>3 doubts</option>
            <option value={5}>5 doubts</option>
            <option value={10}>10 doubts</option>
          </select>
        </div>

        {/* Clear Data */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Clear All Data</p>
            <p className="text-xs text-zinc-500 mt-0.5">Saara local data delete ho jayega</p>
          </div>
          <button onClick={clearAll}
            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all">
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-base mb-4">✏️ Edit Profile</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tumhara naam..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-3" />
            <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School / College naam..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-3" />
            <input value={userClass} onChange={(e) => setUserClass(e.target.value)} placeholder="Class / Year (e.g. Class 10)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-all">Cancel</button>
              <button onClick={saveProfile}
                className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all">Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


