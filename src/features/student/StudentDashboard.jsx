import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import WeakVersesTracker from './WeakVersesTracker';
import MyHifz from './MyHifz';
import DailyPlan from './DailyPlan';
import MutashabihatHistory from './MutashabihatHistory';
import QuranReader from './QuranReader';
import SmartRevision from './SmartRevision';
import QuizModule from './QuizModule';
import RecitationTest from './RecitationTest';
import ProgressModule from './ProgressModule';
import AchievementsModule from './AchievementsModule';

export default function StudentDashboard({ onLogout }) {
  const [studentName, setStudentName] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔴 Logout Confirmation Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Notification Reminder State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Default Stats
  const [userStats, setUserStats] = useState({
    overallProgress: '25%',
    revision: '40%',
    accuracy: '95%',
    streak: '1 Day'
  });

  useEffect(() => {
    // 1. Check if browser notification permission is already granted
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (fullName) {
          setStudentName(fullName);
        } else if (user.email) {
          const emailName = user.email.split('@')[0];
          setStudentName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        } else {
          setStudentName('Student');
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('overall_progress, revision, accuracy, streak')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserStats({
            overallProgress: profile.overall_progress || '25%',
            revision: profile.revision || '40%',
            accuracy: profile.accuracy || '95%',
            streak: profile.streak || '1 Day'
          });
        }
      } else {
        setStudentName('Student');
      }
    };

    fetchUserData();

    // Web Speech API Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'ar-SA';

      recog.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recog.onerror = () => setIsRecording(false);
      recog.onend = () => setIsRecording(false);
      setRecognition(recog);
    }
  }, []);

  // Notification Handler Function
  const handleToggleNotification = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
      if (!notificationsEnabled) {
        new Notification('Hifz Target Reminder Active 📖', {
          body: 'Assalam o Alaikum! Daily targets reminders are now turned ON.',
          icon: '/favicon.ico'
        });
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Reminders Activated! 🔔', {
          body: 'You will receive reminders for your daily Hifz target & Mutashabihat revision.',
          icon: '/favicon.ico'
        });
      }
    } else {
      alert('Notification permissions were blocked. Please enable notifications from browser settings.');
    }
  };

  // 🔴 Confirmed Logout Handler
  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'My Hifz', icon: '📖' },
    { name: 'Quran Reader', icon: '🎧' },
    { name: 'Daily Plan', icon: '📅' },
    { name: 'Recitation Test', icon: '🎙️' },
    { name: 'Mutashabihat History', icon: '⚠️' },
    { name: 'Smart Revision', icon: '🧠' },
    { name: 'Quiz', icon: '❓' },
    { name: 'Progress', icon: '📈' },
    { name: 'Achievements', icon: '🏆' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-[#0d472a] text-white p-4">
        <h2 className="font-bold text-sm">Hifz Dashboard</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleNotification} 
            className="text-base" 
            title="Toggle Daily Reminders"
          >
            {notificationsEnabled ? '🔔' : '🔕'}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-lg focus:outline-none"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <aside className={`w-64 bg-[#0d472a] text-white p-5 flex flex-col justify-between shrink-0 ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div>
          <div className="flex items-center gap-3 bg-[#135d38] p-3 rounded-xl mb-6">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0d472a] font-bold flex items-center justify-center text-sm">
              {studentName ? studentName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="font-semibold text-xs leading-none">{studentName || 'Loading...'}</p>
              <p className="text-[10px] text-emerald-200 mt-1">Student</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  activeTab === item.name
                    ? 'bg-[#186a41] text-white font-semibold shadow-sm'
                    : 'text-emerald-100/80 hover:bg-[#135d38] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom Section (Notifications + Logout) */}
        <div className="pt-4 border-t border-emerald-800 space-y-2 mt-6">
          <button
            onClick={handleToggleNotification}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              notificationsEnabled 
                ? 'bg-[#186a41] text-white' 
                : 'text-emerald-200 hover:bg-[#135d38]'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{notificationsEnabled ? '🔔' : '🔕'}</span> Reminders
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60">
              {notificationsEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 🚪 Logout Button (Confirmation Modal Open Karta Hai) */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-200 hover:bg-red-900/40 hover:text-red-100 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto">
        {activeTab === 'My Hifz' ? (
          <MyHifz />
        ) : activeTab === 'Daily Plan' ? (
          <DailyPlan />
        ) : activeTab === 'Mutashabihat History' ? (
          <MutashabihatHistory />
        ) : activeTab === 'Smart Revision' ? (
          <SmartRevision />
        ) : activeTab === 'Quiz' ? (
          <QuizModule />
        ) : activeTab === 'Recitation Test' ? (
          <RecitationTest />
        ) : activeTab === 'Progress' ? (
          <ProgressModule />
        ) : activeTab === 'Quran Reader' ? (
          <QuranReader />
        ) : activeTab === 'Achievements' ? (
          <AchievementsModule />
        ) : (
          <>
            {/* Dynamic Header Greeting with Notification Bell */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  Assalam o Alaikum, {studentName || 'Student'}! 👋
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Good to see you! You're doing great.</p>
              </div>

              {/* Notification Bell Button in Header */}
              <button
                onClick={handleToggleNotification}
                className={`relative p-2.5 rounded-xl border text-sm transition flex items-center gap-2 ${
                  notificationsEnabled
                    ? 'bg-emerald-50 border-emerald-200 text-[#0d472a]'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
                title="Target Reminder Settings"
              >
                <span>{notificationsEnabled ? '🔔' : '🔕'}</span>
                <span className="text-xs font-semibold hidden sm:inline">
                  {notificationsEnabled ? 'Reminders On' : 'Set Reminders'}
                </span>
                {notificationsEnabled && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-1 -right-1"></span>
                )}
              </button>
            </div>

            {/* Dynamic 4 Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{userStats.overallProgress}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Revision</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{userStats.revision}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Accuracy</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{userStats.accuracy}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Streak</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{userStats.streak}</p>
              </div>
            </div>

            {/* Today's Plan + Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-800 text-sm">Today's Plan</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl text-xs">
                    <div>
                      <p className="font-semibold text-gray-800">Surah Al-Baqarah (Ayat 1 - 15)</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Sabaq • New Lesson</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Daily Plan')}
                      className="px-4 py-1.5 bg-[#0d472a] text-white text-xs rounded-lg hover:bg-[#135d38] transition"
                    >
                      Start
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl text-xs">
                    <div>
                      <p className="font-semibold text-gray-800">Revision: Surah Al-Fatiha</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Sabqi • Old Lesson</p>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-md">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h2 className="font-bold text-gray-800 text-sm mb-1">Quick Actions</h2>
                <button
                  onClick={() => setActiveTab('Recitation Test')}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition flex items-center gap-2 text-xs text-gray-700"
                >
                  <span>🎙️</span> Start Recitation Test
                </button>
                <button 
                  onClick={() => setActiveTab('Quiz')}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition flex items-center gap-2 text-xs text-gray-700"
                >
                  <span>❓</span> Take a Quick Quiz
                </button>
                <button 
                  onClick={() => setActiveTab('Mutashabihat History')}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition flex items-center gap-2 text-xs text-gray-700"
                >
                  <span>⚠️️</span> View My Weak Verses
                </button>
              </div>
            </div>

            {/* AI Recitation Practice */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span>🎙️</span> AI Recitation Practice
              </h2>
              <div className={`p-6 rounded-xl border border-dashed transition text-center flex flex-col items-center gap-3 ${isRecording ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                <button
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 text-[#0d472a]'}`}
                >
                  🎙️
                </button>
                <p className="text-xs text-gray-500">
                  {isRecording ? 'Listening... Recite now' : 'Click microphone to start reciting'}
                </p>
                {transcript && (
                  <div className="mt-2 p-3 bg-white border border-emerald-200 rounded-xl max-w-lg w-full text-right font-serif text-base text-emerald-900 shadow-inner">
                    {transcript}
                  </div>
                )}
              </div>
            </div>

            {/* Weak Verses Tracker */}
            <WeakVersesTracker />
          </>
        )}
      </main>

      {/* 🔴 Confirmation Pop-up Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto font-bold">
              🚪
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-800">
                Are you sure you want to logout?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
              >
                Cancel (منسوخ)
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}