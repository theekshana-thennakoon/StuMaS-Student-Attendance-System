# AbsenSiswa - Modern Glassy Student Attendance Management System

A web-based student attendance marking system with an integrated **Admin / Teacher Panel**, **Student Portal**, and **Parent View** built with **React**, **Vanilla CSS Glassmorphism**, and **Firebase** integration.

---

## 🚀 How to Run the App

The development server is currently **active and running** at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### Run Locally Anytime
Open your terminal inside the project directory (`D:\attendance`) and run:

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Start the Vite development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ✨ Features & Included Screens (Matching Design Mockups)

1. **Splash / Welcome Screen**:
   - Modern glassmorphism UI with brand identity (`AbsenSiswa`).
   - "Mudah, Cepat, Akurat Untuk Kehadiran Siswa".
   - Hero student character illustration with verified security badge.
   - One-tap "Get Started" and "Login" navigation.

2. **Login Screen**:
   - Email/Username & Password with interactive show/hide toggle.
   - Quick Demo Role selector pills (Student, Teacher/Admin, Parent) for 1-click test login.
   - "Continue with Google" authentication button.

3. **Student Home / Dashboard**:
   - Header with student avatar (Andi Pratama) and unread notification badge.
   - Gradient hero card: **"Today's Attendance - Monday, 21 April 2025"** with real-time status pill (`✔ Present`).
   - Glassy quick-action grid: **Check In (QR Scanner)**, **Attendance History**, **My Profile**.
   - **Today's Schedule**: Mathematics, Indonesian Language, Science with live status pills.

4. **Check In / QR Scanner**:
   - Animated glowing viewfinder reticle with interactive scanning laser line.
   - Real device webcam integration (`Open Camera`) with live geofence verification.
   - Interactive verification with celebratory confetti animation upon marking attendance.
   - **Manual Check In modal** for absence notes, sick leave, or traffic excuses.

5. **Attendance History**:
   - Interactive month switcher (`< April 2025 >`).
   - Stat cards: **18 Present**, **1 Sick**, **1 Absent**, **1 Late**.
   - Status filters and chronological daily attendance timeline.

6. **Class Schedule**:
   - Weekly date picker strip (Mon 21, Tue 22, Wed 23, Thu 24, Fri 25, Sat 26).
   - Class period cards with subject icons, teacher names, and room numbers.

7. **Student Profile**:
   - Profile photo, student badge, NISN (Student ID: 2024001), Date of Birth, Gender, Email, Phone, Guardian.
   - Interactive "Edit Profile" modal.

8. **Notifications Screen**:
   - Real-time alerts for Attendance Confirmed, Schedule Reminders, and School Announcements with "Mark all read" and "Clear all".

9. **Settings Screen**:
   - Account security options, Language settings.
   - **Dark Mode toggle** with instant smooth theme transitions.
   - **Biometric toggle** & **Layout mode switcher** (Phone Frame Mockup vs Fluid Responsive Web).
   - One-click Log Out.

10. **Admin / Teacher Panel & Parent View**:
    - **Teacher Live QR Generator**: Generates dynamic QR codes to project on the classroom board for students to scan.
    - **Live Class Roster**: View all students in Class 8A and change their status (Present / Late / Sick / Absent) with 1 click.
    - **CSV Export**: Export attendance reports directly to spreadsheet format.
    - **Parent Portal**: View student attendance status, recent grades, and submit excused absence notes directly to teachers.

---

## ☁️ Firebase Database Integration

AbsenSiswa comes with a **Hybrid Data Layer**:
- **Out of the box**: Operates with a reactive local persistence store so you can test all features immediately without any setup.
- **Connect Real Firebase**: Click the **Database (🗄️)** icon in the top bar or go to **Settings > Firebase Database Setup** and paste your Firebase Project keys:
  - `apiKey`
  - `projectId`
  - `authDomain`
  - `appId`

The system connects to **Cloud Firestore** and **Firebase Auth** with instant feedback!
