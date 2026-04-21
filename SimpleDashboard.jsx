import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (!token) {
      navigate('/');
      return;
    }

    setUser({
      token,
      role,
      userId,
      email: 'user@example.com', // Default since we can't fetch
      name: role === 'student' ? 'Student' : role === 'teacher' ? 'Teacher' : 'Administrator'
    });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: '#f8fafc',
    },
    header: {
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2c3e50',
      fontSize: '18px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
    },
    logoutButton: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    main: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    welcome: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    },
    welcomeTitle: {
      fontSize: '2rem',
      color: '#2d3748',
      margin: '0 0 0.5rem 0',
    },
    welcomeSubtitle: {
      color: '#718096',
      margin: '0 0 1rem 0',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#667eea',
      margin: '0 0 0.5rem 0',
    },
    statLabel: {
      color: '#718096',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    actions: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    actionsTitle: {
      fontSize: '1.5rem',
      color: '#2d3748',
      margin: '0 0 1.5rem 0',
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    actionButton: {
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#4a5568',
    },
    actionButtonHover: {
      borderColor: '#667eea',
      background: '#f7fafc',
      color: '#667eea',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.2rem',
      color: '#718096',
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>No user data found...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>EDU</div>
          EduHub Kids
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#718096' }}>{user.role}</div>
          </div>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseOver={(e) => Object.assign(e.target.style, { background: '#c82333' })}
            onMouseOut={(e) => Object.assign(e.target.style, { background: '#dc3545' })}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcome}>
          <h1 style={styles.welcomeTitle}>Welcome to Dashboard</h1>
          <p style={styles.welcomeSubtitle}>
            Hello {user.name}! You're logged in as a {user.role}. Here's your overview.
          </p>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>12</div>
            <div style={styles.statLabel}>Active Courses</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>8</div>
            <div style={styles.statLabel}>Completed Lessons</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>Attendance Rate</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>4.8</div>
            <div style={styles.statLabel}>Average Grade</div>
          </div>
        </div>

        <div style={styles.actions}>
          <h2 style={styles.actionsTitle}>Quick Actions</h2>
          <div style={styles.actionButtons}>
            <div
              style={styles.actionButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.actionButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, {})}
            >
              View Courses
            </div>
            <div
              style={styles.actionButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.actionButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, {})}
            >
              View Schedule
            </div>
            <div
              style={styles.actionButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.actionButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, {})}
            >
              View Progress
            </div>
            <div
              style={styles.actionButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.actionButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, {})}
            >
              Messages
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SimpleDashboard;
