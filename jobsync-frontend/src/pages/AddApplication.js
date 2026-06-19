import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddApplication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    status: 'Applied',
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please upload a PDF file only');
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.jobTitle || !form.jobDescription || !resumeFile) {
      alert('Please fill in Company, Job Title, Job Description and upload your Resume PDF');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(form));
      formData.append('resume', resumeFile);

      await axios.post('http://localhost:8080/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      alert('Error saving application');
    } finally {
      setLoading(false);
    }
  };

  const glassInput = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '11px 14px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '20px',
    transition: 'border-color 0.2s, background 0.2s',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.8rem',
    marginBottom: '6px',
    display: 'block',
    fontWeight: '500',
    letterSpacing: '0.03em'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(124,58,237,0.6)';
    e.target.style.background = 'rgba(124,58,237,0.06)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
    e.target.style.background = 'rgba(255,255,255,0.04)';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginBottom: '6px' }}>
          New Entry
        </p>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.8rem', fontWeight: '700' }}>
          Add Application
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', marginTop: '6px' }}>
          Paste the JD + upload your resume PDF — AI analyzes the match instantly ✨
        </p>
      </div>

      {/* Main Card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '36px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input name="companyName" value={form.companyName} onChange={handleChange}
              placeholder="e.g. Google" style={glassInput}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
              placeholder="e.g. Software Engineer" style={glassInput}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              style={{ ...glassInput, cursor: 'pointer' }}>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Applied Date</label>
            <input type="date" name="appliedDate" value={form.appliedDate}
              onChange={handleChange} style={glassInput}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>

        {/* Divider with AI label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          margin: '8px 0 24px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '20px', padding: '5px 16px'
          }}>
            <p style={{ color: '#a855f7', fontSize: '0.78rem', fontWeight: '600' }}>
              🤖 AI Match Analysis
            </p>
          </div>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <label style={labelStyle}>Job Description * <span style={{ color: 'rgba(255,255,255,0.2)' }}>(paste full JD)</span></label>
        <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange}
          placeholder="Paste the full job description here..." rows={7}
          style={{ ...glassInput, resize: 'vertical' }}
          onFocus={handleFocus} onBlur={handleBlur} />

        {/* PDF Upload */}
        <label style={labelStyle}>Your Resume * <span style={{ color: 'rgba(255,255,255,0.2)' }}>(upload PDF)</span></label>
        <div style={{
          border: '2px dashed rgba(124,58,237,0.3)',
          borderRadius: '10px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px',
          background: resumeFile ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative'
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer'
            }}
          />
          {resumeFile ? (
            <div>
              <p style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✅</p>
              <p style={{ color: '#a855f7', fontWeight: '600', fontSize: '0.9rem' }}>
                {resumeFile.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '4px' }}>
                Click to change file
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '500' }}>
                Click to upload your resume PDF
              </p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '4px' }}>
                Only PDF files accepted
              </p>
            </div>
          )}
        </div>

        <label style={labelStyle}>Notes <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span></label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          placeholder="Recruiter name, salary range, referral..." rows={3}
          style={{ ...glassInput, resize: 'vertical' }}
          onFocus={handleFocus} onBlur={handleBlur} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={handleSubmit} disabled={loading} style={{
            background: loading
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
            border: '1px solid rgba(124,58,237,0.4)',
            padding: '12px 32px', borderRadius: '10px',
            fontSize: '0.92rem', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
            transition: 'all 0.2s'
          }}>
            {loading ? '⏳ Analyzing with AI...' : '🚀 Save & Analyze'}
          </button>
          <button onClick={() => navigate('/')} style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 28px', borderRadius: '10px',
            fontSize: '0.92rem', transition: 'all 0.2s',
            cursor: 'pointer'
          }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddApplication;