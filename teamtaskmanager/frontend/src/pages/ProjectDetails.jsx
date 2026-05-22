import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import AddMemberModal from '../components/AddMemberModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'dashboard' | 'members'
  
  // Modals state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // For editing
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes, statsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get(`/tasks/dashboard/${id}`)
      ]);
      
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setDashboardStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsOnly = async () => {
    try {
      const statsRes = await api.get(`/tasks/dashboard/${id}`);
      setDashboardStats(statsRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = project ? (project.adminId._id === user._id || project.adminId === user._id) : false;

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      fetchStatsOnly();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask._id}`, taskData);
      } else {
        await api.post('/tasks', { ...taskData, projectId: id });
      }
      setShowTaskForm(false);
      setSelectedTask(null);
      
      const tasksRes = await api.get(`/tasks/project/${id}`);
      setTasks(tasksRes.data.data);
      fetchStatsOnly();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to submit task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      fetchStatsOnly();
    } catch (error) {
      console.error(error);
      alert('Failed to delete task');
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      await api.post(`/projects/${id}/members`, { userId: memberId });
      setShowAddMember(false);
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (confirm('Are you sure you want to remove this member from the project? Any tasks assigned to them will remain.')) {
      try {
        await api.delete(`/projects/${id}/members/${memberId}`);
        const projectRes = await api.get(`/projects/${id}`);
        setProject(projectRes.data.data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    const isMatch = deleteConfirmationInput.trim().toLowerCase() === `delete ${project.name.trim().toLowerCase()}`;
    if (!isMatch) {
      alert(`Please type exactly "Delete ${project.name}" to delete.`);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      setShowDeleteModal(false);
      navigate('/projects');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete workspace.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAssignee = assigneeFilter === '' || task.assignedTo?._id === assigneeFilter;
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'Done');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="text-sm font-semibold text-slate-500">Loading workspace details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
          <Link to="/projects" className="text-indigo-600 hover:underline">Return to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      <Navbar />
      
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200/80 py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <Link to="/projects" className="hover:text-indigo-600">Workspaces</Link>
                <span>/</span>
                <span className="text-slate-600">{project.name}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {project.name}
              </h1>
              <p className="text-slate-500 text-sm mt-2 max-w-2xl">
                {project.description || 'No description provided.'}
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setShowTaskForm(true);
                  }}
                  className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  ➕ Create Task
                </button>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  👥 Add Member
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmationInput('');
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 md:flex-none bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 text-sm font-bold px-5 py-2.5 rounded-xl transition"
                >
                  🗑️ Delete Workspace
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2.5 mt-8 border-t border-slate-100 pt-4">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all ${
                activeTab === 'board'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              📋 Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              📊 Performance Stats
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all ${
                activeTab === 'members'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              👥 Team Members ({project.members.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* TAB 1: KANBAN BOARD */}
        {activeTab === 'board' && (
          <div className="flex flex-col gap-6">
            
            {/* Filter controls bar */}
            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <span className="absolute left-3 top-2 text-slate-400">🔍</span>
              </div>
              
              {/* Dropdown selectors */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="flex-1 md:flex-none text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/50 transition"
                >
                  <option value="">All Assignees</option>
                  {project.members.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="flex-1 md:flex-none text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/50 transition"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Columns grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* To Do Column */}
              <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]">
                <div className="flex justify-between items-center px-1">
                  <span className="font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span> To Do
                  </span>
                  <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {todoTasks.length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3.5 overflow-y-auto">
                  {todoTasks.length === 0 ? (
                    <div className="text-center py-10 bg-white/40 border border-dashed border-slate-200/70 rounded-xl text-xs text-slate-400 select-none">
                      No tasks in this stage
                    </div>
                  ) : (
                    todoTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleTaskStatusChange}
                        onEdit={(t) => {
                          setSelectedTask(t);
                          setShowTaskForm(true);
                        }}
                        onDelete={handleDeleteTask}
                        isAdmin={isAdmin}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]">
                <div className="flex justify-between items-center px-1">
                  <span className="font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span> In Progress
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {inProgressTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5 overflow-y-auto">
                  {inProgressTasks.length === 0 ? (
                    <div className="text-center py-10 bg-white/40 border border-dashed border-slate-200/70 rounded-xl text-xs text-slate-400 select-none">
                      No tasks in progress
                    </div>
                  ) : (
                    inProgressTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleTaskStatusChange}
                        onEdit={(t) => {
                          setSelectedTask(t);
                          setShowTaskForm(true);
                        }}
                        onDelete={handleDeleteTask}
                        isAdmin={isAdmin}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]">
                <div className="flex justify-between items-center px-1">
                  <span className="font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Completed
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {doneTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5 overflow-y-auto">
                  {doneTasks.length === 0 ? (
                    <div className="text-center py-10 bg-white/40 border border-dashed border-slate-200/70 rounded-xl text-xs text-slate-400 select-none">
                      No completed tasks
                    </div>
                  ) : (
                    doneTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleTaskStatusChange}
                        onEdit={(t) => {
                          setSelectedTask(t);
                          setShowTaskForm(true);
                        }}
                        onDelete={handleDeleteTask}
                        isAdmin={isAdmin}
                      />
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WORKSPACE STATISTICS */}
        {activeTab === 'dashboard' && dashboardStats && (
          <div className="flex flex-col gap-8">
            
            {/* Quick stats widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Tasks</span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{dashboardStats.totalTasks}</span>
              </div>
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">To Do</span>
                <span className="text-3xl font-extrabold text-slate-700 mt-1 block">{dashboardStats.todoTasks}</span>
              </div>
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">In Progress</span>
                <span className="text-3xl font-extrabold text-indigo-600 mt-1 block">{dashboardStats.inProgressTasks}</span>
              </div>
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Done</span>
                <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">{dashboardStats.doneTasks}</span>
              </div>
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
                <span className="text-rose-500 text-xs font-bold uppercase tracking-wider block">Overdue</span>
                <span className="text-3xl font-extrabold text-rose-600 mt-1 block">{dashboardStats.overdueTasks}</span>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Assignee Performance Index</h3>
                <p className="text-xs text-slate-500 mt-0.5">Task distribution and completion metrics per team member</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Member</th>
                      <th className="px-6 py-3 text-center">Allocated</th>
                      <th className="px-6 py-3 text-center">To Do</th>
                      <th className="px-6 py-3 text-center">In Progress</th>
                      <th className="px-6 py-3 text-center">Done</th>
                      <th className="px-6 py-3 text-right">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {dashboardStats.tasksPerUser?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-400 italic">No task allocations recorded yet.</td>
                      </tr>
                    ) : (
                      dashboardStats.tasksPerUser?.map((item) => {
                        const completionRate = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
                        return (
                          <tr key={item.name} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                              {item.profileImage ? (
                                <img src={item.profileImage} alt={item.name} className="w-6 h-6 rounded-full object-cover border" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 text-xs font-bold flex items-center justify-center text-slate-600 border">
                                  {item.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span>{item.name}</span>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-slate-900">{item.total}</td>
                            <td className="px-6 py-4 text-center text-slate-600">{item.todo}</td>
                            <td className="px-6 py-4 text-center text-indigo-600">{item.inProgress}</td>
                            <td className="px-6 py-4 text-center text-emerald-600">{item.done}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-bold text-slate-900">{completionRate}%</span>
                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full" 
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TEAM MEMBERS */}
        {activeTab === 'members' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Collaborators</h3>
                <p className="text-xs text-slate-500 mt-0.5">Users registered on this project workspace</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-indigo-500/20 transition shadow-sm"
                >
                  ➕ Invite Member
                </button>
              )}
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {project.members.map((member) => {
                const isMemberAdmin = project.adminId._id === member._id || project.adminId === member._id;
                return (
                  <div key={member._id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt={member.name} 
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-xs text-slate-500">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isMemberAdmin ? (
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                          Admin
                        </span>
                      ) : (
                        <>
                          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                            Collaborator
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => handleRemoveMember(member._id)}
                              className="text-xs hover:bg-rose-50 border border-transparent hover:border-rose-100 text-slate-400 hover:text-rose-600 font-semibold px-2.5 py-1.5 rounded-xl transition"
                            >
                              Remove
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Task Creation & Editing form Modal */}
      {showTaskForm && (
        <TaskForm
          project={project}
          task={selectedTask}
          onSubmit={handleCreateOrUpdateTask}
          onClose={() => {
            setShowTaskForm(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Add team member modal */}
      {showAddMember && (
        <AddMemberModal
          project={project}
          onAddMember={handleAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {/* Delete Workspace Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all duration-300">
            {/* Header */}
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                ⚠️ Secure Workspace Deletion
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-rose-400 hover:text-rose-600 rounded-lg p-1 hover:bg-rose-100/50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs text-rose-800 leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide block mb-1">CRITICAL WARNING</span>
                Deleting this workspace is **permanent and irreversible**. It will immediately delete the workspace <strong className="font-bold underline">{project.name}</strong>, all associated tasks, and revoke member access.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 leading-relaxed">
                  To confirm, type exactly <strong className="font-extrabold text-slate-700">Delete {project.name}</strong> in the field below (copy/paste is disabled):
                </label>
                <input
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    alert("Copy and pasting is disabled for safety verification.");
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm transition-all"
                  placeholder={`Delete ${project.name}`}
                  disabled={isDeleting}
                />
              </div>

              <div className="flex gap-3 mt-4 border-t border-slate-100 pt-5">
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={
                    isDeleting ||
                    deleteConfirmationInput.trim().toLowerCase() !== `delete ${project.name.trim().toLowerCase()}`
                  }
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetails;
