import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Loader2, Cpu, Database, Wifi, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../App';
import { mockDb } from '../lib/mockDb';

export default function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const user = mockDb.getAuthUser();
    if (user) {
      const profile = mockDb.getUser(user.uid);
      if (profile?.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [navigate]);

  const handleAccess = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    
    if (passcode === 'BOLD STEP') {
      setIsVerifying(true);
      
      const steps = [
        'Initiating secure handshake...',
        'Decrypting access key...',
        'Syncing with Registry Node...',
        'Verifying Administrator identity...',
        'Access Granted. Redirecting...'
      ];

      for (const step of steps) {
        setStatus(step);
        await new Promise(r => setTimeout(r, 600));
      }

      navigate('/admin-selection');
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 select-none relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full animate-pulse ${theme === 'dark' ? 'bg-accent/5' : 'bg-wholesome-primary/5'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 blur-[100px] rounded-full animate-pulse delay-700 ${theme === 'dark' ? 'bg-accent/5' : 'bg-wholesome-primary/5'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className={`p-1 border-2 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-wholesome-primary shadow-2xl'}`}>
          <div className={`p-12 relative overflow-hidden border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 shadow-2xl' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
            
            {/* Corner Details */}
            <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${theme === 'dark' ? 'border-accent/30' : 'border-wholesome-primary/30'}`} />
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${theme === 'dark' ? 'border-accent/30' : 'border-wholesome-primary/30'}`} />

            <div className="flex flex-col items-center text-center mb-12">
              <motion.div 
                animate={isVerifying ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`p-5 rounded-full mb-8 border relative ${theme === 'dark' ? 'bg-accent/5 border-gold-border/20' : 'bg-wholesome-primary/5 border-wholesome-primary/20'}`}
              >
                <ShieldCheck className={`w-12 h-12 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                {isVerifying && (
                  <div className={`absolute inset-0 border-2 rounded-full border-t-transparent animate-spin ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`} />
                )}
              </motion.div>
              <h1 className={`text-3xl font-serif font-black uppercase tracking-[6px] mb-3 leading-none ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Registry Gateway</h1>
              <div className={`flex items-center gap-3 text-[10px] uppercase tracking-[4px] opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                <Wifi className="w-3 h-3" /> Encrypted Link Station // Zulu-01
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isVerifying ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleAccess} 
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <label className={`block text-[10px] uppercase tracking-[5px] font-black text-center ${theme === 'dark' ? 'text-accent/80' : 'text-wholesome-primary/80'}`}>Encrypted Passkey Required</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        placeholder="•••• ••••"
                        className={`w-full border-b-2 px-6 py-5 outline-none text-center text-3xl tracking-[16px] transition-all font-mono ${
                          error 
                            ? 'border-red-500' 
                            : (theme === 'dark' ? 'border-gold-border/40 focus:border-accent' : 'border-gray-200 focus:border-wholesome-primary')
                        } ${theme === 'dark' ? 'bg-bg-card text-text-main placeholder:text-text-muted/10' : 'bg-white text-black placeholder:text-gray-300'}`}
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors p-2 ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {error && (
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute -bottom-10 left-0 w-full text-red-500 text-[9px] uppercase tracking-[3px] font-black text-center"
                        >
                          Authentication Denied
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-black py-5 uppercase tracking-[5px] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-[0.98] ${theme === 'dark' ? 'bg-accent text-black hover:bg-white' : 'bg-wholesome-primary text-white hover:opacity-90'}`}
                  >
                    Establish Secure Flow <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 space-y-8"
                >
                  <div className={`text-center font-mono text-[11px] uppercase tracking-[4px] animate-pulse ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                    {status}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {[Cpu, Database, ShieldCheck, Lock].map((Icon, i) => (
                      <div key={i} className={`aspect-square border flex items-center justify-center transition-colors ${theme === 'dark' ? 'border-gold-border/20 bg-accent/5' : 'border-gray-100 bg-wholesome-surface'}`}>
                        <Icon className={`w-5 h-5 opacity-40 animate-pulse ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`mt-16 pt-8 border-t ${theme === 'dark' ? 'border-gold-border/10' : 'border-gray-50'}`}>
              <div className={`flex justify-between items-center text-[8px] uppercase tracking-[3px] font-mono leading-relaxed opacity-50 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
                <span>Core: scholars_v4</span>
                <span>Signal: High</span>
                <span>Node: 0x82f..2</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
