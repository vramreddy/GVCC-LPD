# GVCC Learning Portal & Content Protection Shield

A secure, premium Learning Management System (LMS) portal developed as part of the GVCC Learning Portal Development Assignment. Built with React, TypeScript, and Vite, featuring custom HTML5 video controls, interactive bookmarking, watch state persistence, and a multi-layered client-side screenshot and screen recording protection framework.

---

## 🚀 Key Highlights & Features

### 1. Unified Student Learning Dashboard
*   **Structured Module Layout**: View learning courses with clear category markers, duration metrics, and instructor credits.
*   **Course Filtering & Search**: Instant, non-lag search filtering for course titles, descriptions, and instructors, coupled with category pill filters.
*   **"Continue Watching" Shelf**: Automatically identifies course modules started by the user and places them in a high-priority shelf at the top of the dashboard so students can resume learning with a single click.
*   **Watch Progress Indicators**: Beautiful inline watch progress bar overlays on course thumbnails displaying the exact completion percentage.

### 2. Premium Video Player & Bookmark Controller
*   **Fully Custom Video UI**: Avoids native browser controls in favor of an elegant, responsive interface including customizable play/pause triggers, volume sliders, playback speed managers, current/total watch timers, and fullscreen options.
*   **Interactive Bookmarks List**:
    *   **Timestamp Anchoring**: Add bookmarks at any playback position with a custom title or description (e.g. "Chapter 3: DevTools Shield").
    *   **Timeline Tick Markers**: Saved bookmarks are mapped directly as colored visual tick indicators on the scrub timeline. Hovering shows the bookmark title and time; clicking jumps the player straight to that mark and resumes playback.
    *   **Inline Editing & Deletion**: Rename bookmarks directly in the panel and remove unused tags with intuitive controls.
*   **Persistent Local Storage**: Bookmark registries and video watch metrics are fully persistent using unified client-side browser JSON storage services.

### 3. Multi-Layer Screenshot & Recording Prevention Shield
Because hardware-level screenshot prevention is sandboxed on standard browser endpoints, this portal deploys a highly active, multi-layered deterrence system:
*   **Loss-of-Focus Masking (Blur Shield)**: Instantly covers the active video with a blurry screen overlay and pauses playback if the user switches browser tabs, leaves the browser window, or triggers window-focus stealing screenshot utilities (such as Windows Snipping Tool, Snagit, or Xbox Game Bar).
*   **Floating Dynamic Watermark**: Generates a semi-transparent floating text label containing the logged-in student's email/ID, IP address, and security tag. The watermark drifts randomly across the video canvas every 5 seconds, making external device screen recordings (like recording with a phone camera) traceable back to the specific student.
*   **Media Print Shield**: Injects responsive CSS media print selectors (`@media print`) that completely hide page components (`display: none`) if a print-to-PDF command is executed.
*   **Keyboard Shortcut Blockers**: Overrides key event hooks for developer shortcuts and screenshot keycombos:
    *   `PrintScreen` key (clears clipboard buffer automatically).
    *   `F12` and `Ctrl + Shift + I` / `Ctrl + Shift + J` (DevTools Console inspect block).
    *   `Ctrl + U` (View Source block).
    *   `Ctrl + P` (Browser page print block).
    *   `Ctrl + S` (Save page source block).
    *   `Ctrl + C` and copy event actions.
*   **Context Menu Blocker**: Right-clicks on the player and layout are intercepted to block native video inspecting or saving actions.

---

## 🛠️ Technology Stack & Project Structure

*   **Frontend Core Framework**: React 18.3 & TypeScript (compiled in strict mode).
*   **Scaffolding Tool**: Vite 8.1.
*   **Styling Engine**: Custom Vanilla CSS (No external utilities like Tailwind, ensuring complete control over the paint layer and transitions).
*   **Data Models & Store**: TypeScript Interfaces mapping User profiles, Bookmarks, and WatchProgress schemas, saved via browser `localStorage`.

```
gvcc-lpd/
├── index.html                  # Main DOM index, optimized for SEO & headers
├── package.json                # Project configurations & dependency tree
├── vite.config.ts              # Vite configurations
├── src/
│   ├── main.tsx                # Client application root
│   ├── App.tsx                 # App layout router & layout controller
│   ├── index.css               # Vanilla CSS variables, keyframe animations, & print rules
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── services/
│   │   ├── storage.ts          # localStorage CRUD utilities
│   │   └── mockData.ts         # Sample video content data
│   └── components/
│       ├── Navbar.tsx          # Brand header, profile info, and search bar
│       ├── LoginModal.tsx      # Student details configurator
│       ├── CourseGrid.tsx      # Video card listings and watch histories
│       ├── ProtectionOverlay.tsx # Global keyboard blockers & security notices
│       ├── BookmarkPanel.tsx   # Bookmark creation form & list manager
│       └── VideoPlayer.tsx     # Custom HTML5 video controller & blur shields
```

---

## 💾 Data Architecture

### Bookmark Schema
```typescript
interface Bookmark {
  id: string;        // Unique hash (bookmark-1700...)
  videoId: string;   // Video ID mapping the course module
  name?: string;     // Custom title notes
  timestamp: number; // Playhead position (in seconds)
  createdAt: number; // Epoch timestamp
}
```

### Watch Progress Schema
```typescript
interface WatchProgress {
  videoId: string;      // Video ID
  lastPosition: number; // Playhead last position (in seconds)
  completed: boolean;   // Completion marker
  updatedAt: number;    // Epoch timestamp for sorting recent shelves
}
```

---

## ⚙️ Local Development Instructions

Follow these steps to run the GVCC Learning Portal locally:

### Prerequisites
*   Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed.

### Setup and Running
1.  **Extract/Navigate** into the project folder:
    ```bash
    cd "Gvcc LPD"
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open Portal**:
    *   Click on the local URL printed in the terminal (usually `http://localhost:5173`) to view the application in your browser.

### Verifying Production Bundles
To check production builds and lint compile checks:
```bash
npm run build
```
This runs the TS compiler and compiles the assets into the `/dist` directory.
