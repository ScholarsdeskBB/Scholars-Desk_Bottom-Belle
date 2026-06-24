import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../App';
import { mockDb } from '../lib/mockDb';

export default function AdminSignIn() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockDb.getUsers().find(u => u.email === email && u.role === 'admin');
    
    if (!user) {
      setError('ACCESS_DENIED: Admin Record Not Found');
      return;
    }

    setIsVerifying(true);
    
    const steps = [
      'Locating registry node...',
      'Validating persistent token...',
      'Resuming admin session...',
      'Finalizing handshake...'
    ];

    for (const step of steps) {
      setStatus(step);
      await new Promise(r => setTimeout(r, 600));
    }

    mockDb.setAuthUser({ uid: user.uid, email: user.email });
    window.location.href = '/admin';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 select-none relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className={`p-1 border-2 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-wholesome-primary shadow-2xl'}`}>
          <div className={`p-10 relative overflow-hidden border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 shadow-2xl' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className={`p-4 rounded-full mb-6 border relative ${theme === 'dark' ? 'bg-accent/5 border-gold-border/20' : 'bg-wholesome-primary/5 border-wholesome-primary/20'}`}>
                <ShieldCheck className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
              </div>
              <h1 className={`text-2xl font-serif font-black uppercase tracking-[6px] mb-2 leading-none ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Identity Verification</h1>
              <div className={`text-[8px] uppercase tracking-[3px] opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                Node: Existing Administrator Entry
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isVerifying ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSignIn} 
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className={`block text-[9px] uppercase tracking-[4px] font-black mb-2 px-1 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Registered Admin Email</label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1 border ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="ENTER_ADMIN_EMAIL"
                        className={`w-full border-b px-12 py-4 outline-none text-xs tracking-widest transition-all font-mono ${
                          error ? 'border-red-500' : (theme === 'dark' ? 'bg-bg-card border-gold-border/20 focus:border-accent text-text-main' : 'bg-white border-gray-100 focus:border-wholesome-primary text-black')
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-[8px] font-black uppercase tracking-widest text-center">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-black py-5 uppercase tracking-[5px] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-[0.98] ${theme === 'dark' ? 'bg-accent text-black hover:bg-white' : 'bg-wholesome-primary text-white hover:opacity-90'}`}
                  >
                    Resume Station Access <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <div className="text-center pt-4">
                    <button 
                      type="button"
                      onClick={() => navigate('/admin-create')}
                      className={`text-[8px] uppercase tracking-[3px] font-black underline-offset-4 hover:underline ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
                    >
                      No Registry Found? Create Account
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 space-y-8"
                >
                  <div className={`text-center font-mono text-[10px] uppercase tracking-[4px] animate-pulse ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                    {status}
                  </div>
                  <div className="flex justify-center">
                    <Loader2 className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
