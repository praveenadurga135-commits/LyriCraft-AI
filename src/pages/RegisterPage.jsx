import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Music, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function RegisterPage({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    const newUser = {
      username: name.trim(),
      name: name.trim(),
      email: email.trim(),
      status: 'loggedIn',
      loggedIn: true,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('lyricraft_user', JSON.stringify(newUser));
    localStorage.setItem('lyricraft_profile', JSON.stringify({
      username: name.trim(),
      name: name.trim(),
      email: email.trim(),
      favoriteGenre: 'Indie Folk',
      favoriteMood: 'Hopeful',
      profilePicture: '',
      registeredAt: newUser.registeredAt
    }));
    // Store username and login status strictly per Requirement 7
    localStorage.setItem('lyricraft_auth', JSON.stringify({ 
      username: name.trim(), 
      loggedIn: true, 
      status: 'loggedIn' 
    }));

    if (onRegisterSuccess) onRegisterSuccess(newUser);
    toast.success(`Account created! Welcome, ${newUser.username}.`);
    navigate('/create');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30">
            <div className="w-full h-full bg-[#0c0f17] rounded-[14px] flex items-center justify-center">
              <Music className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400">
            Join LyriCraft to generate and organize your song ideas
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Maya Lin"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Create Account Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="text-center text-xs text-slate-400 pt-3 border-t border-white/10">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}
