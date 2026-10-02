import React, { useState, useEffect } from 'react';
// Agar aap Supabase use kar rahe hain, to niche wali line ka comment hata dein:
// import { supabase } from '../supabaseClient'; 

// Local Static Questions (Backup jab tak online data load na ho)
const DEFAULT_QUIZ_DATA = [
  {
    id: 1,
    categoryEn: 'Full Quran - General',
    categoryUr: 'مکمل قرآن - عام معلومات',
    questionEn: 'How many Surahs are in the Holy Quran, and how many are Makki / Madani?',
    questionUr: 'قرآن مجید میں کل کتنی سورتیں ہیں، اور ان میں سے مکی اور مدنی کتنی ہیں؟',
    optionsEn: [
      '114 Surahs (86 Makki, 28 Madani)',
      '114 Surahs (80 Makki, 34 Madani)',
      '112 Surahs (86 Makki, 26 Madani)',
      '114 Surahs (90 Makki, 24 Madani)',
    ],
    optionsUr: [
      '114 سورتیں (86 مکی، 28 مدنی)',
      '114 سورتیں (80 مکی، 34 مدنی)',
      '112 سورتیں (86 مکی، 26 مدنی)',
      '114 سورتیں (90 مکی، 24 مدنی)',
    ],
    correct: 0,
    explanationEn: 'The Quran has 114 Surahs in total: 86 were revealed in Makkah (Makki) and 28 in Madinah (Madani).',
    explanationUr: 'قرآن مجید میں کل 114 سورتیں ہیں: 86 مکہ مکرمہ میں نازل ہوئیں (مکی) اور 28 مدینہ منورہ میں (مدنی)۔',
  },
  {
    id: 2,
    categoryEn: 'Mutashabihat (Similar Verses)',
    categoryUr: 'متشابہات (مشابہ آیات)',
    questionEn: 'In which Surah does the verse "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ" appear 31 times?',
    questionUr: 'آیت "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ" کس سورۃ میں 31 بار آئی ہے؟',
    optionsEn: ['Surah Yasin', 'Surah Al-Waqi\'ah', 'Surah Ar-Rahman', 'Surah Al-Mulk'],
    optionsUr: ['سورۃ یٰسین', 'سورۃ الواقعہ', 'سورۃ الرحمٰن', 'سورۃ الملک'],
    correct: 2,
    explanationEn: 'Surah Ar-Rahman (Surah #55) repeats this verse 31 times emphasizing Allah\'s blessings.',
    explanationUr: 'سورۃ الرحمٰن (سورۃ نمبر 55) میں یہ آیت اللہ تعالیٰ کی نعمتوں کو اجاگر کرنے کے لیے 31 بار دہرائی گئی ہے۔',
  },
  {
    id: 3,
    categoryEn: 'Tajweed Rules',
    categoryUr: 'تجوید کے قواعد',
    questionEn: 'What Tajweed rule applies when Noon Sakinah (نْ) or Tanween is followed by the letter Baa (ب)?',
    questionUr: 'نون ساکن (نْ) یا تنوین کے بعد حرف با (ب) آنے پر تجوید کا کون سا قاعدہ لاگو ہوتا ہے؟',
    optionsEn: ['Izhar', 'Iqlab', 'Idgham', 'Ikhfa'],
    optionsUr: ['اظہار', 'اقلاب', 'ادغام', 'اخفاء'],
    correct: 1,
    explanationEn: 'Iqlab occurs when Noon Sakinah or Tanween meets Baa (ب), changing its sound to Meem with Ghunnah.',
    explanationUr: 'اقلاب تب ہوتا ہے جب نون ساکن یا تنوین کے بعد با (ب) آئے، جس سے اس کی آواز غنہ کے ساتھ میم میں بدل جاتی ہے۔',
  },
  {
    id: 4,
    categoryEn: 'Quranic Knowledge',
    categoryUr: 'قرآنی معلومات',
    questionEn: 'Which Surah is known as the "Heart of the Quran"?',
    questionUr: 'کس سورۃ کو "قرآن کا دل" کہا جاتا ہے؟',
    optionsEn: ['Surah Al-Baqarah', 'Surah Yasin', 'Surah Al-Kahf', 'Surah Al-Ikhlas'],
    optionsUr: ['سورۃ البقرۃ', 'سورۃ یٰسین', 'سورۃ الکہف', 'سورۃ الاخلاص'],
    correct: 1,
    explanationEn: 'Surah Yasin (Surah 36) is narrated as the heart of the Holy Quran.',
    explanationUr: 'احادیث مبارکہ کی روشنی میں سورۃ یٰسین (سورۃ 36) کو قرآن مجید کا دل کہا گیا ہے۔',
  },
  {
    id: 5,
    categoryEn: 'Longest & Shortest Surah',
    categoryUr: 'طویل اور مختصر سورتیں',
    questionEn: 'Which are the longest and shortest Surahs in the Holy Quran respectively?',
    questionUr: 'قرآن مجید کی سب سے طویل (بڑی) اور سب سے مختصر (چھوٹی) سورۃ کون سی ہیں؟',
    optionsEn: [
      'Surah Al-Imran & Surah Al-Nas',
      'Surah Al-Baqarah & Surah Al-Kauthar',
      'Surah Al-Baqarah & Surah Al-Ikhlas',
      'Surah Al-Nisa & Surah Al-Kauthar',
    ],
    optionsUr: [
      'سورۃ آل عمران اور سورۃ الناس',
      'سورۃ البقرۃ اور سورۃ کوثر',
      'سورۃ البقرۃ اور سورۃ الاخلاص',
      'سورۃ النساء اور سورۃ کوثر',
    ],
    correct: 1,
    explanationEn: 'Surah Al-Baqarah is the longest (286 Ayats) and Surah Al-Kauthar is the shortest (3 Ayats).',
    explanationUr: 'سورۃ البقرۃ سب سے بڑی (286 آیات) اور سورۃ کوثر سب سے چھوٹی سورۃ (3 آیات) ہے۔',
  },
];

export default function QuizModule() {
  const [questions, setQuestions] = useState(DEFAULT_QUIZ_DATA);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null); // 'en' ya 'ur'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // LocalStorage se stats read karna
  const [quizStats, setQuizStats] = useState(() => {
    const saved = localStorage.getItem('quran_quiz_results');
    return saved ? JSON.parse(saved) : { testsCompleted: 0, highestScore: 0 };
  });

  useEffect(() => {
    localStorage.setItem('quran_quiz_results', JSON.stringify(quizStats));
  }, [quizStats]);

  // Online Supabase / API se dynamic questions fetch karne ka function
  const fetchDynamicQuestions = async () => {
    setLoading(true);
    try {
      /* SUPABASE INTEGRATION (Agar Supabase Table bani hui ho):
      const { data, error } = await supabase.from('quiz_questions').select('*');
      if (data && data.length > 0) {
        setQuestions(data);
      }
      */

      // Alternative Free Online API Fetch (Demo ke liye):
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=20&type=multiple');
      const apiData = await res.json();

      if (apiData.results && apiData.results.length > 0) {
        const formatted = apiData.results.map((q, idx) => {
          const opts = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
          return {
            id: idx + 100,
            categoryEn: 'Islamic Studies (Online)',
            categoryUr: 'اسلامی معلومات (آن لائن)',
            questionEn: q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
            questionUr: q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
            optionsEn: opts.map((o) => o.replace(/&quot;/g, '"').replace(/&#039;/g, "'")),
            optionsUr: opts.map((o) => o.replace(/&quot;/g, '"').replace(/&#039;/g, "'")),
            correct: opts.indexOf(q.correct_answer),
            explanationEn: `Correct answer is: ${q.correct_answer}`,
            explanationUr: `درست جواب: ${q.correct_answer}`,
          };
        });
        setQuestions(formatted);
      }
    } catch (err) {
      console.log('Online questions load nahi ho sake, default fallback questions active hain.', err);
      setQuestions(DEFAULT_QUIZ_DATA);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIdx] || DEFAULT_QUIZ_DATA[0];

  const handleSelect = (idx) => {
    if (!isSubmitted) setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      const finalPercent = Math.round((score / questions.length) * 100);
      setQuizStats((prev) => ({
        testsCompleted: prev.testsCompleted + 1,
        highestScore: Math.max(prev.highestScore, finalPercent),
      }));
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setLanguage(null);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);
  const isUrdu = language === 'ur';

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-2 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🧠 Full Quran Assessment Quiz</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Test your Hifz, Mutashabihat, and Tajweed rules in English or Urdu.
          </p>
        </div>

        <div className="text-right text-xs bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
          <p className="font-bold text-[#0d472a]">Tests Taken: {quizStats.testsCompleted}</p>
          <p className="text-emerald-700 text-[10px]">Highest Score: {quizStats.highestScore}%</p>
        </div>
      </div>

      {/* LANGUAGE SELECT SCREEN */}
      {!language ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-[#0d472a] rounded-full flex items-center justify-center mx-auto text-3xl">
            🌐
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-800">Select Quiz Language / زبان منتخب کریں</h2>
            <p className="text-xs text-gray-500">Choose preferred language to start the test.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <button
              onClick={() => setLanguage('en')}
              className="p-5 bg-emerald-50/60 border-2 border-emerald-200 hover:border-[#0d472a] rounded-2xl transition text-center space-y-1"
            >
              <p className="font-bold text-sm text-[#0d472a]">English</p>
              <p className="text-[11px] text-gray-500">Attempt quiz in English</p>
            </button>

            <button
              onClick={() => setLanguage('ur')}
              className="p-5 bg-emerald-50/60 border-2 border-emerald-200 hover:border-[#0d472a] rounded-2xl transition text-center space-y-1"
            >
              <p className="font-bold text-base text-[#0d472a]">اردو (Urdu)</p>
              <p className="text-[11px] text-gray-500">اردو زبان میں کوئز دیں</p>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={fetchDynamicQuestions}
              disabled={loading}
              className="px-4 py-2 text-xs bg-emerald-100 text-[#0d472a] font-bold rounded-xl hover:bg-emerald-200 transition disabled:opacity-50"
            >
              {loading ? '🔄 Loading Online Questions...' : '⚡ Fetch New Online Questions'}
            </button>
          </div>
        </div>
      ) : !isFinished ? (
        /* QUIZ SCREEN */
        <div
          className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Top Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                {isUrdu ? currentQ.categoryUr : currentQ.categoryEn}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
                  className="text-[10px] text-emerald-700 underline font-semibold"
                >
                  {isUrdu ? 'English' : 'اردو'}
                </button>
                <span className="text-gray-400 font-semibold">
                  {isUrdu
                    ? `سوال ${currentIdx + 1} از ${questions.length}`
                    : `Question ${currentIdx + 1} of ${questions.length}`}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0d472a] h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-bold text-gray-800 leading-relaxed">
            {isUrdu ? currentQ.questionUr : currentQ.questionEn}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5">
            {(isUrdu ? currentQ.optionsUr : currentQ.optionsEn).map((opt, idx) => {
              let btnStyle = 'bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-300';

              if (selectedOption === idx) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
              }

              if (isSubmitted) {
                if (idx === currentQ.correct) {
                  btnStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                } else if (selectedOption === idx) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-900';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-3.5 text-xs rounded-xl border transition flex justify-between items-center ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && idx === currentQ.correct && (
                    <span className="text-emerald-700 font-extrabold text-xs">
                      {isUrdu ? '✓ درست' : '✓ Correct'}
                    </span>
                  )}
                  {isSubmitted && selectedOption === idx && idx !== currentQ.correct && (
                    <span className="text-red-600 font-bold text-xs">
                      {isUrdu ? '✗ غلط' : '✗ Wrong'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isSubmitted && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-emerald-900">
                {isUrdu ? '📖 جواب کی وضاحت:' : '📖 Answer Explanation:'}
              </p>
              <p className="text-emerald-800 leading-relaxed">
                {isUrdu ? currentQ.explanationUr : currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="w-full py-3 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition disabled:opacity-40"
              >
                {isUrdu ? 'جواب جمع کروائیں' : 'Submit Answer'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition"
              >
                {currentIdx < questions.length - 1
                  ? isUrdu
                    ? 'اگلا سوال ←'
                    : 'Next Question →'
                  : isUrdu
                  ? 'نتائج دیکھیں'
                  : 'View Test Results'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT SCREEN */
        <div
          className={`bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-5 ${
            isUrdu ? 'rtl' : ''
          }`}
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 text-2xl font-black">
            🎉
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isUrdu ? 'کوئز مکمل ہو گیا!' : 'Quiz Completed!'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isUrdu ? 'آپ کے کوئز کی کارکردگی کا خلاصہ' : 'Here is your Quran Assessment Summary'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] text-emerald-700 font-bold uppercase">
                {isUrdu ? 'درست جوابات' : 'Correct Answers'}
              </p>
              <p className="text-2xl font-black text-[#0d472a] mt-1">
                {score} / {questions.length}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-700 font-bold uppercase">
                {isUrdu ? 'اسکور کا فیصد' : 'Score Percentage'}
              </p>
              <p className="text-2xl font-black text-blue-900 mt-1">{scorePercentage}%</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition"
          >
            {isUrdu ? '🔄 دوبارہ کوئز دیں' : '🔄 Retake Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}