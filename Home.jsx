import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [notifications] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    school: '',
    experience: ''
  });

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    if (token && role && userId) {
      setIsLoggedIn(true);
      setUser({
        token,
        role,
        userId,
        email: localStorage.getItem('userEmail') || '',
        name: localStorage.getItem('userName') || role.charAt(0).toUpperCase() + role.slice(1)
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
        
        setUser({
          token: data.token,
          role: data.role,
          userId: data.userId,
          email: email,
          name: data.role === 'student' ? 'Student' : data.role === 'teacher' ? 'Teacher' : 'Administrator'
        });
        setIsLoggedIn(true);
        setShowLoginModal(false);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          grade: registerData.grade,
          school: registerData.school,
          experience: registerData.experience
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
        
        setUser({
          token: data.token,
          role: data.role,
          userId: data.userId,
          email: registerData.email,
          name: data.role === 'student' ? 'Student' : data.role === 'teacher' ? 'Teacher' : 'Administrator'
        });
        setIsLoggedIn(true);
        setShowLoginModal(false);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUser(null);
    setEmail('');
    setPassword('');
    navigate('/');
  };

  // Professional Dashboard Component
  const Dashboard = () => {
    return (
      <div className="dashboard-container">
        <style>{`
          .dashboard-container {
            min-height: 100vh;
            background: var(--bg-secondary);
            font-family: var(--font-family-sans);
          }
          
          .dashboard-header {
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-light);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--shadow-sm);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          
          .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--gradient-primary);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: var(--shadow-primary);
          }
          
          .user-section {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }
          
          .notification-bell {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--bg-tertiary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          
          .notification-bell:hover {
            background: var(--neutral-200);
          }
          
          .notification-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 18px;
            height: 18px;
            background: var(--error-500);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 600;
          }
          
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
          }
          
          .user-info {
            text-align: right;
          }
          
          .user-name {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.9rem;
          }
          
          .user-role {
            color: var(--text-secondary);
            font-size: 0.8rem;
          }
          
          .logout-btn {
            padding: 0.5rem 1rem;
            background: var(--bg-tertiary);
            border: none;
            border-radius: var(--radius-lg);
            color: var(--text-secondary);
            cursor: pointer;
            font-weight: 500;
            transition: all var(--transition-fast);
          }
          
          .logout-btn:hover {
            background: var(--error-100);
            color: var(--error-600);
          }
          
          .dashboard-content {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .dashboard-header-content {
            margin-bottom: 2rem;
          }
          
          .dashboard-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
          }
          
          .dashboard-subtitle {
            color: var(--text-secondary);
            margin: 0 0 1.5rem 0;
          }
          
          .time-range-selector {
            display: flex;
            gap: 0.5rem;
            background: var(--bg-primary);
            padding: 0.25rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-light);
            width: fit-content;
          }
          
          .time-range-btn {
            padding: 0.5rem 1rem;
            border: none;
            background: transparent;
            border-radius: var(--radius-lg);
            color: var(--text-secondary);
            cursor: pointer;
            font-weight: 500;
            transition: all var(--transition-fast);
          }
          
          .time-range-btn.active {
            background: var(--primary-500);
            color: white;
            box-shadow: var(--shadow-primary);
          }
          
          .time-range-btn:hover:not(.active) {
            background: var(--bg-tertiary);
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .metric-card {
            background: var(--bg-primary);
            padding: 1.25rem;
            border-radius: 1rem;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            transition: all var(--transition-base);
            animation: fadeInUp 0.5s ease-out;
          }
          
          .metric-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 24px -4px rgba(0,0,0,0.1);
          }
          
          .metric-card .glossy-border {
            position: absolute;
            inset: 0;
            border-radius: 1rem;
            padding: 2px;
            opacity: 0.5;
            transition: opacity 0.2s;
            pointer-events: none;
          }
          
          .metric-card:hover .glossy-border {
            opacity: 1;
          }
          
          .metric-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }
          
          .metric-title {
            color: var(--text-secondary);
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .metric-icon {
            width: 40px;
            height: 40px;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            flex-shrink: 0;
          }
          
          .metric-value {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text-primary);
            margin: 0 0 0.25rem 0;
            line-height: 1;
          }
          
          .metric-change {
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .metric-change.positive {
            color: var(--success-600);
          }
          
          .metric-change.negative {
            color: var(--error-600);
          }
          
          .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .action-card {
            background: var(--bg-primary);
            padding: 1.25rem;
            border-radius: 1rem;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all var(--transition-base);
            animation: fadeInUp 0.5s ease-out;
            position: relative;
            overflow: hidden;
          }
          
          .action-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 24px -4px rgba(0,0,0,0.1);
          }
          
          .action-card .glossy-border {
            position: absolute;
            inset: 0;
            border-radius: 1rem;
            padding: 2px;
            opacity: 0.5;
            transition: opacity 0.2s;
            pointer-events: none;
          }
          
          .action-card:hover .glossy-border {
            opacity: 1;
          }
          
          .action-icon {
            width: 56px;
            height: 56px;
            border-radius: var(--radius-xl);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            margin-bottom: 1rem;
          }
          
          .action-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
          }
          
          .action-description {
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.5;
          }
          
          .recent-activity {
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-light);
            overflow: hidden;
            animation: fadeInUp 0.5s ease-out;
          }
          
          .activity-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-light);
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .activity-item {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--bg-tertiary);
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: background var(--transition-fast);
          }
          
          .activity-item:hover {
            background: var(--bg-tertiary);
          }
          
          .activity-item:last-child {
            border-bottom: none;
          }
          
          .activity-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          
          .activity-content {
            flex: 1;
          }
          
          .activity-title {
            font-weight: 500;
            color: var(--text-primary);
            font-size: 0.9rem;
            margin: 0 0 0.25rem 0;
          }
          
          .activity-time {
            color: var(--text-tertiary);
            font-size: 0.8rem;
          }
        `}</style>

        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">EDU</div>
              EduHub Kids
            </div>
          </div>
          <div className="user-section">
            <div className="notification-bell">
              <span>🔔</span>
              {notifications > 0 && (
                <div className="notification-badge">{notifications}</div>
              )}
            </div>
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Header Section */}
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">
              Hey {user.name}, ready to learn? Here's your overview for this week.
            </p>
            <div className="time-range-selector">
              <button 
                className={`time-range-btn ${selectedTimeRange === 'day' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('day')}
              >
                Today
              </button>
              <button 
                className={`time-range-btn ${selectedTimeRange === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('week')}
              >
                This Week
              </button>
              <button 
                className={`time-range-btn ${selectedTimeRange === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('month')}
              >
                This Month
              </button>
              <button 
                className={`time-range-btn ${selectedTimeRange === 'year' ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange('year')}
              >
                This Year
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card" style={{boxShadow: 'inset 0 0 0 2px rgba(59,130,246,0.15), 0 4px 12px -2px rgba(59,130,246,0.08)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="metric-header">
                <div className="metric-icon" style={{background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#3b82f6'}}>📚</div>
                <div className="metric-title">Active Courses</div>
              </div>
              <div className="metric-value">12</div>
              <div className="metric-change positive">
                <span>↑</span> +2 from last week
              </div>
            </div>
            
            <div className="metric-card" style={{boxShadow: 'inset 0 0 0 2px rgba(16,185,129,0.15), 0 4px 12px -2px rgba(16,185,129,0.08)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="metric-header">
                <div className="metric-icon" style={{background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#10b981'}}>✅</div>
                <div className="metric-title">Completed</div>
              </div>
              <div className="metric-value">8</div>
              <div className="metric-change positive">
                <span>↑</span> +3 from last week
              </div>
            </div>
            
            <div className="metric-card" style={{boxShadow: 'inset 0 0 0 2px rgba(245,158,11,0.15), 0 4px 12px -2px rgba(245,158,11,0.08)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="metric-header">
                <div className="metric-icon" style={{background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', color: '#f59e0b'}}>📅</div>
                <div className="metric-title">Attendance</div>
              </div>
              <div className="metric-value">95%</div>
              <div className="metric-change positive">
                <span>↑</span> +5% from last week
              </div>
            </div>
            
            <div className="metric-card" style={{boxShadow: 'inset 0 0 0 2px rgba(139,92,246,0.15), 0 4px 12px -2px rgba(139,92,246,0.08)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="metric-header">
                <div className="metric-icon" style={{background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', color: '#8b5cf6'}}>⭐</div>
                <div className="metric-title">Avg Grade</div>
              </div>
              <div className="metric-value">4.8</div>
              <div className="metric-change negative">
                <span>↓</span> -0.2 from last week
              </div>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="actions-grid">
            <div className="action-card" style={{boxShadow: 'inset 0 0 0 2px rgba(59,130,246,0.12), 0 4px 12px -2px rgba(59,130,246,0.06)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="action-icon" style={{background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#3b82f6'}}>📖</div>
              <h3 className="action-title">Browse Courses</h3>
              <p className="action-description">
                Explore our comprehensive catalog of courses and find new learning opportunities.
              </p>
            </div>
            
            <div className="action-card" style={{boxShadow: 'inset 0 0 0 2px rgba(16,185,129,0.12), 0 4px 12px -2px rgba(16,185,129,0.06)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="action-icon" style={{background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#10b981'}}>📅</div>
              <h3 className="action-title">View Schedule</h3>
              <p className="action-description">
                Check your upcoming classes and manage your learning schedule efficiently.
              </p>
            </div>
            
            <div className="action-card" style={{boxShadow: 'inset 0 0 0 2px rgba(245,158,11,0.12), 0 4px 12px -2px rgba(245,158,11,0.06)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="action-icon" style={{background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', color: '#f59e0b'}}>📈</div>
              <h3 className="action-title">Track Progress</h3>
              <p className="action-description">
                Monitor your learning progress and see how you're improving over time.
              </p>
            </div>
            
            <div className="action-card" style={{boxShadow: 'inset 0 0 0 2px rgba(139,92,246,0.12), 0 4px 12px -2px rgba(139,92,246,0.06)'}}>
              <div className="glossy-border" style={{background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
              <div className="action-icon" style={{background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', color: '#8b5cf6'}}>💬</div>
              <h3 className="action-title">Messages</h3>
              <p className="action-description">
                Stay connected with teachers and classmates through our messaging system.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="activity-header">Recent Activity</div>
            
            <div className="activity-item">
              <div className="activity-dot" style={{background: 'var(--success-500)'}}></div>
              <div className="activity-content">
                <div className="activity-title">Completed Mathematics Lesson 5</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-dot" style={{background: 'var(--primary-500)'}}></div>
              <div className="activity-content">
                <div className="activity-title">Enrolled in Science Course</div>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-dot" style={{background: 'var(--warning-500)'}}></div>
              <div className="activity-content">
                <div className="activity-title">Submitted English Assignment</div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-dot" style={{background: 'var(--error-500)'}}></div>
              <div className="activity-content">
                <div className="activity-title">Missed History Class</div>
                <div className="activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If logged in, redirect to dashboard
  if (isLoggedIn && user) {
    return <Dashboard />;
  }

  // Professional Home Page Styles
  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: 'var(--font-family-sans)',
      background: 'var(--bg-primary)',
    },
    header: {
      background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-light)' : 'none',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all var(--transition-base)',
    },
    nav: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.8rem',
      fontWeight: '700',
      color: scrolled ? 'var(--text-primary)' : 'var(--text-primary)',
      textDecoration: 'none',
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      background: 'var(--gradient-primary)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      fontSize: '20px',
      color: 'white',
      fontWeight: '700',
      boxShadow: 'var(--shadow-primary)',
    },
    navButtons: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    navButton: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all var(--transition-base)',
      minWidth: '120px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButton: {
      backgroundColor: 'transparent',
      color: 'var(--primary-600)',
      border: '2px solid var(--primary-500)',
    },
    registerButton: {
      background: 'var(--gradient-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-primary)',
    },
    hero: {
      padding: '6rem 2rem 4rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0e6ff 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2,
    },
    heroTitle: {
      fontSize: '3.5rem',
      margin: '0 0 1.5rem 0',
      fontWeight: '800',
      lineHeight: '1.1',
      color: 'var(--text-primary)',
      animation: 'fadeInUp 0.8s ease-out',
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      margin: '0 0 2.5rem 0',
      color: 'var(--text-secondary)',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6',
      animation: 'fadeInUp 0.8s ease-out 0.2s',
      animationFillMode: 'both',
    },
    heroButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      animation: 'fadeInUp 0.8s ease-out 0.4s',
      animationFillMode: 'both',
    },
    heroButton: {
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: 'var(--radius-xl)',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all var(--transition-base)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      minWidth: '180px',
      height: '56px',
      boxShadow: 'var(--shadow-md)',
    },
    primaryButton: {
      background: 'var(--gradient-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-primary)',
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: 'var(--primary-600)',
      border: '2px solid var(--primary-500)',
    },
    features: {
      padding: '5rem 2rem',
      background: 'white',
    },
    featuresContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
    },
    feature: {
      textAlign: 'center',
      padding: '2.5rem 2rem',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border-light)',
      transition: 'all var(--transition-base)',
      background: 'white',
    },
    featureHover: {
      border: 'none',
      boxShadow: 'var(--shadow-xl)',
      transform: 'translateY(-8px)',
    },
    featureIcon: {
      width: '80px',
      height: '80px',
      background: 'var(--gradient-primary)',
      borderRadius: 'var(--radius-2xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      fontSize: '2rem',
      color: 'white',
      boxShadow: 'var(--shadow-primary)',
    },
    featureTitle: {
      fontSize: '1.5rem',
      color: 'var(--text-primary)',
      margin: '0 0 1rem 0',
      fontWeight: '700',
    },
    featureDescription: {
      color: 'var(--text-secondary)',
      lineHeight: '1.6',
      fontSize: '1rem',
    },
    stats: {
      padding: '4rem 2rem',
      background: 'var(--bg-secondary)',
    },
    statsContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
    },
    stat: {
      textAlign: 'center',
      padding: '2rem',
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: '800',
      background: 'var(--gradient-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 0.5rem 0',
    },
    statLabel: {
      color: 'var(--text-secondary)',
      fontSize: '1rem',
      fontWeight: '500',
      margin: 0,
    },
    cta: {
      padding: '5rem 2rem',
      background: 'var(--gradient-primary)',
      textAlign: 'center',
      color: 'white',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      margin: '0 0 1rem 0',
      color: 'white',
    },
    ctaSubtitle: {
      fontSize: '1.25rem',
      margin: '0 0 2rem 0',
      opacity: 0.9,
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    ctaButton: {
      padding: '1rem 3rem',
      background: 'white',
      color: 'var(--primary-600)',
      border: 'none',
      borderRadius: 'var(--radius-xl)',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all var(--transition-base)',
      boxShadow: 'var(--shadow-lg)',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
      animation: 'fadeIn 0.3s ease-out',
    },
    modalCard: {
      background: 'white',
      padding: '2.5rem',
      borderRadius: 'var(--radius-2xl)',
      width: '100%',
      maxWidth: '480px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: 'var(--shadow-2xl)',
      position: 'relative',
      animation: 'scaleIn 0.3s ease-out',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    modalTitle: {
      fontSize: '1.75rem',
      color: 'var(--text-primary)',
      margin: 0,
      fontWeight: '700',
    },
    closeButton: {
      background: 'var(--bg-tertiary)',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--transition-fast)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: 'var(--text-primary)',
      fontWeight: '600',
      fontSize: '0.875rem',
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '2px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      fontSize: '1rem',
      boxSizing: 'border-box',
      transition: 'all var(--transition-fast)',
      backgroundColor: 'white',
      height: '52px',
    },
    select: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '2px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      fontSize: '1rem',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      transition: 'all var(--transition-fast)',
      height: '52px',
    },
    button: {
      width: '100%',
      padding: '1rem',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all var(--transition-base)',
      fontWeight: '600',
      height: '52px',
      boxShadow: 'var(--shadow-md)',
    },
    submitButton: {
      background: 'var(--gradient-primary)',
      color: 'white',
      marginBottom: '1rem',
      boxShadow: 'var(--shadow-primary)',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: 'var(--primary-600)',
      cursor: 'pointer',
      textDecoration: 'underline',
      width: '100%',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: '500',
      padding: '0.5rem',
    },
    errorBox: {
      background: 'var(--error-50)',
      color: 'var(--error-600)',
      padding: '1rem',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '1.5rem',
      fontSize: '0.9rem',
      border: '1px solid var(--error-200)',
      fontWeight: '500',
    },
    floatingShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    shape: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.1,
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Header Navigation */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>EDU</div>
            EduHub Kids
          </div>
          <div style={styles.navButtons}>
            <button 
              style={{...styles.navButton, ...styles.loginButton}}
              onClick={() => setShowLoginModal(true)}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-50)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
            <button 
              style={{...styles.navButton, ...styles.registerButton}}
              onClick={() => {
                setIsRegistering(true);
                setShowLoginModal(true);
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-primary)';
              }}
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.floatingShapes}>
          <div style={{...styles.shape, width: '300px', height: '300px', background: 'var(--primary-300)', top: '10%', left: '5%', animation: 'float 6s ease-in-out infinite'}}></div>
          <div style={{...styles.shape, width: '200px', height: '200px', background: 'var(--secondary-300)', top: '60%', right: '10%', animation: 'float 8s ease-in-out infinite 1s'}}></div>
          <div style={{...styles.shape, width: '150px', height: '150px', background: 'var(--success-300)', bottom: '20%', left: '15%', animation: 'float 7s ease-in-out infinite 2s'}}></div>
        </div>
        
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Transform Your Learning Journey</h1>
          <p style={styles.heroSubtitle}>
            Experience world-class education with our innovative online platform. 
            Quality Pakistani curriculum, expert teachers, and interactive learning designed for your success.
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={{...styles.heroButton, ...styles.primaryButton}}
              onClick={() => setShowLoginModal(true)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              🚀 Start Learning
            </button>
            <button 
              style={{...styles.heroButton, ...styles.secondaryButton}}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-500)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = 'var(--primary-600)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📖 Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContent}>
          <div 
            style={styles.feature}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.featureHover)}
            onMouseLeave={(e) => {
              e.target.style.border = '1px solid var(--border-light)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.featureIcon}>📚</div>
            <h3 style={styles.featureTitle}>Comprehensive Curriculum</h3>
            <p style={styles.featureDescription}>
              Access complete Pakistani educational standards from Pre-Classes to Matric with carefully structured learning paths.
            </p>
          </div>
          
          <div 
            style={styles.feature}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.featureHover)}
            onMouseLeave={(e) => {
              e.target.style.border = '1px solid var(--border-light)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.featureIcon}>💻</div>
            <h3 style={styles.featureTitle}>Interactive Learning</h3>
            <p style={styles.featureDescription}>
              Engage with modern digital tools, real-time assessments, and personalized learning experiences tailored to your needs.
            </p>
          </div>
          
          <div 
            style={styles.feature}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.featureHover)}
            onMouseLeave={(e) => {
              e.target.style.border = '1px solid var(--border-light)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.featureIcon}>⭐</div>
            <h3 style={styles.featureTitle}>Expert Faculty</h3>
            <p style={styles.featureDescription}>
              Learn from experienced educators dedicated to providing quality education and personalized attention to every student.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsContent}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>10K+</div>
            <p style={styles.statLabel}>Active Students</p>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>500+</div>
            <p style={styles.statLabel}>Expert Teachers</p>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>200+</div>
            <p style={styles.statLabel}>Courses</p>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>95%</div>
            <p style={styles.statLabel}>Success Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Start Learning?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of students already learning with EduHub Kids. Get started today and transform your future.
        </p>
        <button 
          style={styles.ctaButton}
          onClick={() => {
            setIsRegistering(true);
            setShowLoginModal(true);
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = 'var(--shadow-2xl)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          Get Started Free
        </button>
      </section>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div style={styles.modal} onClick={() => setShowLoginModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowLoginModal(false)}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--error-100)';
                  e.target.style.color = 'var(--error-600)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-tertiary)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            {!isRegistering ? (
              <form onSubmit={handleLogin}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your email"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your password"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{...styles.button, ...styles.submitButton}}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = 'var(--shadow-xl)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'var(--shadow-primary)';
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                    style={styles.input}
                    placeholder="Enter your full name"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                    style={styles.input}
                    placeholder="Enter your email"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    style={styles.select}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {registerData.role === 'student' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Grade</label>
                    <input
                      type="text"
                      value={registerData.grade}
                      onChange={(e) => setRegisterData({...registerData, grade: e.target.value})}
                      style={styles.input}
                      placeholder="Enter your grade"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-500)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}

                {registerData.role === 'teacher' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Experience</label>
                      <input
                        type="text"
                        value={registerData.experience}
                        onChange={(e) => setRegisterData({...registerData, experience: e.target.value})}
                        style={styles.input}
                        placeholder="Years of teaching experience"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary-500)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Department</label>
                      <input
                        type="text"
                        value={registerData.school}
                        onChange={(e) => setRegisterData({...registerData, school: e.target.value})}
                        style={styles.input}
                        placeholder="Your department"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary-500)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                    style={styles.input}
                    placeholder="Create a password"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                    style={styles.input}
                    placeholder="Confirm your password"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{...styles.button, ...styles.submitButton}}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = 'var(--shadow-xl)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'var(--shadow-primary)';
                  }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              style={styles.toggleButton}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--secondary-600)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--primary-600)';
              }}
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;