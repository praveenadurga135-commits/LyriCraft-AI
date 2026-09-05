import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Music, 
  HelpCircle, 
  History, 
  Info, 
  User, 
  Menu, 
  X,
  Home,
  Wand2,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Header({ historyCount = 0, isAuthenticated = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items strictly adhering to Requirement 6:
  // Before Login: Home, How It Works, About (Login and Register on right / auth section)
  // After Login: Home, Create, History, How It Works, About, My Profile (Login and Register hidden)
  const mainNavItems = isAuthenticated
    ? [
        { to: '/', label: 'Home', icon: Home },
        { to: '/create', label: 'Create', icon: Wand2 },
        { to: '/history', label: 'History', icon: History, badge: historyCount },
        { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
        { to: '/about', label: 'About', icon: Info },
        { to: '/profile', label: 'My Profile', icon: User },
      ]
    : [
        { to: '/', label: 'Home', icon: Home },
        { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
        { to: '/about', label: 'About', icon: Info },
      ];

  // Auth items shown ONLY before login
  const authNavItems = !isAuthenticated ? [
    { to: '/login', label: 'Login', icon: LogIn },
    { to: '/register', label: 'Register', icon: UserPlus },
  ] : [];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#080b11]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link 
          to="/"
          className="flex items-center gap-3 group select-none shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0c0f17] rounded-[10px] flex items-center justify-center">
              <Music className="w-5 h-5 text-indigo-400 group-hover:text-pink-400 transition-colors" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              LyriCraft
            </span>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">
              AI Songwriting Studio
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-indigo-400" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Auth Links (Hidden after login) */}
        {!isAuthenticated && (
          <div className="hidden lg:flex items-center gap-2">
            {authNavItems.map((item) => {
              const Icon = item.icon;
              const isRegister = item.to === '/register';
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isRegister
                      ? 'px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5'
                      : `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-indigo-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0c0f17]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
              {authNavItems.map((item) => {
                const Icon = item.icon;
                const isRegister = item.to === '/register';
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      isRegister
                        ? 'py-2.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center gap-1.5'
                        : 'py-2.5 rounded-xl text-xs font-medium text-center text-slate-300 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-1.5'
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

        </div>
      )}
    </header>
  );
}
