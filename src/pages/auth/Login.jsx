import React, { useState } from 'react';
import LucideIcon from '../../components/common/LucideIcon';
import Button from '../../components/common/Button';
import { api } from '../../services/api';

export default function Login({ onLogin, onRegister, triggerToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      if (onLogin) {
        onLogin(res);
      }
    } catch (err) {
      setError(err.message || 'Invalid government email or password');
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
        <article className="login-card">
          <div className="brand">
            <span className="brand-mark">
              <LucideIcon name="cloud-rain" />
            </span>
            <span>Rain<span>Intel</span></span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to your Jal Shakti Mission workspace.</p>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              marginTop: '12px',
              border: '1px solid #fee2e2',
              textAlign: 'left'
            }}>
              <b>Error:</b> {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label>
              Government email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </label>
            <div className="remember">
              <span>☑ Remember me</span>
              <a href="#" onClick={(e) => { e.preventDefault(); if (triggerToast) triggerToast('Password reset currently unavailable. Contact district dispatch.', 'circle-alert'); }}>Forgot password?</a>
            </div>
            <Button
              type="submit"
              variant="primary"
              icon={loading ? null : "arrow-right"}
              iconPosition="right"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to workspace"}
            </Button>
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
              <span>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); if(onRegister) onRegister(); }} style={{ fontWeight: 600, color: '#0f766e' }}>Register</a></span>
            </div>
          </form>
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px' }}>Powered by Ministry of Jal Shakti</p>
        </article>
      </section>
    </div>
  );
}
