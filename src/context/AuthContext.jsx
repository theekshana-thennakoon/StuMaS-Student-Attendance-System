import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_STUDENT, DEFAULT_TEACHER } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('stumas_user') || localStorage.getItem('absensiswa_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name !== "Andi Pratama" && parsed.role !== "Parent") return parsed;
      } catch {
        // ignore
      }
    }
    return DEFAULT_STUDENT;
  });

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('stumas_role');
    if (savedRole === 'parent') return 'student';
    return savedRole || 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('stumas_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('stumas_user', JSON.stringify(currentUser));
    localStorage.setItem('stumas_role', role);
    localStorage.setItem('stumas_auth', isAuthenticated ? 'true' : 'false');
  }, [currentUser, role, isAuthenticated]);

  const login = (roleToLogin = 'student', credentials = {}) => {
    if (roleToLogin === 'teacher') {
      setCurrentUser({
        ...DEFAULT_TEACHER,
        name: credentials.name || DEFAULT_TEACHER.name,
        email: credentials.email || DEFAULT_TEACHER.email
      });
      setRole('teacher');
    } else {
      const studentName = credentials.name || (credentials.email ? credentials.email.split('@')[0] : "Student");
      setCurrentUser({
        ...DEFAULT_STUDENT,
        name: studentName,
        email: credentials.email || DEFAULT_STUDENT.email,
        studentId: credentials.studentId || ("STD-" + Math.floor(1000 + Math.random() * 9000))
      });
      setRole('student');
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const switchRole = (newRole) => {
    login(newRole);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
