import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Add Application', path: '/add', icon: '➕' },
];

const COMPANY_COLORS = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #2563eb, #60a5fa)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #d97706, #fbbf24)',
  'linear-gradient(135deg, #dc2626, #f87171)',
  'linear-gradient(135deg, #db2777, #f472b6)',
  'linear-gradient(135deg, #0891b2, #67e8f9)',
];

export const getAvatarGradient = (name) => {
  if (!name) return COMPANY_COLORS[0];
  const idx = name.charCodeAt(0) % COMPANY_COLORS.length;
  return COMPANY_COLORS[idx];
};

function Sidebar() {
  const location = useLocation();

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'fixed', top: 0, left: 0,
      height: '100vh', display: 'flex',
      flexDirection: 'column', padding: '0',
      zIndex: 1000
    }}>

      {/* Profile Section */}
      <div style={{
        padding: '28px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow behind avatar */}
        <div style={{
          position: 'absolute', top: '-20px', left: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Avatar */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: '700', fontSize: '1.2rem',
          marginBottom: '12px', position: 'relative',
          boxShadow: '0 0 20px rgba(124,58,237,0.5)'
        }}>
          AB
          <div style={{
            position: 'absolute', bottom: '2px', right: '2px',
            width: '10px', height: '10px', borderRadius: '50%',
            backgroundColor: '#34d399', border: '2px solid #060612'
          }} />
        </div>

        <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 2px' }}>
          Akshatha Boini
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '0 0 10px' }}>
          Job Hunt in Progress 🎯
        </p>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem'
          }}>🎯</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.08em' }}>
            JOBSYNC
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 16px', flex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0 8px', marginBottom: '8px' }}>
          NAVIGATION
        </p>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', borderRadius: '10px', marginBottom: '4px',
            background: location.pathname === item.path
              ? 'rgba(124,58,237,0.2)'
              : 'transparent',
            color: location.pathname === item.path ? '#a855f7' : 'rgba(255,255,255,0.4)',
            fontSize: '0.88rem', fontWeight: '500',
            border: location.pathname === item.path
              ? '1px solid rgba(124,58,237,0.3)'
              : '1px solid transparent',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '10px', padding: '12px'
        }}>
          <p style={{ color: '#a855f7', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
            💡 Pro Tip
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', lineHeight: 1.5 }}>
            Aim for 70%+ match score before applying!
          </p>
        </div>
      </div>
    </aside>
  );
}

export { COMPANY_COLORS };
export default Sidebar;