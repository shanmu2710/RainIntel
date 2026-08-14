import React, { useState } from 'react';
import SearchInput from '../common/SearchInput';
import IconButton from '../common/IconButton';
import Avatar from '../common/Avatar';

export default function Navbar({ currentPage, onPageChange, triggerToast }) {
  const isDashboard = currentPage === 'Dashboard';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const handleAvatarClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleMenuSelect = (page) => {
    setShowProfileMenu(false);
    if (onPageChange) onPageChange(page);
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const displayName = user?.fullName || user?.username || user?.email || 'Guest';

  const getInitials = (name) => {
    if (!name || name === 'Guest') return 'GU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(displayName);
  const firstName = displayName.split(/\s+/)[0];

  const getPageTitle = () => {
    if (isDashboard) {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      else if (hour >= 17 && hour < 21) greeting = 'Good evening';
      else if (hour >= 21 || hour < 5) greeting = 'Good night';

      const greetingName = (!user || (!user.fullName && !user.username && !user.email)) ? 'there' : firstName;

      return `${greeting}, ${greetingName}`;
    }
    switch (currentPage) {
      case 'New Assessment':
        return 'Assessment workspace';
      case 'Assessment Result':
        return 'Assessment results';
      case '3D Design':
        return '3D system design';
      case 'Report Preview':
        return 'Report preview';
      case 'AI Processing':
        return 'AI Processing';
      default:
        return currentPage;
    }
  };

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const day = today.getDate().toString().padStart(2, '0');
  const month = today.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = today.getFullYear();
  const dateString = `${weekday}, ${day} ${month} ${year}`;

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <div>
        <p className="eyebrow">{dateString}</p>
        <h1 id="page-title">{getPageTitle()}</h1>
      </div>
      <div className="top-actions">
        <SearchInput
          placeholder="Search buildings, reports…"
          onChange={(e) => {}}
        />
        <IconButton
          icon="bell"
          hasBadge={true}
          onClick={handleNotificationClick}
        />
        <IconButton
          icon="message-square"
          onClick={() => triggerToast && triggerToast('Opening direct messaging...')}
        />
        <Avatar initials={initials} className="top-avatar" onClick={handleAvatarClick} />

        {showNotifications && (
          <>
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                background: 'transparent',
              }}
              onClick={() => setShowNotifications(false)}
            />
            <div className="card" style={{
              position: 'absolute',
              top: '55px',
              right: '80px',
              zIndex: 1000,
              width: '280px',
              padding: '12px',
              boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              background: '#fff',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Notifications</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#475569' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <b>AI Processing complete</b>
                  <p style={{ margin: '2px 0 0' }}>Rooftop analysis for Municipal Hall is ready.</p>
                </li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <b>New Survey Draft</b>
                  <p style={{ margin: '2px 0 0' }}>Draft survey saved by {displayName}.</p>
                </li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <b>System update</b>
                  <p style={{ margin: '2px 0 0' }}>RainIntel database successfully updated.</p>
                </li>
              </ul>
            </div>
          </>
        )}

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
              top: '55px',
              right: '20px',
              zIndex: 1000,
              width: '160px',
              padding: '8px',
              boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: '#fff',
              textAlign: 'left'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#475569' }}>
                <li style={{ padding: '8px 10px', cursor: 'pointer', borderRadius: '6px' }} onClick={() => handleMenuSelect('Settings')}>
                  My Profile
                </li>
                <li style={{ padding: '8px 10px', cursor: 'pointer', borderRadius: '6px' }} onClick={() => handleMenuSelect('Settings')}>
                  Workspace Settings
                </li>
                <li style={{ padding: '8px 10px', borderTop: '1px solid #f1f5f9', cursor: 'pointer', color: '#dc2626' }} onClick={() => handleMenuSelect('Login')}>
                  Sign Out
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
