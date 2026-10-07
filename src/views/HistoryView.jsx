import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock,
  Filter
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const HistoryView = ({ onBack }) => {
  const { historyList } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });
  const [filterStatus, setFilterStatus] = useState('All');

  // Calculate statistics
  const presentCount = historyList.filter(item => item.status === 'Present').length;
  const sickCount = historyList.filter(item => item.status === 'Sick').length;
  const absentCount = historyList.filter(item => item.status === 'Absent').length;
  const lateCount = historyList.filter(item => item.status === 'Late').length;

  const filteredList = historyList.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="status-pill present">
            <CheckCircle2 size={13} /> Present
          </span>
        );
      case 'Sick':
        return (
          <span className="status-pill sick">
            <AlertCircle size={13} /> Sick
          </span>
        );
      case 'Absent':
        return (
          <span className="status-pill absent">
            <XCircle size={13} /> Absent
          </span>
        );
      case 'Late':
        return (
          <span className="status-pill late">
            <Clock size={13} /> Late
          </span>
        );
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="view-header">
        <button onClick={onBack} className="back-btn" title="Back">
          <ArrowLeft size={18} />
        </button>
        <h2 className="view-header-title">Attendance History</h2>
        <div style={{ width: '36px' }} />
      </div>

      {/* Month Selector */}
      <div className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)'
      }}>
        <button 
          onClick={() => setSelectedMonth('March 2025')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
          {selectedMonth}
        </span>
        <button 
          onClick={() => setSelectedMonth('April 2025')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
      }}>
        {/* Present Card */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Present' ? 'All' : 'Present')}
          className="glass-card" 
          style={{
            padding: '14px 10px',
            textAlign: 'center',
            borderRadius: '16px',
            cursor: 'pointer',
            border: filterStatus === 'Present' ? '2px solid var(--success)' : '1px solid var(--glass-border)',
            background: 'rgba(16, 185, 129, 0.05)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>
            Present
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
            {presentCount}
          </div>
        </div>

        {/* Sick Card */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Sick' ? 'All' : 'Sick')}
          className="glass-card" 
          style={{
            padding: '14px 10px',
            textAlign: 'center',
            borderRadius: '16px',
            cursor: 'pointer',
            border: filterStatus === 'Sick' ? '2px solid var(--warning)' : '1px solid var(--glass-border)',
            background: 'rgba(245, 158, 11, 0.05)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '4px' }}>
            Sick
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>
            {sickCount}
          </div>
        </div>

        {/* Absent Card */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Absent' ? 'All' : 'Absent')}
          className="glass-card" 
          style={{
            padding: '14px 10px',
            textAlign: 'center',
            borderRadius: '16px',
            cursor: 'pointer',
            border: filterStatus === 'Absent' ? '2px solid var(--danger)' : '1px solid var(--glass-border)',
            background: 'rgba(239, 68, 68, 0.05)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '4px' }}>
            Absent
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
            {absentCount}
          </div>
        </div>
      </div>

      {/* Filter reset if active */}
      {filterStatus !== 'All' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          padding: '0 4px'
        }}>
          <span>Showing: <strong>{filterStatus}</strong></span>
          <button 
            onClick={() => setFilterStatus('All')} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Show All
          </button>
        </div>
      )}

      {/* History Timeline Logs List */}
      {filteredList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
          <Clock size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>No attendance records found</p>
          <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>
            Attendance logs will appear here once marked via QR code or manual entry.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredList.map((log) => (
            <div 
              key={log.id}
              className="glass-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: '14px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {log.date}{' '}
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {log.day}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                  {log.checkInTime !== '-' ? `Checked in at ${log.checkInTime}` : log.method}
                </div>
              </div>

              <div>
                {getStatusBadge(log.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
