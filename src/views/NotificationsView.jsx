import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Megaphone, 
  Clock, 
  Trash2, 
  CheckCheck 
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const NotificationsView = ({ onBack }) => {
  const { 
    notifications, 
    markAllNotificationsRead, 
    clearNotifications 
  } = useAttendance();

  const getNotifIcon = (type, icon) => {
    switch(type) {
      case 'success':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle size={20} />
          </div>
        );
      case 'info':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Calendar size={20} />
          </div>
        );
      case 'announcement':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Megaphone size={20} />
          </div>
        );
      default:
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} />
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">Notifications</h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          {notifications.length > 0 && (
            <button 
              onClick={markAllNotificationsRead} 
              className="back-btn" 
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          No new notifications. You're all caught up!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '16px',
                opacity: item.read ? 0.8 : 1,
                borderLeft: item.read ? '1px solid var(--glass-border)' : '4px solid var(--primary)'
              }}
            >
              {getNotifIcon(item.type, item.icon)}

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <button 
          onClick={clearNotifications}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '8px'
          }}
        >
          <Trash2 size={14} /> Clear all notifications
        </button>
      )}
    </div>
  );
};
