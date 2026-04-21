import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ onLogout }) {
  // Mock user data - in a real app, this would come from an Auth Context
  const [user, setUser] = useState({ name: 'User', role: 'Guest', avatar: '👤' });
  const [role, setRole] = useState(localStorage.getItem('role') || 'student');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Alex Johnson';
    const currentRole = localStorage.getItem('role') || 'student';
    
    setRole(currentRole);
    setUser({ name, role: currentRole.charAt(0).toUpperCase() + currentRole.slice(1), avatar: currentRole === 'teacher' ? '👨‍🏫' : currentRole === 'admin' ? '👨‍💼' : '🎓' });
  }, [role]);

  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMenu = () => {
    const baseMenu = [
      { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
      { name: 'My Schedule', icon: '📅', path: '/schedule' },
    ];

    if (role === 'admin') {
      return [
        ...baseMenu,
        { name: 'Students', icon: '👥', path: '/students' },
        { name: 'Teachers', icon: '👨‍🏫', path: '/teachers' },
        { name: 'Courses', icon: '📚', path: '/courses' },
      ];
    }

    if (role === 'teacher') {
      return [
        ...baseMenu,
        { name: 'My Courses', icon: '📚', path: '/courses' },
        { name: 'Video Library', icon: '🎥', path: '/videos' },
        { name: 'Progress', icon: '📊', path: '/progress' },
      ];
    }

    return [
      ...baseMenu,
      { name: 'Courses', icon: '📚', path: '/courses' },
      { name: 'Videos', icon: '🎥', path: '/videos' },
      { name: 'My Progress', icon: '🌟', path: '/progress' },
    ];
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('courses')) return 'Course Management';
    if (path.includes('schedule')) return 'My Schedule';
    if (path.includes('students')) return 'Student Directory';
    if (path.includes('teachers')) return 'Faculty Management';
    if (path.includes('progress')) return 'Performance Reports';
    return 'Dashboard Overview';
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--overlay-dark)',
            zIndex: 400,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        bottom: isMobile ? 0 : 'auto',
        width: isMobile ? '280px' : (sidebarOpen ? '280px' : '0'),
        background: 'var(--gradient-primary)',
        color: 'white',
        padding: sidebarOpen ? 'var(--space-6)' : '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xl)',
        zIndex: isMobile ? 500 : 'auto',
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'all var(--transition-base)',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', marginBottom: 'var(--space-2)' }}>🎓 EduHub</h2>
            
            {/* User Profile Section */}
            <div className="animate-fade-in" style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: 'var(--space-3)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-4)'
            }}>
              <div style={{ fontSize: '24px' }}>{user.avatar}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: 'var(--text-sm)' }}>{user.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>{user.role}</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1 }}>
          {getMenu().map((item) => (
            <div
              key={item.path}
              className="hover-lift"
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                fontWeight: location.pathname === item.path ? '700' : '500',
                transition: 'all 0.15s ease',
                border: location.pathname === item.path ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
              }}
            >
              <span style={{fontSize: '16px', flexShrink: 0}}>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
          </nav>
        </div>
        <button
          className="hover-scale"
          onClick={handleLogout}
          style={{
            padding: 'var(--space-3)',
            background: 'var(--error-500)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            width: '100%',
            transition: 'all var(--transition-fast)'
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        position: 'relative',
        overflowY: 'auto',
        padding: 'var(--space-6)',
        background: 'var(--bg-primary)'
      }}>
        {/* Top Header Bar - World Class Refinement */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--space-8)',
          paddingRight: '60px' // Space for toggle button
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
              {getPageTitle()}
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
              Hey <span style={{ color: 'var(--primary-600)' }}>{user.name}</span>, ready to learn?
            </p>
          </div>

          {/* Global Search & Notifications */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div className="hover-glow" style={{ 
              background: 'var(--bg-primary)', 
              padding: 'var(--space-2) var(--space-4)',
              border: '2px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>🔍</span>
              <input type="text" placeholder="Search anything..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--text-sm)' }} />
            </div>
            <div style={{ fontSize: '20px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
              🔔
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--error-500)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></span>
            </div>
          </div>
        </div>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 500,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: isMobile || !sidebarOpen ? 'var(--primary-600)' : 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontSize: '20px',
            width: '48px',
            height: '48px',
            transition: 'all var(--transition-fast)'
          }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <Outlet />
      </main>
    </div>
  );
}