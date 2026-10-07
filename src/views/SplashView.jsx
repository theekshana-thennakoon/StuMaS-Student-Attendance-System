import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const SplashView = ({ onGetStarted, onLoginClick, onAdminLoginClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '65vh',
      padding: '36px 12px 24px',
      textAlign: 'center',
      gap: '36px'
    }}>
      {/* Brand Icon & Title */}
      <div style={{ marginTop: '20px' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '24px',
          background: 'var(--primary-gradient)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(37, 99, 235, 0.35)',
          color: '#fff'
        }}>
          <GraduationCap size={44} strokeWidth={2.2} />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: 'var(--primary)',
          marginBottom: '6px'
        }}>
          StuMaS
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          maxWidth: '240px',
          margin: '0 auto',
          lineHeight: '1.4'
        }}>
          Smart Attendance System<br />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Student & School Management</span>
        </p>
      </div>


      {/* CTA Buttons */}
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <button 
          onClick={onGetStarted}
          className="btn-primary" 
          style={{ marginBottom: '14px', fontSize: '1rem', height: '48px' }}
        >
          Student Portal <ArrowRight size={18} />
        </button>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button 
            onClick={onLoginClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Login
          </button>
        </p>

        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={onAdminLoginClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            👨‍🏫 Teacher & Admin Portal Access →
          </button>
        </div>
      </div>
    </div>
  );
};
