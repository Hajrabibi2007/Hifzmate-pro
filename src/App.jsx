import React, { useState, useEffect } from 'react';
import LandingPage from './features/public/LandingPage';
import StudentDashboard from './features/student/StudentDashboard';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import ParentDashboard from './features/parent/ParentDashboard';

export default function App() {
  // 1. LocalStorage se save hua current page load karein (Agar pehli baar hai toh 'landing' hoga)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('hifzmate_current_page') || 'landing';
  });

  // 2. LocalStorage se save hua user data load karein
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('hifzmate_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 3. Jab bhi currentPage ya currentUser badle, usay browser ki memory mein save karein
  useEffect(() => {
    localStorage.setItem('hifzmate_current_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hifzmate_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hifzmate_current_user');
    }
  }, [currentUser]);

  // Handle User Login
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    localStorage.removeItem('hifzmate_current_page');
    localStorage.removeItem('hifzmate_current_user');
  };

  return (
    <div>
      {/* Dynamic Views */}
      {currentPage === 'landing' ? (
        <LandingPage onNavigateToDashboard={handleLoginSuccess} />
      ) : currentPage === 'teacher' ? (
        <TeacherDashboard onLogout={handleLogout} />
      ) : currentPage === 'parent' ? (
        <ParentDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {/* Role Switcher Floating Bar (Bottom Right) */}
      {currentPage !== 'landing' && (
        <div className="fixed bottom-4 right-4 bg-gray-900/90 text-white p-2 rounded-xl shadow-lg flex items-center gap-2 text-xs z-50 backdrop-blur">
          <span className="text-gray-400 pl-1">Switch View:</span>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-2.5 py-1 rounded-lg transition ${
              currentPage === 'dashboard' ? 'bg-[#0d472a] font-semibold text-white' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setCurrentPage('teacher')}
            className={`px-2.5 py-1 rounded-lg transition ${
              currentPage === 'teacher' ? 'bg-[#0d472a] font-semibold text-white' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setCurrentPage('parent')}
            className={`px-2.5 py-1 rounded-lg transition ${
              currentPage === 'parent' ? 'bg-[#0d472a] font-semibold text-white' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            Parent
          </button>
        </div>
      )}
    </div>
  );
}