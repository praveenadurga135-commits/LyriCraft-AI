import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Music, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both username/email and password.');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('lyricraft_profile') || localStorage.getItem('lyricraft_user') || '{}');
    const derivedUsername = savedUser.username || savedUser.name || (email.includes('@') ? email.split('@')[0] : email.trim());
    
    const user = {
      username: derivedUsername,
      name: derivedUsername,
      email: email.trim(),
      status: 'loggedIn',
      loggedIn: true,
      registeredAt: savedUser.registeredAt || savedUser.registrationDate || new Date().toISOString(),
      rememberMe
    };

    // Store username and login status strictly per Requirement 7
    localStorage.setItem('lyricraft_auth', JSON.stringify({ 
      username: derivedUsername, 
      loggedIn: true,
      status: 'loggedIn' 
    }));
    localStorage.setItem('lyricraft_user', JSON.stringify(user));

    if (onLoginSuccess) onLoginSuccess(user);
    toast.success(`Welcome back, ${user.username}!`);
    navigate('/create');
  };

  const handleGoogleSignIn = () => {
    const googleUser = {
      name: 'Google Artist',
      email: 'artist@gmail.com',
      provider: 'google'
    };

    localStorage.setItem('lyricraft_auth', JSON.stringify({ loggedIn: true }));
    localStorage.setItem('lyricraft_user', JSON.stringify(googleUser));

    if (onLoginSuccess) onLoginSuccess(googleUser);
    toast.success('Signed in with Google!');
    navigate('/create');
  };

  const handleForgotPassword = () => {
    toast.info('Local Mode: You can sign in with any credentials.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-[#0c0f17] rounded-[14px] flex items-center justify-center">
              <Music className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome to LyriCraft
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your songwriting studio
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Username or Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="username or you@example.com"
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
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-studio-900 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Forgot Password
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c0f17] px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            or
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Google Sign In Button (UI only) */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex items-center justify-center gap-2.5 hover:border-white/20 active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Google Sign In</span>
          </button>
        </div>

        {/* Footer link to Register */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
