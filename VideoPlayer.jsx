import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoPlayer({ video, onVideoComplete, courseId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      if (onVideoComplete) {
        onVideoComplete(courseId, video.id);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [video, onVideoComplete, courseId]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = video.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      background: '#000'
    },
    video: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    controls: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
      padding: '20px',
      opacity: showControls ? 1 : 0,
      transition: 'opacity 0.3s'
    },
    progressBar: {
      position: 'relative',
      height: '6px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '3px',
      marginBottom: '15px',
      cursor: 'pointer',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '3px',
      transition: 'width 0.1s'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px'
    },
    playButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'all 0.3s'
    },
    timeDisplay: {
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      opacity: 0.9
    },
    volumeControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    volumeSlider: {
      width: '60px',
      height: '4px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '2px',
      appearance: 'none',
      cursor: 'pointer'
    },
    fullscreenButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'all 0.3s'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        style={styles.video}
        src={video.url}
        onClick={handlePlayPause}
      />
      
      <div style={styles.controls}>
        {/* Progress Bar */}
        <div style={styles.progressBar} onClick={handleSeek}>
          <motion.div
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Controls Row */}
        <div style={styles.controlsRow}>
          <button style={styles.playButton} onClick={handlePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div style={styles.timeDisplay}>
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </div>

          <div style={styles.volumeControl}>
            <span style={{ color: 'white', fontSize: '14px' }}>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="1"
              style={styles.volumeSlider}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.volume = e.target.value;
                }
              }}
            />
          </div>

          <button
            style={styles.fullscreenButton}
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }
            }}
          >
            ⛶
          </button>
        </div>
      </div>
    </motion.div>
  );
}
