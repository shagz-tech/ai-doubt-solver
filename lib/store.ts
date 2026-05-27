export interface Doubt {
  id: number;
  q: string;
  a: string;
  subject: string;
  time: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  time: string;
}

export interface AppState {
  name: string;
  school: string;
  userClass: string;
  theme: "dark" | "light";
  defaultLang: string;
  dailyGoal: number;
  doubts: Doubt[];
  notes: Note[];
  points: number;
  streak: number;
  lastActive: string | null;
  todayCount: number;
}

export const defaultState: AppState = {
  name: "Student",
  school: "",
  userClass: "",
  theme: "dark",
  defaultLang: "Hinglish",
  dailyGoal: 5,
  doubts: [],
  notes: [],
  points: 0,
  streak: 0,
  lastActive: null,
  todayCount: 0,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const saved = localStorage.getItem("ads_state");
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ads_state", JSON.stringify(state));
}

export function checkStreak(state: AppState): AppState {
  const today = new Date().toDateString();
  if (state.lastActive === today) return state;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const newStreak =
    state.lastActive === yesterday.toDateString()
      ? (state.streak || 0) + 1
      : state.lastActive
      ? 0
      : state.streak || 0;

  return {
    ...state,
    streak: newStreak,
    todayCount: 0,
    lastActive: today,
  };
}

export const subjectColors: Record<string, string> = {
  Math: "bg-blue-500/10 text-blue-400",
  Physics: "bg-amber-500/10 text-amber-400",
  Chemistry: "bg-green-500/10 text-green-400",
  Biology: "bg-emerald-500/10 text-emerald-400",
  History: "bg-rose-500/10 text-rose-400",
  English: "bg-purple-500/10 text-purple-400",
  "Computer Science": "bg-cyan-500/10 text-cyan-400",
};

export const subjectIcons: Record<string, string> = {
  Math: "📐",
  Physics: "⚡",
  Chemistry: "🧪",
  Biology: "🌱",
  History: "📜",
  English: "📖",
  "Computer Science": "💻",
};

export const SUBJECTS = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "English",
  "Computer Science",
];

export const LANGUAGES = [
  "Hinglish",
  "Hindi",
  "English",
  "Bengali",
  "Tamil",
  "Telugu",
];