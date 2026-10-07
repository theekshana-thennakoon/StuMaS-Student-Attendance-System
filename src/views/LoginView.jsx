import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles,
  Shield,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginView = ({ initialIsAdmin = false, onBack, onRegisterClick, onLoginSuccess }) => {
  const { login } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(initialIsAdmin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const targetRole = isAdminMode ? 'teacher' : 'student';
    setTimeout(() => {
      login(targetRole, { 
        email: email || (isAdminMode ? 'admin@school.edu' : 'student@school.edu'), 
        password,
        name: name || (email ? email.split('@')[0] : (isAdminMode ? 'Administrator' : 'Student'))
      });
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 400);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: '12px 6px'
    }}>
      {/* Back button */}
      <div style={{ marginBottom: '18px' }}>
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: isAdminMode ? 'linear-gradient(135deg, #1e3a8a, #0284c7)' : 'var(--primary-gradient)',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isAdminMode ? '0 8px 24px rgba(2, 132, 199, 0.35)' : '0 8px 24px rgba(37, 99, 235, 0.3)',
          color: '#fff'
        }}>
          {isAdminMode ? <Shield size={34} /> : <GraduationCap size={34} />}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            StuMaS
          </h2>
          <span className="status-pill" style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            background: isAdminMode ? 'rgba(245, 158, 11, 0.15)' : 'var(--primary-light)',
            color: isAdminMode ? '#f59e0b' : 'var(--primary)',
            border: `1px solid ${isAdminMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--primary-border)'}`
          }}>
            {isAdminMode ? '🔒 Admin Portal' : '🎓 Student Portal'}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isAdminMode 
            ? 'Authorized Administrator & Teacher Access' 
            : 'Login with your Student ID or Email'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="input-label">
            {isAdminMode ? 'Administrator Username / Email' : 'Student ID / NISN or Email'}
          </label>
          <div className="input-wrapper">
            {isAdminMode ? <Shield size={18} className="input-icon-left" /> : <User size={18} className="input-icon-left" />}
            <input 
              type="text"
              className="glass-input"
              placeholder={isAdminMode ? "admin@school.edu" : "Student ID or Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '10px' }}>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon-left" />
            <input 
              type={showPassword ? 'text' : 'password'}
              className="glass-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: '22px' }}>
          <button
            type="button"
            onClick={() => alert('Password reset link will be sent to your registered school email.')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary" disabled={isLoading} style={{ height: '48px', fontSize: '0.95rem' }}>
          {isLoading 
            ? 'Authorizing...' 
            : (isAdminMode ? 'Authorize & Enter Admin Panel' : 'Login to Student Portal')}
        </button>
      </form>

      {/* Switch to Admin Mode Card */}
      {!isAdminMode ? (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--glass-bg-subtle)',
          border: '1px solid var(--glass-border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Are you a School Administrator or Teacher?
          </div>
          <button 
            type="button"
            onClick={() => {
              setIsAdminMode(true);
              setEmail('');
              setPassword('');
            }}
            className="btn-outline"
            style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <Shield size={16} /> Go to Separate Admin Login →
          </button>
        </div>
      ) : (
        <div style={{
          marginTop: '24px',
          padding: '14px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(37, 99, 235, 0.05)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Are you a Student?
          </div>
          <button 
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setEmail('');
              setPassword('');
            }}
            className="btn-outline"
            style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <GraduationCap size={16} /> ← Back to Student Portal Login
          </button>
        </div>
      )}

      {/* Footer Register link (only in Student mode) */}
      {!isAdminMode && (
        <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={onRegisterClick}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
