import React, { useState, useEffect } from 'react';
import {supabase} from '../../supabaseClient'; 

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('Ustad');
  const [teacherGender, setTeacherGender] = useState('male');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Mobile Navigation Drawer Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Surahs List State
  const [surahList, setSurahList] = useState([]);

  // Student Directory State with Admission Date and Duration
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('hifz_students');
    return saved ? JSON.parse(saved) : [
      { id: '101', name: 'Ali Ahmed', phone: '03001234567', currentJuz: 'Juz 3', status: 'Active', startDate: '2025-01-15', completionDate: null, duration: null, attendance: 'Present' },
      { id: '102', name: 'Hamza Khan', phone: '03007654321', currentJuz: 'Juz 5', status: 'Active', startDate: '2026-02-01', completionDate: null, duration: null, attendance: 'Present' },
      { id: '103', name: 'Usman Ghani', phone: '03129876543', currentJuz: 'Juz 30', status: 'Graduated', startDate: '2023-01-10', completionDate: '2025-06-15', duration: '2 Years, 5 Months, 5 Days', attendance: 'Present' },
    ];
  });

  // Assignments / Progress State
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('hifz_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  // Parent Feedbacks State
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('hifz_parent_feedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // Attendance Logs
  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('hifz_attendance_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Exam Creation Wizard State
  const [examWizardStep, setExamWizardStep] = useState(1);
  const [examData, setExamData] = useState({ title: '', classId: 'Class 1-A', surahStart: '', surahEnd: '', examType: 'Oral Recitation', totalMarks: 100 });
  const [createdExams, setCreatedExams] = useState(() => {
    const saved = localStorage.getItem('hifz_exams');
    return saved ? JSON.parse(saved) : [];
  });

  // Forms
  const [sabaqForm, setSabaqForm] = useState({ surah: '', fromAyah: '1', toAyah: '10', type: 'Sabaq' });
  const [feedbackForm, setFeedbackForm] = useState({ studentId: '101', message: '', type: 'Good Progress', rating: 5 });
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    phone: '',
    currentJuz: 'Juz 1',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Persistence Effects
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

  // Calculate Duration in Years, Months, and Days
  const calculateDuration = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);

    return parts.join(', ');
  };

  // Attendance Toggle
  const handleAttendanceChange = (id, studentName, status) => {
    if (status === 'Absent') {
      const confirmAbsent = window.confirm(`Are you sure you want to mark ${studentName} as ABSENT?`);
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
      startDate: newStudentForm.startDate,
      completionDate: null,
      duration: null,
      attendance: 'Present'
    };
    setStudents([...students, newStudent]);
    setNewStudentForm({
      name: '',
      phone: '',
      currentJuz: 'Juz 1',
      startDate: new Date().toISOString().split('T')[0]
    });
    alert('New student added successfully!');
  };

  // Mark Completed / Graduate Student
  const handleGraduateStudent = (id) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    if (window.confirm(`Has ${student.name} completed Hifz? Move to Graduates list?`)) {
      const today = new Date().toISOString().split('T')[0];
      const durationFormatted = calculateDuration(student.startDate, today);

      setStudents(students.map(s => s.id === id ? {
        ...s,
        status: 'Graduated',
        completionDate: today,
        duration: durationFormatted
      } : s));

      alert(`Congratulations! ${student.name} completed Hifz in ${durationFormatted}.`);
    }
  };

  // Assign Sabaq
  const handleAssignSabaq = (e) => {
    e.preventDefault();
    if (!selectedStudent || !sabaqForm.surah) { alert('Please select a student and a surah.'); return; }

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
    alert('Progress updated successfully!');
    setSelectedStudent('');
  };

  // Send Direct Feedback
  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackForm.studentId || !feedbackForm.message) {
      alert('Student and message are required.');
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

    alert('Feedback sent to Parent Dashboard!');
  };

  // Create Exam Save
  const handleSaveExam = () => {
    if (!examData.title) { alert('Please enter an exam title.'); return; }
    const newExam = { id: Date.now(), ...examData, date: new Date().toLocaleDateString() };
    setCreatedExams([newExam, ...createdExams]);
    setExamWizardStep(1);
    setExamData({ title: '', classId: 'Class 1-A', surahStart: '', surahEnd: '', examType: 'Oral Recitation', totalMarks: 100 });
    alert('Exam created successfully!');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Mobile Sticky Top Header with Menu Button */}
      <div className="md:hidden bg-[#0d472a] text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#186a41] flex items-center justify-center font-bold text-white text-xs">
            {teacherGender === 'female' ? '🧕' : '👳'}
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight">{teacherName}</h2>
            <p className="text-[9px] text-emerald-200">Teacher Portal</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-[#135d38] rounded-lg text-white text-base focus:outline-none"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Responsive Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0d472a] text-white p-5 flex flex-col justify-between shadow-xl shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#186a41] flex items-center justify-center font-bold text-white text-sm">
                {teacherGender === 'female' ? '🧕' : '👳'}
              </div>
              <div>
                <p className="font-bold text-sm">{teacherName}</p>
                <p className="text-[10px] text-emerald-200">Hifz Teacher / Qari</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white text-lg p-1"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1.5">
            {[
              { name: 'Overview', icon: '📊' },
              { name: 'Attendance', icon: '📅' },
              { name: 'Assign Sabaq', icon: '📖' },
              { name: 'Parent Feedback', icon: '💬' },
              { name: 'Create Exam', icon: '📝' },
              { name: 'Student Directory', icon: '👨‍🎓' },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setIsMobileMenuOpen(false);
                }}
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

      {/* Mobile Dark Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 space-y-6 w-full overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-2xl border shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
            <p className="text-xs text-gray-500">HifzMate Management Dashboard</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTeacherGender(teacherGender === 'male' ? 'female' : 'male')}
              className="px-3 py-1.5 text-xs bg-gray-50 border rounded-xl shadow-sm hover:bg-gray-100 font-semibold"
            >
              Gender: {teacherGender === 'male' ? 'Male 👳' : 'Female 🧕'}
            </button>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Total Active Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{students.filter(s => s.status === 'Active').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Today Present</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{students.filter(s => s.attendance === 'Present').length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="text-xs text-gray-400 font-semibold">Graduated / Hufaz</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{students.filter(s => s.status === 'Graduated').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DIRECTORY TAB */}
        {activeTab === 'Student Directory' && (
          <div className="space-y-6">
            {/* Add Student Form */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm max-w-xl">
              <h3 className="font-bold text-xs text-gray-800 mb-3">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-600">Student Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-600">Parent Phone Number</label>
                  <input
                    type="text"
                    placeholder="03001234567"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-600">Admission Date</label>
                  <input
                    type="date"
                    value={newStudentForm.startDate}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, startDate: e.target.value })}
                    className="w-full p-2.5 border rounded-xl outline-none"
                    required
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#0d472a] text-white font-semibold rounded-xl hover:bg-[#135d38]">
                  Save Student
                </button>
              </form>
            </div>

            {/* Active Students List */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-xs text-gray-800 mb-3">Active Students</h3>
              <div className="divide-y text-xs">
                {students.filter(s => s.status === 'Active').map((s) => (
                  <div key={s.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-bold text-gray-800">{s.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {s.currentJuz} • Phone: {s.phone}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        Admission Date: {s.startDate}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleGraduateStudent(s.id)}
                        className="px-3 py-1.5 bg-purple-600 text-white font-bold text-[11px] rounded-xl hover:bg-purple-700 shadow-sm"
                      >
                        Mark Completed 🎓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graduated Students List */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm border-purple-100 bg-purple-50/20">
              <h3 className="font-bold text-xs text-purple-900 mb-3 flex items-center gap-1.5">
                <span>🎓</span> Graduated Hufaz
              </h3>
              <div className="divide-y text-xs">
                {students.filter(s => s.status === 'Graduated').map((s) => (
                  <div key={s.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-bold text-purple-950 text-sm">{s.name}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Admission: <span className="font-semibold">{s.startDate}</span> | Completion: <span className="font-semibold">{s.completionDate}</span>
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 font-bold text-[11px] rounded-xl border border-purple-200">
                        ⏱️ Total Time Taken: {s.duration}
                      </span>
                    </div>
                  </div>
                ))}
                {students.filter(s => s.status === 'Graduated').length === 0 && (
                  <p className="text-xs text-gray-400 py-2">No records found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PARENT FEEDBACK TAB */}
        {activeTab === 'Parent Feedback' && (
          <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm max-w-2xl space-y-4">
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
          <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm max-w-2xl space-y-4">
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
          <div className="bg-white p-5 md:p-6 rounded-2xl border space-y-4">
            <h2 className="font-bold text-gray-800 text-sm">Daily Attendance Marking</h2>
            <div className="divide-y">
              {students.filter(s => s.status === 'Active').map((s) => (
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

        {/* CREATE EXAM TAB */}
        {activeTab === 'Create Exam' && (
          <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm max-w-xl space-y-4">
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