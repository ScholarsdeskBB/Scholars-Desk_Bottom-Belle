import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import { mockDb } from '../lib/mockDb';
import BrandingLogo from './BrandingLogo';
import { LogOut, User, Bell, CreditCard, History, LayoutDashboard, ShieldCheck, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    mockDb.clearAuth();
    window.location.href = '/';
  };

  return (
    <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-bg-deep/80 border-gold-border' : 'bg-white/80 border-gray-100'} backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <BrandingLogo className="h-10" />
            </motion.div>
          </Link>

          <div className="flex items-center space-x-8">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transform transition-all active:scale-90 ${theme === 'dark' ? 'hover:bg-accent/10 text-accent' : 'hover:bg-wholesome-primary/10 text-wholesome-primary'}`}
              title={theme === 'dark' ? 'Switch to Wholesome Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center space-x-8">
              {user ? (
              <>
                {profile?.role === 'admin' ? (
                  <>
                    <Link to="/admin" className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold transition-colors ${theme === 'dark' ? 'text-accent hover:text-white' : 'text-wholesome-primary hover:text-black'}`}>
                      <LayoutDashboard className="w-4 h-4" /> Mission Control
                    </Link>
                    <Link to="/admin" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                      <History className="w-4 h-4" /> Global History
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/pay" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                      <CreditCard className="w-4 h-4" /> Pay Now
                    </Link>
                    <Link to="/history" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                      <History className="w-4 h-4" /> History
                    </Link>
                  </>
                )}
                <Link to="/inbox" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                  <Bell className="w-4 h-4" /> Inbox
                </Link>
                <Link to="/support" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-text-muted hover:text-accent transition-colors">
                  <ShieldCheck className="w-4 h-4" /> Support
                </Link>
                <Link to="/profile-settings" className="flex items-center gap-2 group">
                  <div className={`w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center transition-all ${theme === 'dark' ? 'border-accent group-hover:border-white' : 'border-wholesome-primary group-hover:border-black'}`}>
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className={`w-4 h-4 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                    )}
                  </div>
                  <span className={`text-[11px] uppercase tracking-[1.5px] font-bold transition-colors ${theme === 'dark' ? 'text-accent hover:text-white' : 'text-wholesome-primary hover:text-black'}`}>
                    {profile?.displayName?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={`text-[11px] uppercase tracking-[1.5px] font-bold transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-600 hover:text-wholesome-primary'}`}>Home</Link>
                <Link to="/login" className={`px-5 py-2 rounded-sm text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white hover:bg-wholesome-primary/90'}`}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
}
