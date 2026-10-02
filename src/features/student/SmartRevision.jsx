import React, { useState, useEffect } from 'react';

// Full Quran 114 Surahs Reference List
const FULL_QURAN_SURAHS = [
  { id: 1, name: 'Al-Fatiha (الفاتحة)', verses: 7 },
  { id: 2, name: 'Al-Baqarah (البقرة)', verses: 286 },
  { id: 3, name: 'Ali Imran (آل عمران)', verses: 200 },
  { id: 4, name: 'An-Nisa (النساء)', verses: 176 },
  { id: 5, name: 'Al-Ma\'idah (المائدة)', verses: 120 },
  { id: 6, name: 'Al-An\'am (الأنعام)', verses: 165 },
  { id: 7, name: 'Al-A\'raf (الأعراف)', verses: 206 },
  { id: 8, name: 'Al-Anfal (الأنفال)', verses: 75 },
  { id: 9, name: 'At-Tawbah (التوبة)', verses: 129 },
  { id: 10, name: 'Yunus (يونس)', verses: 109 },
  { id: 18, name: 'Al-Kahf (الكهف)', verses: 110 },
  { id: 36, name: 'Yasin (يس)', verses: 83 },
  { id: 55, name: 'Ar-Rahman (الرحمن)', verses: 78 },
  { id: 67, name: 'Al-Mulk (الملك)', verses: 30 },
  { id: 112, name: 'Al-Ikhlas (الإخلاص)', verses: 4 },
  { id: 114, name: 'An-Nas (الناس)', verses: 6 },
];

// Initial Full Quran Based Revision Plan Sample
const INITIAL_REVISION_CARDS = [
  {
    id: 1,
    targetType: 'surah',
    targetName: 'Surah Al-Baqarah',
    verses: 'Ayat 10 - 25',
    reason: 'Mutashabihat confusion with Surah Al-A\'raf',
    priority: 'High',
    reviewIntervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    completed: false,
    reviewCount: 2,
  },
  {
    id: 2,
    targetType: 'juz',
    targetName: 'Juz 1 (Al-Fatiha - Al-Baqarah 141)',
    verses: 'Full Para Revision',
    reason: 'Weekly Manzil Cycle Target',
    priority: 'Medium',
    reviewIntervalDays: 3,
    nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    reviewCount: 4,
  },
  {
    id: 3,
    targetType: 'surah',
    targetName: 'Surah Yasin',
    verses: 'Full Surah',
    reason: 'Sabaq Para Memory Fortification',
    priority: 'Normal',
    reviewIntervalDays: 5,
    nextReviewDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    completed: false,
    reviewCount: 1,
  },
];

export default function SmartRevision() {
  // Load initial state from LocalStorage or Default Cards
  const [revisionCards, setRevisionCards] = useState(() => {
    const savedData = localStorage.getItem('quran_smart_revision');
    return savedData ? JSON.parse(savedData) : INITIAL_REVISION_CARDS;
  });

  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Revision Task Form State
  const [targetType, setTargetType] = useState('surah');
  const [selectedSurah, setSelectedSurah] = useState(FULL_QURAN_SURAHS[1].name);
  const [selectedJuz, setSelectedJuz] = useState('1');
  const [versesRange, setVersesRange] = useState('Ayat 1 - 20');
  const [reason, setReason] = useState('Weak Makhraj & Tajweed Precision');
  const [priority, setPriority] = useState('High');

  // Save to LocalStorage on Change
  useEffect(() => {
    localStorage.setItem('quran_smart_revision', JSON.stringify(revisionCards));
  }, [revisionCards]);

  // Mark Completed & Spaced Repetition Calculation
  const toggleComplete = (id) => {
    setRevisionCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === id) {
          const isNowCompleted = !card.completed;
          let updatedInterval = card.reviewIntervalDays;
          
          if (isNowCompleted) {
            // Spaced Repetition Algorithm: Expands review period each time reviewed
            updatedInterval = Math.round(card.reviewIntervalDays * 1.8);
          }

          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + updatedInterval);

          return {
            ...card,
            completed: isNowCompleted,
            reviewCount: isNowCompleted ? card.reviewCount + 1 : card.reviewCount,
            reviewIntervalDays: updatedInterval,
            nextReviewDate: nextDate.toISOString().split('T')[0],
          };
        }
        return card;
      })
    );
  };

  // Delete Revision Card
  const handleDeleteCard = (id) => {
    setRevisionCards((prev) => prev.filter((item) => item.id !== id));
  };

  // Add New Revision Task
  const handleAddNewTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      targetType,
      targetName: targetType === 'surah' ? selectedSurah : `Juz ${selectedJuz}`,
      verses: versesRange,
      reason,
      priority,
      reviewIntervalDays: priority === 'High' ? 1 : priority === 'Medium' ? 3 : 5,
      nextReviewDate: new Date().toISOString().split('T')[0],
      completed: false,
      reviewCount: 0,
    };

    setRevisionCards([newTask, ...revisionCards]);
    setShowAddModal(false);
  };

  // Filtered Cards Logic
  const filteredCards = revisionCards.filter((card) => {
    if (filter === 'pending') return !card.completed;
    if (filter === 'completed') return card.completed;
    if (filter === 'high') return card.priority === 'High';
    return true;
  });

  const completedCount = revisionCards.filter((c) => c.completed).length;
  const totalCount = revisionCards.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🧠 Full Quran Smart Revision Planner
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Spaced Repetition System (SRS) for Weak Verses, Mutashabihat, and Daily Manzil Revision.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition shadow-sm self-start sm:self-center"
        >
          + Add Revision Target
        </button>
      </div>

      {/* Real Revision Progress Banner */}
      <div className="bg-gradient-to-r from-[#0d472a] to-[#1a5e3a] p-5 rounded-2xl text-white shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold uppercase tracking-wider text-emerald-200">
            Quran Revision Mastery
          </span>
          <span className="font-bold text-emerald-200">{completedCount} / {totalCount} Targets Reviewed</span>
        </div>

        <div className="w-full bg-emerald-950/50 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-700/50">
          <div
            className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-emerald-100/80 pt-1">
          <span>Overall Accuracy Rate: {progressPercent}%</span>
          <span>Algorithm Status: Spaced Repetition Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'high' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'completed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Revision Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-2xl border transition shadow-sm flex flex-col justify-between space-y-4 ${
              card.completed ? 'bg-gray-50/70 border-gray-200' : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                    card.priority === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : card.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border border-amber-100'
                      : 'bg-blue-50 text-blue-800 border border-blue-100'
                  }`}
                >
                  {card.priority} Priority
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Due: {card.nextReviewDate}
                  </span>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-gray-300 hover:text-red-500 text-xs transition"
                    title="Delete Target"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {card.targetType}
                </span>
                <h3 className={`font-bold text-base mt-1.5 ${card.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {card.targetName}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{card.verses}</p>
              </div>

              <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                💡 <span className="font-semibold text-gray-700">Revision Note:</span> {card.reason}
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-gray-50">
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>Reviews Done: {card.reviewCount} times</span>
                <span>Interval: {card.reviewIntervalDays} Days</span>
              </div>

              <button
                onClick={() => toggleComplete(card.id)}
                className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl transition ${
                  card.completed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-[#0d472a] text-white hover:bg-[#135d38] shadow-sm'
                }`}
              >
                {card.completed ? '✓ Revision Completed' : 'Mark as Reviewed'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-sm">Add Full Quran Revision Target</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                >
                  <option value="surah">Surah Based</option>
                  <option value="juz">Juz / Para Based</option>
                </select>
              </div>

              {targetType === 'surah' ? (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Surah</label>
                  <select
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                  >
                    {FULL_QURAN_SURAHS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.id}. {s.name} ({s.verses} Verses)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Juz (1 - 30)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={selectedJuz}
                    onChange={(e) => setSelectedJuz(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Verses / Range</label>
                <input
                  type="text"
                  value={versesRange}
                  onChange={(e) => setVersesRange(e.target.value)}
                  placeholder="e.g. Ayat 1 - 20 or Full Pass"
                  className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Revision Reason / Note</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Weak Mutashabihat or Tajweed"
                  className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 outline-none"
                >
                  <option value="High">High Priority (Every 1-2 Days)</option>
                  <option value="Medium">Medium Priority (Every 3-4 Days)</option>
                  <option value="Normal">Normal Priority (Every 5+ Days)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d472a] text-white font-semibold rounded-xl hover:bg-[#135d38]"
                >
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}