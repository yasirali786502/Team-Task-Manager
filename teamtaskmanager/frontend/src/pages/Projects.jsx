import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import Navbar from '../components/Navbar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/projects', formData);
      setFormData({ name: '', description: '' });
      setShowModal(false);
      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!projectToDelete) return;
    
    const isMatch = deleteConfirmationInput.trim().toLowerCase() === `delete ${projectToDelete.name.trim().toLowerCase()}`;
    if (!isMatch) {
      alert(`Please type exactly "Delete ${projectToDelete.name}" to delete.`);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      setProjectToDelete(null);
      setDeleteConfirmationInput('');
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete workspace.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="text-sm font-semibold text-slate-500">Loading workspaces...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Workspaces</h1>
            <p className="text-slate-500 text-sm mt-1">Create or manage projects with your team</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl border border-indigo-500/20 shadow-md hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <span>➕</span> Create Workspace
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto p-8">
            <span className="text-5xl block mb-4">📁</span>
            <h3 className="text-xl font-bold text-slate-900">No workspaces yet</h3>
            <p className="text-slate-500 text-sm mt-1.5 mb-6 max-w-md mx-auto">
              Get started by creating your very first workspace. You can then invite collaborators and delegate tasks.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow transition"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isAdmin={project.adminId._id === user._id || project.adminId === user._id}
                onDeleteClick={(proj) => {
                  setDeleteConfirmationInput('');
                  setProjectToDelete(proj);
                }}
              />
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all duration-300">
              {/* Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">
                  📁 Create Workspace
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Workspace Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                    placeholder="e.g. Q3 Launch, Marketing, Dev Operations"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all resize-none"
                    placeholder="Briefly state the goal or team function..."
                    rows="3"
                  />
                </div>
                <div className="flex gap-3 mt-4 border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-indigo-400 font-bold py-2.5 rounded-xl border border-indigo-500/30 shadow-md transition-all text-sm"
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Workspace Confirmation Modal */}
        {projectToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all duration-300">
              {/* Header */}
              <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                  ⚠️ Secure Workspace Deletion
                </h3>
                <button
                  onClick={() => setProjectToDelete(null)}
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
                  Deleting this workspace is **permanent and irreversible**. It will immediately delete the workspace <strong className="font-bold underline">{projectToDelete.name}</strong>, all associated tasks, and revoke member access.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 leading-relaxed">
                    To confirm, type exactly <strong className="font-extrabold text-slate-700">Delete {projectToDelete.name}</strong> in the field below (copy/paste is disabled):
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
                    placeholder={`Delete ${projectToDelete.name}`}
                    disabled={isDeleting}
                  />
                </div>

                <div className="flex gap-3 mt-4 border-t border-slate-100 pt-5">
                  <button
                    onClick={handleDeleteWorkspace}
                    disabled={
                      isDeleting ||
                      deleteConfirmationInput.trim().toLowerCase() !== `delete ${projectToDelete.name.trim().toLowerCase()}`
                    }
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(null)}
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
    </div>
  );
};

export default Projects;
