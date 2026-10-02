import React, { useState, useRef, useEffect } from 'react';

export default function RecitationPractice() {
  const [selectedSurah, setSelectedSurah] = useState('Surah Al-Fatiha');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Web API Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Clean up Object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  // Start Real Microphone Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioUrl(null);
      setFeedback(null);
      setRecordingTime(0);

      // Live Recording Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access access deny ho gaya hai. Kripya mic permission allow karein.');
      console.error('Mic Error:', err);
    }
  };

  // Stop Microphone Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all mic streams
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
      analyzeAudio();
    }
  };

  // Simulate Processing & Score Calculation
  const analyzeAudio = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setFeedback({
        accuracy: '92%',
        status: 'Excellent',
        tajweedScore: '9.0 / 10',
        duration: `${recordingTime} seconds`,
        notes: [
          'Clear pronunciation on Maddah letters.',
          'Pay close attention to Makhraj of "الرَّحْمَٰنِ" (heavy Haa sound).',
          'Good Ghunnah timing observed throughout the recitation.',
        ],
      });
    }, 1800);
  };

  // Format Timer Format (00:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            🎙️ Live Recitation Practice
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Record your voice live via browser mic and check your Tajweed performance.
          </p>
        </div>

        <select
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(e.target.value)}
          className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-700 hover:border-gray-300 transition"
        >
          <option>Surah Al-Fatiha</option>
          <option>Surah Al-Baqarah (1-15)</option>
          <option>Surah Al-Mulk</option>
          <option>Surah An-Nas</option>
        </select>
      </div>

      {/* Audio Recorder Stage */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 gap-4 relative overflow-hidden">
        {/* Animated Mic Indicator */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse scale-110'
              : 'bg-[#0d472a] text-white shadow-md'
          }`}
        >
          <span className="text-3xl">{isRecording ? '⏹️' : '🎙️'}</span>
        </div>

        {/* Live Timer or Status */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">
            {isRecording ? formatTime(recordingTime) : 'Ready to Recite'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isRecording
              ? 'Recording live audio from microphone...'
              : 'Click start button and begin reciting aloud'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-2">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="px-6 py-2.5 bg-[#0d472a] text-white font-semibold text-xs rounded-xl hover:bg-[#135d38] transition shadow-sm flex items-center gap-2"
            >
              <span>●</span> Start Reciting
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-6 py-2.5 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition shadow-sm flex items-center gap-2"
            >
              <span>■</span> Stop & Analyze
            </button>
          )}
        </div>
      </div>

      {/* Audio Playback Preview */}
      {audioUrl && !isRecording && (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
          <p className="text-xs font-bold text-gray-700">Listen to your recorded audio:</p>
          <audio src={audioUrl} controls className="w-full h-9 rounded-lg outline-none" />
        </div>
      )}

      {/* Analyzing Loader */}
      {isAnalyzing && (
        <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-[#0d472a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-[#0d472a]">
            Analyzing recitation rhythm and Tajweed accuracy...
          </p>
        </div>
      )}

      {/* Feedback Results Card */}
      {feedback && !isAnalyzing && (
        <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Recitation Report
              </span>
              <h4 className="text-base font-bold text-[#0d472a]">
                Overall Score: {feedback.accuracy}
              </h4>
            </div>
            <span className="px-3 py-1 bg-emerald-200/80 text-[#0d472a] font-bold text-xs rounded-lg">
              {feedback.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <p className="text-gray-400 text-[10px]">Tajweed Precision</p>
              <p className="font-bold text-gray-800">{feedback.tajweedScore}</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <p className="text-gray-400 text-[10px]">Recorded Duration</p>
              <p className="font-bold text-gray-800">{feedback.duration}</p>
            </div>
          </div>

          <div className="text-xs space-y-1.5 pt-1">
            <p className="font-bold text-gray-800">Observation Notes:</p>
            <ul className="space-y-1 text-gray-600 list-disc pl-4">
              {feedback.notes.map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}