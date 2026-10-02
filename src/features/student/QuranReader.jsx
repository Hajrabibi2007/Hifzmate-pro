import React, { useState, useEffect } from 'react';

export default function QuranReader({ onBack }) {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [activeTab, setActiveTab] = useState('listen'); // 'listen' or 'read'
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch all 114 Surahs
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => setSurahs(data.data || []))
      .catch((err) => console.error('Error fetching surahs:', err));
  }, []);

  // 2. Fetch Selected Surah Details (Arabic Text)
  useEffect(() => {
    if (!selectedSurah) return;
    setLoadingSurah(true);

    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        setSurahData(data.data);
        setLoadingSurah(false);
      })
      .catch((err) => {
        console.error('Error fetching surah detail:', err);
        setLoadingSurah(false);
      });
  }, [selectedSurah]);

  // Filter Surahs by search input
  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      s.number.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📖</span> قرآن مجید (Quran Majeed)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Select any Surah to listen to recitation or read verses
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search Surah (e.g. Yaseen, 36)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d472a]"
          />
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs px-3.5 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 font-medium transition whitespace-nowrap"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* 114 Surahs Card Grid */}
      {surahs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Loading Surahs List...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => setSelectedSurah(surah)}
              className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition cursor-pointer flex justify-between items-center group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0d472a] group-hover:bg-[#0d472a] group-hover:text-white font-bold text-xs flex items-center justify-center transition">
                  {surah.number}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#0d472a] transition">
                    {surah.englishName}
                  </h4>
                  <p className="text-[11px] text-gray-400">{surah.numberOfAyahs} Verses</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-serif text-lg text-[#0d472a] font-bold block">{surah.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surah Modal Player / Reader (Bada Size) */}
      {selectedSurah && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  سورة {selectedSurah.name} ({selectedSurah.englishName})
                </h3>
                <p className="text-xs text-emerald-800 font-semibold">
                  Surah #{selectedSurah.number}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSurah(null);
                  setSurahData(null);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold text-[#0d472a] text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Comprehensive Surah Intro Banner */}
            <div className="bg-emerald-800 text-white p-4 rounded-xl shadow-inner space-y-2 shrink-0">
              <div className="flex justify-between items-center border-b border-emerald-700/60 pb-2">
                <div>
                  <h4 className="text-xl font-bold font-serif">{selectedSurah.name}</h4>
                  <p className="text-xs text-emerald-200">{selectedSurah.englishName} — {selectedSurah.englishNameTranslation}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-700 px-2.5 py-1 rounded-full text-emerald-100 font-medium">
                    {selectedSurah.revelationType === 'Meccan' ? 'مكية (Meccan)' : 'مدنية (Medinan)'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-emerald-100 pt-1">
                <span>🔢 Surah Number: <strong>{selectedSurah.number}</strong></span>
                <span>📖 Total Verses: <strong>{selectedSurah.numberOfAyahs} Ayahs</strong></span>
              </div>
            </div>

            {/* Switch Tabs (Listen / Read) */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('listen')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'listen' ? 'bg-white shadow text-[#0d472a]' : 'text-gray-600'
                }`}
              >
                🎧 Listen Recitation (Tilawat)
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'read' ? 'bg-white shadow text-[#0d472a]' : 'text-gray-600'
                }`}
              >
                📖 Read Surah Text
              </button>
            </div>

            {/* Modal Body Content (Bada Aur Scrollable Reading Area) */}
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
              {activeTab === 'listen' ? (
                /* Audio Player Section */
                <div className="bg-emerald-50/70 p-8 rounded-xl text-center space-y-4 border border-emerald-100 my-4">
                  <div className="text-5xl">🎙️</div>
                  <h4 className="text-sm font-bold text-[#0d472a]">
                    Reciter: Mishary Rashid Alafasy
                  </h4>
                  <audio
                    controls
                    autoPlay
                    key={`${selectedSurah.number}-${activeTab}`}
                    className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
                  >
                    <source
                      src={`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${selectedSurah.number}.mp3`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                /* Quran Text Reader Section - Bada Font & High-Reading Layout */
                loadingSurah ? (
                  <div className="text-center py-16 text-gray-400 font-semibold">Loading Surah Verses...</div>
                ) : surahData ? (
                  <div className="p-6 md:p-10 bg-[#fcfbf7] rounded-2xl border border-amber-100/80 text-right leading-[2.5] md:leading-[2.8] font-serif text-2xl md:text-4xl space-y-4 text-gray-900 shadow-inner" style={{ direction: 'rtl' }}>
                    {/* Bismillah Header */}
                    {selectedSurah.number !== 9 && (
                      <div className="text-center font-serif text-2xl md:text-3xl text-[#0d472a] my-4 border-b border-amber-200/60 pb-4">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                    )}
                    {surahData.ayahs.map((ayah) => (
                      <span key={ayah.numberInSurah} className="inline-block px-1 hover:text-[#0d472a] transition">
                        {ayah.text}{' '}
                        <span className="text-sm md:text-base font-sans bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block text-center mr-1 ml-2 font-bold border border-emerald-200">
                          ﴿{ayah.numberInSurah}﴾
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t shrink-0">
              <button
                onClick={() => {
                  setSelectedSurah(null);
                  setSurahData(null);
                }}
                className="w-full py-2.5 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-emerald-900 transition shadow-sm"
              >
                Close Reader
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}