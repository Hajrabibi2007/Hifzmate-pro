import React, { useState } from 'react';

export default function AchievementsModule() {
  const [filter, setFilter] = useState('all'); // 'all', 'unlocked', 'locked'
  const [selectedRewardModal, setSelectedRewardModal] = useState(null);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'First Step',
      description: 'Completed your first daily Hifz lesson.',
      icon: '🌱',
      unlocked: true,
      date: 'Aug 10, 2026',
      category: 'Milestone',
      xp: 100,
      stars: 1,
      rewardTitle: 'Beginner Reciter 🏅',
    },
    {
      id: 2,
      title: 'Consistent Reciter',
      description: 'Maintained a 10-day active learning streak.',
      icon: '🔥',
      unlocked: true,
      date: 'Sep 15, 2026',
      category: 'Streak',
      xp: 250,
      stars: 2,
      rewardTitle: 'Streak Master ⚡',
    },
    {
      id: 3,
      title: 'Juz Master',
      description: 'Memorized 10 complete Juz with high accuracy.',
      icon: '📖',
      unlocked: true,
      date: 'Sep 20, 2026',
      category: 'Hifz',
      xp: 500,
      stars: 3,
      rewardTitle: '10-Juz Champion 🏆',
    },
    {
      id: 4,
      title: 'Mutashabihat Expert',
      description: 'Successfully reviewed 50+ similar verses.',
      icon: '🧠',
      unlocked: false,
      currentProgress: 32,
      totalGoal: 50,
      category: 'Revision',
      xp: 400,
      stars: 3,
      rewardTitle: 'Verse Specialist 🔮',
    },
    {
      id: 5,
      title: 'Quiz Champion',
      description: 'Scored 100% in 5 consecutive Hifz quizzes.',
      icon: '🏆',
      unlocked: false,
      currentProgress: 3,
      totalGoal: 5,
      category: 'Quiz',
      xp: 300,
      stars: 2,
      rewardTitle: 'Mastermind 👑',
    },
    {
      id: 6,
      title: 'Half Hafiz',
      description: 'Complete 15 Juz of the Holy Quran.',
      icon: '⭐',
      unlocked: false,
      currentProgress: 12,
      totalGoal: 15,
      category: 'Hifz',
      xp: 1000,
      stars: 5,
      rewardTitle: 'Half Hafiz Hero 🌟',
    },
  ]);

  // Gamification Calculations
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const unlockedCount = unlockedAchievements.length;
  const lockedCount = totalAchievements - unlockedCount;
  const overallProgressPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  // Total XP & Stars Earned
  const totalXP = unlockedAchievements.reduce((acc, item) => acc + item.xp, 0);
  const totalStars = unlockedAchievements.reduce((acc, item) => acc + item.stars, 0);

  // Student Level Logic (1 Level per 300 XP)
  const currentLevel = Math.floor(totalXP / 300) + 1;
  const nextLevelXP = currentLevel * 300;
  const xpProgressPercent = Math.min(100, Math.round((totalXP / nextLevelXP) * 100));

  // Determine Rank Badge
  const getRankTitle = (lvl) => {
    if (lvl >= 5) return 'Hafiz Legend 👑';
    if (lvl >= 3) return 'Rising Hafiz 🌟';
    return 'Learner Reciter 🌿';
  };

  // Filter logic
  const filteredAchievements = achievements.filter((item) => {
    if (filter === 'unlocked') return item.unlocked;
    if (filter === 'locked') return !item.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🏆 Badges & Student Rewards
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Unlock achievements, earn XP points, collect stars, and level up your Hifz journey!
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === 'all'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All ({totalAchievements})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === 'unlocked'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === 'locked'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Locked ({lockedCount})
          </button>
        </div>
      </div>

      {/* NEW GAMIFIED LEVEL & XP HERO BANNER */}
      <div className="bg-gradient-to-r from-[#0d472a] to-emerald-700 text-white p-5 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
            <span className="text-[10px] uppercase tracking-wider">LEVEL</span>
            <span className="text-2xl leading-none">{currentLevel}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{getRankTitle(currentLevel)}</h2>
              <span className="bg-emerald-800/80 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-300/30">
                {totalStars} ⭐ Stars Collected
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              Earn XP by unlocking badges and completing Hifz goals.
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full md:w-64 space-y-1.5 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="flex justify-between text-[11px] font-semibold text-emerald-100">
            <span>XP Progress</span>
            <span className="text-amber-300">{totalXP} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-emerald-950/60 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpProgressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800">Unlocked Badges</p>
            <p className="text-2xl font-bold text-emerald-900 mt-0.5">
              {unlockedCount} / {totalAchievements}
            </p>
          </div>
          <span className="text-2xl">🎉</span>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800">Total Stars Earned</p>
            <p className="text-2xl font-bold text-amber-900 mt-0.5 flex items-center gap-1">
              {totalStars} <span className="text-lg">⭐</span>
            </p>
          </div>
          <span className="text-2xl">🌟</span>
        </div>

        <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-800">Next Available Target</p>
            <p className="text-sm font-bold text-blue-900 mt-1">
              {achievements.find((a) => !a.unlocked)?.title || 'All Completed!'}
            </p>
          </div>
          <span className="text-2xl">🎯</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredAchievements.map((item) => {
          const itemProgressPercent = item.unlocked
            ? 100
            : Math.round((item.currentProgress / item.totalGoal) * 100);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition duration-200 shadow-sm flex flex-col justify-between space-y-4 ${
                item.unlocked
                  ? 'bg-white border-emerald-200 hover:shadow-md cursor-pointer'
                  : 'bg-gray-50/80 border-gray-200 opacity-80'
              }`}
              onClick={() => item.unlocked && setSelectedRewardModal(item)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                      item.unlocked
                        ? 'bg-emerald-50 border-emerald-100 shadow-sm'
                        : 'bg-gray-100 border-gray-200 grayscale'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        item.unlocked
                          ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                          : 'bg-gray-200/70 text-gray-600 border-gray-300'
                      }`}
                    >
                      {item.unlocked ? 'Unlocked 🔓' : 'Locked 🔒'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      +{item.xp} XP • {'⭐'.repeat(item.stars)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-800 flex items-center justify-between">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Progress or Date Footer */}
              <div className="pt-3 border-t border-gray-100">
                {item.unlocked ? (
                  <div className="flex justify-between items-center text-[11px] text-emerald-700 font-medium">
                    <span className="text-emerald-800 font-semibold">{item.rewardTitle}</span>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                      <span>Goal Progress</span>
                      <span>
                        {item.currentProgress} / {item.totalGoal} ({itemProgressPercent}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${itemProgressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
          No badges found in this category.
        </div>
      )}

      {/* CELEBRATION REWARD POP-UP MODAL */}
      {selectedRewardModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-emerald-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl"></div>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner">
              {selectedRewardModal.icon}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Reward Unlocked! 🎊
              </span>
              <h3 className="text-xl font-extrabold text-gray-800 mt-2">
                {selectedRewardModal.title}
              </h3>
              <p className="text-xs font-bold text-emerald-700">
                Title Earned: "{selectedRewardModal.rewardTitle}"
              </p>
              <p className="text-xs text-gray-500 pt-1">
                {selectedRewardModal.description}
              </p>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl flex justify-around items-center border border-emerald-100 text-xs font-bold">
              <span className="text-emerald-800">+{selectedRewardModal.xp} XP Points</span>
              <span className="text-amber-600">{'⭐'.repeat(selectedRewardModal.stars)} Stars</span>
            </div>

            <button
              onClick={() => setSelectedRewardModal(null)}
              className="w-full py-2.5 bg-[#0d472a] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition shadow-md"
            >
              Awesome! Keep Learning 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}