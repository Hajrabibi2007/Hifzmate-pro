import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// Full Quran Surah List for Standardized Inputs
const QURAN_SURAHS = [
  '1. Al-Fatiha', '2. Al-Baqarah', '3. Ali \'Imran', '4. An-Nisa', '5. Al-Ma\'idah',
  '6. Al-An\'am', '7. Al-A\'raf', '8. Al-Anfal', '9. At-Tawbah', '10. Yunus',
  '11. Hud', '12. Yusuf', '13. Ar-Ra\'d', '14. Ibrahim', '15. Al-Hijr',
  '16. An-Nahl', '17. Al-Isra', '18. Al-Kahf', '19. Maryam', '20. Taha',
  '21. Al-Anbiya', '22. Al-Hajj', '23. Al-Mu\'minun', '24. An-Nur', '25. Al-Furqan',
  '26. Ash-Shu\'ara', '27. An-Naml', '28. Al-Qasas', '29. Al-\'Ankabut', '30. Ar-Rum',
  '31. Luqman', '32. As-Sajdah', '33. Al-Ahzab', '34. Saba', '35. Fatir',
  '36. Yasin', '55. Ar-Rahman', '56. Al-Waqi\'ah', '67. Al-Mulk', '78. An-Naba', '114. An-Nas'
];

export default function WeakVersesTracker() {
  const [weakList, setWeakList] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  const [paraNo, setParaNo] = useState('');
  const [ayatNo, setAyatNo] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('active'); // 'all' | 'active' | 'mastered'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch Weak Verses from Supabase
  const fetchWeakVerses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('weak_verses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWeakList(data);
    } else if (error) {
      console.error('Error fetching weak verses:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeakVerses();
  }, []);

  // Add New Weak Verse
  const handleAddVerse = async (e) => {
    e.preventDefault();
    if (!selectedSurah || !ayatNo) return;

    setSaving(true);
    const newEntry = {
      surah: selectedSurah,
      para_no: paraNo ? Number(paraNo) : null,
      ayat: ayatNo,
      note: note || 'Needs extra revision for Mutashabihat',
      status: 'Needs Revision',
    };

    const { data, error } = await supabase
      .from('weak_verses')
      .insert([newEntry])
      .select();

    if (!error && data) {
      setWeakList([data[0], ...weakList]);
      setSelectedSurah('');
      setParaNo('');
      setAyatNo('');
      setNote('');
    } else {
      alert('Failed to save verse: ' + (error?.message || 'Database error'));
    }
    setSaving(false);
  };

  // Update Revision Status (Real Progress Tracking)
  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = 
      currentStatus === 'Needs Revision' ? 'In Review' : 
      currentStatus === 'In Review' ? 'Mastered' : 'Needs Revision';

    const { error } = await supabase
      .from('weak_verses')
      .update({ status: nextStatus })
      .eq('id', id);

    if (!error) {
      setWeakList(weakList.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    }
  };

  // Delete Record
  const handleRemoveVerse = async (id) => {
    const { error } = await supabase.from('weak_verses').delete().eq('id', id);
    if (!error) {
      setWeakList(weakList.filter((item) => item.id !== id));
    }
  };

  // Filtered List Logic
  const filteredList = weakList.filter(item => {
    if (filter === 'active') return item.status !== 'Mastered';
    if (filter === 'mastered') return item.status === 'Mastered';
    return true;
  });

  const masteredCount = weakList.filter(item => item.status === 'Mastered').length;

  return (
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header & Overall Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span>⚠️</span> Mutashabihat & Weak Verses Tracker
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Log confusing or weak Ayats to track real-time revision progress.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs">
          <div>
            <span className="text-emerald-800 font-semibold">Active Items: </span>
            <span className="font-extrabold text-[#0d472a]">{weakList.length - masteredCount}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div>
            <span className="text-emerald-800 font-semibold">Mastered: </span>
            <span className="font-extrabold text-emerald-700">{masteredCount}</span>
          </div>
        </div>
      </div>

      {/* Form Input Section */}
      <form onSubmit={handleAddVerse} className="grid sm:grid-cols-4 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200/50">
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Surah Name</label>
          <input
            type="text"
            list="surah-options"
            placeholder="Select/Type Surah"
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d472a] bg-white"
          />
          <datalist id="surah-options">
            {QURAN_SURAHS.map((s, idx) => (
              <option key={idx} value={s} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:col-span-1">
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Para (1-30)</label>
            <input
              type="number"
              min="1"
              max="30"
              placeholder="Juz #"
              value={paraNo}
              onChange={(e) => setParaNo(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d472a] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Ayat No.</label>
            <input
              type="text"
              placeholder="e.g. 42-45"
              value={ayatNo}
              onChange={(e) => setAyatNo(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d472a] bg-white"
            />
          </div>
        </div>

        <div className="sm:col-span-2 flex items-end gap-2">
          <div className="w-full">
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Revision Note / Mutashabih</label>
            <input
              type="text"
              placeholder="e.g. Similar to Surah Al-A'raf Ayat 120"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d472a] bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-[#0d472a] text-white text-xs font-semibold rounded-lg hover:bg-[#135d38] transition whitespace-nowrap h-[34px] disabled:opacity-50"
          >
            {saving ? 'Saving...' : '+ Add Verse'}
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center text-xs pt-1">
        <div className="flex gap-2">
          {['active', 'all', 'mastered'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                filter === t
                  ? 'bg-[#0d472a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-gray-400 text-[11px]">Click status badge to update progress</span>
      </div>

      {/* Verses List */}
      <div className="space-y-2.5">
        {loading ? (
          <p className="text-xs text-gray-400 italic text-center py-6">Fetching records from Supabase database...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No verses found in this category.
          </p>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition text-xs ${
                item.status === 'Mastered'
                  ? 'bg-emerald-50/40 border-emerald-200/60 opacity-80'
                  : 'bg-white border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{item.surah}</span>
                  <span className="text-gray-600 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                    Ayat: {item.ayat}
                  </span>
                  {item.para_no && (
                    <span className="text-amber-800 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded text-[10px]">
                      Para {item.para_no}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-[11px]">{item.note}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Toggle Badge */}
                <button
                  onClick={() => handleUpdateStatus(item.id, item.status)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition ${
                    item.status === 'Mastered'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : item.status === 'In Review'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                  title="Click to cycle status"
                >
                  {item.status || 'Needs Revision'}
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveVerse(item.id)}
                  className="text-gray-400 hover:text-red-600 font-bold px-1 transition"
                  title="Delete record"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}