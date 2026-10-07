import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  BadgeCheck, 
  Camera, 
  Edit3,
  Shield,
  Heart,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const ProfileView = ({ onBack, onOpenSettings }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { studentGrade, setStudentGrade, availableGrades } = useAttendance();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(currentUser.grade || studentGrade || 'Grade 8');
  const [formData, setFormData] = useState({
    name: currentUser.name || "Student",
    phone: currentUser.phone || "",
    email: currentUser.email || "",
    guardian: currentUser.guardian || ""
  });

  const handleOpenEdit = () => {
    setSelectedGrade(currentUser.grade || studentGrade || 'Grade 8');
    setFormData({
      name: currentUser.name || "Student",
      phone: currentUser.phone || "",
      email: currentUser.email || "",
      guardian: currentUser.guardian || ""
    });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedGrade) {
      setStudentGrade(selectedGrade);
    }
    updateProfile({
      ...formData,
      grade: selectedGrade
    });
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">Student Profile</h2>
        <button onClick={onOpenSettings} className="back-btn" title="Settings">
          <Settings size={18} />
        </button>
      </div>

      {/* Profile Header (Avatar + Name + Class) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          padding: '3px',
          background: 'var(--primary-gradient)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
          marginBottom: '10px'
        }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff'
          }}>
            <Camera size={13} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {currentUser.name}
          <BadgeCheck size={18} color="var(--primary)" />
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {studentGrade} • StuMaS Student
        </span>
      </div>

      {/* Details List Glass Card */}
      <div className="glass-card" style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Student Grade */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <GraduationCap size={18} color="var(--primary)" /> Student Grade
          </div>
          <span className="status-pill present" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
            {studentGrade}
          </span>
        </div>

        {/* Student ID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <User size={18} color="var(--primary)" /> Student ID
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {currentUser.studentId || '-'}
          </span>
        </div>

        {/* Date of Birth */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Calendar size={18} color="var(--primary)" /> Date of Birth
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {currentUser.dob || '-'}
          </span>
        </div>

        {/* Gender */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Shield size={18} color="var(--primary)" /> Gender
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {currentUser.gender || 'Not Specified'}
          </span>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Mail size={18} color="var(--primary)" /> Email
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
            {currentUser.email || '-'}
          </span>
        </div>

        {/* Phone */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Phone size={18} color="var(--primary)" /> Phone
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {currentUser.phone || '-'}
          </span>
        </div>

        {/* Guardian / Parent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Heart size={18} color="var(--primary)" /> Guardian
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {currentUser.guardian || '-'}
          </span>
        </div>
      </div>

      {/* Edit Profile Action */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleOpenEdit} 
          className="btn-primary"
          style={{ height: '46px', fontSize: '0.92rem', flex: 2 }}
        >
          <Edit3 size={17} /> Edit Profile
        </button>

        <button 
          onClick={logout} 
          className="btn-outline"
          style={{
            height: '46px', 
            fontSize: '0.92rem', 
            flex: 1, 
            color: 'var(--danger)', 
            borderColor: 'var(--danger-border)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          title="Sign Out"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
              Edit Student Details
            </h3>

            <form onSubmit={handleSave}>
              {/* Select Your Grade */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="input-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={16} color="var(--primary)" /> Select Your Grade
                  </label>
                  <span className="status-pill present" style={{ fontSize: '0.72rem' }}>
                    Active: {selectedGrade}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexWrap: 'wrap', 
                  padding: '10px',
                  background: 'var(--glass-bg-subtle)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)' 
                }}>
                  {availableGrades.map((gr) => {
                    const isActive = selectedGrade === gr;
                    return (
                      <button
                        key={gr}
                        type="button"
                        onClick={() => setSelectedGrade(gr)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          border: isActive ? 'none' : '1px solid var(--glass-border)',
                          background: isActive ? 'var(--primary-gradient)' : 'var(--glass-bg-subtle)',
                          color: isActive ? '#fff' : 'var(--text-main)',
                          cursor: 'pointer',
                          boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                          transition: 'var(--transition)'
                        }}
                      >
                        {gr}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '14px' }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Phone Number</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '14px' }}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Parent / Guardian Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '14px' }}
                  value={formData.guardian}
                  onChange={e => setFormData({ ...formData, guardian: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
