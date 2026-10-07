import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Bell, 
  QrCode, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  PlusCircle,
  Check,
  Download,
  Maximize2,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const StudentHomeView = ({ 
  onNavigateTab, 
  onOpenNotifications, 
  onOpenSchedule 
}) => {
  const { currentUser } = useAuth();
  const { 
    todayAttendance, 
    notifications, 
    classesList, 
    joinClass, 
    leaveClass,
    studentGrade,
    setStudentGrade,
    availableGrades,
    getStudentUniqueQr 
  } = useAttendance();

  const [studentQrDataUrl, setStudentQrDataUrl] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [showCodeJoinModal, setShowCodeJoinModal] = useState(false);
  const [joinMsg, setJoinMsg] = useState(null);
  const [showFullscreenQr, setShowFullscreenQr] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate unique student QR code image
  useEffect(() => {
    const qrPayload = getStudentUniqueQr(currentUser);
    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    }, (err, url) => {
      if (!err && url) {
        setStudentQrDataUrl(url);
      }
    });
  }, [currentUser, studentGrade, getStudentUniqueQr]);

  // Classes for the student's assigned grade
  const gradeClasses = classesList.filter(c => c.grade === studentGrade);
  const myEnrolledClasses = classesList.filter(c => c.enrolledStudentIds?.includes(currentUser.id));

  const handleJoinByCode = (e) => {
    e.preventDefault();
    const found = classesList.find(c => c.code.toLowerCase() === classCodeInput.trim().toLowerCase());
    if (found) {
      joinClass(found.id, currentUser.id);
      setJoinMsg({ type: 'success', text: `Enrolled successfully in ${found.subject}!` });
      setTimeout(() => {
        setShowCodeJoinModal(false);
        setJoinMsg(null);
        setClassCodeInput('');
      }, 1000);
    } else {
      setJoinMsg({ type: 'error', text: 'Class code not found. Please ask your teacher.' });
    }
  };

  const getSubjectIcon = (iconName) => {
    switch(iconName) {
      case 'calculator': return <Calculator size={18} />;
      case 'book-open': return <BookOpen size={18} />;
      case 'atom': return <Atom size={18} />;
      case 'globe': return <Globe size={18} />;
      default: return <GraduationCap size={18} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Greeting & Notification Bar */}
      <div className="student-greeting-bar">
        <div className="student-greeting-profile">
          <div className="student-greeting-avatar">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Welcome back,</span>
              <span className="status-pill present" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                {studentGrade}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currentUser.name}
            </h2>
          </div>
        </div>

        <div className="student-greeting-actions">
          <button 
            onClick={() => setShowCodeJoinModal(true)}
            className="btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <PlusCircle size={14} /> Join Class Code
          </button>

          <button 
            onClick={onOpenNotifications}
            className="icon-circle-btn" 
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--danger)',
                boxShadow: '0 0 6px var(--danger)'
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Student's Unique QR Attendance Pass */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Unique QR Attendance Badge Card */}
          <div className="student-qr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={13} /> Official Student Pass
              </span>
              <button 
                onClick={() => setShowFullscreenQr(true)}
                className="icon-circle-btn" 
                style={{ width: '28px', height: '28px' }}
                title="Expand QR Badge"
              >
                <Maximize2 size={13} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)' }}>
              My Attendance QR Code
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Show this code to teacher / scanner to mark attendance
            </p>

            {/* Generated QR Code */}
            <div className="qr-code-wrapper">
              {studentQrDataUrl ? (
                <img 
                  src={studentQrDataUrl} 
                  alt="Student Attendance QR" 
                  style={{ width: '180px', height: '180px', display: 'block' }} 
                />
              ) : (
                <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={40} className="animate-spin" />
                </div>
              )}
            </div>

            {/* Student ID & Grade Pill */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}>
              <span>NISN: {currentUser.studentId || '-'}</span>
              <span>•</span>
              <span style={{ color: 'var(--primary)' }}>{studentGrade}</span>
            </div>

            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg)',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span className="pulse-indicator" /> Auto-updates token daily
            </div>
          </div>

          {/* Today's Status Banner */}
          <div className="glass-card-primary" style={{ padding: '16px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Today's Status</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{todayAttendance.dateStr}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {todayAttendance.status}
              </div>
              <span style={{
                background: '#fff',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {todayAttendance.time || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Classes for Your Grade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Classes for Assigned Grade (Created on Admin Side) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Classes in {studentGrade}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {gradeClasses.length} class(es) available for your grade
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('profile')}
                className="status-pill present"
                style={{
                  fontSize: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Change your grade in Student Profile"
              >
                Grade: {studentGrade} • Edit in Profile
              </button>
            </div>

            {gradeClasses.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                <BookOpen size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>No classes created for {studentGrade} yet.</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Teachers can create classes from the Admin Panel.</p>
              </div>
            ) : (
              <div className="classes-grid">
                {gradeClasses.map((cls) => {
                  const isEnrolled = cls.enrolledStudentIds?.includes(currentUser.id || "std-2024001");

                  return (
                    <div key={cls.id} className="class-card">
                      <div>
                        {/* Class Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: `${cls.color}15`,
                            color: cls.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getSubjectIcon(cls.icon)}
                          </div>

                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: isEnrolled ? 'var(--success-bg)' : 'var(--glass-bg)',
                            color: isEnrolled ? 'var(--success)' : 'var(--text-muted)',
                            border: `1px solid ${isEnrolled ? 'var(--success-border)' : 'var(--border-color)'}`
                          }}>
                            {isEnrolled ? '✔ Enrolled' : cls.code}
                          </span>
                        </div>

                        {/* Subject & Class name */}
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                          {cls.subject}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                          {cls.className} • {cls.teacher}
                        </div>

                        {/* Schedule & Room */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} /> {cls.time} ({cls.days})
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Layers size={13} /> {cls.room}
                          </span>
                        </div>
                      </div>

                      {/* Join / Leave Action Button */}
                      <div>
                        {isEnrolled ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => onNavigateTab('history')}
                              className="btn-outline"
                              style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}
                            >
                              Attendance Log
                            </button>
                            <button
                              type="button"
                              onClick={() => leaveClass(cls.id, currentUser.id || "std-2024001")}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                color: 'var(--text-muted)',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Leave
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => joinClass(cls.id, currentUser.id || "std-2024001")}
                            className="btn-primary"
                            style={{ padding: '9px 14px', fontSize: '0.82rem' }}
                          >
                            <PlusCircle size={15} /> Join Class
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join By Class Code Modal */}
      {showCodeJoinModal && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              Join Class with Code
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter the unique 6-character code provided by your teacher.
            </p>

            {joinMsg && (
              <div style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                marginBottom: '12px',
                background: joinMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: joinMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'
              }}>
                {joinMsg.text}
              </div>
            )}

            <form onSubmit={handleJoinByCode}>
              <div className="form-group">
                <label className="input-label">Class Code</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. MATH8A or SCI8A"
                  value={classCodeInput}
                  onChange={e => setClassCodeInput(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, paddingLeft: '14px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCodeJoinModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Enroll Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Student QR Modal */}
      {showFullscreenQr && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <span className="status-pill present" style={{ marginBottom: '8px' }}>
              Official Student Pass
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2px' }}>
              {currentUser.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              NISN: {currentUser.studentId} • {studentGrade}
            </p>

            {studentQrDataUrl && (
              <div style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '20px',
                display: 'inline-block',
                margin: '0 auto 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={studentQrDataUrl} 
                  alt="Student Pass" 
                  style={{ width: '220px', height: '220px', display: 'block' }} 
                />
              </div>
            )}

            <button 
              onClick={() => setShowFullscreenQr(false)} 
              className="btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
