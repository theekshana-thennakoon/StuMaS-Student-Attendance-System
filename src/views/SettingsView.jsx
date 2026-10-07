import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Fingerprint, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const SettingsView = ({ onBack }) => {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode, viewMode, toggleViewMode } = useAttendance();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">Settings</h2>
        <div style={{ width: '36px' }} />
      </div>

      {/* Account Section */}
      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          Account
        </h4>
        <div className="glass-card" style={{ padding: '4px 14px', display: 'flex', flexDirection: 'column' }}>
          {/* Change Password */}
          <div 
            onClick={() => alert("Change Password modal: An email verification will be sent.")}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Change Password</span>
            </div>
            <ChevronRight size={16} color="var(--text-subtle)" />
          </div>

          {/* Notification Settings */}
          <div 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Notification Settings</span>
            </div>
            <ChevronRight size={16} color="var(--text-subtle)" />
          </div>

          {/* Language */}
          <div 
            onClick={() => alert("Languages supported: English & Bahasa Indonesia")}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Language</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              English <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* App Settings Section */}
      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          App Settings
        </h4>
        <div className="glass-card" style={{ padding: '4px 14px', display: 'flex', flexDirection: 'column' }}>
          {/* Dark Mode */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Moon size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Dark Mode</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={toggleDarkMode}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: darkMode ? 'var(--primary)' : '#cbd5e1',
                borderRadius: '34px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: darkMode ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }} />
              </span>
            </label>
          </div>

          {/* Biometric Login */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Fingerprint size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Biometric Login</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={biometricEnabled} 
                onChange={() => setBiometricEnabled(!biometricEnabled)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: biometricEnabled ? 'var(--primary)' : '#cbd5e1',
                borderRadius: '34px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: biometricEnabled ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }} />
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <button 
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--danger)',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          padding: '8px 4px',
          marginTop: '4px'
        }}
      >
        <LogOut size={18} /> Log Out
      </button>
    </div>
  );
};
