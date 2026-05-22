import React, { useState } from 'react';
import api from '../utils/api';

const AddMemberModal = ({ project, onAddMember, onClose }) => {
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!emailSearch.trim()) return;

    setSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await api.get(`/projects/search-users?email=${encodeURIComponent(emailSearch)}`);
      // Filter out users who are already members of the project
      const filtered = response.data.data.filter(
        user => !project.members.some(member => member._id === user._id)
      );
      setSearchResults(filtered);
      if (filtered.length === 0) {
        setError('No eligible users found with that email.');
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            ➕ Add Team Member
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Search user by email..."
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 rounded-xl shadow-sm text-sm transition disabled:bg-indigo-400"
            >
              {searching ? '...' : 'Search'}
            </button>
          </form>

          {/* Results List */}
          <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Results
            </h4>

            {error && (
              <p className="text-slate-500 text-xs py-3 text-center bg-slate-50 border border-slate-100 rounded-xl">
                {error}
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-150 p-3 rounded-xl transition"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-400 truncate">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => onAddMember(user._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && !error && !searching && (
              <p className="text-slate-400 text-xs py-6 text-center italic">
                Enter an email address above to look up registered users.
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
