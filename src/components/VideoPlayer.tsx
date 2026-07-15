import React, { useRef, useState, useEffect } from 'react';
import type { Video, Bookmark, User } from '../types';
import { formatTime } from '../services/storage';

interface VideoPlayerProps {
  video: Video;
  user: User;
  bookmarks: Bookmark[];
  onTimeUpdate: (time: number) => void;
  onSaveProgress: (videoId: string, time: number, completed: boolean) => void;
  initialTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  user,
  bookmarks,
  onTimeUpdate,
  onSaveProgress,
  initialTime = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Floating Watermark position coordinates
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });

  // Initialize initial playhead position
  useEffect(() => {
    const videoNode = videoRef.current;
    if (videoNode) {
      videoNode.currentTime = initialTime;
      setCurrentTime(initialTime);
    }
  }, [video.id, initialTime]);

  // Track loss-of-focus (Snipping Tool & Focus loss detection)
  useEffect(() => {
    const handleBlur = () => {
      setIsWindowBlurred(true);
      // Immediately pause playback
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleFocus = () => {
      // Keep blurred state active until user explicitly clicks "Resume Content"
      // to make them aware that focus was lost.
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Watermark Drift updates (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const left = Math.floor(Math.random() * 70) + 10; // 10% to 80%
      setWatermarkPos({ top: `${top}%`, left: `${left}%` });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Controls Visibility Timer (hide after 2s of idle)
  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      return;
    }
    const handleMouseMove = () => {
      setControlsVisible(true);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const timer = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timer);
    };
  }, [isPlaying, controlsVisible]);

  // Auto-Save watch progress interval
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (videoRef.current) {
          const time = videoRef.current.currentTime;
          const completed = time >= duration - 5; // mark completed if within 5s of end
          onSaveProgress(video.id, time, completed);
        }
      }, 3000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, video.id, duration]);

  // Video Ref Seeking API Export
  useEffect(() => {
    // Expose internal seeking functionality globally for Bookmark seeking
    (window as any).seekVideoTo = (seconds: number) => {
      const videoNode = videoRef.current;
      if (videoNode) {
        videoNode.currentTime = seconds;
        setCurrentTime(seconds);
        // Autoplay when seeking from bookmark
        videoNode.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    return () => {
      delete (window as any).seekVideoTo;
    };
  }, []);

  const togglePlay = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (isPlaying) {
      videoNode.pause();
      setIsPlaying(false);
    } else {
      videoNode.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
      videoRef.current.volume = nextMute ? 0 : volume || 0.5;
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekPercentage = clickX / width;
    const seekTime = seekPercentage * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen to fullscreen changes outside custom toggle (e.g. Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const resumeFromBlur = () => {
    setIsWindowBlurred(false);
    // Refocus the window
    window.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`premium-player-container screenshot-protected ${
        controlsVisible ? 'controls-active' : ''
      }`}
    >
      {/* Loss-of-focus shield mask */}
      {isWindowBlurred && (
        <div className="blur-shield-overlay">
          <div className="blur-shield-icon">🔒</div>
          <h3 className="blur-shield-title">Content Protected</h3>
          <p className="blur-shield-desc">
            To prevent screen recording, the learning portal blurs content when focus is lost or a screenshot capture utility is active.
          </p>
          <button className="blur-shield-btn" onClick={resumeFromBlur}>
            Resume Learning
          </button>
        </div>
      )}

      {/* Floating security watermark */}
      <div
        className="drift-watermark"
        style={{
          top: watermarkPos.top,
          left: watermarkPos.left,
          transition: 'all 2s ease-in-out',
        }}
      >
        <span>
          {user.email || 'guest@gvcc.edu'} • 192.168.42.10 • SECURE CONTENT
        </span>
      </div>

      <video
        ref={videoRef}
        src={video.videoUrl}
        className="video-element"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
      />

      {/* Custom Controls UI Overlay */}
      <div className="player-controls-overlay">
        {/* Timeline bar with mapped bookmark ticks */}
        <div className="timeline-container" onClick={handleTimelineClick}>
          <div
            className="timeline-progress"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          <div
            className="timeline-handle"
            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
          />

          {/* Map bookmarks onto timeline scrubber */}
          {bookmarks.map((bm) => {
            const percentage = (bm.timestamp / (duration || 1)) * 100;
            return (
              <div
                key={bm.id}
                className="timeline-bookmark-tick"
                style={{ left: `${percentage}%` }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent timeline default seek
                  if (videoRef.current) {
                    videoRef.current.currentTime = bm.timestamp;
                    setCurrentTime(bm.timestamp);
                  }
                }}
              >
                <div className="timeline-bookmark-tooltip">
                  {bm.name} ({formatTime(bm.timestamp)})
                </div>
              </div>
            );
          })}
        </div>

        <div className="control-row">
          <div className="control-group">
            {/* Play/Pause Button */}
            <button className="control-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            {/* Volume controls */}
            <div className="volume-control-container">
              <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                className="volume-slider"
                onChange={handleVolumeChange}
              />
            </div>

            {/* Time display */}
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="control-group">
            {/* Speed Selector */}
            <select className="speed-selector" value={playbackSpeed} onChange={handleSpeedChange} title="Playback speed">
              <option value="0.5">0.5x</option>
              <option value="1">1.0x (Normal)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>

            {/* Fullscreen Button */}
            <button className="control-btn" onClick={toggleFullscreen} title="Fullscreen">
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"></path>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3M10 21v-6H4M4 14l7-7M14 10l7 7"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
