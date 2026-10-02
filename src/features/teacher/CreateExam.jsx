import React, { useState } from 'react';

export default function CreateExam({ onBack }) {
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState({
    class: 'Class 1 (Hifz Group)',
    surah: 'Surah Al-Baqarah',
    startAyat: 1,
    endAyat: 10,
    examType: 'Both',
  });

  const handlePublish = () => {
    alert('🚀 Exam Scheduled & Published Successfully!');
    if (onBack) onBack();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Create New Exam 📝</h2>
          <p className="text-xs text-gray-500">Build and schedule exams for your students</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Wizard Steps */}
      <div className="flex justify-between text-xs font-semibold text-gray-400 border-b pb-3">
        <span className={step >= 1 ? 'text-[#0d472a] font-bold border-b-2 border-[#0d472a] pb-1' : ''}>1. Select Class</span>
        <span className={step >= 2 ? 'text-[#0d472a] font-bold border-b-2 border-[#0d472a] pb-1' : ''}>2. Select Surah</span>
        <span className={step >= 3 ? 'text-[#0d472a] font-bold border-b-2 border-[#0d472a] pb-1' : ''}>3. Settings</span>
        <span className={step >= 4 ? 'text-[#0d472a] font-bold border-b-2 border-[#0d472a] pb-1' : ''}>4. Review</span>
      </div>

      {/* Step 1: Select Class */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Class / Student Group</label>
            <select 
              value={examData.class}
              onChange={(e) => setExamData({ ...examData, class: e.target.value })}
              className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0d472a]"
            >
              <option value="Class 1 (Hifz Group)">Class 1 (Hifz Group)</option>
              <option value="Class 2 (Nazra Group)">Class 2 (Nazra Group)</option>
              <option value="Hifz Group A">Hifz Group A</option>
            </select>
          </div>
          <button 
            onClick={() => setStep(2)}
            className="w-full py-2.5 bg-[#0d472a] text-white rounded-xl text-xs font-semibold hover:bg-[#0a3821] transition"
          >
            Next: Select Surah →
          </button>
        </div>
      )}

      {/* Step 2: Select Surah & Ayat */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Surah</label>
            <select 
              value={examData.surah}
              onChange={(e) => setExamData({ ...examData, surah: e.target.value })}
              className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0d472a]"
            >
              <option value="Surah Al-Baqarah">Surah Al-Baqarah</option>
              <option value="Surah Al-Imran">Surah Al-Imran</option>
              <option value="Surah Al-Fatiha">Surah Al-Fatiha</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Ayat</label>
              <input 
                type="number" 
                value={examData.startAyat}
                onChange={(e) => setExamData({ ...examData, startAyat: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Ayat</label>
              <input 
                type="number" 
                value={examData.endAyat}
                onChange={(e) => setExamData({ ...examData, endAyat: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs bg-gray-50"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs">
              Back
            </button>
            <button onClick={() => setStep(3)} className="w-1/2 py-2.5 bg-[#0d472a] text-white rounded-xl text-xs font-semibold">
              Next: Settings →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-gray-700">Exam Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['Recitation Test', 'Written Quiz', 'Both'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setExamData({ ...examData, examType: type })}
                className={`p-2.5 border rounded-xl text-xs font-medium transition ${
                  examData.examType === type ? 'bg-emerald-50 border-[#0d472a] text-[#0d472a] font-bold' : 'text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setStep(2)} className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs">
              Back
            </button>
            <button onClick={() => setStep(4)} className="w-1/2 py-2.5 bg-[#0d472a] text-white rounded-xl text-xs font-semibold">
              Next: Review →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2 text-xs text-gray-700">
            <p><b>Class:</b> {examData.class}</p>
            <p><b>Surah:</b> {examData.surah}</p>
            <p><b>Ayat Range:</b> {examData.startAyat} - {examData.endAyat}</p>
            <p><b>Exam Type:</b> {examData.examType}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(3)} className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs">
              Back
            </button>
            <button 
              onClick={handlePublish} 
              className="w-1/2 py-2.5 bg-[#0d472a] text-white rounded-xl text-xs font-semibold hover:bg-[#0a3821]"
            >
              Publish Exam 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}