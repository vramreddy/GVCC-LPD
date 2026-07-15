import React from 'react';
import type { User } from '../types';

interface NavbarProps {
  user: User;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  searchQuery,
  setSearchQuery,
  onProfileClick,
  onLogout
}) => {
  return (
    <nav className="navbar screenshot-protected">
      <div className="nav-brand" onClick={() => window.location.reload()}>
        <div className="nav-brand-logo">L</div>
        <span>GVCC Portal</span>
      </div>

      <div className="nav-search">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search learning courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="nav-actions">
        <div className="user-profile-badge" onClick={onProfileClick} title="Switch Student Profile">
          <div className="avatar-initial">
            {user.username ? user.username.charAt(0).toUpperCase() : 'S'}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {user.username || 'Student'}
          </span>
        </div>
        <button
          className="form-btn cancel"
          onClick={onLogout}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', border: '1px solid var(--border-muted)', borderRadius: '50px', whiteSpace: 'nowrap' }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};
