import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';

export const ScheduleView = ({ onBack }) => {
  const { classesList } = useAttendance();
  const { currentUser } = useAuth();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [selectedDay, setSelectedDay] = useState("Monday");

  // Filter classes for selected day
  const dayClasses = classesList.filter(c => {
    return c.days && c.days.toLowerCase().includes(selectedDay.toLowerCase());
  });

  const getSubjectIcon = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('math')) return <Calculator size={18} />;
    if (s.includes('sci') || s.includes('phy') || s.includes('chem') || s.includes('bio')) return <Atom size={18} />;
    if (s.includes('eng') || s.includes('lang')) return <BookOpen size={18} />;
    return <GraduationCap size={18} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">Class Schedule</h2>
        <div style={{ width: '36px' }} />
      </div>

      {/* Weekly Day Selector Strip */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        {days.map((dayName) => {
          const isSelected = selectedDay === dayName;

          return (
            <button
              key={dayName}
              onClick={() => setSelectedDay(dayName)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 18px',
                borderRadius: '16px',
                border: isSelected ? 'none' : '1px solid var(--glass-border)',
                background: isSelected ? 'var(--primary-gradient)' : 'var(--glass-bg)',
                color: isSelected ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 6px 16px rgba(37, 99, 235, 0.35)' : 'none',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {dayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daily Class List */}
      {dayClasses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          <Calendar size={38} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>No classes scheduled for {selectedDay}</p>
          <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>
            Classes created by teachers in the Admin panel will appear here according to their schedule.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dayClasses.map((cls) => (
            <div 
              key={cls.id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px',
                borderRadius: '18px'
              }}
            >
              {/* Subject icon badge */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: `${cls.color || '#2563eb'}15`,
                color: cls.color || '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getSubjectIcon(cls.subject)}
              </div>

              {/* Class Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {cls.subject}
                  </h4>
                  <span className="status-pill present" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {cls.grade}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px'
                }}>
                  <Clock size={13} /> {cls.time}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {cls.teacher}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <MapPin size={12} /> {cls.room}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
