import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_STUDENT, DEFAULT_TEACHER } from '../data/initialData';
import { registerUserInFirebase, loginUserFromFirebase } from '../firebase';

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

  const loginWithFirebase = async (identifier, password, targetRole = 'student') => {
    const result = await loginUserFromFirebase(identifier, password, targetRole);
    if (!result.success) {
      return result;
    }
    const user = result.user;
    if (targetRole === 'teacher' || user.role === 'teacher' || user.role === 'admin') {
      setCurrentUser({
        ...DEFAULT_TEACHER,
        name: user.name || "Administrator",
        email: user.email || "admin@school.edu"
      });
      setRole('teacher');
    } else {
      setCurrentUser({
        ...DEFAULT_STUDENT,
        name: user.name || "Student",
        email: user.email || "",
        studentId: user.studentId || ("STD-" + Math.floor(1000 + Math.random() * 9000)),
        grade: user.grade || "Grade 8",
        className: user.className || "Class 8A"
      });
      setRole('student');
    }
    setIsAuthenticated(true);
    return { success: true, user };
  };

  const registerUser = async (registrationData) => {
    const result = await registerUserInFirebase(registrationData);
    if (!result.success) {
      return result;
    }
    const user = result.user;
    setCurrentUser({
      ...DEFAULT_STUDENT,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      grade: user.grade || "Grade 8",
      className: user.className || "Class 8A"
    });
    setRole('student');
    setIsAuthenticated(true);
    return result;
  };

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
        studentId: credentials.studentId || ("STD-" + Math.floor(1000 + Math.random() * 9000)),
        grade: credentials.grade || "Grade 8",
        className: credentials.className || "Class 8A"
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
      loginWithFirebase,
      registerUser,
      logout,
      updateProfile,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
