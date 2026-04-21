import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '../components/VideoPlayer';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to access videos');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/student/courses', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
          fetchVideosForCourse(data.courses[0].id);
        }
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosForCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`http://localhost:5000/student/videos/${courseId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        // Fallback to mock data if endpoint doesn't exist
        const mockVideos = [
          { id: '1', title: 'Introduction to Web Development', duration: '15:30', completed: false },
          { id: '2', title: 'HTML Basics', duration: '22:45', completed: false },
          { id: '3', title: 'CSS Fundamentals', duration: '18:20', completed: false },
          { id: '4', title: 'JavaScript Introduction', duration: '25:10', completed: false }
        ];
        setVideos(mockVideos);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setVideos(data.videos || []);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      // Fallback to mock data
      const mockVideos = [
        { id: '1', title: 'Introduction to Web Development', duration: '15:30', completed: false },
        { id: '2', title: 'HTML Basics', duration: '22:45', completed: false },
        { id: '3', title: 'CSS Fundamentals', duration: '18:20', completed: false },
        { id: '4', title: 'JavaScript Introduction', duration: '25:10', completed: false }
      ];
      setVideos(mockVideos);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchVideosForCourse(course.id);
  };

  const handleVideoComplete = async (courseId, videoId) => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:5000/student/video/complete', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId, videoId })
      });

      if (res.ok) {
        // Update video completion status
        setVideos(prevVideos => 
          prevVideos.map(video => 
            video.id === videoId 
              ? { ...video, completed: true }
              : video
          )
        );
      }
    } catch (err) {
      console.error('Error marking video complete:', err);
    }
  };

  const styles = {
    container: {
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    },
    header: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '16px',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    title: {
      margin: '0 0 10px 0',
      fontSize: '32px',
      fontWeight: '800'
    },
    subtitle: {
      margin: '0',
      fontSize: '16px',
      opacity: 0.9
    },
    content: {
      display: 'flex',
      gap: '30px'
    },
    sidebar: {
      width: '300px',
      flexShrink: 0
    },
    courseList: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px'
    },
    courseItem: {
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '8px',
      background: 'rgba(255,255,255,0.1)',
      transition: 'all 0.3s',
      border: '2px solid transparent'
    },
    selectedCourse: {
      background: 'rgba(255,255,255,0.2)',
      border: '2px solid white'
    },
    courseName: {
      fontSize: '14px',
      fontWeight: '600',
      margin: '0 0 5px 0'
    },
    courseProgress: {
      fontSize: '12px',
      opacity: 0.8,
      margin: '0'
    },
    videoList: {
      flex: 1
    },
    videoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    videoCard: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      flexDirection: 'column'
    },
    videoThumbnail: {
      width: '100%',
      height: '160px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      color: 'white',
      position: 'relative'
    },
    videoInfo: {
      padding: 'var(--space-5)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      flex: 1
    },
    videoTitle: {
      fontSize: 'var(--text-base)',
      fontWeight: '700',
      margin: 0,
      lineHeight: '1.4'
    },
    videoDuration: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-secondary)',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)'
    },
    completedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#10b981',
      color: 'white',
      padding: 'var(--space-1) var(--space-2)',
      borderRadius: 'var(--radius-md)',
      fontSize: '10px',
      fontWeight: '700',
      width: 'fit-content'
    },
    errorBox: {
      background: '#fee',
      color: '#c33',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    loadingBox: {
      textAlign: 'center',
      padding: '60px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: 'white'
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '20px'
    },
    emptyText: {
      fontSize: '18px',
      opacity: 0.9
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '50px', color: 'white' }}
          >
            <div> loading videos...</div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ERROR MESSAGE */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.errorBox}
        >
          <div> error loading videos...</div>
        </motion.div>
      )}

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.title}> video library</h1>
        <p style={styles.subtitle}>watch and learn at your own pace!</p>
      </motion.div>

      {/* CONTENT */}
      <div style={styles.content}>
        {/* SIDEBAR - COURSE LIST */}
        <div style={styles.sidebar}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.courseList}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '700' }}>
              courses
            </h3>
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                style={{
                  ...styles.courseItem,
                  ...(selectedCourse?.id === course.id ? styles.selectedCourse : {})
                }}
              >
                <h4 style={styles.courseName}>{course.name}</h4>
                <p style={styles.courseProgress}>{course.progress || 0}% complete</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* VIDEO PLAYER/VIDEO LIST */}
        <div style={styles.videoList}>
          {videos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.emptyState}
            >
              <div style={styles.emptyIcon}>📹</div>
              <p style={styles.emptyText}>
                {selectedCourse ? 'No videos available for this course yet.' : 'Select a course to view videos.'}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Selected Video Player */}
              {videos.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    color: 'white', 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    Now Playing: {videos[0].title}
                  </h3>
                  <VideoPlayer 
                    video={videos[0]} 
                    onVideoComplete={handleVideoComplete}
                    courseId={selectedCourse?.id}
                  />
                </div>
              )}

              {/* Video List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                style={styles.videoGrid}
              >
                {videos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    style={styles.videoCard}
                  >
                    <div style={styles.videoThumbnail}>
                      <div>📹</div>
                    </div>
                    <div style={styles.videoInfo}>
                      <h3 style={styles.videoTitle}>{video.title}</h3>
                      <p style={styles.videoDuration}>Duration: {video.duration}</p>
                      {video.completed && (
                        <span style={styles.completedBadge}>✓ Completed</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Videos;