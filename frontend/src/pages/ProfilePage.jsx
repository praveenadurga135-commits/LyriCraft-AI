import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Disc, 
  Heart, 
  Camera, 
  Trash2, 
  Save, 
  LogOut, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const GENRES = [
  'Indie Folk', 'Pop', 'Rock', 'R&B', 'Hip-Hop', 'Country', 'Lo-fi', 'EDM', 'Alternative', 'Acoustic', 'Soul'
];

const MOODS = [
  'Hopeful', 'Melancholic', 'Romantic', 'Happy', 'Dark', 'Energetic', 'Nostalgic', 'Peaceful', 'Dreamy'
];

export default function ProfilePage({ 
  profile, 
  onSaveProfile, 
  onLogout,
  history = [] 
}) {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(profile?.name || 'Independent Artist');
  const [email, setEmail] = useState(profile?.email || 'artist@lyricraft.app');
  const [favoriteGenre, setFavoriteGenre] = useState(profile?.favoriteGenre || 'Indie Folk');
  const [favoriteMood, setFavoriteMood] = useState(profile?.favoriteMood || 'Hopeful');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');

  // Handle Profile Picture Upload via FileReader -> Data URL
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfilePicture(dataUrl);
      toast.info('Picture uploaded! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    setProfilePicture('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Picture removed. Click Save to apply.');
  };

  // Calculate stats strictly per Requirement 13
  const totalVersions = history.length;
  const totalSongs = new Set(history.map((item) => item.songId || item.title)).size;
  
  const registrationDate = (() => {
    const raw = profile?.registeredAt || profile?.registrationDate;
    try {
      const d = raw ? new Date(raw) : new Date();
      return d.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString();
    }
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: name.trim(),
      username: name.trim(),
      email: email.trim(),
      favoriteGenre,
      favoriteMood,
      profilePicture,
      registeredAt: profile?.registeredAt || profile?.registrationDate || new Date().toISOString()
    };

    onSaveProfile(updated);
    toast.success('Profile saved successfully in Local Storage!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      
      {/* Page Heading & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Artist Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your songwriting preferences, credentials, and profile image.
          </p>
        </div>

        {/* The ONLY Logout Button (Requirement 5 & 13) */}
        <div>
          <button
            type="button"
            onClick={onLogout}
            className="px-5 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-500/10 hover:scale-105 active:scale-95"
            title="Log Out of Account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-xl shadow-indigo-500/20 overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0c0f17] rounded-[22px] flex items-center justify-center">
                    <User className="w-14 h-14 text-indigo-300" />
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 cursor-pointer"
                title="Change Picture"
              >
                <Camera className="w-5 h-5 text-indigo-300" />
                <span>Upload</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-base font-bold text-white">Profile Picture</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Upload your artist picture (PNG, JPG, max 2MB). Stored locally in your browser.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Choose Image</span>
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields: Name, Email, Favorite Genre, Favorite Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Artist or songwriter name"
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artist@example.com"
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Favourite Genre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Disc className="w-4 h-4 text-pink-400" />
                <span>Favourite Genre</span>
              </label>
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-studio-900 text-white">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Favourite Mood */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Favourite Mood</span>
              </label>
              <select
                value={favoriteMood}
                onChange={(e) => setFavoriteMood(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m} className="bg-studio-900 text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Action Bar: Save Profile */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>

        </form>
      </div>

      {/* Songwriting & Account Statistics (Requirement 13) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Account & Songwriting Statistics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Username */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Username</span>
            <div className="text-xl sm:text-2xl font-black text-white truncate">{name}</div>
            <p className="text-[11px] text-slate-500">Artist account name</p>
          </div>

          {/* Registration Date */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Registration Date</span>
            <div className="text-base sm:text-lg font-bold text-indigo-300 truncate mt-1">{registrationDate}</div>
            <p className="text-[11px] text-slate-500">Member since</p>
          </div>

          {/* Total Songs */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Total Songs</span>
            <div className="text-3xl font-black text-pink-400">{totalSongs}</div>
            <p className="text-[11px] text-slate-500">Unique songs generated</p>
          </div>

          {/* Total Versions */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Total Versions</span>
            <div className="text-3xl font-black text-purple-400">{totalVersions}</div>
            <p className="text-[11px] text-slate-500">All saved song versions</p>
          </div>
        </div>
      </div>

    </div>
  );
}
