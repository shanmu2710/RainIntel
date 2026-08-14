import React, { useState, useEffect } from 'react';
import LucideIcon from '../../components/common/LucideIcon';
import Button from '../../components/common/Button';
import { api } from '../../services/api';

export default function Register({ onLogin, onCancel, triggerToast }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.districts.getAll()
      .then(res => setDistricts(res || []))
      .catch(err => {
        // Silent catch for potential offline configurations at render
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Frontend Validations enforcing safe formatting criteria safely
    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !districtId) {
      setError('All fields except password confirmation are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Hardcoding default roles at invocation blocks public escalations natively
      const res = await api.auth.register(username, email, password, fullName, 'FIELD_ENGINEER', Number(districtId));
      
      // Safely pivot routing based on whether the endpoint furnished a native immediate token
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
        if (triggerToast) triggerToast('Registration successful. Welcome to RainIntel.');
        if (onLogin) onLogin(res);
      } else {
        if (triggerToast) triggerToast('Account created successfully. Please sign in.', 'circle-check');
        if (onCancel) onCancel();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. The email or username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="brand" style={{ color: '#fff', padding: 0 }}>
          <span className="brand-mark" style={{ background: '#fff', color: '#0f766e' }}>
            <LucideIcon name="cloud-rain" />
          </span>
          <span>Rain<span style={{ color: '#a7f3d0' }}>Intel</span></span>
        </div>
        <h1>AI-powered <span>rainwater harvesting</span> intelligence.</h1>
        <p>Empowering government engineers with GIS mapping, rooftop analysis and automated assessment reports for sustainable water management.</p>
        <div className="login-badges">
          <span><b>1,284</b><br />Buildings assessed</span>
          <span><b>45.8M L</b><br />Water potential</span>
          <span><b>96.2%</b><br />Analysis confidence</span>
        </div>
      </section>

      <section className="login-card-wrap">
        <article className="login-card" style={{ padding: '32px' }}>
          <div className="brand" style={{ marginBottom: '16px' }}>
            <span className="brand-mark">
              <LucideIcon name="cloud-rain" />
            </span>
            <span>Rain<span>Intel</span></span>
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Create an account</h2>
          <p style={{ marginBottom: '16px' }}>Register your Field Engineer credentials.</p>
          
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              marginBottom: '16px',
              border: '1px solid #fee2e2',
              textAlign: 'left'
            }}>
              <b>Error:</b> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                Full name
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} placeholder="Enter your full name" />
              </label>
              <label>
                Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} placeholder="Enter username" />
              </label>
            </div>
            
            <label>
              Government email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="engineer@jalshakti.gov.in" />
            </label>
            
            <label>
              District Assignment
              <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={loading} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="">Select a district...</option>
                {districts.map(d => (
                  <option key={d.id || d.districtId} value={d.id || d.districtId}>
                    {d.name || d.districtName}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} placeholder="Minimum 8 chars" />
              </label>
              <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} placeholder="Repeat password" />
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={loading ? null : "check"}
              iconPosition="right"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? "Registering account..." : "Complete Registration"}
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
            <span>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); if (onCancel) onCancel(); }} style={{ fontWeight: 600, color: '#0f766e' }}>Sign In</a></span>
          </div>
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px' }}>Powered by Ministry of Jal Shakti</p>
        </article>
      </section>
    </div>
  );
}
