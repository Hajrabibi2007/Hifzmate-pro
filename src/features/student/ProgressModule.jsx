import React, { useState, useEffect } from 'react';

const TOTAL_JUZ = 30;

export default function ProgressModule() {
  const [hifzStats, setHifzStats] = useState(() => {
    const saved = localStorage.getItem('quran_hifz_stats');
    return saved
      ? JSON.parse(saved)
      : {
          completedJuz: [1, 30], // Completed Paras array
          currentSabaq: 'Juz 2 - Surah Al-Baqarah (Ayat 142 - 160)',
          sabaqiJuz: 'Juz 1',
          manzilJuz: 'Juz 30',
          dailyGoalMinutes: 45,
          todayPracticeMinutes: 30,
          totalAyatsMemorized: 624,
          historyLog: [
            { id: 1, date: '2026-09-26', type: 'Sabaq', title: 'Surah Al-Baqarah 142-150', status: 'Passed' },
            { id: 2, date: '2026-09-25', type: 'Sabqi', title: 'Juz 1 Half Pass', status: 'Excellent' },
          ],
        };
  });

  const [newLog, setNewLog] = useState({ type: 'Sabaq', title: '', status: 'Passed' });

  // Confirmation Modal State for Paras Grid
  const [selectedJuzForToggle, setSelectedJuzForToggle] = useState(null);

  useEffect(() => {
    localStorage.setItem('quran_hifz_stats', JSON.stringify(hifzStats));
  }, [hifzStats]);

  // Trigger Modal on Para Button Click
  const handleJuzClick = (juzNum) => {
    const isCompleted = hifzStats.completedJuz.includes(juzNum);
    setSelectedJuzForToggle({
      num: juzNum,
      isCompleted: isCompleted,
    });
  };

  // Confirm Status Toggle
  const confirmToggleJuz = () => {
    if (!selectedJuzForToggle) return;
    const { num, isCompleted } = selectedJuzForToggle;

    const updated = isCompleted
      ? hifzStats.completedJuz.filter((j) => j !== num)
      : [...hifzStats.completedJuz, num];

    setHifzStats((prev) => ({
      ...prev,
      completedJuz: updated,
    }));

    setSelectedJuzForToggle(null); // Close Modal
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.title) return;

    const logEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: newLog.type,
      title: newLog.title,
      status: newLog.status,
    };

    setHifzStats((prev) => ({
      ...prev,
      historyLog: [logEntry, ...prev.historyLog],
      todayPracticeMinutes: prev.todayPracticeMinutes + 15,
    }));

    setNewLog({ type: 'Sabaq', title: '', status: 'Passed' });
  };

  const juzPercent = Math.round((hifzStats.completedJuz.length / TOTAL_JUZ) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📊 Full Quran Hifz Progress Tracker</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time tracking for Sabaq, Sabqi, and Manzil across all 30 Paras & 114 Surahs.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-800 uppercase">Quran Completed</p>
          <p className="text-2xl font-extrabold text-[#0d472a] mt-1">{juzPercent}%</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">{hifzStats.completedJuz.length} of 30 Paras</p>
        </div>

        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-800 uppercase">Current Sabaq</p>
          <p className="text-sm font-bold text-blue-950 mt-1 truncate">{hifzStats.currentSabaq}</p>
          <p className="text-[11px] text-blue-700 mt-0.5">Active Target</p>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-bold text-amber-800 uppercase">Sabqi Revision</p>
          <p className="text-sm font-bold text-amber-950 mt-1">{hifzStats.sabaqiJuz}</p>
          <p className="text-[11px] text-amber-700 mt-0.5">Recent Paras</p>
        </div>

        <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-100">
          <p className="text-[10px] font-bold text-purple-800 uppercase">Daily Practice</p>
          <p className="text-2xl font-extrabold text-purple-950 mt-1">{hifzStats.todayPracticeMinutes} m</p>
          <p className="text-[11px] text-purple-700 mt-0.5">Goal: {hifzStats.dailyGoalMinutes} mins</p>
        </div>
      </div>

      {/* 30 Juz Visual Grid */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="font-bold text-gray-800 text-xs">30 Paras Hifz Status Grid</h3>
          <span className="text-[10px] text-gray-400">Click Para to update completion</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
            const isCompleted = hifzStats.completedJuz.includes(juzNum);
            return (
              <button
                key={juzNum}
                onClick={() => handleJuzClick(juzNum)}
                className={`py-2 text-xs font-bold rounded-xl border transition shadow-xs ${
                  isCompleted
                    ? 'bg-[#0d472a] text-white border-[#0d472a]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300'
                }`}
              >
                P-{juzNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Entry Form & History */}
      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleAddLog} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 text-xs">Log Daily Recitation Lesson</h3>

          <div>
            <label className="block text-[11px] text-gray-600 font-semibold mb-1">Type</label>
            <select
              value={newLog.type}
              onChange={(e) => setNewLog({ ...newLog, type: e.target.value })}
              className="w-full p-2 border rounded-xl bg-gray-50 text-xs"
            >
              <option value="Sabaq">Sabaq (New Lesson)</option>
              <option value="Sabqi">Sabqi (Recent Revision)</option>
              <option value="Manzil">Manzil (Old Revision)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-600 font-semibold mb-1">Surah / Portion</label>
            <input
              type="text"
              value={newLog.title}
              onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
              placeholder="e.g. Surah Al-Kahf 1-20"
              className="w-full p-2 border rounded-xl bg-gray-50 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-600 font-semibold mb-1">Performance Status</label>
            <select
              value={newLog.status}
              onChange={(e) => setNewLog({ ...newLog, status: e.target.value })}
              className="w-full p-2 border rounded-xl bg-gray-50 text-xs"
            >
              <option value="Excellent">Excellent (0 Mistakes)</option>
              <option value="Passed">Passed (1-2 Minor Mistakes)</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition"
          >
            + Save Daily Progress
          </button>
        </form>

        {/* History Table */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 text-xs">Recent Recitation & Assessment History</h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {hifzStats.historyLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs"
              >
                <div>
                  <span className="font-bold text-gray-800">{log.type}: </span>
                  <span className="text-gray-600">{log.title}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{log.date}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    log.status === 'Excellent'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.status === 'Passed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR PARA COMPLETION */}
      {selectedJuzForToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0d472a] flex items-center justify-center mx-auto text-xl font-bold">
              📖
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-gray-800">Confirm Para Status</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedJuzForToggle.isCompleted
                  ? `Are you sure you want to mark Para ${selectedJuzForToggle.num} as incomplete?`
                  : `Are you sure you have completed Para ${selectedJuzForToggle.num}?`}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedJuzForToggle(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleJuz}
                className="flex-1 py-2 bg-[#0d472a] text-white text-xs font-semibold rounded-xl hover:bg-[#135d38] transition"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}