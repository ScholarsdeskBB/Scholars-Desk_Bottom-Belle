import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldPlus, ArrowRight, Lock, Loader2, Cpu, Database, Eye, EyeOff, User, Mail, ShieldCheck } from 'lucide-react';
import { useTheme } from '../App';
import { mockDb } from '../lib/mockDb';

export default function AdminCreate() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    passcode: ''
  });
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [status, setStatus] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.passcode !== 'BRVMC') {
      setError('REJECTED: Invalid Registration Passcode');
      return;
    }

    setIsCreating(true);
    
    // Aesthetic simulation of registry setup
    const steps = [
      'Validating BRVMC clearance...',
      'Opening registry aperture...',
      'Binding identity to secure node...',
      'Establishing hierarchy privileges...',
      'Account Created. Synchronizing...'
    ];

    for (const step of steps) {
      setStatus(step);
      await new Promise(r => setTimeout(r, 600));
    }

    // Save the new admin user
    const newUser = {
      uid: 'admin-' + Math.random().toString(36).substr(2, 9),
      email: formData.email,
      displayName: formData.displayName,
      role: 'admin' as const,
      currentClassOrProgram: 'Registry Administration',
      createdAt: new Date().toISOString()
    };

    mockDb.saveUser(newUser);
    mockDb.setAuthUser({ uid: newUser.uid, email: newUser.email });
    window.location.href = '/admin';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 select-none relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 blur-[120px] rounded-full animate-pulse ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-primary/10'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className={`p-1 border-2 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-wholesome-primary shadow-2xl'}`}>
          <div className={`p-10 relative overflow-hidden border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 shadow-2xl' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className={`p-4 rounded-full mb-6 border relative ${theme === 'dark' ? 'bg-accent/5 border-gold-border/20' : 'bg-wholesome-primary/5 border-wholesome-primary/20'}`}>
                <ShieldPlus className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
              </div>
              <h1 className={`text-2xl font-serif font-black uppercase tracking-[6px] mb-2 leading-none ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>New Admin Registry</h1>
              <div className={`flex items-center gap-2 text-[8px] uppercase tracking-[3px] opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                Clearance: Multi-Factor Required
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isCreating ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleCreateAccount} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1 border ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                        <User size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="ADMIN_FULL_NAME"
                        className={`w-full border-b px-12 py-4 outline-none text-xs tracking-widest uppercase transition-all font-mono ${
                          theme === 'dark' ? 'bg-bg-card border-gold-border/20 focus:border-accent text-text-main placeholder:text-text-muted/20' : 'bg-white border-gray-100 focus:border-wholesome-primary text-black placeholder:text-gray-300'
                        }`}
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                    </div>

                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1 border ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="ADMIN_REGISTRY_EMAIL"
                        className={`w-full border-b px-12 py-4 outline-none text-xs tracking-widest transition-all font-mono ${
                          theme === 'dark' ? 'bg-bg-card border-gold-border/20 focus:border-accent text-text-main placeholder:text-text-muted/20' : 'bg-white border-gray-100 focus:border-wholesome-primary text-black placeholder:text-gray-300'
                        }`}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="pt-4">
                      <label className={`block text-[8px] uppercase tracking-[4px] font-black mb-2 px-1 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Reg-Clearence Passcode</label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1 border ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                          <Lock size={14} />
                        </div>
                        <input
                          type={showPasscode ? 'text' : 'password'}
                          required
                          placeholder="••••••"
                          className={`w-full border-b px-12 py-4 outline-none text-xl tracking-[12px] uppercase transition-all font-mono ${
                            error ? 'border-red-500' : (theme === 'dark' ? 'bg-bg-card border-gold-border/20 focus:border-accent text-text-main group' : 'bg-white border-gray-100 focus:border-wholesome-primary text-black')
                          }`}
                          value={formData.passcode}
                          onChange={(e) => setFormData({...formData, passcode: e.target.value.toUpperCase()})}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscode(!showPasscode)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
                        >
                          {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {error && (
                        <p className="mt-2 text-red-500 text-[8px] font-black uppercase tracking-widest text-center">{error}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-black py-5 uppercase tracking-[5px] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-[0.98] ${theme === 'dark' ? 'bg-accent text-black hover:bg-white' : 'bg-wholesome-primary text-white hover:opacity-90'}`}
                  >
                    Commit Admin Entry <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
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
