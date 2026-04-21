import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // STRICT ROLE GUARD
  const currentRole = localStorage.getItem("role");
  if (currentRole && currentRole !== "admin") {
    window.location.href = `/dashboard/${currentRole}`;
    return null;
  }

  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: '💰', color: 'var(--success-500)' },
    { label: 'Active Users', value: '1,240', icon: '👤', color: 'var(--primary-500)' },
    { label: 'New Enrollments', value: '45', icon: '📈', color: 'var(--secondary-500)' },
    { label: 'System Health', value: '99.9%', icon: '🛡️', color: 'var(--warning-500)' },
  ];

  const quickActions = [
    { name: 'Approve Teachers', icon: '✅', path: '/teachers', color: '#6366f1' },
    { name: 'System Settings', icon: '⚙️', path: '/settings', color: '#ec4899' },
    { name: 'Backup Database', icon: '💾', path: '/backup', color: '#8b5cf6' },
    { name: 'Broadcast Message', icon: '📢', path: '/messages', color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2)' }}>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-10)'
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="hover-lift"
            style={{
              background: '#ffffff',
              padding: 'var(--space-8) var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              borderLeft: `5px solid ${stat.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)'
            }}
          >
            <div style={{ fontSize: 'var(--text-4xl)', padding: 'var(--space-2)' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '900', color: '#111827' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', marginBottom: 'var(--space-6)' }}>🚀 Management Console</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--space-4)'
      }}>
        {quickActions.map((action, i) => (
          <motion.div
            key={action.name}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'white',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              border: `2px solid ${action.color}22`,
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s ease'
            }}
            className="hover-lift"
          >
            <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>{action.icon}</div>
            <div style={{ fontWeight: '800', fontSize: 'var(--text-sm)', color: action.color }}>{action.name}</div>
          </motion.div>
        ))}
      </div>

      {/* Insights & System Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
        <div style={{ padding: 'var(--space-8)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-2xl)' }}>
          <h3 style={{ fontWeight: '800', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🚀 Live Activity Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {['New teacher "Sarah Smith" pending approval', 'System backup completed at 04:00 AM', 'Server load optimized (1.2ms latency)'].map((text, i) => (
              <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', borderLeft: '3px solid var(--primary-500)' }}>
                • {text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 'var(--space-8)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--bg-secondary)' }}>
          <h3 style={{ fontWeight: '800', marginBottom: 'var(--space-4)' }}>🛡️ System Security</h3>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '5px', fontWeight: '700' }}>
              <span>Database Capacity</span>
              <span>82%</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
              <div style={{ width: '82%', height: '100%', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)' }}></div>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            SSL Certificate: <span style={{ color: 'var(--success-500)', fontWeight: 'bold' }}>Active</span><br/>
            Firewall: <span style={{ color: 'var(--success-500)', fontWeight: 'bold' }}>Secure</span>
          </p>
        </div>
      </div>
    </div>
  );
}
