import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ATTENDANCE_HISTORY_INITIAL, 
  TODAY_SCHEDULE, 
  ALL_STUDENTS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_CLASSES,
  AVAILABLE_GRADES
} from '../data/initialData';
import { 
  db, 
  isFirebaseActive, 
  recordAttendanceInFirestore, 
  syncStudentStatusInFirestore 
} from '../firebase';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  // Student Grade selection
  const [studentGrade, setStudentGrade] = useState(() => {
    return localStorage.getItem('stumas_student_grade') || 'Grade 8';
  });

  // Admin-managed classes list (Empty by default, created by Admin)
  const [classesList, setClassesList] = useState(() => {
    const saved = localStorage.getItem('stumas_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].id?.startsWith('cls-math-8a')) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Today's attendance state for the active student (Empty/Clean)
  const [todayAttendance, setTodayAttendance] = useState(() => {
    const saved = localStorage.getItem('stumas_today');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status !== "Present" || parsed.dateStr !== "Monday, 21 April 2025") {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    const today = new Date();
    return {
      checkedIn: false,
      status: "Not Marked",
      time: "-",
      dateStr: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      method: "-"
    };
  });

  // History list (Empty by default)
  const [historyList, setHistoryList] = useState(() => {
    const saved = localStorage.getItem('stumas_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(item => item.id === 'att-1')) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Today's schedules
  const [scheduleList, setScheduleList] = useState(() => {
    return [];
  });

  // Teacher / Admin students roster (Empty by default, populated dynamically)
  const [studentsRoster, setStudentsRoster] = useState(() => {
    const saved = localStorage.getItem('stumas_roster');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(s => s.name === "Andi Pratama")) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Notifications (Empty by default)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('stumas_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(n => n.id === "notif-1")) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Admin active QR token
  const [adminQrCode, setAdminQrCode] = useState(() => {
    return JSON.stringify({
      school: "StuMaS Academy",
      session: "Daily Roll Call",
      token: "STUMAS-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: Date.now()
    });
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('stumas_darkmode') === 'true';
  });

  // Mobile Device Mockup Frame toggle
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('stumas_viewmode') || 'fluid';
  });

  useEffect(() => {
    localStorage.setItem('stumas_today', JSON.stringify(todayAttendance));
  }, [todayAttendance]);

  useEffect(() => {
    localStorage.setItem('stumas_history', JSON.stringify(historyList));
  }, [historyList]);

  useEffect(() => {
    localStorage.setItem('stumas_schedules', JSON.stringify(scheduleList));
  }, [scheduleList]);

  useEffect(() => {
    localStorage.setItem('stumas_roster', JSON.stringify(studentsRoster));
  }, [studentsRoster]);

  useEffect(() => {
    localStorage.setItem('stumas_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('stumas_darkmode', darkMode ? 'true' : 'false');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('stumas_viewmode', viewMode);
  }, [viewMode]);

  // Mark attendance for current student
  const markStudentAttendance = (status = "Present", method = "QR Code Scan", note = "", student = null) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateFormatted = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const dayFormatted = now.toLocaleDateString('en-US', { weekday: 'short' });
    
    setTodayAttendance({
      checkedIn: true,
      status: status,
      time: timeFormatted,
      dateStr: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      method: method
    });

    const newRecord = {
      id: "att-" + Date.now(),
      date: dateFormatted,
      day: dayFormatted,
      status: status,
      checkInTime: timeFormatted,
      method: method,
      location: method === "QR Code Scan" ? "School Terminal" : `Manual Entry (${note || "Approved"})`
    };

    setHistoryList(prev => [newRecord, ...prev]);

    // Also update student in roster if exists
    if (student?.id) {
      setStudentsRoster(prev => prev.map(s => {
        if (s.id === student.id) {
          return { ...s, status, time: timeFormatted };
        }
        return s;
      }));
    }

    // Add notification
    const newNotif = {
      id: "notif-" + Date.now(),
      title: "Attendance Recorded",
      desc: `Attendance (${status}) has been confirmed at ${timeFormatted}.`,
      time: "Just now",
      date: "Today",
      read: false,
      icon: "check-circle",
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Confetti animation on Present
    if (status === "Present") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    // Sync with Firebase Cloud Firestore
    recordAttendanceInFirestore({
      studentId: student?.studentId || "STUDENT",
      studentName: student?.name || "Student",
      status,
      time: timeFormatted,
      date: dateFormatted,
      method,
      note: note || ""
    });

    return true;
  };

  // Admin marks a student
  const updateStudentStatus = (studentId, status, time = "-") => {
    const actualTime = status === "Present" || status === "Late" 
      ? (time === "-" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : time)
      : "-";

    setStudentsRoster(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status, time: actualTime };
      }
      return s;
    }));

    // If updating Andi, sync todayAttendance
    if (studentId === "std-2024001") {
      setTodayAttendance(prev => ({
        ...prev,
        checkedIn: status === "Present" || status === "Late",
        status: status,
        time: actualTime
      }));
    }

    // Sync student roster update to Firebase Firestore
    syncStudentStatusInFirestore(studentId, status, actualTime);
  };

  // Generate new QR Code for Admin
  const refreshAdminQr = (className = "Class 8A", session = "Morning Attendance") => {
    const newCode = JSON.stringify({
      school: "StuMaS Academy",
      class: className,
      session: session,
      date: "2025-04-21",
      token: "ABS-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: Date.now()
    });
    setAdminQrCode(newCode);
    return newCode;
  };

  useEffect(() => {
    localStorage.setItem('stumas_classes', JSON.stringify(classesList));
  }, [classesList]);

  useEffect(() => {
    localStorage.setItem('stumas_student_grade', studentGrade);
  }, [studentGrade]);

  // Admin registers / adds a new student to roster
  const addStudentToRoster = (studentData) => {
    const student = {
      id: "std-" + Date.now(),
      name: studentData.name || "New Student",
      studentId: studentData.studentId || ("STD-" + Math.floor(1000 + Math.random() * 9000)),
      className: studentData.className || "Class 8A",
      grade: studentData.grade || studentGrade || "Grade 8",
      status: "Present",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };
    setStudentsRoster(prev => [student, ...prev]);
    return student;
  };

  // Join a class created in admin side
  const joinClass = (classId, studentId = "std-2024001") => {
    setClassesList(prev => prev.map(cls => {
      if (cls.id === classId) {
        if (!cls.enrolledStudentIds.includes(studentId)) {
          return {
            ...cls,
            enrolledStudentIds: [...cls.enrolledStudentIds, studentId]
          };
        }
      }
      return cls;
    }));

    const targetClass = classesList.find(c => c.id === classId);
    if (targetClass) {
      setNotifications(prev => [{
        id: "notif-" + Date.now(),
        title: "Joined Class",
        desc: `You have successfully enrolled in ${targetClass.subject} (${targetClass.className}).`,
        time: "Just now",
        date: "Today",
        read: false,
        icon: "check-circle",
        type: "success"
      }, ...prev]);
    }
  };

  // Leave / Unenroll from a class
  const leaveClass = (classId, studentId = "std-2024001") => {
    setClassesList(prev => prev.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          enrolledStudentIds: cls.enrolledStudentIds.filter(id => id !== studentId)
        };
      }
      return cls;
    }));
  };

  // Admin creates a new class / grade subject
  const addClass = (classData) => {
    const newClass = {
      id: "cls-" + Date.now(),
      grade: classData.grade || "Grade 8",
      subject: classData.subject || "New Subject",
      className: classData.className || "Class 8A",
      teacher: classData.teacher || "Mr. Budi Santoso",
      time: classData.time || "08:00 - 09:30",
      days: classData.days || "Monday, Wednesday",
      room: classData.room || "Room 101",
      code: classData.code || ("CLS" + Math.floor(1000 + Math.random() * 9000)),
      capacity: Number(classData.capacity) || 35,
      color: classData.color || "#2563eb",
      icon: classData.icon || "book-open",
      enrolledStudentIds: []
    };

    setClassesList(prev => [newClass, ...prev]);

    setNotifications(prev => [{
      id: "notif-" + Date.now(),
      title: "New Class Created",
      desc: `Admin opened ${newClass.subject} for ${newClass.grade}.`,
      time: "Just now",
      date: "Today",
      read: false,
      icon: "calendar",
      type: "info"
    }, ...prev]);

    return newClass;
  };

  // Generate unique student attendance QR code data
  // Generate unique student attendance QR code data
  const getStudentUniqueQr = (student) => {
    return JSON.stringify({
      type: "STUMAS_STUDENT_BADGE",
      studentId: student?.studentId || "STD-001",
      id: student?.id || "std-1",
      name: student?.name || "Student",
      grade: studentGrade,
      className: student?.className || "Class 1",
      timestamp: Date.now(),
      token: "TOKEN-" + (student?.studentId || "STD") + "-" + new Date().toISOString().slice(0, 10)
    });
  };

  // Admin / Teacher scans a student's unique QR code to mark them Present
  const scanStudentQr = (qrString, subject = "General Attendance") => {
    try {
      let parsed = null;
      if (typeof qrString === 'string') {
        parsed = JSON.parse(qrString);
      } else {
        parsed = qrString;
      }

      if (parsed && (parsed.studentId || parsed.name)) {
        const matchingStudent = studentsRoster.find(
          s => s.studentId === parsed.studentId || s.name.toLowerCase() === parsed.name.toLowerCase()
        ) || { id: parsed.id || ("std-" + Date.now()), name: parsed.name, studentId: parsed.studentId, className: parsed.className || "Class 1" };

        updateStudentStatus(matchingStudent.id, "Present");

        // trigger celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }

        return {
          success: true,
          student: matchingStudent,
          message: `Attendance marked for ${matchingStudent.name} (${matchingStudent.studentId}) in ${subject}`
        };
      }
    } catch (err) {
      console.warn("Invalid QR code scanned:", err);
    }
    return { success: false, message: "Invalid student attendance QR code format" };
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Toggle View Mode
  const toggleViewMode = () => setViewMode(prev => prev === 'phone' ? 'fluid' : 'phone');

  return (
    <AttendanceContext.Provider value={{
      studentGrade,
      setStudentGrade,
      classesList,
      joinClass,
      leaveClass,
      addClass,
      addStudentToRoster,
      getStudentUniqueQr,
      scanStudentQr,
      availableGrades: AVAILABLE_GRADES,
      todayAttendance,
      historyList,
      scheduleList,
      studentsRoster,
      notifications,
      adminQrCode,
      darkMode,
      viewMode,
      markStudentAttendance,
      updateStudentStatus,
      refreshAdminQr,
      markAllNotificationsRead,
      clearNotifications,
      toggleDarkMode,
      toggleViewMode
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
