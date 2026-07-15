import type { Bookmark, WatchProgress, User } from '../types';

const STORAGE_KEYS = {
  BOOKMARKS: 'gvcc_portal_bookmarks',
  PROGRESS: 'gvcc_portal_progress',
  USER: 'gvcc_portal_user',
};

// --- AUTHENTICATION MOCK ---
export function getAuthUser(): User {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return { username: 'Guest Student', email: 'student@gvcc.edu', isLoggedIn: true };
}

export function setAuthUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// --- BOOKMARKS SERVICES ---
export function getBookmarks(videoId: string): Bookmark[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  if (!data) return [];
  try {
    const list: Bookmark[] = JSON.parse(data);
    return list
      .filter((b) => b.videoId === videoId)
      .sort((a, b) => a.timestamp - b.timestamp);
  } catch {
    return [];
  }
}

export function getAllBookmarks(): Bookmark[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addBookmark(videoId: string, timestamp: number, name?: string): Bookmark {
  const list = getAllBookmarks();
  const newBookmark: Bookmark = {
    id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    videoId,
    timestamp,
    name: name?.trim() || `Bookmark at ${formatTime(timestamp)}`,
    createdAt: Date.now(),
  };
  list.push(newBookmark);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
  return newBookmark;
}

export function deleteBookmark(id: string): void {
  const list = getAllBookmarks();
  const filtered = list.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
}

export function updateBookmark(id: string, name: string): void {
  const list = getAllBookmarks();
  const updated = list.map((b) => (b.id === id ? { ...b, name: name.trim() || `Bookmark at ${formatTime(b.timestamp)}` } : b));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
}

// --- WATCH PROGRESS SERVICES ---
export function saveProgress(videoId: string, seconds: number, completed: boolean): void {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  let progresses: WatchProgress[] = [];
  if (data) {
    try {
      progresses = JSON.parse(data);
    } catch {
      progresses = [];
    }
  }

  const existingIdx = progresses.findIndex((p) => p.videoId === videoId);
  const newProgress: WatchProgress = {
    videoId,
    lastPosition: seconds,
    completed,
    updatedAt: Date.now(),
  };

  if (existingIdx > -1) {
    progresses[existingIdx] = newProgress;
  } else {
    progresses.push(newProgress);
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progresses));
}

export function getProgress(videoId: string): WatchProgress | null {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!data) return null;
  try {
    const progresses: WatchProgress[] = JSON.parse(data);
    return progresses.find((p) => p.videoId === videoId) || null;
  } catch {
    return null;
  }
}

export function getAllProgress(): WatchProgress[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper utility to format seconds into MM:SS or HH:MM:SS
export function formatTime(seconds: number): string {
  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  
  const pad = (num: number) => String(num).padStart(2, '0');
  
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
