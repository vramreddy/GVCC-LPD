export interface User {
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  category: string;
  instructor: string;
}

export interface Bookmark {
  id: string;
  videoId: string;
  name?: string;
  timestamp: number; // in seconds
  createdAt: number;
}

export interface WatchProgress {
  videoId: string;
  lastPosition: number; // in seconds
  completed: boolean;
  updatedAt: number;
}
