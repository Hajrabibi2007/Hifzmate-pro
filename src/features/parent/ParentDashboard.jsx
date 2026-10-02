import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ParentDashboard({ onLogout }) {
  const [parentName, setParentName] = useState('Parent');
  const [childName, setChildName] = useState('Ali Ahmed');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'reports'
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mobile Menu Toggle State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Stats
  const [stats, setStats] = useState({
    sabaqCompleted: '0 / 0',
    sabaqCount: 0,
    sabaqTotal: 0,
    revisionSessions: 0,
    examsPassed: 0,
    weakAreas: 0,
    overallProgress: 0,
  });

  const [activities, setActivities] = useState([]);
  const [sabaqAssignments, setSabaqAssignments] = useState([]);

  // Main Data Fetch Function (Supports both LocalStorage Sync & Supabase)
  const fetchParentData = async () => {
    setLoading(true);
    try {
      // 1. Fetch from LocalStorage (Sync with Teacher Dashboard)
      const localFeedbacks = JSON.parse(localStorage.getItem('hifz_parent_feedbacks')) || [];
      const localAssignments = JSON.parse(localStorage.getItem('hifz_assignments')) || [];
      const localStudents = JSON.parse(localStorage.getItem('hifz_students')) || [];

      let mergedFeedbacks = [...localFeedbacks];
      let mergedAssignments = [...localAssignments];

      // 2. Fetch Logged-in User & Data from Supabase if connected
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const pName = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Parent');
          const cName = user.user_metadata?.child_name || 'Ali Ahmed';
          setParentName(pName);
          setChildName(cName);

          // Fetch Progress
          const { data: studentData } = await supabase
            .from('hifz_progress')
            .select('*')
            .eq('parent_id', user.id);

          if (studentData && studentData.length > 0) {
            const completed = studentData.filter(item => item.status === 'Completed').length;
            const total = studentData.length;
            const revision = studentData.filter(item => item.type === 'revision').length;
            const passed = studentData.filter(item => item.exam_passed === true).length;
            const weak = studentData.filter(item => item.status === 'Needs Revision' || item.is_weak === true).length;
            const calcProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

            setStats({
              sabaqCompleted: `${completed} / ${total}`,
              sabaqCount: completed,
              sabaqTotal: total,
              revisionSessions: revision,
              examsPassed: passed,
              weakAreas: weak,
              overallProgress: calcProgress,
            });
          }

          // Fetch Supabase Feedback
          const { data: feedbackData } = await supabase
            .from('teacher_feedback')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

          if (feedbackData && feedbackData.length > 0) {
            mergedFeedbacks = [...feedbackData, ...mergedFeedbacks];
          }
        }
      }

      // Local Data Fallback Calculations if Supabase stats are zero
      if (mergedAssignments.length > 0) {
        const sabaqCount = mergedAssignments.filter(a => a.type === 'Sabaq').length;
        const total = mergedAssignments.length;
        const revision = mergedAssignments.filter(a => a.type === 'Sabqi' || a.type === 'Manzil').length;

        setStats(prev => ({
          ...prev,
          sabaqCompleted: `${sabaqCount} / ${total}`,
          sabaqCount: sabaqCount,
          sabaqTotal: total,
          revisionSessions: revision,
          overallProgress: total > 0 ? Math.round((sabaqCount / total) * 100) : 0,
        }));
      }

      setActivities(mergedFeedbacks);
      setSabaqAssignments(mergedAssignments);

    } catch (err) {
      console.error('Error loading parent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Realtime Supabase & LocalStorage Event Listeners
  useEffect(() => {
    fetchParentData();

    // Listen to local storage updates across tabs
    const handleStorageChange = () => fetchParentData();
    window.addEventListener('storage', handleStorageChange);

    if (supabase) {
      const progressSub = supabase
        .channel('realtime-parent-progress')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hifz_progress' }, fetchParentData)
        .subscribe();

      const feedbackSub = supabase
        .channel('realtime-parent-feedback')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teacher_feedback' }, fetchParentData)
        .subscribe();

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        supabase.removeChannel(progressSub);
        supabase.removeChannel(feedbackSub);
      };
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  // Helper function to render Star Icons
  const renderStars = (rating) => {
    const stars = Number(rating) || 5;
    return '⭐'.repeat(stars);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 font-sans relative">

      {/* Mobile Top Header with Hamburger Button */}
      <div className="md:hidden bg-[#0d472a] text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <div>
            <h2 className="font-bold text-sm leading-tight">HifzMate Pro</h2>
            <p className="text-[9px] text-emerald-200">Parent Portal</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-[#135d38] rounded-lg text-white text-lg focus:outline-none"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Responsive Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-60 bg-[#0d472a] text-white flex flex-col justify-between p-4 shadow-xl shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📖</span>
              <div>
                <h2 className="font-bold text-base leading-tight">HifzMate Pro</h2>
                <p className="text-[10px] text-emerald-200">Parent Portal</p>
              </div>
            </div>
            {/* Close button inside sidebar for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white text-lg p-1"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'dashboard' ? 'bg-white/20 text-white font-bold' : 'text-emerald-100/70 hover:bg-white/10'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'reports' ? 'bg-white/20 text-white font-bold' : 'text-emerald-100/70 hover:bg-white/10'
              }`}
            >
              📑 Progress Reports
            </button>
          </nav>
        </div>

        {/* Logged-in User Profile Info & Logout */}
        <div className="border-t border-emerald-800/60 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white">
              {parentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[100px]">{parentName}</p>
              <p className="text-[10px] text-emerald-300">Parent</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-xs text-red-300 hover:text-red-100 font-semibold px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay to close mobile menu when clicking outside */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
      {/* Main Workspace View */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Parent Dashboard 👨‍‍👩‍👧' : 'Child Progress Report 📑'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Welcome, <span className="font-semibold text-[#0d472a]">{parentName}</span>! Monitoring child:{' '}
              <span className="font-semibold text-gray-700">{childName}</span>
            </p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="self-start sm:self-auto px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SABAQ COMPLETED</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.sabaqCompleted}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">REVISION SESSIONS</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.revisionSessions}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">EXAMS PASSED</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{stats.examsPassed}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WEAK AREAS</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{stats.weakAreas}</p>
              </div>
            </div>

            {/* Live Sabaq Assigned Feed */}
            {sabaqAssignments.length > 0 && (
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#0d472a] flex items-center gap-2">
                  <span>📖</span> Recent Sabaq & Revision Assigned by Teacher
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sabaqAssignments.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-900">{item.type}</span>
                        <span className="text-[10px] text-emerald-600">{item.date}</span>
                      </div>
                      <p className="font-medium text-gray-700">{item.surah}</p>
                      <p className="text-[11px] text-gray-500">{item.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Realtime Feedback & Progress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher Feedback Section */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-700">Teacher Direct Feedback 💬</h3>
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center">No teacher feedback recorded yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {activities.map((act, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{act.type || act.title || 'Teacher Review'}</span>
                          <span className="text-xs">{renderStars(act.rating)}</span>
                        </div>
                        <p className="text-gray-600 text-[11px]">"{act.message}"</p>
                        <span className="text-[10px] text-gray-400 block pt-1">
                          {act.date || act.created_at ? new Date(act.created_at || act.date).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Ring */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <h3 className="text-xs font-bold text-gray-700">Overall Progress Ring</h3>

                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-600 transition-all duration-500 ease-out"
                        strokeDasharray={`${stats.overallProgress}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-800">{stats.overallProgress}%</span>
                      <span className="text-[10px] text-gray-400 font-medium">Completed</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="w-full py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition shadow-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROGRESS REPORTS VIEW */}
        {activeTab === 'reports' && (
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800">Detailed Progress Report</h2>
              <p className="text-xs text-gray-500">Comprehensive breakdown of student performance and learning metrics.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">Total Hifz Target Completion</span>
                <span className="text-emerald-700">{stats.overallProgress}% Completed</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${stats.overallProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <p className="text-gray-500 font-medium">Sabaq Target Progress</p>
                <p className="text-xl font-bold text-emerald-800">{stats.sabaqCompleted}</p>
                <p className="text-[10px] text-emerald-600">Lessons completed vs total assigned</p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                <p className="text-gray-500 font-medium">Revision Logged</p>
                <p className="text-xl font-bold text-blue-800">{stats.revisionSessions} Sessions</p>
                <p className="text-[10px] text-blue-600">Total practice sessions finished</p>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                <p className="text-gray-500 font-medium">Exams Status</p>
                <p className="text-xl font-bold text-purple-800">{stats.examsPassed} Cleared</p>
                <p className="text-[10px] text-purple-600">Successful recitation tests</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* View Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-gray-800">Child Progress Details ({childName})</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Sabaq Status:</span>
                <span className="font-semibold text-gray-800">{stats.sabaqCompleted}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Total Revision Sessions:</span>
                <span className="font-semibold text-gray-800">{stats.revisionSessions} sessions</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Exams Passed:</span>
                <span className="font-semibold text-emerald-600">{stats.examsPassed}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Flagged Weak Areas:</span>
                <span className="font-semibold text-amber-600">{stats.weakAreas}</span>
              </div>
            </div>

            <button onClick={() => setShowDetailsModal(false)} className="w-full py-2 bg-[#0d472a] text-white text-xs font-semibold rounded-xl hover:bg-[#135d38]">Close</button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
              🚪
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-gray-800">Confirm Logout</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to log out from this website?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition"
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