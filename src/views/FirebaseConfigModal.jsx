import React, { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, Key, Shield, RefreshCw } from 'lucide-react';
import { getStoredFirebaseConfig, initFirebase, isFirebaseActive } from '../firebase';

export const FirebaseConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(getStoredFirebaseConfig());
  const [statusMsg, setStatusMsg] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMsg(null);

    try {
      localStorage.setItem('absensiswa_firebase_config', JSON.stringify(config));
      const res = initFirebase(config);
      setIsTesting(false);
      if (res.isFirebaseActive) {
        setStatusMsg({ type: 'success', text: 'Connected to Firebase Cloud Firestore successfully!' });
      } else {
        setStatusMsg({ type: 'warning', text: 'Configuration saved! (Running in Hybrid mode with local sync)' });
      }
    } catch (err) {
      setIsTesting(false);
      setStatusMsg({ type: 'error', text: 'Connection failed: ' + err.message });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('absensiswa_firebase_config');
    setConfig({
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    });
    initFirebase();
    setStatusMsg({ type: 'info', text: 'Reset to built-in local database store.' });
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Firebase Database Setup</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Realtime Attendance & Firestore sync
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          background: isFirebaseActive ? 'var(--success-bg)' : 'var(--primary-light)',
          color: isFirebaseActive ? 'var(--success)' : 'var(--primary)',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <span className="pulse-indicator" style={{ background: isFirebaseActive ? 'var(--success)' : 'var(--primary)' }} />
          {isFirebaseActive 
            ? 'Firebase Firestore is LIVE & CONNECTED' 
            : 'Built-in Local DB Active (Paste Firebase keys below to connect Cloud)'}
        </div>

        {statusMsg && (
          <div style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            marginBottom: '12px',
            background: statusMsg.type === 'success' ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: statusMsg.type === 'success' ? 'var(--success)' : 'var(--warning)'
          }}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>API Key (apiKey)</label>
            <input 
              type="text" 
              className="glass-input" 
              style={{ paddingLeft: '12px', height: '36px', fontSize: '0.8rem' }}
              placeholder="AIzaSy..."
              value={config.apiKey}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>Project ID (projectId)</label>
            <input 
              type="text" 
              className="glass-input" 
              style={{ paddingLeft: '12px', height: '36px', fontSize: '0.8rem' }}
              placeholder="attendance-school-123"
              value={config.projectId}
              onChange={e => setConfig({ ...config, projectId: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>Auth Domain (authDomain)</label>
            <input 
              type="text" 
              className="glass-input" 
              style={{ paddingLeft: '12px', height: '36px', fontSize: '0.8rem' }}
              placeholder="attendance-school-123.firebaseapp.com"
              value={config.authDomain}
              onChange={e => setConfig({ ...config, authDomain: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>App ID (appId)</label>
            <input 
              type="text" 
              className="glass-input" 
              style={{ paddingLeft: '12px', height: '36px', fontSize: '0.8rem' }}
              placeholder="1:1234567890:web:abcdef"
              value={config.appId}
              onChange={e => setConfig({ ...config, appId: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={handleReset}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isTesting}
              style={{ flex: 2, padding: '10px', fontSize: '0.85rem' }}
            >
              {isTesting ? 'Connecting...' : 'Save & Connect'}
            </button>
          </div>
        </form>

        <button 
          onClick={onClose} 
          style={{
            width: '100%',
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
