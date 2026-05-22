import React from 'react';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, isAdmin }) => {
  const statusConfig = {
    'To Do': { bg: 'bg-slate-100 border-slate-200 text-slate-700' },
    'In Progress': { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
    'Done': { bg: 'bg-emerald-55 border-emerald-100 text-emerald-800' },
  };

  const priorityConfig = {
    Low: 'bg-slate-100 text-slate-600 border-slate-200/50',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    High: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
      isOverdue ? 'border-rose-500' : 'border-indigo-600'
    } border border-slate-200/80 p-5 overflow-hidden flex flex-col gap-3.5 relative group`}>
      
      {/* Top row */}
      <div className="flex justify-between items-start gap-4">
        <h4 className="font-bold text-[#0F172A] text-base leading-snug group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusConfig[task.status]?.bg || ''}`}>
          {task.status}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${priorityConfig[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          📅 Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-1"></div>

      {/* Bottom Assignment & Controls row */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {task.assignedTo?.profileImage ? (
            <img 
              src={task.assignedTo.profileImage} 
              alt={task.assignedTo.name} 
              className="h-6 w-6 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
              {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <span className="text-xs text-slate-900 font-semibold truncate max-w-[120px]">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Status updater drop-down */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white border border-slate-250 rounded-lg px-2.5 py-1 outline-none cursor-pointer transition-all duration-150"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Admin specific edit / delete actions */}
          {isAdmin && (
            <div className="flex items-center ml-1 border-l border-slate-200 pl-1 gap-0.5">
              <button
                onClick={() => onEdit(task)}
                title="Edit Task"
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task._id);
                  }
                }}
                title="Delete Task"
                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Banner */}
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-bl shadow-sm select-none">
          Overdue
        </div>
      )}
    </div>
  );
};

export default TaskCard;
