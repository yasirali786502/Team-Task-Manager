import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  const workflowSteps = [
    {
      num: '01',
      title: 'Workspace Setup',
      desc: 'Create secure collaborative spaces for development, operations, or marketing campaigns in seconds.'
    },
    {
      num: '02',
      title: 'Team Coordination & Search',
      desc: 'Seamlessly query and add registered team members to your active projects via auto-completing search indexes.'
    },
    {
      num: '03',
      title: 'Priority Allocation',
      desc: 'Delegate tasks with explicit priorities, detailed logs, and hard due dates directly to designated individuals.'
    },
    {
      num: '04',
      title: 'Kanban Progress Tracking',
      desc: 'Supervise task progressions dynamically as members update status selectors in real-time.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Landing Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-2xl text-indigo-500">📅</span>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
              TaskFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-indigo-400 transition-colors">Workflow</a>
            <a href="#stats" className="hover:text-indigo-400 transition-colors">Statistics</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-indigo-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Heading and description */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 bg-slate-800 text-indigo-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 border border-slate-700">
              🚀 Now with Kanban Board Support
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Collaborative <br/>
              <span className="text-indigo-500">Task Management</span> <br/>
              Redefined.
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg mt-6 max-w-xl leading-relaxed">
              Supercharge your organization with role-based access controls, real-time board updates, and performance analytics. A simplified workspace to synchronize teams and deliver projects on schedule.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8 w-full sm:w-auto">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all text-center"
                >
                  Enter Workspace
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all text-center"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-slate-700 transition-all text-center"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>

            {/* Metrics */}
            <div className="flex gap-10 mt-12 border-t border-slate-800 pt-8 w-full">
              <div>
                <span className="text-3xl font-extrabold text-white block">30+</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1 block">Workspaces Active</span>
              </div>
              <div className="h-10 w-[1px] bg-slate-800 self-center"></div>
              <div>
                <span className="text-3xl font-extrabold text-white block">850+</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1 block">Successful Deliveries</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Asymmetrical Card Grid */}
          <div className="relative grid grid-cols-12 gap-4">
            
            {/* mock graphics */}
            <div className="col-span-8 bg-slate-800 rounded-3xl p-6 border border-slate-700/80 relative overflow-hidden h-60 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-start">
                <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full">
                  Status Tracking
                </span>
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1.5 leading-snug">Kanban Flow Systems</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Update tasks continuously through visual drag-or-select status interfaces.
                </p>
              </div>
            </div>

            <div className="col-span-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl p-5 flex flex-col justify-between h-60 shadow-md">
              <div className="text-right">
                <span className="text-3xl font-bold">200K+</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block leading-tight">Active Tasks</span>
                <span className="text-[10px] opacity-75 mt-0.5 block">Managed globally</span>
                
                {/* Profile circles group */}
                <div className="flex items-center mt-3 -space-x-1.5">
                  <div className="h-6 w-6 rounded-full bg-slate-800 text-[9px] font-bold flex items-center justify-center border border-indigo-500">A</div>
                  <div className="h-6 w-6 rounded-full bg-slate-800 text-[9px] font-bold flex items-center justify-center border border-indigo-500">B</div>
                  <div className="h-6 w-6 rounded-full bg-slate-800 text-[9px] font-bold flex items-center justify-center border border-indigo-500">C</div>
                </div>
              </div>
            </div>

            <div className="col-span-4 bg-slate-800 rounded-3xl p-5 border border-slate-700/80 shadow-md h-48 flex flex-col justify-between">
              <span className="text-xl">👥</span>
              <div>
                <h5 className="text-xs font-bold text-white tracking-widest uppercase">Team Invites</h5>
                <span className="text-[10px] text-slate-400 mt-1 block">Role-based controls</span>
              </div>
            </div>

            <div className="col-span-8 bg-slate-800 rounded-3xl p-6 border border-slate-700/80 relative overflow-hidden h-48 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency index</span>
                <span className="text-indigo-400 font-extrabold text-sm">80%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1">
                <div className="bg-indigo-500 h-full" style={{ width: '80%' }}></div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Dashboard reports reflect your progress rate dynamically.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section id="features" className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto max-w-7xl">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Powering Teams with <span className="text-indigo-500">Responsible Innovation</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mt-3 leading-relaxed">
              Every detail is engineered to support clean collaborative progress management, security, and metrics logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/60 rounded-3xl p-8 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-300 shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-lg shadow-inner">
                📋
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Visual Kanban Board</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter and track tasks seamlessly across "To Do", "In Progress", and "Done" stages on our highly optimized board.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/60 rounded-3xl p-8 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-300 shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-lg shadow-inner">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Performance Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Access project health stats instantly: overdue metrics, distributions, and member performance indexes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/60 rounded-3xl p-8 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-300 shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-lg shadow-inner">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Role-Based Access</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Admins coordinate projects and manage task properties, while members focuses solely on updates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Accordion / Integrated Services Workflow Section */}
      <section id="workflow" className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">WORKFLOW</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Our Collaborative <br/>
              <span className="text-indigo-500">Task Solutions</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-md">
              Review how our full-stack application channels project ideas into trackable, highly integrated workflows.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/40 border border-slate-700/80 p-6 rounded-2xl flex gap-6 items-start hover:bg-slate-800/60 transition"
              >
                <span className="text-lg font-black text-indigo-400 leading-none select-none">
                  {step.num}
                </span>
                <div className="flex flex-col">
                  <h4 className="text-base font-bold text-white leading-snug">{step.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Numerical Stats section */}
      <section id="stats" className="py-20 px-4 bg-slate-800/40 border-b border-slate-800">
        <div className="container mx-auto max-w-7xl flex flex-wrap justify-around gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">30+</span>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1.5">Projects Synced</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">850+</span>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1.5">Tasks Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">99.9%</span>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1.5">Uptime SLA</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">25,000+</span>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1.5">Updates Processed</span>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 py-12 px-4 text-center border-t border-slate-800 text-slate-500 text-xs">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span className="text-sm font-bold text-white tracking-tight">TaskFlow</span>
          </div>
          <p>© {new Date().getFullYear()} TaskFlow Inc. Built for Team Coordination and Assignment.</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
