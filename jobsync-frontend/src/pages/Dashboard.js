import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAvatarGradient } from '../components/Sidebar';

const STATUS_COLORS = {
  Applied: { bg: 'rgba(124,58,237,0.15)', text: '#a855f7', border: 'rgba(124,58,237,0.3)' },
  Interview: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Offer: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
  Rejected: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' }
};

function getWelcomeMessage(stats) {
  if (!stats.total) return "Let's start your job hunt! Add your first application 🚀";
  if (stats.offer > 0) return `You have ${stats.offer} offer${stats.offer > 1 ? 's' : ''}! Time to celebrate 🎉`;
  if (stats.interview > 0) return `${stats.interview} interview${stats.interview > 1 ? 's' : ''} lined up — you're crushing it! 💪`;
  if (stats.total >= 10) return `${stats.total} applications sent — great hustle, keep going! 🔥`;
  return `${stats.total} application${stats.total > 1 ? 's' : ''} tracked — keep pushing! 💼`;
}

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/applications'),
        axios.get('http://localhost:8080/api/applications/stats')
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this application?')) {
      await axios.delete(`http://localhost:8080/api/applications/${id}`);
      fetchData();
    }
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  const successRate = stats.total > 0 ? Math.round(((stats.offer || 0) / stats.total) * 100) : 0;
  const interviewRate = stats.total > 0 ? Math.round(((stats.interview || 0) / stats.total) * 100) : 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-40px', right: '60px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-30px', right: '200px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', position: 'relative' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '6px' }}>
              Welcome back
            </p>
            <h1 style={{ color: '#e2e8f0', fontSize: '1.7rem', fontWeight: '700', marginBottom: '8px' }}>
              Hey, Akshatha 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              {getWelcomeMessage(stats)}
            </p>
          </div>
          <div style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '14px', padding: '16px 24px', textAlign: 'center'
          }}>
            <p style={{ color: '#a855f7', fontSize: '1.8rem', fontWeight: '700', lineHeight: 1 }}>
              {stats.total || 0}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '4px' }}>
              Total Applications
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px', marginBottom: '24px'
      }}>
        {[
          { label: 'Interviews', value: stats.interview || 0, icon: '🎙️', color: '#fbbf24', glow: 'rgba(245,158,11,0.2)' },
          { label: 'Offers', value: stats.offer || 0, icon: '🏆', color: '#34d399', glow: 'rgba(16,185,129,0.2)' },
          { label: 'Rejected', value: stats.rejected || 0, icon: '❌', color: '#f87171', glow: 'rgba(239,68,68,0.2)' },
          { label: 'Interview Rate', value: `${interviewRate}%`, icon: '📈', color: '#60a5fa', glow: 'rgba(96,165,250,0.2)' },
          { label: 'Offer Rate', value: `${successRate}%`, icon: '⭐', color: '#34d399', glow: 'rgba(16,185,129,0.2)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: '20px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-15px', right: '-15px',
              width: '70px', height: '70px', borderRadius: '50%',
              background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
              pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{stat.icon}</div>
            <p style={{ color: stat.color, fontSize: '1.7rem', fontWeight: '700', lineHeight: 1 }}>{stat.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '5px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Bar */}
      {stats.total > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px 24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: '600' }}>Application Pipeline</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{stats.total} total</p>
          </div>
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '8px', gap: '2px' }}>
            {[
              { key: 'applied', color: '#7c3aed' },
              { key: 'interview', color: '#f59e0b' },
              { key: 'offer', color: '#10b981' },
              { key: 'rejected', color: '#ef4444' }
            ].map(({ key, color }) => (
              (stats[key] || 0) > 0 && (
                <div key={key} style={{
                  width: `${((stats[key] || 0) / stats.total) * 100}%`,
                  backgroundColor: color, borderRadius: '4px'
                }} />
              )
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Applied', color: '#7c3aed', key: 'applied' },
              { label: 'Interview', color: '#f59e0b', key: 'interview' },
              { label: 'Offer', color: '#10b981', key: 'offer' },
              { label: 'Rejected', color: '#ef4444', key: 'rejected' }
            ].map(({ label, color, key }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{label} ({stats[key] || 0})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '10px'
        }}>
          <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.92rem' }}>Applications</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
              <button key={status} onClick={() => setFilter(status)} style={{
                background: filter === status ? 'rgba(124,58,237,0.25)' : 'transparent',
                color: filter === status ? '#a855f7' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${filter === status ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                padding: '5px 14px', borderRadius: '20px',
                fontSize: '0.8rem', fontWeight: '500', transition: 'all 0.2s'
              }}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</p>
            <p style={{ color: '#e2e8f0', marginBottom: '8px', fontWeight: '600' }}>No applications yet</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
              Click "Add Application" in the sidebar to get started!
            </p>
          </div>
        ) : (
          filtered.map((app, i) => (
            <div key={app.id} onClick={() => navigate(`/application/${app.id}`)}
              style={{
                padding: '16px 24px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: getAvatarGradient(app.companyName),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: '1rem',
                  flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  {app.companyName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.92rem' }}>{app.jobTitle}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '2px' }}>
                    {app.companyName} • {app.appliedDate}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {app.matchScore > 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#34d399', fontWeight: '700', fontSize: '0.92rem' }}>{app.matchScore}%</p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem' }}>match</p>
                  </div>
                )}
                <span style={{
                  background: STATUS_COLORS[app.status]?.bg,
                  color: STATUS_COLORS[app.status]?.text,
                  border: `1px solid ${STATUS_COLORS[app.status]?.border}`,
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: '600'
                }}>
                  {app.status}
                </span>
                <button onClick={(e) => handleDelete(app.id, e)} style={{
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.2)', fontSize: '1rem', padding: '4px',
                  borderRadius: '6px', transition: 'color 0.2s'
                }}
                  onMouseEnter={e => e.target.style.color = '#f87171'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}
                >🗑</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;