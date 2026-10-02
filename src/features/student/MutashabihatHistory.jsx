import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Apne project path ke mutabiq verify kar lein

export default function MutashabihatTracker() {
  const [filter, setFilter] = useState('All'); // 'All', 'Needs Revision', 'Resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Mutashabiha Form State
  const [formData, setFormData] = useState({
    surah1_name: '',
    ayah1_ref: '',
    ayah1_text: '',
    surah2_name: '',
    ayah2_ref: '',
    ayah2_text: '',
    key_difference: '',
  });

  // Fetch Mutashabihat Data from Supabase Database
  useEffect(() => {
    fetchMutashabihat();
  }, []);

  const fetchMutashabihat = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mutashabihat_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mutashabihat:', error);
      }

      if (data && data.length > 0) {
        setComparisons(data);
      } else {
        // Sample Initial Data if Table is Empty
        const initialSample = [
          {
            surah1_name: 'Al-Baqarah',
            ayah1_ref: 'Ayah 2:35',
            ayah1_text: 'وَكُلَا مِنْهَا رَغَدًا حَيْثُ شِئْتُمَا',
            surah2_name: "Al-A'raf",
            ayah2_ref: 'Ayah 7:19',
            ayah2_text: 'فَكُلَا مِنْ حَيْثُ شِئْتُمَا',
            key_difference: "Key Difference / Note: Al-Baqarah includes 'رَغَدًا' whereas Al-A'raf omits it.",
            status: 'Needs Revision'
          },
          {
            surah1_name: 'Al-Baqarah',
            ayah1_ref: 'Ayah 2:48',
            ayah1_text: 'وَلَا يُقْبَلُ مِنْهَا شَفَاعَةٌ وَلَا يُؤْخَذُ مِنْهَا عَدْلٌ',
            surah2_name: 'Al-Baqarah',
            ayah2_ref: 'Ayah 2:123',
            ayah2_text: 'وَلَا يُقْبَلُ مِنْهَا عَدْلٌ وَلَا تَنفَعُهَا شَفَاعَةٌ',
            key_difference: 'Key Difference / Note: Difference in word order: Shafa\'ah comes first in Ayah 48.',
            status: 'Resolved'
          }
        ];

        const { data: insertedData } = await supabase
          .from('mutashabihat_history')
          .insert(initialSample)
          .select();

        if (insertedData) {
          setComparisons(insertedData);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Status (Needs Revision <-> Resolved) & Save to Supabase
  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'Needs Revision' ? 'Resolved' : 'Needs Revision';

    // 1. Instant UI Update
    setComparisons((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: newStatus } : c))
    );

    // 2. Supabase Database Update
    try {
      const { error } = await supabase
        .from('mutashabihat_history')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) {
        console.error('Database Status Update Error:', error);
        alert('Status update nahi ho saka: ' + error.message);
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Add New Flagged Mutashabiha into Database
  const handleCreateMutashabiha = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('mutashabihat_history')
        .insert([
          {
            ...formData,
            status: 'Needs Revision'
          }
        ])
        .select();

      if (error) {
        alert('Failed to save: ' + error.message);
      } else if (data) {
        setComparisons([data[0], ...comparisons]);
        setIsModalOpen(false);
        setFormData({
          surah1_name: '',
          ayah1_ref: '',
          ayah1_text: '',
          surah2_name: '',
          ayah2_ref: '',
          ayah2_text: '',
          key_difference: ''
        });
      }
    } catch (err) {
      console.error('Error adding mutashabiha:', err);
    }
  };

  // Filter List Logic
  const filteredComparisons = comparisons.filter((item) => {
    const matchesFilter = filter === 'All' ? true : item.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.surah1_name.toLowerCase().includes(searchLower) ||
      item.surah2_name.toLowerCase().includes(searchLower) ||
      (item.key_difference && item.key_difference.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ⚠️ Mutashabihat Tracker
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compare and revise similar verses (Ayaat-e-Mutashabihat) to avoid confusion during recitation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0d472a] text-white text-xs font-semibold rounded-xl hover:bg-[#135d38] transition shadow-sm flex items-center gap-1.5"
        >
          + Flag New Mutashabiha
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5">
          {['All', 'Needs Revision', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === tab
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search Surah or Note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64 bg-gray-50/50"
        />
      </div>

      {/* Comparisons List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100">
          Loading Mutashabihat history...
        </div>
      ) : filteredComparisons.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100">
          No Mutashabihat found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComparisons.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-gray-500">
                  Comparison #{index + 1}
                </span>

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                    item.status === 'Needs Revision'
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  {item.status === 'Needs Revision' ? '⚠️ Needs Revision' : '✓ Resolved'}
                </button>
              </div>

              {/* Quran Verses Display Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Verse 1 */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>{item.surah1_name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200">
                      {item.ayah1_ref}
                    </span>
                  </div>
                  <p className="text-right text-lg font-arabic font-bold text-gray-800 leading-loose pt-1" dir="rtl">
                    {item.ayah1_text}
                  </p>
                </div>

                {/* Verse 2 */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>{item.surah2_name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200">
                      {item.ayah2_ref}
                    </span>
                  </div>
                  <p className="text-right text-lg font-arabic font-bold text-gray-800 leading-loose pt-1" dir="rtl">
                    {item.ayah2_text}
                  </p>
                </div>
              </div>

              {/* Key Difference / Note */}
              {item.key_difference && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
                  <span>💡</span>
                  <p>{item.key_difference}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Flag New Mutashabiha Modal with RTL Arabic Support */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-800">Flag New Mutashabiha Mistake</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMutashabiha} className="space-y-3 text-xs">
              {/* Verse 1 Section */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Surah 1 Name (e.g. Al-Baqarah)"
                  required
                  value={formData.surah1_name}
                  onChange={(e) => setFormData({ ...formData, surah1_name: e.target.value })}
                  className="p-2.5 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Ayah 1 Ref (e.g. Ayah 2:35)"
                  required
                  value={formData.ayah1_ref}
                  onChange={(e) => setFormData({ ...formData, ayah1_ref: e.target.value })}
                  className="p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Ayah 1 Text (Arabic):</label>
                <textarea
                  placeholder="آیت 1 کاپی پیسٹ کریں یا عربی میں لکھیں..."
                  required
                  rows={2}
                  dir="rtl"
                  value={formData.ayah1_text}
                  onChange={(e) => setFormData({ ...formData, ayah1_text: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-right font-arabic text-base focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              {/* Verse 2 Section */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Surah 2 Name (e.g. Al-A'raf)"
                  required
                  value={formData.surah2_name}
                  onChange={(e) => setFormData({ ...formData, surah2_name: e.target.value })}
                  className="p-2.5 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Ayah 2 Ref (e.g. Ayah 7:19)"
                  required
                  value={formData.ayah2_ref}
                  onChange={(e) => setFormData({ ...formData, ayah2_ref: e.target.value })}
                  className="p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Ayah 2 Text (Arabic):</label>
                <textarea
                  placeholder="آیت 2 کاپی پیسٹ کریں یا عربی میں لکھیں..."
                  required
                  rows={2}
                  dir="rtl"
                  value={formData.ayah2_text}
                  onChange={(e) => setFormData({ ...formData, ayah2_text: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-right font-arabic text-base focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              {/* Key Difference / Note */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Key Difference / Note (e.g. Difference in word order)"
                  value={formData.key_difference}
                  onChange={(e) => setFormData({ ...formData, key_difference: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#0d472a] hover:bg-[#135d38] rounded-xl font-semibold"
                >
                  Save Mutashabiha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}