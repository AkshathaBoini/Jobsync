import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvatarGradient } from '../components/Sidebar';

const STATUS_COLORS = {
  Applied: { bg: 'rgba(124,58,237,0.15)', text: '#a855f7', border: 'rgba(124,58,237,0.3)' },
  Interview: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Offer: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
  Rejected: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' }
};

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchApp(); }, []);

  const fetchApp = async () => {
    const res = await axios.get(`http://localhost:8080/api/applications/${id}`);
    setApp(res.data);
    setNotes(res.data.notes || '');
  };

  const updateStatus = async (status) => {
    await axios.patch(`http://localhost:8080/api/applications/${id}/status`, { status });
    fetchApp();
  };

  const saveNotes = async () => {
    setSaving(true);
    await axios.patch(`http://localhost:8080/api/applications/${id}/notes`, { notes });
    setSaving(false);
  };

  if (!app) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
      </div>
    </div>
  );

  const glassCard = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '18px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div>
      {/* Back */}
      <button onClick={() => navigate('/')} style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem',
        marginBottom: '24px', display: 'flex',
        alignItems: 'center', gap: '6px', transition: 'color 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
      >
        ← Back to Dashboard
      </button>

      {/* Header Card */}
      <div style={{
        ...glassCard,
        borderColor: 'rgba(124,58,237,0.2)',
        marginBottom: '18px'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-20px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '58px', height: '58px', borderRadius: '16px',
              background: getAvatarGradient(app.companyName),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '1.5rem',
              flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}>
              {app.companyName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700' }}>
                {app.jobTitle}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: '5px', fontSize: '0.88rem' }}>
                {app.companyName} • Applied {app.appliedDate}
              </p>
              <span style={{
                display: 'inline-block', marginTop: '10px',
                background: STATUS_COLORS[app.status]?.bg,
                color: STATUS_COLORS[app.status]?.text,
                border: `1px solid ${STATUS_COLORS[app.status]?.border}`,
                padding: '4px 14px', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: '600'
              }}>
                {app.status}
              </span>
            </div>
          </div>

          {app.matchScore > 0 && (
            <div style={{
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '14px', padding: '18px 28px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#34d399', fontSize: '2.4rem',
                fontWeight: '700', lineHeight: 1
              }}>
                {app.matchScore}%
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '5px' }}>
                Match Score
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update */}
      <div style={glassCard}>
        <p style={{
          color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem',
          fontWeight: '600', marginBottom: '14px',
          textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          Update Status
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
            <button key={status} onClick={() => updateStatus(status)} style={{
              background: app.status === status ? STATUS_COLORS[status].bg : 'transparent',
              color: app.status === status ? STATUS_COLORS[status].text : 'rgba(255,255,255,0.3)',
              border: `1px solid ${app.status === status ? STATUS_COLORS[status].border : 'rgba(255,255,255,0.08)'}`,
              padding: '8px 22px', borderRadius: '10px',
              fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s'
            }}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      {app.aiSuggestions && (
        <div style={glassCard}>
          <p style={{
            color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem',
            fontWeight: '600', marginBottom: '18px',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            🤖 AI Analysis
          </p>
          <div style={{ display: 'grid', gap: '14px' }}>

            {app.missingKeywords && (
              <div style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '12px', padding: '16px'
              }}>
                <p style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                  ⚠️ Missing Keywords
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {app.missingKeywords}
                </p>
              </div>
            )}

            <div style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: '12px', padding: '16px'
            }}>
              <p style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                💡 Suggestions
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {app.aiSuggestions}
              </p>
            </div>

            {app.interviewQuestions && (
              <div style={{
                background: 'rgba(52,211,153,0.06)',
                border: '1px solid rgba(52,211,153,0.15)',
                borderRadius: '12px', padding: '16px'
              }}>
                <p style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                  🎯 Likely Interview Questions
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {app.interviewQuestions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={glassCard}>
        <p style={{
          color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem',
          fontWeight: '600', marginBottom: '14px',
          textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          📝 Notes
        </p>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
          placeholder="Recruiter name, salary discussed, interview feedback..."
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '12px 14px',
            color: '#e2e8f0', fontSize: '0.88rem',
            outline: 'none', resize: 'vertical', marginBottom: '12px',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        <button onClick={saveNotes} disabled={saving} style={{
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: '#fff', border: 'none',
          padding: '9px 24px', borderRadius: '10px',
          fontSize: '0.85rem', fontWeight: '600',
          boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
          transition: 'all 0.2s'
        }}>
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetail;