import React, { useState, useEffect } from 'react';

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('Ustad');
  const [teacherGender, setTeacherGender] = useState('male');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedStudent, setSelectedStudent] = useState('');

  // 1. Earnings & Wallet State
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('hifz_wallet');
    return saved ? JSON.parse(saved) : { totalEarned: 45000, currentBalance: 12500, pendingPayout: 0 };
  });

  const [payouts, setPayouts] = useState(() => {
    const saved = localStorage.getItem('hifz_payouts');
    return saved ? JSON.parse(saved) : [
      { id: 'PO-9921', date: '2026-03-01', amount: 15000, status: 'Completed', method: 'JazzCash' },
      { id: 'PO-8812', date: '2026-02-15', amount: 17500, status: 'Completed', method: 'EasyPaisa' },
    ];
  });

  const [payoutForm, setPayoutForm] = useState({ amount: '', method: 'JazzCash', accountNo: '' });

  // 2. Surahs List State
  const [surahList, setSurahList] = useState([]);

  // 3. Real Students State
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('hifz_students');
    return saved ? JSON.parse(saved) : [
      { id: '101', name: 'Ali Ahmed', phone: '03001234567', currentJuz: 'Juz 3', status: 'Active', startDate: '2026-01-10', attendance: 'Present' },
      { id: '102', name: 'Hamza Khan', phone: '03007654321', currentJuz: 'Juz 5', status: 'Active', startDate: '2026-02-15', attendance: 'Present' },
      { id: '103', name: 'Usman Ghani', phone: '03129876543', currentJuz: 'Juz 12', status: 'Active', startDate: '2025-11-01', attendance: 'Present' },
    ];
  });

  // 4. Assignments / Progress State
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('hifz_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Shared Parent Feedbacks State (Auto Syncs with Parent Dashboard)
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('hifz_parent_feedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // 6. Attendance Logs
  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('hifz_attendance_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // 7. Exam Creation Wizard State
  const [examWizardStep, setExamWizardStep] = useState(1);
  const [examData, setExamData] = useState({ title: '', classId: 'Class 1-A', surahStart: '', surahEnd: '', examType: 'Oral Recitation', totalMarks: 100 });
  const [createdExams, setCreatedExams] = useState(() => {
    const saved = localStorage.getItem('hifz_exams');
    return saved ? JSON.parse(saved) : [];
  });

  // Forms
  const [sabaqForm, setSabaqForm] = useState({ surah: '', fromAyah: '1', toAyah: '10', type: 'Sabaq' });
  const [feedbackForm, setFeedbackForm] = useState({ studentId: '101', message: '', type: 'Good Progress', rating: 5 });
  const [newStudentForm, setNewStudentForm] = useState({ name: '', phone: '', currentJuz: 'Juz 1' });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('hifz_wallet', JSON.stringify(wallet)); }, [wallet]);
  useEffect(() => { localStorage.setItem('hifz_payouts', JSON.stringify(payouts)); }, [payouts]);
  useEffect(() => { localStorage.setItem('hifz_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('hifz_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('hifz_parent_feedbacks', JSON.stringify(feedbacks)); }, [feedbacks]);
  useEffect(() => { localStorage.setItem('hifz_attendance_logs', JSON.stringify(attendanceLogs)); }, [attendanceLogs]);
  useEffect(() => { localStorage.setItem('hifz_exams', JSON.stringify(createdExams)); }, [createdExams]);

  // Fetch Surahs API
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => { if (data && data.data) setSurahList(data.data); })
      .catch((err) => console.error('Error fetching Surahs:', err));
  }, []);

  // Attendance Toggle with Confirmation
  const handleAttendanceChange = (id, studentName, status) => {
    if (status === 'Absent') {
      const confirmAbsent = window.confirm(`Kya aap ${studentName} ko ABSENT mark karna chahte hain?`);
      if (!confirmAbsent) return;
    }

    const today = new Date().toISOString().split('T')[0];
    setStudents(students.map(s => s.id === id ? { ...s, attendance: status } : s));

    const newLog = { id: Date.now(), studentId: id, studentName, date: today, status };
    setAttendanceLogs([newLog, ...attendanceLogs]);
  };

  // Add New Student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentForm.name) return;
    const newStudent = {
      id: Date.now().toString(),
      name: newStudentForm.name,
      phone: newStudentForm.phone || '03000000000',
      currentJuz: newStudentForm.currentJuz,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      attendance: 'Present'
    };
    setStudents([...students, newStudent]);
    setNewStudentForm({ name: '', phone: '', currentJuz: 'Juz 1' });
    alert('Naya Student kamyabi se add ho gaya!');
  };

  // Move to Graduate / Alumni
  const handleGraduateStudent = (id) => {
    if (window.confirm('Kya yeh student Hifz poora kar chuka hai? Iss ko Graduates list mein shift kar dein?')) {
      setStudents(students.map(s => s.id === id ? { ...s, status: 'Graduated' } : s));
    }
  };

  // Assign Sabaq / Live Progress Update to Parent Dashboard
  const handleAssignSabaq = (e) => {
    e.preventDefault();
    if (!selectedStudent || !sabaqForm.surah) { alert('Student aur Surah select karein.'); return; }

    const targetStudent = students.find(s => s.name === selectedStudent);
    const newAssignment = {
      id: Date.now(),
      studentId: targetStudent ? targetStudent.id : '101',
      student: selectedStudent,
      surah: sabaqForm.surah,
      range: `Ayat ${sabaqForm.fromAyah}-${sabaqForm.toAyah}`,
      type: sabaqForm.type,
      date: new Date().toLocaleDateString()
    };

    setAssignments([newAssignment, ...assignments]);
    alert(`✅ Progress update ho gayi aur Parent Dashboard mein chali gayi!`);
    setSelectedStudent('');
  };

  // Direct Parent Dashboard Feedback
  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackForm.studentId || !feedbackForm.message) {
      alert('Student aur Message zaroori hai.');
      return;
    }

    const targetStudent = students.find(s => s.id.toString() === feedbackForm.studentId.toString());

    const newFb = {
      id: Date.now(),
      studentId: feedbackForm.studentId,
      studentName: targetStudent ? targetStudent.name : 'Student',
      message: feedbackForm.message,
      type: feedbackForm.type,
      rating: feedbackForm.rating,
      date: new Date().toLocaleDateString()
    };

    setFeedbacks([newFb, ...feedbacks]);
    setFeedbackForm({ studentId: feedbackForm.studentId, message: '', type: 'Good Progress', rating: 5 });

    alert(`✅ Feedback aur Star Rating direct Parent Dashboard mein bhej di gayi hai!`);
  };

  // Payout Request
  const handleRequestPayout = (e) => {
    e.preventDefault();
    const amountNum = Number(payoutForm.amount);
    if (!amountNum || amountNum <= 0) { alert('Sahi amount darj karein.'); return; }
    if (amountNum > wallet.currentBalance) { alert('Aap ke balance se zyada amount hai.'); return; }

    const newReq = {
      id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: amountNum,
      status: 'Pending',
      method: payoutForm.method
    };

    setWallet({
      ...wallet,
      currentBalance: wallet.currentBalance - amountNum,
      pendingPayout: wallet.pendingPayout + amountNum
    });

    setPayouts([newReq, ...payouts]);
    setPayoutForm({ amount: '', method: 'JazzCash', accountNo: '' });
    alert('Payout Request bhej di gayi hai!');
  };

  // Create Exam Save
  const handleSaveExam = () => {
    if (!examData.title) { alert('Exam ka title likhein.'); return; }
    const newExam = { id: Date.now(), ...examData, date: new Date().toLocaleDateString() };
    setCreatedExams([newExam, ...createdExams]);
    setExamWizardStep(1);
    setExamData({ title: '', classId: 'Class 1-A', surahStart: '', surahEnd: '', examType: 'Oral Recitation', totalMarks: 100 });
    alert('Exam kamyabi se create ho gaya!');
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d472a] text-white p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#186a41] flex items-center justify-center font-bold text-white text-sm">
              {teacherGender === 'female' ? '🧕' : '👳'}
            </div>
            <div>
              <p className="font-bold text-sm">{teacherName}</p>
              <p className="text-[10px] text-emerald-200">Hifz Teacher / Qari</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { name: 'Overview', icon: '📊' },
              { name: 'Attendance', icon: '📅' },
              { name: 'Assign Sabaq', icon: '📖' },
              { name: 'Parent Feedback', icon: '💬' },
              { name: 'Create Exam', icon: '📝' },
              { name: 'Student Directory', icon: '👨‍🎓' },
              { name: 'Wallet & Earnings', icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                  activeTab === tab.name ? 'bg-[#186a41] text-white shadow' : 'text-emerald-100 hover:bg-[#135d38]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
            <p className="text-xs text-gray-500">HifzMate Management Dashboard</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTeacherGender(teacherGender === 'male' ? 'female' : 'male')} className="px-3 py-1.5 text-xs bg-white border rounded-xl shadow-sm">
              Gender: {teacherGender === 'male' ? 'Male 👳' : 'Female 🧕'}
            </button>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Total Active Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{students.filter(s => s.status === 'Active').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Today Present</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{students.filter(s => s.attendance === 'Present').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Wallet Balance</p>
                <p className="text-2xl font-bold text-[#0d472a] mt-1">Rs. {wallet.currentBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Graduated Students</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{students.filter(s => s.status === 'Graduated').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* PARENT FEEDBACK TAB */}
        {activeTab === 'Parent Feedback' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-2xl space-y-4">
            <h2 className="font-bold text-gray-800 text-sm">Send Direct Feedback to Parent Dashboard 💬</h2>
            <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select
                  value={feedbackForm.studentId}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, studentId: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.currentJuz})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Performance Star Rating</label>
                <select
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  <option value={2}>⭐⭐ (2 Stars - Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Feedback Category</label>
                <select
                  value={feedbackForm.type}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                >
                  <option value="Good Progress">Good Progress 🌟</option>
                  <option value="Needs Revision">Needs Revision 📖</option>
                  <option value="Recitation Improved">Recitation Improved 🎙️</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Feedback Message</label>
                <textarea
                  rows="3"
                  placeholder="Daily performance report details..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#0d472a] text-white font-semibold rounded-xl hover:bg-[#135d38]">
                Send Direct to Parent Dashboard 🚀
              </button>
            </form>
          </div>
        )}

        {/* ASSIGN SABAQ / PROGRESS TAB */}
        {activeTab === 'Assign Sabaq' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-2xl space-y-4">
            <h2 className="font-bold text-gray-800 text-sm">Assign Sabaq & Update Parent Progress 📖</h2>
            <form onSubmit={handleAssignSabaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.currentJuz})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lesson Type</label>
                <select
                  value={sabaqForm.type}
                  onChange={(e) => setSabaqForm({ ...sabaqForm, type: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                >
                  <option value="Sabaq">Sabaq (New Lesson)</option>
                  <option value="Sabqi">Sabqi (Recent Revision)</option>
                  <option value="Manzil">Manzil (Old Revision)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Surah</label>
                <select
                  value={sabaqForm.surah}
                  onChange={(e) => setSabaqForm({ ...sabaqForm, surah: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none"
                  required
                >
                  <option value="">-- Select Surah --</option>
                  {surahList.map((s) => (
                    <option key={s.number} value={`${s.number}. ${s.englishName}`}>
                      {s.number}. {s.englishName} ({s.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="From Ayah"
                  value={sabaqForm.fromAyah}
                  onChange={(e) => setSabaqForm({ ...sabaqForm, fromAyah: e.target.value })}
                  className="p-2.5 border rounded-xl bg-gray-50 outline-none"
                />
                <input
                  type="number"
                  placeholder="To Ayah"
                  value={sabaqForm.toAyah}
                  onChange={(e) => setSabaqForm({ ...sabaqForm, toAyah: e.target.value })}
                  className="p-2.5 border rounded-xl bg-gray-50 outline-none"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#0d472a] text-white font-semibold rounded-xl hover:bg-[#135d38]">
                Update Progress Live 🚀
              </button>
            </form>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'Attendance' && (
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h2 className="font-bold text-gray-800 text-sm">Daily Attendance Marking</h2>
            <div className="divide-y">
              {students.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-xs block">{s.name}</span>
                    <span className="text-[10px] text-gray-400">{s.currentJuz}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceChange(s.id, s.name, 'Present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${s.attendance === 'Present' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Present ✓
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(s.id, s.name, 'Absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${s.attendance === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Absent ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WALLET & EARNINGS TAB */}
        {activeTab === 'Wallet & Earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Total Earned</p>
                <p className="text-xl font-bold text-gray-800 mt-1">Rs. {wallet.totalEarned.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Current Balance</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">Rs. {wallet.currentBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Pending Withdrawal</p>
                <p className="text-xl font-bold text-amber-600 mt-1">Rs. {wallet.pendingPayout.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl">
              <h3 className="font-bold text-xs text-gray-800 mb-3">Request Payout / Withdrawal</h3>
              <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
                <input
                  type="number"
                  placeholder="Amount (PKR)"
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                  required
                />
                <select
                  value={payoutForm.method}
                  onChange={(e) => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                >
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <button type="submit" className="w-full py-2 bg-[#0d472a] text-white font-semibold rounded-xl">
                  Submit Withdrawal Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STUDENT DIRECTORY TAB */}
        {activeTab === 'Student Directory' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl">
              <h3 className="font-bold text-xs text-gray-800 mb-3">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Student Full Name"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Parent Contact Phone"
                  value={newStudentForm.phone}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
                <button type="submit" className="w-full py-2 bg-[#0d472a] text-white font-semibold rounded-xl">
                  Save Student
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-xs text-gray-800 mb-3">Student List</h3>
              <div className="divide-y text-xs">
                {students.map((s) => (
                  <div key={s.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.currentJuz} • {s.phone}</p>
                    </div>
                    <div>
                      {s.status === 'Active' ? (
                        <button onClick={() => handleGraduateStudent(s.id)} className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-lg">
                          Mark Graduate 🎓
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-lg">Graduate 🎓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CREATE EXAM TAB */}
        {activeTab === 'Create Exam' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl space-y-4">
            <h3 className="font-bold text-xs text-gray-800">Exam Creation Wizard (Step {examWizardStep} of 4)</h3>
            
            {examWizardStep === 1 && (
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Exam Title (e.g. Midterm Hifz Exam)"
                  value={examData.title}
                  onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
                <button onClick={() => setExamWizardStep(2)} className="w-full py-2 bg-[#0d472a] text-white font-semibold rounded-xl">Next: Select Syllabus</button>
              </div>
            )}

            {examWizardStep === 2 && (
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Surah Start (e.g. Surah Al-Baqarah)"
                  value={examData.surahStart}
                  onChange={(e) => setExamData({ ...examData, surahStart: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
                <input
                  type="text"
                  placeholder="Surah End (e.g. Surah An-Nas)"
                  value={examData.surahEnd}
                  onChange={(e) => setExamData({ ...examData, surahEnd: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setExamWizardStep(1)} className="w-1/2 py-2 bg-gray-100 text-gray-600 rounded-xl">Back</button>
                  <button onClick={() => setExamWizardStep(3)} className="w-1/2 py-2 bg-[#0d472a] text-white rounded-xl">Next: Exam Type</button>
                </div>
              </div>
            )}

            {examWizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <select
                  value={examData.examType}
                  onChange={(e) => setExamData({ ...examData, examType: e.target.value })}
                  className="w-full p-2.5 border rounded-xl outline-none"
                >
                  <option value="Oral Recitation">Oral Recitation (Tilawat)</option>
                  <option value="Tajweed Test">Tajweed Rules Test</option>
                  <option value="Written Test">Written Hifz Test</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setExamWizardStep(2)} className="w-1/2 py-2 bg-gray-100 text-gray-600 rounded-xl">Back</button>
                  <button onClick={() => setExamWizardStep(4)} className="w-1/2 py-2 bg-[#0d472a] text-white rounded-xl">Next: Review</button>
                </div>
              </div>
            )}

            {examWizardStep === 4 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <p><strong>Title:</strong> {examData.title}</p>
                  <p><strong>Syllabus:</strong> {examData.surahStart} - {examData.surahEnd}</p>
                  <p><strong>Type:</strong> {examData.examType}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExamWizardStep(3)} className="w-1/2 py-2 bg-gray-100 text-gray-600 rounded-xl">Back</button>
                  <button onClick={handleSaveExam} className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl font-bold">Publish Exam 🚀</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}