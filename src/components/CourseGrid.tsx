import React from 'react';
import type { Video } from '../types';
import { getProgress, formatTime } from '../services/storage';

interface CourseGridProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ videos, onSelectVideo }) => {
  return (
    <div className="course-grid">
      {videos.map((video) => {
        const progress = getProgress(video.id);
        const percent = progress
          ? Math.min(100, Math.round((progress.lastPosition / video.duration) * 100))
          : 0;

        return (
          <div key={video.id} className="course-card" onClick={() => onSelectVideo(video)}>
            <div className="card-thumbnail-container">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="card-thumbnail"
                loading="lazy"
              />
              <span className="card-badge">{video.category}</span>
              <span className="card-duration">{formatTime(video.duration)}</span>
              
              {/* Progress Bar Indicator */}
              {percent > 0 && (
                <div className="card-progress-bar" title={`Watched ${percent}%`}>
                  <div className="card-progress-fill" style={{ width: `${percent}%` }} />
                </div>
              )}
            </div>

            <div className="card-content">
              <span className="card-instructor">Instructor: {video.instructor}</span>
              <h3 className="card-title">{video.title}</h3>
              <p className="card-desc">{video.description}</p>
              
              <div className="card-footer">
                {percent > 0 ? (
                  <span className="card-stats">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-secondary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {percent}% watched
                  </span>
                ) : (
                  <span className="card-stats" style={{ color: 'var(--text-muted)' }}>
                    Not started yet
                  </span>
                )}
                
                <span className="play-action-text">
                  {percent > 0 ? 'Continue watching' : 'Start learning'}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: '2px' }}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
