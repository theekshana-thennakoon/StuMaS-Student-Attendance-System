import React from 'react';
import { Home, QrCode, Calendar, User } from 'lucide-react';

export const BottomNav = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="bottom-nav-bar">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <IconComponent size={20} className="nav-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
