import React, { useState } from 'react';
import type { User } from '../types';

interface LoginSignupProps {
  onLogin: (user: User) => void;
}

export const LoginSignup: React.FC<LoginSignupProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignUp && !username.trim()) return;

    // Simulate login / signup persistence
    const displayName = isSignUp ? username.trim() : email.split('@')[0];
    onLogin({
      username: displayName,
      email: email.trim(),
      isLoggedIn: true,
    });
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 1000 }}>
      <div className="modal-content" style={{ width: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            className="nav-brand-logo"
            style={{
              width: '48px',
              height: '48px',
              fontSize: '1.5rem',
              margin: '0 auto 1rem auto',
            }}
          >
            L
          </div>
          <h2 className="modal-title" style={{ fontSize: '1.75rem' }}>
            {isSignUp ? 'Create Student Account' : 'Student Sign In'}
          </h2>
          <p className="modal-subtitle">
            {isSignUp
              ? 'Join the GVCC Learning Portal to begin your studies'
              : 'Sign in to access your dashboard, courses, and bookmarks'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isSignUp && (
            <div className="modal-form-group">
              <label className="modal-form-label">Full Name</label>
              <input
                type="text"
                className="modal-form-input"
                placeholder="e.g. Alex Mercer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="modal-form-group">
            <label className="modal-form-label">Student Email Address</label>
            <input
              type="email"
              className="modal-form-input"
              placeholder="e.g. alex@gvcc.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-form-label">Password</label>
            <input
              type="password"
              className="modal-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn" style={{ padding: '0.85rem' }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="modal-toggle-text" style={{ marginTop: '1.5rem' }}>
          {isSignUp ? 'Already registered?' : 'New student?'}
          <span className="modal-toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign in here' : 'Create an account'}
          </span>
        </div>
      </div>
    </div>
  );
};
