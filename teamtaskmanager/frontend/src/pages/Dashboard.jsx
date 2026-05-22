import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projectsCount: 0,
    tasksCount: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
    upcomingTasks: []
  });

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/my-tasks')
      ]);

      const projects = projectsRes.data.data;
      const myTasks = tasksRes.data.data;

      const total = myTasks.length;
      const todo = myTasks.filter(t => t.status === 'To Do').length;
      const progress = myTasks.filter(t => t.status === 'In Progress').length;
      const done = myTasks.filter(t => t.status === 'Done').length;
      
      const overdue = myTasks.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== 'Done'
      ).length;

      const upcoming = myTasks
        .filter(t => t.status !== 'Done')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      setStats({
        projectsCount: projects.length,
        tasksCount: total,
        todoTasks: todo,
        inProgressTasks: progress,
        doneTasks: done,
        overdueTasks: overdue,
        upcomingTasks: upcoming
      });
    } catch (e) {
      console.error('Error fetching global dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="text-sm font-semibold text-slate-500">Loading intelligence summary...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Welcome Banner - Premium dark banner with indigo highlights */}
        <div className="bg-slate-900 border border-slate-800 text-slate-250 rounded-3xl p-6 md:p-8 shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">👋 Hello, {user?.name}!</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Here is your overall task flow summary. You are currently collaborating in <strong className="text-indigo-400 font-bold">{stats.projectsCount} projects</strong> with <strong className="text-indigo-400 font-bold">{stats.tasksCount} active task allocations</strong>.
            </p>
          </div>
          <Link
            to="/projects"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow transition"
          >
            📁 View All Workspaces
          </Link>
        </div>

        {/* Analytics Widgets grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Assigned Tasks</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.tasksCount}</span>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">In Progress</span>
            <span className="text-3xl font-extrabold text-indigo-600 mt-1 block">{stats.inProgressTasks}</span>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Completed</span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">{stats.doneTasks}</span>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider block">Overdue Tasks</span>
            <span className={`text-3xl font-extrabold mt-1 block ${stats.overdueTasks > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {stats.overdueTasks}
            </span>
          </div>
        </div>

        {/* Multi-section content body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Due Dates panel */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2">
            <h3 className="font-extrabold text-slate-800 tracking-tight text-base mb-4 flex items-center gap-2">
              📅 Next 5 Upcoming Assignments
            </h3>
            
            <div className="flex flex-col gap-3">
              {stats.upcomingTasks.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm select-none">
                  No upcoming incomplete assignments. You are fully caught up!
                </div>
              ) : (
                stats.upcomingTasks.map(task => {
                  const isTaskOverdue = new Date(task.dueDate) < new Date();
                  return (
                    <Link
                      to={`/projects/${task.projectId?._id}`}
                      key={task._id}
                      className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 p-4 rounded-xl transition"
                    >
                      <div className="min-w-0 pr-4">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
                          {task.projectId?.name || 'Workspace'}
                        </span>
                        <span className="font-semibold text-slate-800 text-sm block truncate">
                          {task.title}
                        </span>
                      </div>
                      
                      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          task.status === 'In Progress' 
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`text-[10px] font-bold ${isTaskOverdue ? 'text-rose-600' : 'text-slate-400'}`}>
                          {isTaskOverdue ? '⚠️ OVERDUE' : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <h3 className="font-extrabold text-slate-800 tracking-tight text-base">
              📊 Performance Overview
            </h3>

            {stats.tasksCount === 0 ? (
              <div className="text-center py-10 text-slate-400 italic text-xs">
                No completion data available.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Completion rate meter */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <span>Task Completion Rate</span>
                    <span className="text-slate-800">{Math.round((stats.doneTasks / stats.tasksCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(stats.doneTasks / stats.tasksCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Distributions */}
                <div className="flex flex-col gap-3 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>To Do Allocations</span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                      {Math.round((stats.todoTasks / stats.tasksCount) * 100)}% ({stats.todoTasks})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Progress Tasks</span>
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                      {Math.round((stats.inProgressTasks / stats.tasksCount) * 100)}% ({stats.inProgressTasks})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed Items</span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                      {Math.round((stats.doneTasks / stats.tasksCount) * 100)}% ({stats.doneTasks})
                    </span>
                  </div>
                </div>

              </div>
            )}
            
            <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-2">
              <Link
                to="/my-tasks"
                className="text-center bg-slate-100 hover:bg-indigo-700 hover:text-white text-slate-700 font-bold text-xs py-3 rounded-xl transition border border-slate-200/80 shadow-sm"
              >
                📋 View Board Assignments
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
