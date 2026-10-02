import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Apne project path ke mutabiq verify karein

export default function MyHifz() {
  const [selectedTab, setSelectedTab] = useState('surah'); // 'surah' or 'juz'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Surahs State (with real API fetch + Supabase Merge)
  const [surahs, setSurahs] = useState([]);
  
  // Paras (Juz 1 to 30) State
  const [paras, setParas] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      name: `Juz ${i + 1}`,
      status: 'Not Started',
      progress: 0,
    }))
  );

  // Active Item Selected for Editing Progress Modal
  const [editingItem, setEditingItem] = useState(null);

  // Fetch Surahs from API & Progress from Supabase Database on load
  useEffect(() => {
    loadAllProgressData();
  }, []);

  const loadAllProgressData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Saved Progress from Supabase Database
      const { data: dbProgress, error: dbError } = await supabase
        .from('hifz_progress')
        .select('*');

      if (dbError) {
        console.error('Database fetch error:', dbError);
      }

      // 2. Fetch 114 Surahs from Al-Quran Cloud API
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const apiData = await res.json();

      if (apiData && apiData.data) {
        const mappedSurahs = apiData.data.map((s) => {
          // Check if progress exists in database for this surah
          const dbItem = dbProgress?.find(
            (item) => item.type === 'surah' && item.item_id === s.number
          );

          return {
            id: s.number,
            name: s.name,
            english: s.englishName,
            translation: s.englishNameTranslation,
            ayahs: s.numberOfAyahs,
            status: dbItem ? dbItem.status : 'Not Started',
            progress: dbItem ? dbItem.progress : 0,
          };
        });

        setSurahs(mappedSurahs);
      }

      // 3. Map Saved Progress for Juz (Paras)
      setParas((prevParas) =>
        prevParas.map((para) => {
          const dbItem = dbProgress?.find(
            (item) => item.type === 'juz' && item.item_id === para.number
          );
          return dbItem
            ? { ...para, progress: dbItem.progress, status: dbItem.status }
            : para;
        })
      );
    } catch (err) {
      console.error('Failed to load Hifz data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save Progress from Modal & Sync with Supabase
  const handleSaveProgress = async (newProgress, newStatus) => {
    if (!editingItem) return;

    const progressVal = Number(newProgress);
    const itemType = editingItem.type;
    const itemId = itemType === 'surah' ? editingItem.id : editingItem.number;

    // A. Local State Update (Instant UI Response)
    if (itemType === 'surah') {
      setSurahs(
        surahs.map((s) =>
          s.id === itemId
            ? { ...s, progress: progressVal, status: newStatus }
            : s
        )
      );
    } else {
      setParas(
        paras.map((p) =>
          p.number === itemId
            ? { ...p, progress: progressVal, status: newStatus }
            : p
        )
      );
    }

    setEditingItem(null);

    // B. Save to Supabase Database Permanently (UPSERT)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const { error } = await supabase.from('hifz_progress').upsert(
        {
          type: itemType,
          item_id: itemId,
          progress: progressVal,
          status: newStatus,
          user_id: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'type,item_id' }
      );

      if (error) {
        console.error('Failed to save to database:', error);
        alert('Database error: ' + error.message);
      }
    } catch (err) {
      console.error('Unexpected error while saving progress:', err);
    }
  };

  // Calculations for Stats Card
  const completedSurahs = surahs.filter((s) => s.status === 'Completed').length;
  const completedJuz = paras.filter((p) => p.status === 'Completed').length;
  const totalQuranProgress = surahs.length
    ? Math.round(
        surahs.reduce((acc, curr) => acc + curr.progress, 0) / surahs.length
      )
    : 0;

  // Filtered List
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.id.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === 'All' ? true : surah.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredParas = paras.filter((para) => {
    if (statusFilter === 'All') return true;
    return para.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📖 My Hifz Tracker
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor and update your memorization progress across all 114 Surahs and 30 Juz.
          </p>
        </div>

        {/* View Switcher (Surah vs Juz) */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setSelectedTab('surah')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedTab === 'surah'
                ? 'bg-[#0d472a] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            By Surah (114)
          </button>
          <button
            onClick={() => setSelectedTab('juz')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedTab === 'juz'
                ? 'bg-[#0d472a] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            By Juz (30 Para)
          </button>
        </div>
      </div>

      {/* Summary Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">TOTAL MEMORIZED</p>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">
              {completedJuz} / 30 Juz ({completedSurahs} Surahs)
            </p>
          </div>
          <span className="text-2xl">🏅</span>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm md:col-span-2 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-700">
            <span>Overall Quran Memorization Progress</span>
            <span className="text-[#0d472a]">{totalQuranProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#0d472a] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${totalQuranProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Completed', 'In Progress', 'Not Started'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-emerald-50 text-[#0d472a] border border-emerald-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {selectedTab === 'surah' && (
          <input
            type="text"
            placeholder="Search Surah by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64 bg-gray-50/50"
          />
        )}
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100">
          Loading Surah directory and progress...
        </div>
      ) : selectedTab === 'surah' ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.id}
              onClick={() => setEditingItem({ ...surah, type: 'surah' })}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-xs text-[#0d472a]">
                    {surah.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#0d472a] transition">
                      Surah {surah.english}
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      {surah.translation} • {surah.ayahs} Ayahs
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    surah.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : surah.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {surah.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                  <span>Progress</span>
                  <span>{surah.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#0d472a] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${surah.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {filteredParas.map((para) => (
            <div
              key={para.number}
              onClick={() => setEditingItem({ ...para, type: 'juz' })}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 text-center group"
            >
              <span className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-sm text-amber-900">
                {para.number}
              </span>
              <div>
                <span className="text-xs font-bold text-gray-800 block group-hover:text-[#0d472a]">
                  {para.name}
                </span>
                <span className="text-[10px] text-gray-400">{para.progress}% Completed</span>
              </div>

              <span
                className={`text-[9px] font-semibold px-2 py-0.5 rounded block ${
                  para.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : para.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {para.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Progress Modal */}
      {editingItem && (
        <EditProgressModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
}

// Inner Component for Progress Modal
function EditProgressModal({ item, onClose, onSave }) {
  const [progress, setProgress] = useState(item.progress);
  const [status, setStatus] = useState(item.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(progress, status);
  };

  const handleProgressChange = (val) => {
    setProgress(val);
    if (Number(val) === 100) setStatus('Completed');
    else if (Number(val) > 0) setStatus('In Progress');
    else setStatus('Not Started');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-gray-800">
            Update {item.type === 'surah' ? `Surah ${item.english}` : item.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50/50"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-medium text-gray-700 mb-1">
              <span>Completion Percentage</span>
              <span className="font-bold text-[#0d472a]">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleProgressChange(e.target.value)}
              className="w-full accent-[#0d472a]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-[#0d472a] hover:bg-[#135d38] rounded-xl"
            >
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}