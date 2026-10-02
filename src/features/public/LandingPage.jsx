import React, { useState } from 'react';

export default function LandingPage({ onNavigateToDashboard }) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // Empty form initial state - Pre-fill disabled
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '' 
  });

  // Handle Login / Sign Up Modal Open
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setFormData({ email: '', password: '', name: '' });
    setShowAuthModal(true);
  };

  // Handle Form Submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setShowAuthModal(false);
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col justify-between">
      {/* Main Content Area */}
      <div>
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => openAuthModal('login')}>
              <div className="w-8 h-8 rounded-lg bg-[#0d472a] text-white flex items-center justify-center font-bold text-sm">
                📖
              </div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">HifzMate Pro</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
              <a href="#home" className="hover:text-[#0d472a] transition-colors">Home</a>
              <a href="#features" className="hover:text-[#0d472a] transition-colors">Features</a>
              <a href="#pricing" className="hover:text-[#0d472a] transition-colors">Pricing</a>
              <a href="#about" className="hover:text-[#0d472a] transition-colors">About</a>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-[#0d472a] transition"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 text-xs font-semibold bg-[#0d472a] hover:bg-emerald-900 text-white rounded-lg shadow-sm transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="pt-12 pb-16 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0d472a] border border-emerald-100 text-xs font-semibold">
                ✨ Next-Gen Quran Memorization Platform
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Your Hifz Journey, <br />
                <span className="text-gray-900">Smarter & Easier</span>
              </h1>

              <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-xl">
                Track your Quran memorization, revision, and daily progress with precision analytics and smart revision algorithms.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 max-w-md pt-1 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#0d472a]">✓</span> Smart Revision System
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0d472a]">✓</span> Audio Listening
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0d472a]">✓</span> Detailed Progress Stats
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0d472a]">✓</span> Repetition Analysis
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-6 py-3 bg-[#0d472a] hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-md text-xs transition"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="px-5 py-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <span>▶</span> Watch Demo
                </button>
              </div>
            </div>

            {/* Right Side Image Box */}
            <div className="md:col-span-5 flex justify-center items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white w-full max-w-md">
                <img 
                  src="/img.jpg" 
                  alt="Quran Memorization" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
              <p className="text-gray-500 text-xs">Everything you need to memorize, revise, and retain Quran Majeed effectively.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#0d472a] flex items-center justify-center font-bold text-base">
                  🎙️
                </div>
                <h3 className="font-bold text-gray-800 text-sm">AI Recitation Listener</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Recite verses and get real-time audio playback and tracking to fix mistakes easily.
                </p>
              </div>

              <div className="p-6 bg-slate-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#0d472a] flex items-center justify-center font-bold text-base">
                  🔄
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Smart Revision System</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Smart algorithm schedules weak verse revisions (Sabqi & Manzil) systematically.
                </p>
              </div>

              <div className="p-6 bg-slate-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#0d472a] flex items-center justify-center font-bold text-base">
                  📊
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Detailed Progress Reports</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Track surah, juz, and accuracy trends over time with clean interactive charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Pricing Section */}
        <section id="pricing" className="py-16 bg-slate-50 border-t border-gray-200/60">
          <div className="max-w-4xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Simple Pricing</h2>
              <p className="text-gray-500 text-xs">Start free and upgrade as your Hifz goals grow.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Student Basic */}
              <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Student Basic</h3>
                  <div className="mt-3 text-3xl font-extrabold text-gray-900">Free</div>
                  <ul className="mt-4 space-y-2.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2"><span className="text-[#0d472a] font-bold">✓</span> Daily Hifz tracker</li>
                    <li className="flex items-center gap-2"><span className="text-[#0d472a] font-bold">✓</span> Basic revision planner</li>
                    <li className="flex items-center gap-2"><span className="text-[#0d472a] font-bold">✓</span> Unlimited manual logs</li>
                  </ul>
                </div>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition"
                >
                  Get Started
                </button>
              </div>

              {/* HifzMate Pro */}
              <div className="p-6 bg-[#0d472a] text-white rounded-2xl shadow-xl space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-emerald-100">HifzMate Pro</h3>
                  <div className="mt-3 text-3xl font-extrabold">$5 <span className="text-xs font-normal text-emerald-200">/ month</span></div>
                  <ul className="mt-4 space-y-2.5 text-xs text-emerald-100">
                    <li className="flex items-center gap-2"><span>✓</span> Unlimited Recitation AI Tests</li>
                    <li className="flex items-center gap-2"><span>✓</span> Detailed Weak Verse Analytics</li>
                    <li className="flex items-center gap-2"><span>✓</span> Teacher & Parent Dashboard Access</li>
                  </ul>
                </div>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="w-full py-2.5 bg-white text-[#0d472a] hover:bg-emerald-50 rounded-xl text-xs font-semibold transition shadow-sm"
                >
                  Go Pro
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Solid Dark Green Footer */}
      <footer className="bg-[#0d472a] text-emerald-100 border-t border-emerald-900/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs">
              📖
            </div>
            <span className="font-bold text-sm text-white">HifzMate Pro</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-emerald-200">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </div>

          <p className="text-[11px] text-emerald-300/70">
            © {new Date().getFullYear()} HifzMate Pro. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login / Sign Up Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-xl text-gray-900">
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h3>
              <p className="text-xs text-gray-500">
                {authMode === 'login' 
                  ? 'Enter your details to log in' 
                  : 'Enter your details to register'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2" autoComplete="off">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d472a]"
                  />
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="new-email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d472a]"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d472a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0d472a] hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow transition"
              >
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500 border-t pt-4">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('signup')} 
                    className="text-[#0d472a] font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('login')} 
                    className="text-[#0d472a] font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800 text-sm">HifzMate Pro Live Demo</h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-8 bg-emerald-50 rounded-xl text-center space-y-3">
              <div className="text-4xl">🎬</div>
              <p className="text-xs text-emerald-900 font-medium">
                Click below to enter the live interactive app dashboard.
              </p>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  openAuthModal('login');
                }}
                className="px-5 py-2.5 bg-[#0d472a] text-white font-semibold text-xs rounded-xl shadow hover:bg-emerald-900 transition"
              >
                Enter App Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}