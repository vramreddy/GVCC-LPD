import React, { useState } from 'react';
import type { User } from '../types';

interface LoginModalProps {
  currentUser: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ currentUser, onSave, onClose }) => {
  const [username, setUsername] = useState(currentUser.username || '');
  const [email, setEmail] = useState(currentUser.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    onSave({
      username: username.trim(),
      email: email.trim(),
      isLoggedIn: true
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <h2 className="modal-title">Student Profile</h2>
          <p className="modal-subtitle">
            Configure student details for personalized metrics and dynamic video watermarks.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="modal-form-group">
            <label className="modal-form-label">Student Name</label>
            <input
              type="text"
              className="modal-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. John Doe"
              required
              autoFocus
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-form-label">Student Email / ID</label>
            <input
              type="email"
              className="modal-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john.doe@gvcc.edu"
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};
