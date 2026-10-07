import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Hash,
  Layers,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { AVAILABLE_GRADES } from '../data/initialData';

export const RegisterView = ({ onBack, onLoginClick, onRegisterSuccess }) => {
  const { registerUser } = useAuth();
  const { addStudentToRoster, setStudentGrade } = useAttendance();

  const generateAutoStudentId = () => {
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `STD-${currentYear}${randomSuffix}`;
  };

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(() => generateAutoStudentId());
  const [grade, setGrade] = useState('Grade 8');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register in Firebase Auth & Firestore 'users'
      const res = await registerUser({
        name: name.trim(),
        studentId: studentId.trim(),
        grade,
        email: email.trim().toLowerCase(),
        password,
        role: 'student'
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to complete registration. Please try again.');
        setIsLoading(false);
        return;
      }

      // 2. Add to Attendance Context Roster & set student grade
      if (addStudentToRoster) {
        addStudentToRoster({
          name: name.trim(),
          studentId: studentId.trim(),
          grade,
          className: `Class ${grade.replace('Grade ', '')}A`,
          email: email.trim().toLowerCase()
        });
      }
      if (setStudentGrade) {
        setStudentGrade(grade);
      }

      setSuccessMsg('Account registered successfully! Welcome to StuMaS.');
      setIsLoading(false);

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      }, 700);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: '12px 6px',
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Back button */}
      <div style={{ marginBottom: '14px' }}>
        <button onClick={onBack} className="back-btn" title="Back to Login">
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: 'var(--primary-gradient)',
          margin: '0 auto 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--primary-glow)',
          color: '#fff'
        }}>
          <GraduationCap size={32} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
          Create Student Account
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Register to mark attendance and view your school schedule
        </p>
      </div>

      {/* Error / Success Feedback */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '0.82rem',
          marginBottom: '16px'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          color: 'var(--success)',
          fontSize: '0.82rem',
          marginBottom: '16px'
        }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Full Name */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Full Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon-left" />
            <input 
              type="text"
              className="glass-input"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Student ID / NISN (Auto-generated) */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="input-label" style={{ marginBottom: 0 }}>Student ID / NISN</label>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              border: '1px solid var(--success-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✨ Auto-Generated
            </span>
          </div>
          <div className="input-wrapper">
            <Hash size={18} className="input-icon-left" />
            <input 
              type="text"
              className="glass-input"
              placeholder="e.g. STD-2025001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              style={{ fontWeight: 600, letterSpacing: '0.5px' }}
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setStudentId(generateAutoStudentId())}
              title="Regenerate new Student ID"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Grade Selector */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Select Grade</label>
          <div className="input-wrapper">
            <Layers size={18} className="input-icon-left" />
            <select
              className="glass-input"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {AVAILABLE_GRADES.map(g => (
                <option key={g} value={g} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Student Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon-left" />
            <input 
              type="email"
              className="glass-input"
              placeholder="student@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Password (Min. 6 characters)</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon-left" />
            <input 
              type={showPassword ? 'text' : 'password'}
              className="glass-input"
              placeholder="Create secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

        {/* Confirm Password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon-left" />
            <input 
              type={showPassword ? 'text' : 'password'}
              className="glass-input"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading} 
          style={{ height: '48px', fontSize: '0.95rem', marginTop: '8px' }}
        >
          {isLoading ? 'Saving to Firebase Cloud...' : 'Create Student Account'}
        </button>
      </form>

      {/* Footer Login link */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onLoginClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};
