import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Sparkles, Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

const GlassAlertContext = createContext();

export const GlassAlertProvider = ({ children }) => {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    title: 'StuMaS Notice',
    message: '',
    type: 'info', // 'info' | 'success' | 'warning' | 'error'
    confirmText: 'Got It'
  });

  const closeAlert = useCallback(() => {
    setAlertData(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showGlassAlert = useCallback((message, options = {}) => {
    let cleanMessage = '';
    if (typeof message === 'object' && message !== null) {
      cleanMessage = JSON.stringify(message, null, 2);
    } else {
      cleanMessage = String(message || '');
    }

    let detectedType = options.type || 'info';
    let detectedTitle = options.title || 'StuMaS Notice';

    // Auto-detect tone if not explicitly provided
    if (!options.type) {
      const lower = cleanMessage.toLowerCase();
      if (lower.includes('success') || lower.includes('connected') || lower.includes('welcome')) {
        detectedType = 'success';
        detectedTitle = options.title || 'Success';
      } else if (lower.includes('warning') || lower.includes('caution')) {
        detectedType = 'warning';
        detectedTitle = options.title || 'Attention';
      } else if (lower.includes('error') || lower.includes('failed') || lower.includes('incorrect') || lower.includes('invalid')) {
        detectedType = 'error';
        detectedTitle = options.title || 'Notice';
      }
    }

    setAlertData({
      isOpen: true,
      title: detectedTitle,
      message: cleanMessage,
      type: detectedType,
      confirmText: options.confirmText || 'Got It'
    });
  }, []);

  // Globally intercept standard window.alert() so ANY native JS alert opens this glassy modal
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      showGlassAlert(msg);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showGlassAlert]);

  // Handle keyboard Escape or Enter to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (alertData.isOpen && (e.key === 'Escape' || e.key === 'Enter')) {
        closeAlert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alertData.isOpen, closeAlert]);

  const getIconAndColors = () => {
    switch (alertData.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={26} />,
          bg: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--success)',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={26} />,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)'
        };
      case 'error':
        return {
          icon: <AlertCircle size={26} />,
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.3)'
        };
      case 'info':
      default:
        return {
          icon: <Sparkles size={26} />,
          bg: 'var(--primary-light)',
          color: 'var(--primary)',
          border: 'var(--primary-border)'
        };
    }
  };

  const styleConfig = getIconAndColors();

  return (
    <GlassAlertContext.Provider value={{ showGlassAlert, closeAlert }}>
      {children}

      {/* Glassy Centered Popup Modal */}
      {alertData.isOpen && (
        <div 
          className="modal-overlay" 
          style={{
            zIndex: 999999,
            background: 'rgba(8, 13, 24, 0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              textAlign: 'center',
              padding: '28px 22px 22px',
              borderRadius: '24px',
              background: 'var(--glass-bg-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35), var(--glass-shadow)',
              animation: 'popIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            {/* Top Close Icon */}
            <button
              onClick={closeAlert}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Glowing Icon Badge */}
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '20px',
              background: styleConfig.bg,
              color: styleConfig.color,
              border: `1px solid ${styleConfig.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 8px 24px ${styleConfig.bg}`
            }}>
              {styleConfig.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '10px',
              letterSpacing: '-0.3px'
            }}>
              {alertData.title}
            </h3>

            {/* Message Body */}
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              marginBottom: '24px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              padding: '0 4px'
            }}>
              {alertData.message}
            </p>

            {/* Confirmation Button */}
            <button
              onClick={closeAlert}
              className="btn-primary"
              autoFocus
              style={{
                width: '100%',
                height: '46px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {alertData.confirmText}
            </button>
          </div>
        </div>
      )}
    </GlassAlertContext.Provider>
  );
};

export const useGlassAlert = () => useContext(GlassAlertContext);
