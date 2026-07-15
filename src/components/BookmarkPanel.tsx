import React, { useState } from 'react';
import type { Bookmark } from '../types';
import { formatTime } from '../services/storage';

interface BookmarkPanelProps {
  currentTime: number;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, timestamp: number) => void;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (id: string, newName: string) => void;
  onSeekTo: (timestamp: number) => void;
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  currentTime,
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  onEditBookmark,
  onSeekTo
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const [bookmarkTime, setBookmarkTime] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleOpenAddForm = () => {
    setBookmarkTime(currentTime);
    setNewBookmarkName(`Bookmark at ${formatTime(currentTime)}`);
    setIsAdding(true);
  };

  const handleSaveNewBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBookmark(newBookmarkName, bookmarkTime);
    setIsAdding(false);
    setNewBookmarkName('');
  };

  const handleStartEditing = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering seek
    setEditingId(bookmark.id);
    setEditingName(bookmark.name || '');
  };

  const handleSaveEdit = (id: string) => {
    onEditBookmark(id, editingName);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering seek
    if (confirm('Are you sure you want to delete this bookmark?')) {
      onDeleteBookmark(id);
    }
  };

  return (
    <div className="bookmark-panel screenshot-protected">
      <div className="panel-header">
        <div className="panel-title">
          <span>Bookmarks</span>
          <span className="panel-title-badge">{bookmarks.length}</span>
        </div>
        {!isAdding && (
          <button className="add-bookmark-quick-btn" onClick={handleOpenAddForm}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Bookmark
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSaveNewBookmark} className="bookmark-form-box">
          <div className="bookmark-form-title">
            <span>New Bookmark Title</span>
            <span>at {formatTime(bookmarkTime)}</span>
          </div>
          <input
            type="text"
            className="bookmark-form-input"
            value={newBookmarkName}
            onChange={(e) => setNewBookmarkName(e.target.value)}
            placeholder="e.g. Key Concept, Chapter 2"
            autoFocus
            required
          />
          <div className="bookmark-form-actions">
            <button type="button" className="form-btn cancel" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="form-btn save">
              Save Bookmark
            </button>
          </div>
        </form>
      )}

      <div className="bookmark-list-container">
        {bookmarks.length === 0 ? (
          <div className="bookmark-empty-state">
            <div className="bookmark-empty-icon">🔖</div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Bookmarks Yet</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              Create bookmarks to save and jump back to important timestamps.
            </p>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bookmark-item"
              onClick={() => onSeekTo(bookmark.timestamp)}
            >
              {editingId === bookmark.id ? (
                <div className="bookmark-edit-inline" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    className="bookmark-edit-input"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(bookmark.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <div className="bookmark-edit-actions">
                    <button
                      className="form-btn cancel"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="form-btn save"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => handleSaveEdit(bookmark.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bookmark-item-left">
                    <div className="bookmark-item-title-row">
                      <span className="bookmark-item-title">{bookmark.name}</span>
                      <span className="bookmark-item-time">{formatTime(bookmark.timestamp)}</span>
                    </div>
                    <span className="bookmark-item-date">
                      Saved {new Date(bookmark.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bookmark-item-actions">
                    <button
                      className="bookmark-action-btn edit"
                      onClick={(e) => handleStartEditing(bookmark, e)}
                      title="Edit name"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                      </svg>
                    </button>
                    <button
                      className="bookmark-action-btn delete"
                      onClick={(e) => handleDelete(bookmark.id, e)}
                      title="Delete bookmark"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
