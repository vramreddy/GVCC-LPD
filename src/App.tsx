import { useState, useEffect } from 'react';
import type { User, Video, Bookmark } from './types';
import { MOCK_VIDEOS } from './services/mockData';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { LoginSignup } from './components/LoginSignup';
import { CourseGrid } from './components/CourseGrid';
import { BookmarkPanel } from './components/BookmarkPanel';
import { VideoPlayer } from './components/VideoPlayer';
import { ProtectionOverlay } from './components/ProtectionOverlay';
import {
  getAuthUser,
  setAuthUser,
  logoutUser,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  updateBookmark,
  saveProgress,
  getProgress,
  getAllProgress
} from './services/storage';

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User>({ username: '', email: '', isLoggedIn: false });
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Video Selection & Dashboard Navigation states
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [initialSeekTime, setInitialSeekTime] = useState(0);

  // Search & Category states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Bookmarking integration states
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [videoBookmarks, setVideoBookmarks] = useState<Bookmark[]>([]);

  // Load user profile on mount
  useEffect(() => {
    const activeUser = getAuthUser();
    setUser(activeUser);
  }, []);

  // Sync bookmarks list when selected video updates
  useEffect(() => {
    if (selectedVideo) {
      const bms = getBookmarks(selectedVideo.id);
      setVideoBookmarks(bms);
    } else {
      setVideoBookmarks([]);
    }
  }, [selectedVideo]);

  const handleSaveProfile = (updatedUser: User) => {
    setAuthUser(updatedUser);
    setUser(updatedUser);
    setShowProfileModal(false);
  };

  const handleLogin = (loggedInUser: User) => {
    setAuthUser(loggedInUser);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logoutUser();
    setUser({ username: '', email: '', isLoggedIn: false });
    setSelectedVideo(null);
  };

  const handleSelectVideo = (video: Video) => {
    // Get last watch progress if existing
    const history = getProgress(video.id);
    const resumeSeconds = history ? history.lastPosition : 0;
    
    setInitialSeekTime(resumeSeconds);
    setSelectedVideo(video);
    setCurrentPlaybackTime(resumeSeconds);
  };

  const handleBackToDashboard = () => {
    setSelectedVideo(null);
    setInitialSeekTime(0);
    setCurrentPlaybackTime(0);
  };

  // Bookmark CRUD handlers
  const handleAddBookmark = (name: string, timestamp: number) => {
    if (!selectedVideo) return;
    addBookmark(selectedVideo.id, timestamp, name);
    // Reload bookmarks
    setVideoBookmarks(getBookmarks(selectedVideo.id));
  };

  const handleDeleteBookmark = (id: string) => {
    if (!selectedVideo) return;
    deleteBookmark(id);
    setVideoBookmarks(getBookmarks(selectedVideo.id));
  };

  const handleEditBookmark = (id: string, newName: string) => {
    if (!selectedVideo) return;
    updateBookmark(id, newName);
    setVideoBookmarks(getBookmarks(selectedVideo.id));
  };

  const handleSeekToBookmark = (timestamp: number) => {
    if ((window as any).seekVideoTo) {
      (window as any).seekVideoTo(timestamp);
    }
  };

  // Watch Progress handler called from VideoPlayer updates
  const handleSaveWatchProgress = (videoId: string, seconds: number, completed: boolean) => {
    saveProgress(videoId, seconds, completed);
  };

  // Filtering Logic
  const categories = ['All', ...Array.from(new Set(MOCK_VIDEOS.map((v) => v.category)))];

  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Recently Watched selector (reads watch histories from local storage and matches)
  const getRecentlyWatchedVideos = () => {
    const progressList = getAllProgress();
    // Sort progressList by updatedAt descending
    const sortedProgress = progressList
      .filter((p) => p.lastPosition > 0)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    // Map to actual Video objects
    return sortedProgress
      .map((p) => MOCK_VIDEOS.find((v) => v.id === p.videoId))
      .filter((v): v is Video => !!v);
  };

  const recentlyWatched = getRecentlyWatchedVideos();

  return (
    <ProtectionOverlay>
      {!user.isLoggedIn ? (
        <LoginSignup onLogin={handleLogin} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onProfileClick={() => setShowProfileModal(true)}
            onLogout={handleLogout}
          />

        <main className="dashboard-container" style={{ flexGrow: 1 }}>
          {selectedVideo ? (
            /* --- LEARNING WORKSPACE VIEW --- */
            <div className="video-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={handleBackToDashboard} className="back-link">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Dashboard
                </button>

                {/* Show indicator if resuming watcher */}
                {initialSeekTime > 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                    Resumed watching from {new Date(initialSeekTime * 1000).toISOString().substr(14, 5)}
                  </span>
                )}
              </div>

              <div className="learning-workspace">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <VideoPlayer
                    video={selectedVideo}
                    user={user}
                    bookmarks={videoBookmarks}
                    onTimeUpdate={setCurrentPlaybackTime}
                    onSaveProgress={handleSaveWatchProgress}
                    initialTime={initialSeekTime}
                  />

                  <div className="video-info-box screenshot-protected">
                    <div className="video-info-meta">
                      <span className="video-info-category">{selectedVideo.category}</span>
                      <span className="video-info-instructor">Instructor: {selectedVideo.instructor}</span>
                    </div>
                    <h1 className="video-info-title">{selectedVideo.title}</h1>
                    <p className="video-info-desc">{selectedVideo.description}</p>
                  </div>
                </div>

                <BookmarkPanel
                  currentTime={currentPlaybackTime}
                  bookmarks={videoBookmarks}
                  onAddBookmark={handleAddBookmark}
                  onDeleteBookmark={handleDeleteBookmark}
                  onEditBookmark={handleEditBookmark}
                  onSeekTo={handleSeekToBookmark}
                />
              </div>
            </div>
          ) : (
            /* --- DASHBOARD VIEW --- */
            <>
              {/* Profile setup reminder banner if details are guest */}
              {user.username === 'Guest Student' && (
                <div
                  className="screenshot-protected"
                  style={{
                    background: 'var(--primary-glow)',
                    border: '1px solid var(--border-focus)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '1.25rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>🔒 Secure Streaming Mode Active</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Set up your official student credentials to personalize your screen protection watermarks.
                    </p>
                  </div>
                  <button
                    className="blur-shield-btn"
                    style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    onClick={() => setShowProfileModal(true)}
                  >
                    Setup Profile
                  </button>
                </div>
              )}

              {/* Category Filter Pills */}
              <div className="category-filters screenshot-protected">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Recently Watched Shelf (only display when history exists) */}
              {recentlyWatched.length > 0 && !searchQuery && activeCategory === 'All' && (
                <div style={{ marginBottom: '3rem' }}>
                  <div className="section-header screenshot-protected">
                    <h2 className="section-title">Continue Learning</h2>
                    <p className="section-subtitle">Jump straight back into your ongoing courses</p>
                  </div>
                  <CourseGrid
                    videos={recentlyWatched.slice(0, 3)} // Limit to top 3 recent
                    onSelectVideo={handleSelectVideo}
                  />
                </div>
              )}

              {/* Primary Course Listing Grid */}
              <div>
                <div className="section-header screenshot-protected">
                  <h2 className="section-title">
                    {searchQuery ? 'Search Results' : 'Available Courses'}
                  </h2>
                  <p className="section-subtitle">
                    {searchQuery
                      ? `Found ${filteredVideos.length} matches for "${searchQuery}"`
                      : 'Expand your skillset with expert-led structured modules'}
                  </p>
                </div>

                {filteredVideos.length === 0 ? (
                  <div
                    className="screenshot-protected"
                    style={{
                      textAlign: 'center',
                      padding: '4rem 2rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--border-radius-lg)',
                      border: '1px solid var(--border-muted)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ fontSize: '3rem' }}>🔍</span>
                    <h3 style={{ fontWeight: 600, marginTop: '1rem', color: 'var(--text-primary)' }}>
                      No Courses Found
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Try refining your search queries or selecting a different category.
                    </p>
                  </div>
                ) : (
                  <CourseGrid videos={filteredVideos} onSelectVideo={handleSelectVideo} />
                )}
              </div>
            </>
          )}
        </main>

        <footer
          className="screenshot-protected"
          style={{
            padding: '2rem',
            borderTop: '1px solid var(--border-muted)',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <p>© {new Date().getFullYear()} GVCC Learning Portal. All Rights Reserved.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Protected with Dynamic Watermarking, Print Shields, and Focus Guard.
          </p>
        </footer>

        {/* Profiles setting modal */}
        {showProfileModal && (
          <LoginModal
            currentUser={user}
            onSave={handleSaveProfile}
            onClose={() => setShowProfileModal(false)}
          />
        )}
        </div>
      )}
    </ProtectionOverlay>
  );
}
