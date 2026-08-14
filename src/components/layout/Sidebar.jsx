import React, { useState } from 'react';
import LucideIcon from '../common/LucideIcon';
import Avatar from '../common/Avatar';

export default function Sidebar({ currentPage, onPageChange, triggerToast }) {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isFieldEngineer = user?.role === 'FIELD_ENGINEER';

  const primaryNavItems = [
    { name: 'Dashboard', icon: 'layout-dashboard' },
    { name: 'Assessments', icon: 'clipboard-check', pill: 12 },
    { name: 'GIS Intelligence', icon: 'map' },
    { name: 'Reports', icon: 'file-bar-chart' },
    ...(isFieldEngineer ? [] : [{ name: 'Analytics', icon: 'chart-no-axes-combined' }]),
  ];

  const systemNavItems = [
    { name: 'Settings', icon: 'settings-2' },
    { name: 'Support', icon: 'circle-help' },
  ];

  const displayName = user?.fullName || user?.username || user?.email || 'Guest';
  
  let formattedRole = 'Guest';
  if (user?.role) {
    formattedRole = user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  } else if (user) {
    formattedRole = 'User';
  }

  const getInitials = (name) => {
    if (!name || name === 'Guest') return 'GU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(displayName);

  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onPageChange('Dashboard'); }}>
        <span className="brand-mark">
          <LucideIcon name="cloud-rain" />
        </span>
        <span>Rain<span>Intel</span></span>
      </a>

      <div
        className="workspace"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowWorkspace(!showWorkspace)}
      >
        <span className="workspace-icon">
          <LucideIcon name="building-2" />
        </span>
        <div>
          <b>Jal Shakti Mission</b>
          <small>Government Workspace</small>
        </div>
        <LucideIcon name="chevrons-up-down" />
      </div>

      {showWorkspace && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'transparent',
            }}
            onClick={() => setShowWorkspace(false)}
          />
          <div className="card" style={{
            position: 'absolute',
            top: '110px',
            left: '16px',
            zIndex: 1000,
            width: '210px',
            padding: '8px',
            boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            background: '#fff',
            textAlign: 'left'
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#475569' }}>
              <li style={{ padding: '8px 10px', background: '#e7f5f3', color: '#0f766e', borderRadius: '6px', fontWeight: 600 }}>
                Jal Shakti Mission
              </li>
              <li style={{ padding: '8px 10px', cursor: 'pointer', borderRadius: '6px' }} onClick={() => {
                setShowWorkspace(false);
                if (triggerToast) triggerToast('Switching workspace...');
              }}>
                Andhra Pradesh Water Resources
              </li>
            </ul>
          </div>
        </>
      )}

      <nav>
        {primaryNavItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${currentPage === item.name ? 'active' : ''}`}
            onClick={() => onPageChange(item.name)}
          >
            <LucideIcon name={item.icon} />
            {item.name}
            {item.pill !== undefined && <span className="pill">{item.pill}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="side-label">SYSTEM</span>
        
        {systemNavItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${currentPage === item.name ? 'active' : ''}`}
            onClick={() => onPageChange(item.name)}
          >
            <LucideIcon name={item.icon} />
            {item.name}
          </button>
        ))}

        <button
          className={`nav-item ${currentPage === 'Login' ? 'active' : ''}`}
          onClick={() => onPageChange('Login')}
        >
          <LucideIcon name="log-out" />
          Sign out
        </button>

        {showProfileMenu && (
          <>
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                background: 'transparent',
              }}
              onClick={() => setShowProfileMenu(false)}
            />
            <div className="card" style={{
              position: 'absolute',
              bottom: '70px',
              left: '14px',
              zIndex: 1000,
              width: '230px',
              padding: '8px',
              boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              background: '#fff',
              textAlign: 'left'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#475569' }}>
                <li style={{ padding: '8px 10px', cursor: 'pointer', borderRadius: '6px' }} onClick={() => { setShowProfileMenu(false); onPageChange('Settings'); }}>
                  My Profile
                </li>
                <li style={{ padding: '8px 10px', cursor: 'pointer', borderRadius: '6px' }} onClick={() => { setShowProfileMenu(false); onPageChange('Settings'); }}>
                  Workspace Settings
                </li>
                <li style={{ padding: '8px 10px', borderTop: '1px solid #f1f5f9', cursor: 'pointer', color: '#dc2626' }} onClick={() => { setShowProfileMenu(false); onPageChange('Login'); }}>
                  Sign Out
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="user-card" style={{ cursor: 'pointer' }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <Avatar initials={initials} />
          <div>
            <b>{displayName}</b>
            <small>{formattedRole}</small>
          </div>
          <LucideIcon name="more-horizontal" />
        </div>
      </div>
    </aside>
  );
}
