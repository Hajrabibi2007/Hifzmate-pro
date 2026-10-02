import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function DailyPlan() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Goal Form State
  const [newType, setNewType] = useState('Sabaq');
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  // 1. Fetch Active User and Plans
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user || null;
        setCurrentUser(user);

        let query = supabase.from('daily_plans').select('*');
        if (user) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: true });

        if (error) {
          console.error('Fetch Error:', error);
        } else if (data) {
          const mappedData = data.map((item) => ({
            id: item.id,
            type: item.type || 'Sabaq',
            title: item.title,
            detail: item.detail || '',
            status: item.status || 'Pending',
            tagColor:
              item.type === 'Sabqi'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : item.type === 'Manzil'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'bg-amber-100 text-amber-800 border-amber-200',
          }));
          setTasks(mappedData);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Add New Goal
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const activeUser = session?.user || currentUser;

      let tagColor = 'bg-amber-100 text-amber-800 border-amber-200';
      if (newType === 'Sabqi') tagColor = 'bg-blue-100 text-blue-800 border-blue-200';
      if (newType === 'Manzil') tagColor = 'bg-purple-100 text-purple-800 border-purple-200';

      const newTaskData = {
        type: newType,
        title: newTitle,
        detail: newDetail,
        status: 'Pending',
      };

      if (activeUser?.id) {
        newTaskData.user_id = activeUser.id;
      }

      const { data, error } = await supabase
        .from('daily_plans')
        .insert([newTaskData])
        .select();

      if (error) {
        console.error('Insert error:', error);
        alert('Database error: ' + error.message);
      } else if (data && data.length > 0) {
        setTasks([...tasks, { ...data[0], tagColor }]);
        setNewTitle('');
        setNewDetail('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Add goal error:', err);
      alert('Error: ' + err.message);
    }
  };

  // 3. Toggle Task Status
  const toggleTaskStatus = async (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const newStatus = targetTask.status === 'Completed' ? 'Pending' : 'Completed';

    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));

    const { error } = await supabase
      .from('daily_plans')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Update status error:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  // 4. Delete Task
  const deleteTask = async (id) => {
    setTasks(tasks.filter((t) => t.id !== id));

    const { error } = await supabase
      .from('daily_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      alert('Error deleting goal: ' + error.message);
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'All') return true;
    return task.type === activeFilter;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (loading) {
    return <div className="text-center py-12 text-xs text-gray-500">Loading daily plans...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📅 Daily Plan & Schedule
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Today is <span className="font-semibold text-emerald-800">{todayDate}</span>. Keep up your consistency!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0d472a] text-white rounded-xl text-xs font-semibold hover:bg-[#135d38] transition flex items-center gap-1.5 shadow-sm w-fit"
        >
          <span>+</span> Add Custom Goal
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <p className="text-xs font-semibold text-gray-400">TODAY'S PROGRESS</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-800">{completedTasks} / {totalTasks}</span>
            <span className="text-xs text-emerald-700 font-semibold">({progressPercent}% Completed)</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Overall Completion Rate</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0d472a] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {['All', 'Sabaq', 'Sabqi', 'Manzil'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeFilter === filter
                ? 'bg-emerald-50 text-[#0d472a] border border-emerald-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-5 rounded-2xl border transition duration-200 shadow-sm flex flex-col justify-between space-y-4 ${
              task.status === 'Completed'
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-gray-100 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${task.tagColor}`}>
                  {task.type}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold ${
                      task.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 text-xs transition px-1"
                    title="Delete goal"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-base">{task.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.detail}</p>
            </div>

            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl transition ${
                task.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                  : 'bg-[#0d472a] text-white hover:bg-[#135d38]'
              }`}
            >
              {task.status === 'Completed' ? '✓ Completed (Click to Undo)' : 'Mark as Completed'}
            </button>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
          No tasks found under "{activeFilter}".
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-800">Add New Daily Goal</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Goal Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                >
                  <option value="Sabaq">Sabaq (New Lesson)</option>
                  <option value="Sabqi">Sabqi (Recent Revision)</option>
                  <option value="Manzil">Manzil (Old Revision)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title (e.g., Surah / Juz Name)</label>
                <input
                  type="text"
                  placeholder="e.g. Surah Al-Kahf"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Detail (e.g., Verses / Pages)</label>
                <input
                  type="text"
                  placeholder="e.g. Verses 1 to 10"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d472a] hover:bg-[#135d38] rounded-xl"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}