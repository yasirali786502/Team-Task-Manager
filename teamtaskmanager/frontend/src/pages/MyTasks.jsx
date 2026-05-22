import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const response = await api.get('/tasks/my-tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="text-sm font-semibold text-slate-500">Loading your tasks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Tasks</h1>
            <p className="text-slate-500 text-sm mt-1">Review and manage your personal assignments across all workspaces</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center mb-8">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/50 transition"
            >
              <option value="">All Stages</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Filter by Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/50 transition"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="self-end text-xs font-bold text-slate-400 py-2.5 px-1">
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto p-6">
            <span className="text-4xl block mb-3">🎉</span>
            <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
            <p className="text-slate-500 text-xs mt-1">
              You either don't have any tasks assigned in this state, or aren't assigned to tasks in any active projects!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="relative">
                <div className="absolute top-3 left-4 z-10 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[9px] uppercase px-2.5 py-0.5 rounded shadow-sm">
                  {task.projectId?.name || 'Workspace'}
                </div>
                <div className="pt-4">
                  <TaskCard
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={() => {}} 
                    onDelete={() => {}} 
                    isAdmin={false} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
