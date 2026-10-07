import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  CheckCircle, 
  QrCode, 
  Sparkles,
  MapPin,
  Clock,
  Download,
  Share2,
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const CheckInView = ({ onBack, onCheckInComplete }) => {
  const { currentUser } = useAuth();
  const { 
    markStudentAttendance, 
    studentGrade, 
    getStudentUniqueQr,
    todayAttendance 
  } = useAttendance();

  const [studentQrDataUrl, setStudentQrDataUrl] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualStatus, setManualStatus] = useState('Present');
  const [manualReason, setManualReason] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const qrPayload = getStudentUniqueQr(currentUser);
    QRCode.toDataURL(qrPayload, {
      width: 320,
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

  const handleDownloadQr = () => {
    if (!studentQrDataUrl) return;
    const a = document.createElement('a');
    a.href = studentQrDataUrl;
    a.download = `attendance_qr_${currentUser.studentId || 'STUDENT'}.png`;
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    markStudentAttendance(manualStatus, 'Manual Entry', manualReason || 'Self reported');
    setShowManualModal(false);
    if (onCheckInComplete) onCheckInComplete();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">My Attendance QR Badge</h2>
        <div style={{ width: '36px' }} />
      </div>

      {/* Main Digital Pass Card */}
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '28px 20px',
        borderRadius: '26px',
        border: '1.5px solid var(--glass-border)',
        position: 'relative'
      }}>
        {/* Verification Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          padding: '5px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} /> Verified School Pass • {studentGrade}
        </div>

        {/* Student Avatar & Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', marginBottom: '8px' }} 
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentUser.name}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Student ID: <strong>{currentUser.studentId}</strong> • {currentUser.className}
          </span>
        </div>

        {/* Dynamic High-Res QR Code */}
        <div style={{
          background: '#ffffff',
          padding: '16px',
          borderRadius: '22px',
          display: 'inline-block',
          boxShadow: '0 12px 35px rgba(37, 99, 235, 0.15)',
          border: '1px solid var(--border-color)',
          margin: '0 auto 16px'
        }}>
          {studentQrDataUrl ? (
            <img 
              src={studentQrDataUrl} 
              alt="Student QR Code" 
              style={{ width: '220px', height: '220px', display: 'block' }} 
            />
          ) : (
            <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={48} className="animate-spin" />
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 18px' }}>
          Present this unique dynamic QR code to your teacher or scan at the attendance terminal.
        </p>

        {/* Action Buttons */}
        <div className="checkin-action-buttons">
          <button 
            onClick={handleDownloadQr}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <Download size={16} /> {downloadSuccess ? 'Saved!' : 'Download QR Image'}
          </button>

          <button 
            onClick={() => setShowManualModal(true)}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <FileText size={16} /> Submit Excuse Note
          </button>
        </div>
      </div>

      {/* Manual Check In Modal */}
      {showManualModal && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              Submit Attendance Note
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Report absence, doctor appointment, or reason for delay.
            </p>

            <form onSubmit={handleManualSubmit}>
              <div className="form-group">
                <label className="input-label">Attendance Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {['Present', 'Sick', 'Late'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setManualStatus(st)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: manualStatus === st ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                        background: manualStatus === st ? 'var(--primary-light)' : 'var(--glass-bg)',
                        color: manualStatus === st ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Reason or Notes</label>
                <textarea 
                  rows={3}
                  value={manualReason}
                  onChange={e => setManualReason(e.target.value)}
                  placeholder="e.g. Doctor note submitted / Delayed due to bus"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowManualModal(false)}
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
                  Submit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
