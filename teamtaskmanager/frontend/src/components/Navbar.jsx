import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname.startsWith(path) 
      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white';
  };

  return (
    <nav className="bg-slate-900 text-slate-100 shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/projects" className="flex items-center gap-2.5 group transition">
            <span className="text-2xl transition-transform group-hover:scale-110 duration-200">📅</span>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
              TaskFlow
            </span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-6">
              {/* Navigation links - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Link to="/projects" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/projects')}`}>
                  Workspaces
                </Link>
                <Link to="/my-tasks" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/my-tasks')}`}>
                  My Tasks
                </Link>
                <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
              </div>
              
              {/* Avatar & Profile Dropdown Container */}
              <div className="relative border-l border-slate-800 pl-6 flex items-center" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 rounded-full bg-slate-800 text-indigo-400 hover:text-white flex items-center justify-center font-bold text-sm select-none border border-slate-700/80 shadow-md transition-all duration-200 hover:border-indigo-500/50 active:scale-95 overflow-hidden"
                >
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-3 transform origin-top-right transition-all duration-200 z-50">
                    {/* Header in Dropdown with Avatar, Name & Email */}
                    <div className="px-4 py-3.5 border-b border-slate-800 flex items-center gap-3">
                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="h-12 w-12 rounded-full bg-slate-800 text-indigo-400 hover:text-white flex-shrink-0 flex items-center justify-center font-bold text-base border border-slate-700 hover:border-indigo-500 transition-all duration-200 overflow-hidden cursor-pointer active:scale-95"
                        title="View Profile"
                      >
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </Link>
                      <div className="flex flex-col min-w-0">
                        <Link 
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="text-sm font-bold text-white hover:text-indigo-400 transition truncate cursor-pointer leading-snug"
                        >
                          {user.name}
                        </Link>
                        <span className="text-xs text-slate-400 truncate leading-none mt-0.5">{user.email}</span>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="px-1.5 py-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150"
                      >
                        <span className="text-base">⚙️</span>
                        <span>Profile Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition duration-150 text-left"
                      >
                        <span className="text-base">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile navigation row if user logged in */}
      {user && (
        <div className="flex sm:hidden justify-around border-t border-slate-800 bg-slate-900">
          <Link to="/projects" className="flex-1 py-3 text-center text-xs font-bold hover:bg-slate-800 transition border-r border-slate-800 text-slate-300 hover:text-white">
            📁 Workspaces
          </Link>
          <Link to="/my-tasks" className="flex-1 py-3 text-center text-xs font-bold hover:bg-slate-800 transition border-r border-slate-800 text-slate-300 hover:text-white">
            📋 My Tasks
          </Link>
          <Link to="/dashboard" className="flex-1 py-3 text-center text-xs font-bold hover:bg-slate-800 transition text-slate-300 hover:text-white">
            📊 Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
