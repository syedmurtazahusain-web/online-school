import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Home, BookOpen, Calendar, Users, GraduationCap, Video, User, MessageSquare, BarChart2, Settings, LogOut, ChevronDown, X } from 'lucide-react';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName') || 'User';
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={18} />, roles: ['admin', 'teacher', 'student'] },
    { path: '/courses', label: 'Courses', icon: <BookOpen size={18} />, roles: ['admin', 'teacher', 'student'] },
    { path: '/schedule', label: 'Schedule', icon: <Calendar size={18} />, roles: ['admin', 'teacher', 'student'] },
    { path: '/students', label: 'Students', icon: <GraduationCap size={18} />, roles: ['admin'] },
    { path: '/teachers', label: 'Teachers', icon: <Users size={18} />, roles: ['admin'] },
    { path: '/videos', label: 'Videos', icon: <Video size={18} />, roles: ['admin', 'teacher'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role || ''));

  const profileOptions = [
    { label: 'My Profile', path: '/profile', icon: <User size={16} /> },
    { label: 'Messages', path: '/messages', icon: <MessageSquare size={16} /> },
    { label: 'Progress', path: '/progress', icon: <BarChart2 size={16} /> },
    { label: 'Settings', path: '/dashboard', icon: <Settings size={16} /> },
  ];

  const mockNotifications = [
    { id: 1, title: 'New Course Available', message: 'Web Development Fundamentals is now available', time: '5 minutes ago', unread: true },
    { id: 2, title: 'Schedule Updated', message: 'Monday class schedule has been updated', time: '1 hour ago', unread: true },
    { id: 3, title: 'Welcome!', message: 'Welcome to EduHub Kids! Explore your courses.', time: '2 hours ago', unread: false },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo">
          <div className="logo-icon">EDU</div>
          <span className="logo-text">EduHub Kids</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {filteredNavItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span className="nav-link-text">
                {item.icon}
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="nav-user">
          {/* Notifications Bell */}
          <div className="notification-wrapper" style={{ position: 'relative' }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="user-btn notification-btn" 
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {mockNotifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">
                  {mockNotifications.filter(n => n.unread).length}
                </span>
              )}
            </motion.button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="notifications-dropdown"
                >
                <div className="notifications-header">
                  <span>Notifications</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {mockNotifications.filter(n => n.unread).length} new
                  </span>
                </div>
                {mockNotifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No notifications yet
                  </div>
                ) : (
                  mockNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="notification-content">
                        <div className="notification-text">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="notifications-footer">
                  <span style={{ cursor: 'pointer', color: 'var(--primary-500)' }} onClick={() => setShowNotifications(false)}>
                    Close
                  </span>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
          
          {/* User Profile Dropdown */}
          <div className="profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
            <button 
              className="user-profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="User profile"
            >
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">{userName}</div>
                <div className="user-role">{role?.charAt(0).toUpperCase() + role?.slice(1)}</div>
              </div>
              <ChevronDown size={14} className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} />
            </button>

            {showProfileDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="profile-dropdown"
              >
                <div className="profile-header">
                  <div className="user-avatar-large">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="profile-name">{userName}</div>
                    <div className="profile-role">{role?.charAt(0).toUpperCase() + role?.slice(1)}</div>
                  </div>
                </div>
                <div className="profile-divider"></div>
                {profileOptions.map((option, index) => (
                  <button
                    key={index}
                    className="profile-option"
                    onClick={() => {
                      navigate(option.path);
                      setShowProfileDropdown(false);
                    }}
                  >
                    <span className="profile-option-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
                <div className="profile-divider"></div>
                <button className="profile-option logout" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;