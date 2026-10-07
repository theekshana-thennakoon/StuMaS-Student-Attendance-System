import React, { useState } from 'react';
import { 
  AuthProvider, 
  useAuth 
} from './context/AuthContext';
import { 
  AttendanceProvider, 
  useAttendance 
} from './context/AttendanceContext';
import { GlassAlertProvider } from './context/GlassAlertContext';
import { SplashView } from './views/SplashView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { StudentHomeView } from './views/StudentHomeView';
import { CheckInView } from './views/CheckInView';
import { HistoryView } from './views/HistoryView';
import { ScheduleView } from './views/ScheduleView';
import { ProfileView } from './views/ProfileView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { FirebaseConfigModal } from './views/FirebaseConfigModal';
import { 
  GraduationCap, 
  Sparkles,
  LogOut,
  User,
  Calendar,
  Clock,
  QrCode,
  Layers,
  Settings,
  Bell,
  Home
} from 'lucide-react';
import { isFirebaseActive } from './firebase';

const MainApp = () => {
  const { currentUser, role, isAuthenticated, login, logout, switchRole } = useAuth();
  const { darkMode, toggleDarkMode, notifications } = useAttendance();

  // Screen routing states
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash' | 'login' | 'register' | 'app'
  const [adminLoginInitial, setAdminLoginInitial] = useState(false);
  const [studentTab, setStudentTab] = useState('home'); // 'home' | 'attendance' | 'schedule' | 'history' | 'profile' | 'notifications' | 'settings'
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const effectiveScreen = isAuthenticated ? 'app' : currentScreen;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Modern Responsive Glassy App Header (Only rendered when user is logged in) */}
      {isAuthenticated && (
        <header className="app-header">
          <div className="header-top-row">
            <div 
              className="brand-section" 
              onClick={() => { 
                if (role === 'student') setStudentTab('home');
              }}
            >
              <div className="brand-icon-box">
                <GraduationCap size={24} strokeWidth={2.4} />
              </div>
              <div>
                <div className="brand-title">StuMaS</div>
                <div className="brand-subtitle">Attendance System</div>
              </div>
              {role === 'teacher' && (
                <span className="live-db-badge" style={{
                  background: isFirebaseActive ? 'var(--success-bg)' : 'var(--primary-light)',
                  color: isFirebaseActive ? 'var(--success)' : 'var(--primary)'
                }}>
                  <span className="pulse-indicator" style={{ background: isFirebaseActive ? 'var(--success)' : 'var(--primary)', width: '6px', height: '6px' }} />
                  <span>{isFirebaseActive ? 'Cloud Live' : 'Local DB'}</span>
                </span>
              )}
            </div>

            {/* Quick utility icons & Role Indicator (Admin only) */}
            {role === 'teacher' && (
              <div className="header-actions">
                <span 
                  className="status-pill"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    marginRight: '6px'
                  }}
                >
                  👨‍🏫 Admin Panel
                </span>

                <button 
                  onClick={() => { logout(); setCurrentScreen('login'); }}
                  className="icon-circle-btn" 
                  title="Sign Out"
                  style={{ color: 'var(--danger)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Student Navigation (Desktop Top Strip / Mobile Bottom Tabs) */}
      {effectiveScreen === 'app' && role === 'student' && (
        <nav className="student-nav-strip">
          {[
            { id: 'home', label: 'Dashboard', icon: Home },
            { id: 'attendance', label: 'QR Badge', icon: QrCode },
            { id: 'history', label: 'History', icon: Calendar },
            { id: 'schedule', label: 'Schedule', icon: Clock },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = studentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStudentTab(tab.id)}
                className={`student-nav-tab-btn ${isActive ? 'active' : ''}`}
                title={tab.label}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                  {tab.badge > 0 && (
                    <span className="tab-badge">{tab.badge}</span>
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Main Content Workspace (Full Width & Fluid Responsive) */}
      <main className="app-workspace">
        {/* 1. Splash Screen */}
        {effectiveScreen === 'splash' && (
          <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
            <SplashView 
              onGetStarted={() => { setAdminLoginInitial(false); setCurrentScreen('login'); }}
              onLoginClick={() => { setAdminLoginInitial(false); setCurrentScreen('login'); }}
              onAdminLoginClick={() => { setAdminLoginInitial(true); setCurrentScreen('login'); }}
            />
          </div>
        )}

        {/* 2. Login Screen */}
        {effectiveScreen === 'login' && (
          <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}>
            <LoginView 
              initialIsAdmin={adminLoginInitial}
              onBack={() => setCurrentScreen('splash')}
              onRegisterClick={() => setCurrentScreen('register')}
              onLoginSuccess={() => setCurrentScreen('app')}
            />
          </div>
        )}

        {/* 2.5 Register Screen */}
        {effectiveScreen === 'register' && (
          <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
            <RegisterView 
              onBack={() => setCurrentScreen('login')}
              onLoginClick={() => setCurrentScreen('login')}
              onRegisterSuccess={() => setCurrentScreen('app')}
            />
          </div>
        )}

        {/* 3. Authenticated Views */}
        {effectiveScreen === 'app' && (
          <>
            {/* TEACHER / ADMIN PANEL */}
            {role === 'teacher' && (
              <AdminDashboardView 
                onOpenFirebaseConfig={() => setIsFirebaseModalOpen(true)}
              />
            )}


            {/* STUDENT VIEWS */}
            {role === 'student' && (
              <>
                {studentTab === 'home' && (
                  <StudentHomeView 
                    onNavigateTab={(tab) => setStudentTab(tab)}
                    onOpenNotifications={() => setStudentTab('notifications')}
                    onOpenSchedule={() => setStudentTab('schedule')}
                  />
                )}

                {studentTab === 'attendance' && (
                  <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
                    <CheckInView 
                      onBack={() => setStudentTab('home')}
                      onCheckInComplete={() => setStudentTab('home')}
                    />
                  </div>
                )}

                {studentTab === 'history' && (
                  <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                    <HistoryView 
                      onBack={() => setStudentTab('home')}
                    />
                  </div>
                )}

                {studentTab === 'schedule' && (
                  <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                    <ScheduleView 
                      onBack={() => setStudentTab('home')}
                    />
                  </div>
                )}

                {studentTab === 'profile' && (
                  <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <ProfileView 
                      onBack={() => setStudentTab('home')}
                      onOpenSettings={() => setStudentTab('settings')}
                    />
                  </div>
                )}

                {studentTab === 'notifications' && (
                  <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%' }}>
                    <NotificationsView 
                      onBack={() => setStudentTab('home')}
                    />
                  </div>
                )}

                {studentTab === 'settings' && (
                  <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <SettingsView 
                      onBack={() => setStudentTab('home')}
                      onOpenFirebaseConfig={() => setIsFirebaseModalOpen(true)}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Firebase Database Config Modal */}
      <FirebaseConfigModal 
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <GlassAlertProvider>
      <AuthProvider>
        <AttendanceProvider>
          <MainApp />
        </AttendanceProvider>
      </AuthProvider>
    </GlassAlertProvider>
  );
}
