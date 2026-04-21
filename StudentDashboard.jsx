import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  // STRICT ROLE GUARD: Kill the render immediately if the user shouldn't be here
  const currentRole = localStorage.getItem('role');
  if (currentRole && currentRole !== 'student') {
    window.location.href = `/dashboard/${currentRole}`;
    return null;
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // Only redirect to login if we are certain there is no token and no role
    if (!token && !role) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      await Promise.all([
        fetchUserData(),
        fetchCourses(),
        fetchAchievements()
      ]);
    };

    loadDashboard();
  }, [navigate]);

  const fetchUserData = async () => {
    const role = localStorage.getItem('role');
    if (role && role !== 'student') return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return; // Let useEffect handle the redirect, don't set a hard error yet
      }

      // Mock user data for now
      const mockUser = {
        id: 1,
        name: 'Alex Johnson',
        grade: '5th Grade',
        avatar: '🌟',
        level: 12,
        xp: 2450,
        nextLevelXp: 3000
      };

      setUser(mockUser);
      
      // Mock streak and points
      setStreak(7);
      setPoints(850);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError(err.message || 'Failed to fetch user data');
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Mock course data with more interactive elements
      const mockCourses = [
        { 
          id: 1, 
          name: 'Math Adventures', 
          description: 'Explore numbers and solve fun puzzles!',
          icon: '🔢',
          color: '#ff6b6b',
          progress: 75,
          totalLessons: 20,
          completedLessons: 15,
          nextLesson: 'Multiplication Magic',
          difficulty: 'Medium',
          estimatedTime: '15 min',
          badges: ['⭐', '🎯'],
          locked: false
        },
        { 
          id: 2, 
          name: 'Science Explorer', 
          description: 'Discover the amazing world of science!',
          icon: '🔬',
          color: '#4ecdc4',
          progress: 60,
          totalLessons: 25,
          completedLessons: 15,
          nextLesson: 'Cool Chemistry',
          difficulty: 'Easy',
          estimatedTime: '20 min',
          badges: ['🌟'],
          locked: false
        },
        { 
          id: 3, 
          name: 'Reading Kingdom', 
          description: 'Become a reading champion!',
          icon: '📚',
          color: '#45b7d1',
          progress: 90,
          totalLessons: 30,
          completedLessons: 27,
          nextLesson: 'Story Time Adventure',
          difficulty: 'Easy',
          estimatedTime: '10 min',
          badges: ['🏆', '⭐', '🎯'],
          locked: false
        },
        { 
          id: 4, 
          name: 'Art Studio', 
          description: 'Create amazing artwork!',
          icon: '🎨',
          color: '#f7b731',
          progress: 0,
          totalLessons: 15,
          completedLessons: 0,
          nextLesson: 'Locked - Complete Math Adventures first!',
          difficulty: 'Easy',
          estimatedTime: '25 min',
          badges: [],
          locked: true
        }
      ];

      setCourses(mockCourses);
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Mock achievements data
      const mockAchievements = [
        { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '👶', unlocked: true, date: '2024-01-15' },
        { id: 2, name: 'Week Warrior', description: 'Study for 7 days in a row', icon: '🗓️', unlocked: true, date: '2024-01-22' },
        { id: 3, name: 'Math Master', description: 'Complete 10 math lessons', icon: '🧮', unlocked: true, date: '2024-02-01' },
        { id: 4, name: 'Speed Learner', description: 'Complete 5 lessons in one day', icon: '⚡', unlocked: false, progress: 3, total: 5 },
        { id: 5, name: 'Perfect Score', description: 'Get 100% on 3 quizzes', icon: '💯', unlocked: false, progress: 1, total: 3 },
        { id: 6, name: 'Course Champion', description: 'Complete an entire course', icon: '🏆', unlocked: false, progress: 0, total: 1 }
      ];

      setAchievements(mockAchievements);
    } catch (err) {
      console.error('❌ Error fetching achievements:', err);
    }
  };

  const handleCourseClick = (course) => {
    if (!course.locked) {
      setSelectedItem(course);
      // Navigate to course details or start lesson
      navigate(`/dashboard/courses?course=${course.id}`);
    } else {
      // Show locked message
      alert('🔒 This course is locked! Complete more lessons to unlock it.');
    }
  };

  const handleAchievementClick = (achievement) => {
    if (achievement.unlocked) {
      setSelectedItem(achievement);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      padding: 'var(--space-6)',
      background: 'var(--gradient-primary)',
      overflow: 'hidden',
      color: 'white'
    },
    header: {
      background: '#ffffff',
      padding: 'var(--space-14) var(--space-10)',
      borderRadius: 'var(--radius-2xl)',
      marginBottom: 'var(--space-8)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      color: '#111827'
    },
    avatar: {
      fontSize: '60px',
      background: '#ebf5ff',
      width: '84px',
      height: '84px',
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid #0056D2'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-10)',
      flex: 1
    },
    welcomeText: {
      flex: 1
    },
    userName: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#111827',
      letterSpacing: '-0.03em',
      marginBottom: '8px'
    },
    userGrade: {
      fontSize: '20px',
      color: '#64748b', // Slate color for better contrast
      fontWeight: '600',
      letterSpacing: '0.01em'
    },
    progressSection: {
      background: '#F8FAFC',
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid #E2E8F0',
      width: '100%'
    },
    levelBar: {
      background: '#E2E8F0',
      borderRadius: 'var(--radius-full)',
      height: '12px',
      overflow: 'hidden',
      marginTop: 'var(--space-2)'
    },
    levelProgress: {
      height: '100%',
      background: '#0056D2',
      borderRadius: 'var(--radius-full)',
      transition: 'width var(--transition-base)',
    },
    statCard: {
      background: '#ffffff',
      padding: 'var(--space-12) var(--space-6)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e5e7eb',
      transition: 'all var(--transition-base)',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      minHeight: '160px',
      flex: 1
    },
    section: {
      background: 'white',
      padding: 'var(--space-16) var(--space-12)',
      borderRadius: 'var(--radius-2xl)',
      marginBottom: 'var(--space-8)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #f3f4f6'
    },
    courseCard: {
      background: 'white',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-10)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #f1f5f9',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    },
    courseProgressBar: {
      height: '100%',
      transition: 'width var(--transition-base)',
      borderRadius: 'inherit'
    },
    courseProgress: {
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-full)',
      height: '12px',
      overflow: 'hidden',
      marginBottom: 'var(--space-5)'
    },
    durationBadge: {
      background: '#ebf5ff',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '900',
      color: '#0056D2',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid #c2e0ff',
      position: 'absolute',
      top: '24px',
      right: '24px',
      zIndex: 2
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.2)',
      backdropFilter: 'blur(10px)',
      padding: 'var(--space-5)',
      borderRadius: 'var(--radius-xl)',
      marginBottom: 'var(--space-6)',
      border: '2px solid var(--error-500)',
      textAlign: 'center'
    },
    achievementCard: {
      background: '#f9fafb',
      padding: 'var(--space-8) var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      border: '2px solid #f1f5f9',
      transition: 'all var(--transition-base)',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    bgStar: {
      position: 'absolute',
      fontSize: '24px',
      animation: 'twinkle 3s infinite ease-in-out',
      zIndex: 0,
      pointerEvents: 'none'
    },
    bgCloud: {
      position: 'absolute',
      fontSize: '48px',
      opacity: 0.3,
      animation: 'float 8s infinite ease-in-out',
      zIndex: 0,
      pointerEvents: 'none'
    }
  };

  const animations = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.2); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  `;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-primary">
        <div className="text-center p-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '60px' }}
          >
            🚀
          </motion.div>
          <p className="text-xl mt-4 text-white font-bold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{animations}</style>
      <div style={styles.container}>
        {/* Animated Background Elements */}
        <div style={{ ...styles.bgStar, top: '10%', left: '5%' }}>⭐</div>
        <div style={{ ...styles.bgStar, top: '20%', right: '10%', animationDelay: '1s' }}>✨</div>
        <div style={{ ...styles.bgStar, bottom: '30%', left: '15%', animationDelay: '2s' }}>🌟</div>
        <div style={{ ...styles.bgCloud, top: '15%', right: '20%' }}>☁️</div>
        <div style={{ ...styles.bgCloud, bottom: '20%', left: '10%', animationDelay: '3s' }}>☁️</div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.errorBox}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* USER INFO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.header}
        >
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user?.avatar || '🌟'}</div>
            <div style={styles.welcomeText}>
              <h1 style={styles.userName}>Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
              <p style={styles.userGrade}>Ready to jump into your {user?.grade || '5th Grade'} journey?</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div style={styles.progressSection}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-700">Level {user?.level || 1}</span>
              <span className="text-xs font-semibold text-gray-500">{user?.xp || 0} / {user?.nextLevelXp || 100} XP</span>
            </div>
            <div style={styles.levelBar}>
              <motion.div
                style={{
                  ...styles.levelProgress,
                  width: `${((user?.xp || 0) / (user?.nextLevelXp || 100)) * 100}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${((user?.xp || 0) / (user?.nextLevelXp || 100)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: '🔥', value: streak, label: 'Day Streak' },
              { icon: '⭐', value: points, label: 'Star Points' },
              { icon: '📚', value: courses.length, label: 'Courses' },
              { icon: '🏆', value: achievements.filter(a => a.unlocked).length, label: 'Badges' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                style={styles.statCard}
              >
                <div className="text-5xl mb-6">{stat.icon}</div>
                <div className="text-3xl font-black text-[#1f2937]">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">{stat.label}</div>
                <div className="mt-4 text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">VIEW DETAILS →</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* COURSES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={styles.section}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 drop-shadow-sm">🎓 Your Learning Adventures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={course.locked ? "opacity-70 grayscale cursor-not-allowed" : "hover-lift"}
                style={{
                  ...styles.courseCard,
                  borderLeft: `6px solid ${course.color}`
                }}
                onClick={() => handleCourseClick(course)}
              >
                {course.locked && (
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-xl">🔒</div>
                )}
                
                {!course.locked && <div style={styles.durationBadge}><span>⏱️</span> {course.estimatedTime}</div>}
                
                <div className="text-5xl mb-8">{course.icon}</div>
                <h3 className="text-2xl font-black text-[#111827] mb-4">{course.name}</h3>
                <p className="text-[15px] text-slate-500 mb-10 leading-relaxed font-medium">{course.description}</p>
                
                <div className="flex items-center gap-4 text-[12px] font-bold text-slate-400 mb-6">
                  <span className="bg-blue-50 text-[#0056D2] px-3 py-1.5 rounded-lg border border-blue-100 font-black">📖 {course.completedLessons}/{course.totalLessons} lessons</span>
                </div>
                
                <div style={{ ...styles.courseProgress, height: '8px', marginBottom: '14px', background: '#f1f5f9' }}>
                  <motion.div
                    className="h-full"
                    style={{
                      ...styles.courseProgressBar,
                      background: '#0056D2',
                      width: `${course.progress}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                  />
                </div>
                
               <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-black text-blue-600">{course.progress}% Complete</span>
                  <div className="flex gap-2">
                  {course.badges.map((badge, i) => (
                    <span key={i} className="text-xl bg-gray-50 rounded-lg w-10 h-10 flex items-center justify-center border border-gray-100">{badge}</span>
                  ))}
                </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-6 border-t border-slate-100">
                  <div className="text-sm font-bold text-slate-700">
                    <span className="text-slate-300 font-medium uppercase mr-2 text-[10px] tracking-widest">NEXT:</span> {course.nextLesson}
                  </div>
                  {!course.locked && (
                    <button className="bg-[#0056D2] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0041a3] transition-all shadow-md flex items-center gap-2 border-none cursor-pointer">
                      <span>Resume</span>
                      <span className="text-xl">▶️</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ACHIEVEMENTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={styles.section}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 drop-shadow-sm">🏆 Your Achievements</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={achievement.unlocked ? "hover-lift" : "opacity-50 grayscale"}
                style={{
                  ...styles.achievementCard,
                  borderBottom: achievement.unlocked ? `3px solid var(--success-500)` : `3px solid transparent`
                }}
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="text-5xl mb-8">{achievement.icon}</div>
                <div className="text-sm font-extrabold leading-tight mb-3">{achievement.name}</div>
                {achievement.unlocked ? (
                  <div className="text-[10px] text-success-500 font-bold">✅ Unlocked!</div>
                ) : (
                  <div className="text-[10px] opacity-80">
                    {achievement.progress || 0}/{achievement.total || 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={styles.section}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">🚀 Learning Shortcuts</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/dashboard/courses')}
              className="flex flex-col items-center justify-center gap-4 p-10 rounded-[32px] bg-[#0056D2] hover-lift text-white no-underline shadow-xl cursor-pointer"
            >
              <div className="text-4xl">📚</div>
              <div className="font-black text-lg tracking-tight">Browse Courses</div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/dashboard/videos')}
              className="relative flex flex-col items-center justify-center gap-4 p-10 rounded-[32px] bg-[#ec4899] hover-lift text-white no-underline shadow-xl cursor-pointer"
            >
              <div className="absolute top-6 right-6 text-[11px] bg-white/20 px-3 py-1 rounded-full font-black border border-white/20">15:20</div>
              <div className="text-4xl">🎥</div>
              <div className="font-black text-lg tracking-tight">Watch Videos</div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/dashboard/schedule')}
              className="flex flex-col items-center justify-center gap-4 p-10 rounded-[32px] bg-[#8b5cf6] hover-lift text-white no-underline shadow-xl cursor-pointer"
            >
              <div className="text-4xl">📅</div>
              <div className="font-black text-lg tracking-tight">My Schedule</div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setShowAchievementModal(true)}
              className="flex flex-col items-center justify-center gap-4 p-10 rounded-[32px] bg-[#f59e0b] hover-lift cursor-pointer text-white shadow-xl"
            >
              <div className="text-4xl">🎁</div>
              <div className="font-black text-lg tracking-tight">Rewards Shop</div>
            </motion.div>
          </div>
        </motion.div>

        {/* ACHIEVEMENT MODAL */}
        <AnimatePresence>
          {showAchievementModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]"
              onClick={() => setShowAchievementModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-10 rounded-[25px] max-w-[400px] w-[90%] text-center text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-5">🎁</div>
                <h3 className="text-2xl font-bold mb-2">Rewards Shop</h3>
                <p className="text-secondary mb-5 leading-relaxed">
                  Use your Star Points to unlock cool rewards!<br />
                  You have {points} points to spend.
                </p>
                <button 
                  onClick={() => setShowAchievementModal(false)}
                  className="bg-gradient-primary text-white border-none py-4 px-8 rounded-xl text-lg font-bold cursor-pointer hover-scale transition-all"
                >
                  Coming Soon! 🚀
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
