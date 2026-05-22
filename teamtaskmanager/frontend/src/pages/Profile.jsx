import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle file selection and client-side resizing/compression
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize image (max 256x256 for compact base64)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly compressed JPEG base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setProfileImage(compressedBase64);
        setMessage({ type: 'success', text: 'Image loaded successfully! Don\'t forget to save changes.' });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(name, profileImage);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A]">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl flex flex-col justify-center">
        {/* Card Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-1.5">Manage your personal workspace appearance and credentials</p>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-semibold border transition-all duration-300 flex items-center gap-2.5 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}
          >
            <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 md:p-10">
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            
            {/* Avatar Upload Grid Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-inner group-hover:brightness-90 transition duration-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-slate-100 text-indigo-600 flex items-center justify-center font-extrabold text-3xl shadow-inner group-hover:brightness-95 transition duration-200 select-none">
                    {name.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition duration-200">
                  📸 Upload
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-base text-[#0F172A]">Profile Picture</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-3.5 max-w-sm">
                  Recommended size: Square 256x256px. The image is compressed in real-time to save database space.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    Choose Photo
                  </button>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage('')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-750 text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all duration-200"
                  placeholder="Your display name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-slate-100/70 border border-slate-200 rounded-2xl text-slate-400 text-sm font-medium select-none cursor-not-allowed"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔒
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 pl-1.5">
                  Email changing is managed by workspace security. Contact support for updates.
                </p>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex gap-3 mt-6 border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-indigo-400 font-bold py-3 rounded-2xl border border-indigo-500/30 shadow-md transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition text-sm text-center"
              >
                Back to Dashboard
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
