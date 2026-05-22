import { Link } from 'react-router-dom';

const ProjectCard = ({ project, isAdmin, onDeleteClick }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 hover:border-indigo-500/50 p-6 overflow-hidden relative"
    >
      {/* Accent gradient line using Indigo */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600 opacity-80 group-hover:opacity-100 group-hover:h-[6px] transition-all duration-300"></div>

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors duration-200 leading-snug">
          {project.name}
        </h3>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-sm">
                Admin
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteClick(project);
                }}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 p-1.5 rounded-xl transition duration-200 flex items-center justify-center"
                title="Delete Workspace"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-emerald-100 shadow-sm">
              Member
            </span>
          )}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {project.description || 'No description provided.'}
      </p>
      
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4 mt-2">
        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{project.members.length} {project.members.length === 1 ? 'member' : 'members'}</span>
        </div>
        
        <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors">
          View details 
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
