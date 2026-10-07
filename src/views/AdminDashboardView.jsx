import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Users, 
  QrCode, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Database,
  Maximize2,
  Sparkles,
  Camera,
  Layers,
  BookOpen,
  UserCheck,
  Check,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const AdminDashboardView = ({ onBack, onOpenFirebaseConfig }) => {
  const { currentUser } = useAuth();
  const { 
    studentsRoster, 
    updateStudentStatus, 
    classesList,
    addClass,
    addStudentToRoster,
    scanStudentQr,
    availableGrades 
  } = useAttendance();

  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Helper to generate unique Student ID
  const generateStudentId = () => `STD-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

  // Student & Class Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    studentId: `STD-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
    grade: 'Grade 8',
    className: 'Class 8A'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassForm, setNewClassForm] = useState({
    grade: 'Grade 8',
    subject: '',
    className: 'Class 8A',
    teacher: currentUser.name || 'Mr. Budi Santoso',
    time: '08:00 - 09:30',
    days: 'Monday, Wednesday',
    room: 'Room 101',
    code: '',
    capacity: 35,
    color: '#2563eb'
  });

  // Scanner modal for Teacher to scan Student QR Codes
  const [showScanStudentModal, setShowScanStudentModal] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);

  // Filter students
  const filteredStudents = studentsRoster.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.includes(searchQuery);
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => s.status === 'Present').length;
  const lateCount = filteredStudents.filter(s => s.status === 'Late').length;
  const sickCount = filteredStudents.filter(s => s.status === 'Sick').length;
  const absentCount = filteredStudents.filter(s => s.status === 'Absent').length;

  const handleCreateClass = (e) => {
    e.preventDefault();
    addClass(newClassForm);
    setShowCreateModal(false);
    setNewClassForm({
      grade: 'Grade 8',
      subject: '',
      className: 'Class 8A',
      teacher: currentUser.name || 'Mr. Budi Santoso',
      time: '08:00 - 09:30',
      days: 'Monday, Wednesday',
      room: 'Room 101',
      code: '',
      capacity: 35,
      color: '#2563eb'
    });
  };

  // Simulate scanning a student's unique QR code
  const handleQuickScanStudent = (student) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const res = scanStudentQr({
        studentId: student.studentId,
        name: student.name,
        className: student.className
      }, "Morning Roll Call");
      setScannedResult(res);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Admin Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-profile-info">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="admin-avatar"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin Workspace</span>
              <span className="status-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem' }}>
                Master Access
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currentUser.name}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="admin-action-controls">
          <button 
            onClick={() => setShowScanStudentModal(true)}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Camera size={15} /> Scan Student QR
          </button>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} /> Create Class
          </button>

          <button 
            onClick={onOpenFirebaseConfig}
            className="icon-circle-btn" 
            title="Firebase Database"
            style={{ color: '#f59e0b' }}
          >
            <Database size={16} />
          </button>
        </div>
      </div>

      {/* Admin Stats Overview */}
      <div className="admin-stats-grid">
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Students</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>{totalStudents}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>Present Today</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>{presentCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)' }}>
          <span style={{ fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 600 }}>Late Arrivals</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>{lateCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600 }}>Absent / Sick</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>{absentCount + sickCount}</div>
        </div>
      </div>

      {/* Classes Created by Admin Section */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Active Classes & Grade Offerings
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Classes created here are instantly visible to students to join
            </span>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-outline" 
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Plus size={14} /> Add New Class
          </button>
        </div>

        {/* Classes horizontal cards */}
        <div className="classes-grid">
          {classesList.map((cls) => (
            <div key={cls.id} className="class-card" style={{ padding: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="status-pill present" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {cls.grade}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Code: {cls.code}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                  {cls.subject}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {cls.className} • {cls.teacher}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> {cls.time}</span>
                  <span><Layers size={12} style={{ display: 'inline', marginRight: '4px' }} /> {cls.room}</span>
                </div>
              </div>

              <div style={{
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Enrolled Students:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {cls.enrolledStudentIds?.length || 0} / {cls.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Attendance Roster Management */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '22px' }}>
        <div className="roster-header-bar">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Student Attendance Roster
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Mark attendance or scan student QR badges
            </span>
          </div>

          <div className="roster-header-actions">
            {/* Grade filter */}
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="All">All Grades</option>
              {availableGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <button 
              onClick={() => setShowAddStudentModal(true)}
              className="btn-primary" 
              style={{ padding: '6px 14px', fontSize: '0.8rem', width: 'auto' }}
            >
              <Plus size={14} /> Add Student
            </button>

          </div>
        </div>

        {/* Search */}
        <div className="input-wrapper" style={{ marginBottom: '14px' }}>
          <Search size={16} className="input-icon-left" />
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Search students by name or NISN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        {/* Students Table / Grid */}
        {filteredStudents.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
            <Users size={38} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>No students enrolled yet</p>
            <p style={{ fontSize: '0.78rem', marginTop: '4px', marginBottom: '14px' }}>
              Add a student manually below or have students log in via the Student Portal.
            </p>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem', width: 'auto', display: 'inline-flex' }}
            >
              <Plus size={14} /> Add First Student
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredStudents.map((std) => (
              <div key={std.id} className="student-roster-card">
                <div className="student-roster-info">
                  <img 
                    src={std.avatar} 
                    alt={std.name} 
                    className="student-avatar"
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="student-name">
                      {std.name}
                    </div>
                    <div className="student-meta">
                      NISN: {std.studentId} • {std.grade || 'Grade 8'} • {std.className}
                    </div>
                  </div>
                </div>

                {/* Status Controls + Quick Scan */}
                <div className="student-roster-actions">
                  <span className="student-time-tag">
                    {std.time}
                  </span>

                  <div className="student-status-btn-group">
                    {['Present', 'Late', 'Sick', 'Absent'].map(st => {
                      const isActive = std.status === st;
                      const colorMap = {
                        Present: 'var(--success)',
                        Late: '#8b5cf6',
                        Sick: 'var(--warning)',
                        Absent: 'var(--danger)'
                      };

                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateStudentStatus(std.id, st)}
                          className={`roster-status-btn ${isActive ? 'active' : ''}`}
                          style={{
                            background: isActive ? colorMap[st] : 'var(--glass-bg-subtle)',
                            color: isActive ? '#fff' : 'var(--text-muted)'
                          }}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleQuickScanStudent(std)}
                    className="icon-circle-btn"
                    style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    title="Simulate scanning this student's QR badge"
                  >
                    <QrCode size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Class / Grade */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Create New Class
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Students will be able to browse and join this class in their dashboard.
            </p>

            <form onSubmit={handleCreateClass}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="input-label">Select Grade</label>
                <select
                  className="glass-input"
                  style={{ paddingLeft: '14px' }}
                  value={newClassForm.grade}
                  onChange={e => setNewClassForm({ ...newClassForm, grade: e.target.value })}
                >
                  {availableGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="input-label">Subject Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Physics, World History, Robotics"
                  style={{ paddingLeft: '14px' }}
                  value={newClassForm.subject}
                  onChange={e => setNewClassForm({ ...newClassForm, subject: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Class Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. Class 8A"
                    style={{ paddingLeft: '14px' }}
                    value={newClassForm.className}
                    onChange={e => setNewClassForm({ ...newClassForm, className: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Room Number</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. Room 204"
                    style={{ paddingLeft: '14px' }}
                    value={newClassForm.room}
                    onChange={e => setNewClassForm({ ...newClassForm, room: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Schedule Time</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. 09:00 - 10:30"
                    style={{ paddingLeft: '14px' }}
                    value={newClassForm.time}
                    onChange={e => setNewClassForm({ ...newClassForm, time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Class Code</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. PHY8A"
                    style={{ paddingLeft: '14px', textTransform: 'uppercase' }}
                    value={newClassForm.code}
                    onChange={e => setNewClassForm({ ...newClassForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
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
                  Publish Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Scanner for Teacher to Scan Student's QR Badges */}
      {showScanStudentModal && (
        <div className="modal-overlay" onClick={() => setShowScanStudentModal(false)}>
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>
              Scan Student Attendance QR
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Hold camera to student's phone badge or click any student to test scan.
            </p>

            {/* Viewfinder */}
            <div className="qr-scanner-frame" style={{ width: '220px', height: '220px', margin: '0 auto 16px' }}>
              <div style={{ opacity: 0.7 }}>
                <QrCode size={110} color="var(--primary)" />
              </div>
              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />
              <div className="laser-scanner-line" />
            </div>

            {scannedResult && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                marginBottom: '14px',
                background: scannedResult.success ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: scannedResult.success ? 'var(--success)' : 'var(--danger)',
                fontWeight: 700
              }}>
                ✔ {scannedResult.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {studentsRoster.length > 0 && (
                <button 
                  onClick={() => handleQuickScanStudent(studentsRoster[0])}
                  className="btn-primary"
                  style={{ flex: 2, padding: '10px', fontSize: '0.82rem' }}
                >
                  Scan {studentsRoster[0].name}
                </button>
              )}
              <button 
                onClick={() => setShowScanStudentModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Student to Roster */}
      {showAddStudentModal && (
        <div className="modal-overlay" onClick={() => setShowAddStudentModal(false)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>
              Enroll New Student
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Add a student to the school attendance roster.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              addStudentToRoster(newStudentForm);
              setShowAddStudentModal(false);
              setNewStudentForm({ name: '', studentId: generateStudentId(), grade: 'Grade 8', className: 'Class 8A' });
            }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="input-label">Student Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. John Doe"
                  style={{ paddingLeft: '14px' }}
                  value={newStudentForm.name}
                  onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="input-label">Student ID / NISN</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. STD-2025"
                  style={{ paddingLeft: '14px' }}
                  value={newStudentForm.studentId}
                  onChange={e => setNewStudentForm({ ...newStudentForm, studentId: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Grade</label>
                  <select
                    className="glass-input"
                    style={{ paddingLeft: '12px' }}
                    value={newStudentForm.grade}
                    onChange={e => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
                  >
                    {availableGrades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Class</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. Class 8A"
                    style={{ paddingLeft: '12px' }}
                    value={newStudentForm.className}
                    onChange={e => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddStudentModal(false)}
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
