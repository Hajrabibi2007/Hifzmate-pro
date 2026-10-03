import React, { useState, useEffect, useRef } from 'react';

// Quran Majid ki sabhi 114 Surahs ki list
const SURAH_LIST = [
  { id: 1, name: 'Al-Fatiha', englishName: 'The Opening', verses: 7 },
  { id: 2, name: 'Al-Baqarah', englishName: 'The Cow', verses: 286 },
  { id: 3, name: 'Ali Imran', englishName: 'Family of Imran', verses: 200 },
  { id: 4, name: 'An-Nisa', englishName: 'The Women', verses: 176 },
  { id: 5, name: 'Al-Ma\'idah', englishName: 'The Table Spread', verses: 120 },
  { id: 6, name: 'Al-An\'am', englishName: 'The Cattle', verses: 165 },
  { id: 7, name: 'Al-A\'raf', englishName: 'The Heights', verses: 206 },
  { id: 8, name: 'Al-Anfal', englishName: 'The Spoils of War', verses: 75 },
  { id: 9, name: 'At-Tawbah', englishName: 'The Repentance', verses: 129 },
  { id: 10, name: 'Yunus', englishName: 'Jonah', verses: 109 },
  { id: 11, name: 'Hud', englishName: 'Hud', verses: 123 },
  { id: 12, name: 'Yusuf', englishName: 'Joseph', verses: 111 },
  { id: 13, name: 'Ar-Ra\'d', englishName: 'The Thunder', verses: 43 },
  { id: 14, name: 'Ibrahim', englishName: 'Abraham', verses: 52 },
  { id: 15, name: 'Al-Hijr', englishName: 'The Rocky Tract', verses: 99 },
  { id: 16, name: 'An-Nahl', englishName: 'The Bee', verses: 128 },
  { id: 17, name: 'Al-Isra', englishName: 'The Night Journey', verses: 111 },
  { id: 18, name: 'Al-Kahf', englishName: 'The Cave', verses: 110 },
  { id: 19, name: 'Maryam', englishName: 'Mary', verses: 98 },
  { id: 20, name: 'Taha', englishName: 'Ta-Ha', verses: 135 },
  { id: 21, name: 'Al-Anbiya', englishName: 'The Prophets', verses: 112 },
  { id: 22, name: 'Al-Hajj', englishName: 'The Pilgrimage', verses: 78 },
  { id: 23, name: 'Al-Mu\'minun', englishName: 'The Believers', verses: 118 },
  { id: 24, name: 'An-Nur', englishName: 'The Light', verses: 64 },
  { id: 25, name: 'Al-Furqan', englishName: 'The Criterion', verses: 77 },
  { id: 26, name: 'Ash-Shu\'ara', englishName: 'The Poets', verses: 227 },
  { id: 27, name: 'An-Naml', englishName: 'The Ant', verses: 93 },
  { id: 28, name: 'Al-Qasas', englishName: 'The Stories', verses: 88 },
  { id: 29, name: 'Al-Ankabut', englishName: 'The Spider', verses: 69 },
  { id: 30, name: 'Ar-Rum', englishName: 'The Romans', verses: 60 },
  { id: 31, name: 'Luqman', englishName: 'Luqman', verses: 34 },
  { id: 32, name: 'As-Sajdah', englishName: 'The Prostration', verses: 30 },
  { id: 33, name: 'Al-Ahzab', englishName: 'The Combined Forces', verses: 73 },
  { id: 34, name: 'Saba', englishName: 'Sheba', verses: 54 },
  { id: 35, name: 'Fatir', englishName: 'Originator', verses: 45 },
  { id: 36, name: 'Yasin', englishName: 'Ya-Sin', verses: 83 },
  { id: 37, name: 'As-Saffat', englishName: 'Those who set the Ranks', verses: 182 },
  { id: 38, name: 'Sad', englishName: 'The Letter "Saad"', verses: 88 },
  { id: 39, name: 'Az-Zumar', englishName: 'The Troops', verses: 75 },
  { id: 40, name: 'Ghafir', englishName: 'The Forgiver', verses: 85 },
  { id: 41, name: 'Fussilat', englishName: 'Explained in Detail', verses: 54 },
  { id: 42, name: 'Ash-Shuraa', englishName: 'The Consultation', verses: 53 },
  { id: 43, name: 'Az-Zukhruf', englishName: 'The Ornaments of Gold', verses: 89 },
  { id: 44, name: 'Ad-Dukhan', englishName: 'The Smoke', verses: 59 },
  { id: 45, name: 'Al-Jathiyah', englishName: 'The Crouching', verses: 37 },
  { id: 46, name: 'Al-Ahqaf', englishName: 'The Wind-Curved Sandhills', verses: 35 },
  { id: 47, name: 'Muhammad', englishName: 'Muhammad', verses: 38 },
  { id: 48, name: 'Al-Fath', englishName: 'The Victory', verses: 29 },
  { id: 49, name: 'Al-Hujurat', englishName: 'The Dwellings', verses: 18 },
  { id: 50, name: 'Qaf', englishName: 'The Letter "Qaaf"', verses: 45 },
  { id: 51, name: 'Adh-Dhariyat', englishName: 'The Winnowing Winds', verses: 60 },
  { id: 52, name: 'At-Tur', englishName: 'The Mount', verses: 49 },
  { id: 53, name: 'An-Najm', englishName: 'The Star', verses: 62 },
  { id: 54, name: 'Al-Qamar', englishName: 'The Moon', verses: 55 },
  { id: 55, name: 'Ar-Rahman', englishName: 'The Beneficent', verses: 78 },
  { id: 56, name: 'Al-Waqi\'ah', englishName: 'The Inevitable', verses: 96 },
  { id: 57, name: 'Al-Hadid', englishName: 'The Iron', verses: 29 },
  { id: 58, name: 'Al-Mujadila', englishName: 'The Pleading Woman', verses: 22 },
  { id: 59, name: 'Al-Hashr', englishName: 'The Exile', verses: 24 },
  { id: 60, name: 'Al-Mumtahanah', englishName: 'She that is to be examined', verses: 13 },
  { id: 61, name: 'As-Saf', englishName: 'The Ranks', verses: 14 },
  { id: 62, name: 'Al-Jumu\'ah', englishName: 'The Congregation', verses: 11 },
  { id: 63, name: 'Al-Munafiqun', englishName: 'The Hypocrites', verses: 11 },
  { id: 64, name: 'At-Taghabun', englishName: 'The Mutual Disillusion', verses: 18 },
  { id: 65, name: 'At-Talaq', englishName: 'The Divorce', verses: 12 },
  { id: 66, name: 'At-Tahrim', englishName: 'The Prohibition', verses: 12 },
  { id: 67, name: 'Al-Mulk', englishName: 'The Sovereignty', verses: 30 },
  { id: 68, name: 'Al-Qalam', englishName: 'The Pen', verses: 52 },
  { id: 69, name: 'Al-Haqqah', englishName: 'The Inevitable Reality', verses: 52 },
  { id: 70, name: 'Al-Ma\'arij', englishName: 'The Ascending Stairways', verses: 44 },
  { id: 71, name: 'Nuh', englishName: 'Noah', verses: 28 },
  { id: 72, name: 'Al-Jinn', englishName: 'The Jinn', verses: 28 },
  { id: 73, name: 'Al-Muzzammil', englishName: 'The Enshrouded One', verses: 20 },
  { id: 74, name: 'Al-Muddaththir', englishName: 'The Cloaked One', verses: 56 },
  { id: 75, name: 'Al-Qiyamah', englishName: 'The Resurrection', verses: 40 },
  { id: 76, name: 'Al-Insan', englishName: 'The Man', verses: 31 },
  { id: 77, name: 'Al-Mursalat', englishName: 'Those sent forth', verses: 50 },
  { id: 78, name: 'An-Naba', englishName: 'The Tidings', verses: 40 },
  { id: 79, name: 'An-Nazi\'at', englishName: 'Those who drag forth', verses: 46 },
  { id: 80, name: 'Abasa', englishName: 'He Frowned', verses: 42 },
  { id: 81, name: 'At-Takwir', englishName: 'The Overthrowing', verses: 29 },
  { id: 82, name: 'Al-Infitar', englishName: 'The Cleaving', verses: 19 },
  { id: 83, name: 'Al-Mutaffifin', englishName: 'The Defrauding', verses: 36 },
  { id: 84, name: 'Al-Inshiqaq', englishName: 'The Sundering', verses: 25 },
  { id: 85, name: 'Al-Buruj', englishName: 'The Mansions of the Stars', verses: 22 },
  { id: 86, name: 'At-Tariq', englishName: 'The Nightcomer', verses: 17 },
  { id: 87, name: 'Al-A\'la', englishName: 'The Most High', verses: 19 },
  { id: 88, name: 'Al-Ghashiyah', englishName: 'The Overwhelming', verses: 26 },
  { id: 89, name: 'Al-Fajr', englishName: 'The Dawn', verses: 30 },
  { id: 90, name: 'Al-Balad', englishName: 'The City', verses: 20 },
  { id: 91, name: 'Ash-Shams', englishName: 'The Sun', verses: 15 },
  { id: 92, name: 'Al-Layl', englishName: 'The Night', verses: 21 },
  { id: 93, name: 'Ad-Duha', englishName: 'The Morning Hours', verses: 11 },
  { id: 94, name: 'Ash-Sharh', englishName: 'The Relief', verses: 8 },
  { id: 95, name: 'At-Tin', englishName: 'The Fig', verses: 8 },
  { id: 96, name: 'Al-Alaq', englishName: 'The Clot', verses: 19 },
  { id: 97, name: 'Al-Qadr', englishName: 'The Power', verses: 5 },
  { id: 98, name: 'Al-Bayyinah', englishName: 'The Clear Proof', verses: 8 },
  { id: 99, name: 'Az-Zalzalah', englishName: 'The Earthquake', verses: 8 },
  { id: 100, name: 'Al-Adiyat', englishName: 'The Courser', verses: 11 },
  { id: 101, name: 'Al-Qari\'ah', englishName: 'The Calamity', verses: 11 },
  { id: 102, name: 'At-Takathur', englishName: 'The Rivalry in world increase', verses: 8 },
  { id: 103, name: 'Al-Asr', englishName: 'The Declining Day', verses: 3 },
  { id: 104, name: 'Al-Humazah', englishName: 'The Traducer', verses: 9 },
  { id: 105, name: 'Al-Fil', englishName: 'The Elephant', verses: 5 },
  { id: 106, name: 'Quraysh', englishName: 'Quraysh', verses: 4 },
  { id: 107, name: 'Al-Ma\'un', englishName: 'Small Kindnesses', verses: 7 },
  { id: 108, name: 'Al-Kawthar', englishName: 'Abundance', verses: 3 },
  { id: 109, name: 'Al-Kafirun', englishName: 'The Disbelievers', verses: 6 },
  { id: 110, name: 'An-Nasr', englishName: 'The Divine Support', verses: 3 },
  { id: 111, name: 'Al-Masad', englishName: 'The Palm Fiber', verses: 5 },
  { id: 112, name: 'Al-Ikhlas', englishName: 'The Sincerity', verses: 4 },
  { id: 113, name: 'Al-Falaq', englishName: 'The Daybreak', verses: 5 },
  { id: 114, name: 'An-Nas', englishName: 'Mankind', verses: 6 }
];

// Diacritics remove karne ka helper function
const removeArabicDiacritics = (text) => {
  return text.replace(/[\u064B-\u065F\u0670]/g, "").trim();
};

export default function QuranRecitationTest() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState('full'); // 'full' means Full Surah Test
  const [targetText, setTargetText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wordAnalysis, setWordAnalysis] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [mistakes, setMistakes] = useState([]);

  const recognitionRef = useRef(null);

  // Dynamic API Fetching for Selected Surah or Single Ayah
  useEffect(() => {
    const fetchTargetText = async () => {
      setLoadingText(true);
      try {
        if (selectedAyah === 'full') {
          // Fetch full Surah text
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-simple`);
          const data = await response.json();
          if (data.status === 'OK') {
            const fullSurahText = data.data.ayahs.map(a => a.text).join(' ');
            setTargetText(fullSurahText);
          }
        } else {
          // Fetch single Ayah text
          const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah}:${selectedAyah}/quran-simple`);
          const data = await response.json();
          if (data.status === 'OK') {
            setTargetText(data.data.text);
          }
        }
      } catch (err) {
        console.error('Error fetching text data:', err);
      } finally {
        setLoadingText(false);
      }
    };

    fetchTargetText();
    setTranscript('');
    setWordAnalysis([]);
    setAccuracy(null);
    setMistakes([]);
  }, [selectedSurah, selectedAyah]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'ar-SA';

      recog.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognitionRef.current = recog;
    }
  }, []);

  // Algorithm for word-by-word matching
  const compareRecitation = (userText) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const rawOriginalWords = targetText.split(' ').filter(w => w.trim() !== '');
      const cleanOriginalWords = rawOriginalWords.map(w => removeArabicDiacritics(w));
      const cleanUserWords = removeArabicDiacritics(userText).split(' ').filter(w => w !== '');

      let wordStatus = [];
      let detectedMistakes = [];
      let correctMatches = 0;

      rawOriginalWords.forEach((origWord, idx) => {
        const cleanOrig = cleanOriginalWords[idx];
        const userWord = cleanUserWords[idx];

        if (!userWord) {
          wordStatus.push({ original: origWord, status: 'missing' });
          detectedMistakes.push({
            index: idx + 1,
            type: 'Missing Word',
            expected: origWord,
            recited: '---'
          });
        } else if (cleanOrig === userWord || cleanOrig.includes(userWord) || userWord.includes(cleanOrig)) {
          correctMatches++;
          wordStatus.push({ original: origWord, status: 'correct' });
        } else {
          wordStatus.push({ original: origWord, status: 'wrong' });
          detectedMistakes.push({
            index: idx + 1,
            type: 'Wrong Word',
            expected: origWord,
            recited: userWord
          });
        }
      });

      const calcAccuracy = Math.round((correctMatches / rawOriginalWords.length) * 100);

      setWordAnalysis(wordStatus);
      setMistakes(detectedMistakes);
      setAccuracy(calcAccuracy);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      compareRecitation(transcript);
    } else {
      setTranscript('');
      setWordAnalysis([]);
      setAccuracy(null);
      setMistakes([]);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const currentSurahData = SURAH_LIST.find(s => s.id === selectedSurah);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Full Quran AI Recitation Tester</h1>
            <p className="text-xs text-gray-500">Test single Ayah or Full Surah with dynamic real-time speech comparison</p>
          </div>
          
          <div className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-2 ${
            isRecording ? 'bg-red-100 text-red-700 animate-pulse' :
            isAnalyzing ? 'bg-amber-100 text-amber-700 animate-pulse' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {isRecording ? 'Listening...' : isAnalyzing ? 'Analyzing...' : 'AI Ready'}
          </div>
        </div>

        {/* Dynamic Surah & Ayah/Full Selection Dropdowns */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Select Surah (1 to 114):</label>
              <select
                value={selectedSurah}
                onChange={(e) => {
                  setSelectedSurah(Number(e.target.value));
                  setSelectedAyah('full');
                }}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0d472a]"
              >
                {SURAH_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.name} ({s.englishName}) - {s.verses} Verses
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Select Test Scope (Ayah or Full Surah):</label>
              <select
                value={selectedAyah}
                onChange={(e) => setSelectedAyah(e.target.value === 'full' ? 'full' : Number(e.target.value))}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0d472a]"
              >
                <option value="full">✨ Full Surah Test ({currentSurahData.verses} Verses)</option>
                {Array.from({ length: currentSurahData.verses }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Single Ayah {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reference Display Box */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
            <span className="text-xs text-gray-400 font-bold block mb-1">
              Surah {currentSurahData.name} - {selectedAyah === 'full' ? 'Full Surah Target Text' : `Ayah ${selectedAyah} Target Text`}:
            </span>
            {loadingText ? (
              <span className="text-xs text-emerald-700 animate-pulse font-semibold">
                Loading Quran text from API...
              </span>
            ) : (
              <p className="text-2xl font-serif text-[#0d472a] dir-rtl leading-relaxed max-h-48 overflow-y-auto px-2">
                {targetText}
              </p>
            )}
          </div>
        </div>

        {/* Recording Panel */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
          <button
            onClick={handleToggleRecording}
            disabled={isAnalyzing || loadingText}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all mx-auto ${
              isRecording 
                ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-100' 
                : 'bg-[#0d472a] text-white hover:bg-[#125835] ring-8 ring-emerald-50'
            }`}
          >
            🎙️
          </button>
          
          <p className="text-xs font-semibold text-gray-600">
            {isRecording ? 'Recite into mic... Click to Stop & Analyze' : 'Click microphone button to start testing'}
          </p>

          {transcript && (
            <div className="p-3 bg-slate-100 rounded-xl text-right font-serif text-lg text-gray-800 border dir-rtl max-h-40 overflow-y-auto">
              {transcript}
            </div>
          )}
        </div>

        {/* Word-by-Word Color Visualizer */}
        {wordAnalysis.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Word-by-Word Color Feedback</h3>
            <div className="flex flex-wrap gap-2 justify-end dir-rtl p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-60 overflow-y-auto">
              {wordAnalysis.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-xl font-serif font-bold px-3 py-1 rounded-lg border ${
                    item.status === 'correct' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    item.status === 'wrong' ? 'bg-red-100 text-red-700 border-red-300' :
                    'bg-amber-100 text-amber-800 border-amber-300 line-through'
                  }`}
                >
                  {item.original}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Breakdown Report */}
        {accuracy !== null && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">🎯 Test Accuracy Result</h3>
              <span className={`px-4 py-1 rounded-full font-extrabold text-sm ${
                accuracy >= 80 ? 'bg-emerald-100 text-[#0d472a]' : 'bg-amber-100 text-amber-800'
              }`}>
                Score: {accuracy}%
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mistakes.length === 0 ? (
                <div className="text-center py-4 text-emerald-700 font-bold text-sm">
                  🎉 MashaAllah! No mistakes detected in your recitation.
                </div>
              ) : (
                mistakes.map((m, idx)=> (
                  <div key={idx} className="p-3 rounded-xl bg-red-50 border border-red-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                        Word #{m.index}
                      </span>
                      <span className="text-xs font-bold text-red-700">{m.type}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Expected</span>
                        <span className="text-emerald-700 font-serif text-base">{m.expected}</span>
                      </div>
                      <span className="text-gray-300">➔</span>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Recited</span>
                        <span className="text-red-600 font-serif text-base">{m.recited}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}