import React, { useState } from 'react';

export default function StudentDashboard({ onNavigateToLanding }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#fdf8f6] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0d472a] text-white flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* User Profile Info */}
          <div className="flex items-center gap-3 p-3 mb-6 bg-[#135d38] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-300 text-[#0d472a] font-bold flex items-center justify-center">
              AF
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ayesha Fatima</h3>
              <p className="text-xs text-emerald-200">Student</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-[#135d38] space-y-1">
            <SidebarItem 
              id="dashboard" 
              label="Dashboard" 
              icon="🏠" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="my-hifz" 
              label="My Hifz" 
              icon="📖" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="daily-plan" 
              label="Daily Plan" 
              icon="📅" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="recitation" 
              label="Recitation Test" 
              icon="🎙️" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="mistakes" 
              label="Mistake History" 
              icon="⚠️" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="smart-revision" 
              label="Smart Revision" 
              icon="🔄" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="quiz" 
              label="Quiz" 
              icon="❓" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="progress" 
              label="Progress" 
              icon="📈" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SidebarItem 
              id="achievements" 
              label="Achievements" 
              icon="🏅" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </nav>
        </div>

        {/* Footer / Back Link */}
        <div className="pt-4 border-t border-emerald-800/60">
          <button 
            onClick={onNavigateToLanding}
            className="w-full text-left px-3 py-2 text-xs text-emerald-200 hover:text-white transition"
          >
            ← Back to Landing Page
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dynamic Header based on active tab */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Assalam o Alaikum, Ayesha! 👋'}
              {activeTab === 'my-hifz' && 'My Hifz Progress 📖'}
              {activeTab === 'daily-plan' && 'Today\'s Study Plan 📅'}
              {activeTab === 'recitation' && 'AI Recitation Test 🎙️'}
              {activeTab === 'mistakes' && 'Mistake History & Analytics ⚠️'}
              {activeTab === 'smart-revision' && 'Smart Revision Schedule 🔄'}
              {activeTab === 'quiz' && 'Hifz Revision Quiz ❓'}
              {activeTab === 'progress' && 'Detailed Progress Reports 📈'}
              {activeTab === 'achievements' && 'Badges & Achievements 🏅'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Keep going! You are doing great on your Quran memorization journey.
            </p>
          </div>
        </header>

        {/* Dynamic Content Views */}
        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'my-hifz' && <MyHifzView />}
        {activeTab === 'daily-plan' && <DailyPlanView />}
        {activeTab === 'recitation' && <RecitationView />}
        {activeTab === 'mistakes' && <MistakesView />}
        {activeTab === 'smart-revision' && <SmartRevisionView />}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'achievements' && <AchievementsView />}
      </main>
    </div>
  );
}

// Sub-Component: Sidebar Navigation Item
function SidebarItem({ id, label, icon, activeTab, setActiveTab }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
        isActive
          ? 'bg-[#186b40] text-white font-medium shadow-sm'
          : 'text-emerald-100 hover:bg-[#135d38] hover:text-white'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ---------------- VIEWS ----------------

function DashboardView({ setActiveTab }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Memorization" value="72%" color="text-emerald-700" />
        <StatCard title="Revision" value="81%" color="text-emerald-700" />
        <StatCard title="Accuracy" value="89%" color="text-emerald-700" />
        <StatCard title="Consistency" value="12 Days" color="text-emerald-700" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
          <h2 className="font-bold text-gray-800">Today's Plan</h2>
          <div className="p-4 bg-emerald-50/50 rounded-xl flex items-center justify-between border border-emerald-100">
            <div>
              <h4 className="font-semibold text-gray-800">Surah Al-Baqarah (Ayat 1 - 10)</h4>
              <p className="text-xs text-gray-500">Recitation Test (15 min)</p>
            </div>
            <button 
              onClick={() => setActiveTab('recitation')}
              className="bg-[#0d472a] text-white px-4 py-1.5 rounded-lg text-xs hover:bg-[#135d38]"
            >
              Start
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100 opacity-75">
            <div>
              <h4 className="font-semibold text-gray-800">Revision: Surah Al-Fatiha</h4>
              <p className="text-xs text-emerald-600 font-medium">Completed ✓</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 space-y-3">
          <h2 className="font-bold text-gray-800 mb-2">Quick Actions</h2>
          <button 
            onClick={() => setActiveTab('recitation')}
            className="w-full text-left p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-[#0d472a] transition"
          >
            🎙️ Start Recitation Test
          </button>
          <button 
            onClick={() => setActiveTab('smart-revision')}
            className="w-full text-left p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-[#0d472a] transition"
          >
            📖 Hide & Recall Mode
          </button>
          <button 
            onClick={() => setActiveTab('mistakes')}
            className="w-full text-left p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-[#0d472a] transition"
          >
            ⚠️ View My Weak Areas
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm">
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
    </div>
  );
}

function MyHifzView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
      <h2 className="font-bold text-lg mb-4 text-gray-800">Memorized Surahs</h2>
      <div className="space-y-3">
        {['Surah Al-Fatiha', 'Surah Al-Baqarah (Juz 1)', 'Surah Yaseen', 'Surah Al-Mulk'].map((surah, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 border-b border-gray-100">
            <span className="font-medium text-gray-700">{surah}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">100% Memorized</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyPlanView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
      <h2 className="font-bold text-lg text-gray-800">Today's Schedule</h2>
      <p className="text-sm text-gray-600">Complete your tasks to maintain your 12-day streak 🔥</p>
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
        <h3 className="font-semibold text-[#0d472a]">Morning Session</h3>
        <p className="text-xs text-gray-600">Sabaq: Surah Al-Baqarah (Verses 11 - 20)</p>
      </div>
    </div>
  );
}

function RecitationView() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-[#0d472a] rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
        🎙️
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">AI Recitation Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">Tap the microphone and start reciting. AI will detect pronunciation & memory mistakes in real-time.</p>
      </div>
      <button className="bg-[#0d472a] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-[#135d38] transition">
        Start Reciting
      </button>
    </div>
  );
}

function MistakesView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
      <h2 className="font-bold text-lg text-gray-800">Weak Verses & Common Mistakes</h2>
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-1">
        <span className="text-xs font-bold text-red-600">Surah Al-Baqarah - Verse 7</span>
        <p className="text-sm text-gray-700">Frequent hesitation on Tajweed rule (Ghunnah).</p>
      </div>
    </div>
  );
}

function SmartRevisionView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
      <h2 className="font-bold text-lg mb-2 text-gray-800">Smart Revision Algorithm</h2>
      <p className="text-sm text-gray-500 mb-4">Spaced repetition system ensures you never forget previously memorized Juz.</p>
      <button className="bg-[#0d472a] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#135d38]">
        Generate Today's Revision Queue
      </button>
    </div>
  );
}

function QuizView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
      <h2 className="font-bold text-lg text-gray-800">Test Your Memory</h2>
      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
        <p className="font-semibold text-gray-800">Complete the Ayat: "ذَٰلِكَ الْكِتَابُ..."</p>
      </div>
    </div>
  );
}

function ProgressView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
      <h2 className="font-bold text-lg mb-2 text-gray-800">Overall Hifz Analytics</h2>
      <p className="text-sm text-gray-500">You have completed 4 Juz out of 30.</p>
    </div>
  );
}

function AchievementsView() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 grid grid-cols-3 gap-4">
      <div className="p-4 border rounded-xl text-center space-y-1">
        <span className="text-3xl">🔥</span>
        <h3 className="font-bold text-sm">10-Day Streak</h3>
        <p className="text-xs text-gray-400">Unlocked!</p>
      </div>
      <div className="p-4 border rounded-xl text-center space-y-1">
        <span className="text-3xl">🌟</span>
        <h3 className="font-bold text-sm">First Juz Done</h3>
        <p className="text-xs text-gray-400">Unlocked!</p>
      </div>
    </div>
  );
}