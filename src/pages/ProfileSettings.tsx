import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth, useTheme } from '../App';
import { User, Check, Camera, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../lib/mockDb';

const AVATARS = [
  "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
];

export default function ProfileSettings() {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ok = mockDb.updateUserProfile(user.uid, { avatarUrl: selectedAvatar });
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Reload page to reflect changes in AuthProvider (simplified for mock)
      window.location.reload(); 
    }
    setSaving(false);
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <button 
        onClick={() => navigate('/dashboard')}
        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[4px] mb-8 transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Node
      </button>

      <header className={`mb-12 border-l-4 pl-8 ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}>
        <div className={`flex items-center gap-3 font-black uppercase tracking-[4px] text-[9px] mb-2 font-mono ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
          <Camera className="w-3 h-3" /> Identity Configuration
        </div>
        <h1 className={`text-3xl font-serif font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Registry Profile</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className={`p-8 border shadow-2xl relative overflow-hidden text-center ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
            <div className={`w-32 h-32 mx-auto rounded-full border-4 relative group mb-6 overflow-hidden ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}>
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-bg-deep' : 'bg-gray-50'}`}>
                  <User className={`w-12 h-12 opacity-20 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                </div>
              )}
            </div>
            <div className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{profile?.displayName}</div>
            <div className={`text-[10px] font-mono opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{profile?.email}</div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-8">
            <section>
              <h2 className={`text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                <ShieldCheck className="w-4 h-4" /> Select Visual Identity
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {AVATARS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative aspect-square border-2 transition-all p-1 group overflow-hidden ${
                      selectedAvatar === url 
                        ? (theme === 'dark' ? 'border-accent scale-105' : 'border-wholesome-primary scale-105') 
                        : (theme === 'dark' ? 'border-gold-border/20 grayscale' : 'border-gray-100 grayscale hover:grayscale-0 hover:border-wholesome-primary/40')
                    }`}
                  >
                    <img src={url} alt={`Student ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {selectedAvatar === url && (
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]`}>
                         <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-accent text-black' : 'bg-wholesome-primary text-white'}`}>
                            <Check className="w-4 h-4 font-black" />
                         </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <div className="pt-8 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 font-black py-4 uppercase tracking-[4px] text-xs transition-all flex items-center justify-center gap-3 ${
                  success 
                    ? 'bg-green-600 text-white' 
                    : (theme === 'dark' ? 'bg-accent text-black hover:bg-white' : 'bg-wholesome-primary text-white hover:opacity-90')
                }`}
              >
                {saving ? 'Syncing...' : success ? 'Identity Updated' : 'Confirm Visual Update'}
              </button>
              {success && (
                 <motion.div
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-[10px] font-black uppercase tracking-widest text-green-500"
                 >
                   Registry Updated
                 </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
