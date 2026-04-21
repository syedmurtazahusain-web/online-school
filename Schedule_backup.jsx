import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) {
        setError('Please login to access schedule');
        setLoading(false);
        return;
      }

      const endpoint = role === 'teacher' || role === 'admin' 
        ? 'http://localhost:5000/teacher/schedule' 
        : 'http://localhost:5000/student/schedule';

      const res = await fetch(endpoint, {
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
        setSchedule(data.schedule || []);
      } else {
        setError(data.message || 'Failed to fetch schedule');
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err.message || 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    const role = localStorage.getItem('role');
    if (role === 'teacher' || role === 'admin') {
      navigate('/schedule/add');
    }
  };

  const handleEditClass = (classId) => {
    const role = localStorage.getItem('role');
    if (role === 'teacher' || role === 'admin') {
      navigate(`/schedule/edit/${classId}`);
    }
  };

  const handleDeleteClass = async (classId) => {
    const role = localStorage.getItem('role');
    if (role !== 'teacher' && role !== 'admin') return;

    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/teacher/schedule/${classId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        setSchedule(schedule.filter(item => item.id !== classId));
      } else {
        setError(data.message || 'Failed to delete class');
      }
    } catch (err) {
      setError('Failed to delete class');
    }
  };

  const filteredSchedule = schedule.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'live') return item.type === 'live';
    if (filter === 'assignment') return item.type === 'assignment';
    return true;
  });

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    },
    bgPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      opacity: 0.4
    },
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      padding: "16px 40px",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      zIndex: 1000,
      transition: "all 0.3s ease"
    },
    navContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    navTitle: {
      fontSize: "24px",
      fontWeight: "700",
      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    navActions: {
      display: "flex",
      gap: "12px",
      alignItems: "center"
    },
    navButton: {
      padding: "10px 20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      fontSize: "14px"
    },
    navButtonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
    },
    mainContent: {
      paddingTop: "100px",
      paddingBottom: "40px"
    },
    header: {
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "16px",
      marginBottom: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px"
    },
    titleSection: {
      flex: 1
    },
    title: {
      margin: "0",
      fontSize: "clamp(28px, 4vw, 36px)",
      fontWeight: "800",
      color: "white"
    },
    subtitle: {
      margin: "8px 0 0 0",
      fontSize: "16px",
      opacity: 0.9,
      color: "white"
    },
    filtersSection: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    },
    filterButton: {
      padding: "8px 16px",
      background: "rgba(255,255,255,0.1)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.3s ease",
      fontSize: "14px"
    },
    filterButtonActive: {
      background: "rgba(255,255,255,0.2)",
      border: "1px solid rgba(255,255,255,0.5)"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "24px"
    },
    scheduleCard: {
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px"
    },
    day: {
      fontSize: "18px",
      fontWeight: "800",
      color: "#1a202c",
      margin: "0"
    },
    cardActions: {
      display: "flex",
      gap: "8px"
    },
    actionButton: {
      padding: "6px 12px",
      background: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      border: "1px solid rgba(102, 126, 234, 0.2)",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.3s ease"
    },
    actionButtonHover: {
      background: "rgba(102, 126, 234, 0.15)",
      transform: "translateY(-1px)"
    },
    subject: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1a202c",
      margin: "0 0 12px 0"
    },
    time: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#4a5568",
      margin: "8px 0"
    },
    teacher: {
      fontSize: "13px",
      color: "#718096",
      marginTop: "12px",
      margin: "0"
    },
    liveBadge: {
      display: "inline-block",
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
      marginTop: "8px"
    },
    errorBox: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#c53030",
      padding: "16px 20px",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      textAlign: "center",
      fontSize: "14px"
    },
    loadingBox: {
      textAlign: "center",
      padding: "80px 40px"
    },
    loadingSpinner: {
      width: "60px",
      height: "60px",
      border: "4px solid rgba(255,255,255,0.2)",
      borderTop: "4px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 20px"
    },
    loadingText: {
      fontSize: "18px",
      color: "white",
      marginTop: "20px"
    },
    emptyState: {
      textAlign: "center",
      padding: "80px 40px",
      color: "white"
    },
    emptyIcon: {
      fontSize: "80px",
      marginBottom: "24px",
      opacity: 0.8
    },
    emptyText: {
      fontSize: "20px",
      fontWeight: "500",
      opacity: 0.9,
      marginBottom: "24px"
    },
    emptyAction: {
      padding: "12px 24px",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      transition: "all 0.3s ease"
    }
  };

  const role = localStorage.getItem('role');
  const canManageSchedule = role === 'teacher' || role === 'admin';

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.bgPattern} />
        <div style={styles.loadingBox}>
          <div style={styles.loadingSpinner} />
          <p style={styles.loadingText}>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.bgPattern} />
      
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navTitle}>📅 Schedule</div>
          <div style={styles.navActions}>
            {canManageSchedule && (
              <motion.button
                whileHover={styles.navButtonHover}
                style={styles.navButton}
                onClick={handleAddClass}
              >
                ➕ Add Class
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={styles.errorBox}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Weekly Schedule</h1>
              <p style={styles.subtitle}>Manage your classes and appointments</p>
            </div>
            <div style={styles.filtersSection}>
              <motion.button
                style={{
                  ...styles.filterButton,
                  ...(filter === 'all' ? styles.filterButtonActive : {})
                }}
                onClick={() => setFilter('all')}
                whileHover={{ scale: 1.05 }}
              >
                All
              </motion.button>
              <motion.button
                style={{
                  ...styles.filterButton,
                  ...(filter === 'live' ? styles.filterButtonActive : {})
                }}
                onClick={() => setFilter('live')}
                whileHover={{ scale: 1.05 }}
              >
                Live Classes
              </motion.button>
              <motion.button
                style={{
                  ...styles.filterButton,
                  ...(filter === 'assignment' ? styles.filterButtonActive : {})
                }}
                onClick={() => setFilter('assignment')}
                whileHover={{ scale: 1.05 }}
              >
                Assignments
              </motion.button>
            </div>
          </div>
        </motion.div>

        {filteredSchedule.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.emptyState}
          >
            <div style={styles.emptyIcon}>📚</div>
            <p style={styles.emptyText}>No classes scheduled for this filter.</p>
            {canManageSchedule && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.emptyAction}
                onClick={handleAddClass}
              >
                Add Your First Class
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            style={styles.grid}
          >
            {filteredSchedule.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)" 
                }}
                style={{
                  ...styles.scheduleCard,
                  borderLeft: `4px solid ${item.color || '#667eea'}`
                }}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.day}>{item.day}</h3>
                  {canManageSchedule && (
                    <div style={styles.cardActions}>
                      <motion.button
                        whileHover={styles.actionButtonHover}
                        style={styles.actionButton}
                        onClick={() => handleEditClass(item.id)}
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={styles.actionButtonHover}
                        style={{...styles.actionButton, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444"}}
                        onClick={() => handleDeleteClass(item.id)}
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  )}
                </div>
                
                <h4 style={styles.subject}>{item.subject}</h4>
                <div style={styles.time}>
                  <span>🕐</span>
                  <span>{item.time}</span>
                </div>
                <p style={styles.teacher}>👨‍🏫 {item.teacher}</p>
                
                {item.type === 'live' && (
                  <div style={styles.liveBadge}>
                    🔴 LIVE CLASS
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
