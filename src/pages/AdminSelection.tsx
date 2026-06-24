import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, ArrowLeft, ShieldCheck, Wifi } from 'lucide-react';
import { useTheme } from '../App';

export default function AdminSelection() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 select-none relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
      <div className="absolute inset-0 z-0 text-accent opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full font-mono text-[8px] leading-none whitespace-pre overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array.from({ length: 20 }).map((_, j) => (
                <span key={j}>ADMIN_SELECTION_PROTOCOL_V46.03</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <button 
          onClick={() => navigate('/admin-login')}
          className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px] mb-8 transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Reset Encryption
        </button>

        <div className={`p-1 border-2 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-wholesome-primary shadow-2xl'}`}>
          <div className={`p-12 relative overflow-hidden border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 shadow-2xl' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
            
            <div className="flex flex-col items-center text-center mb-12">
              <div className={`p-5 rounded-full mb-8 border relative ${theme === 'dark' ? 'bg-accent/5 border-gold-border/20' : 'bg-wholesome-primary/5 border-wholesome-primary/20'}`}>
                <ShieldCheck className={`w-12 h-12 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
              </div>
              <h1 className={`text-3xl font-serif font-black uppercase tracking-[6px] mb-3 leading-none ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Verification Node</h1>
              <div className={`flex items-center gap-3 text-[10px] uppercase tracking-[4px] opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                <Wifi className="w-3 h-3" /> Select Authentication Pathway
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <button
                onClick={() => navigate('/admin-create')}
                className={`group flex items-center gap-6 p-6 border-2 transition-all text-left ${
                  theme === 'dark' 
                    ? 'border-gold-border/20 bg-accent/5 hover:border-accent' 
                    : 'border-gray-100 bg-white hover:border-wholesome-primary'
                }`}
              >
                <div className={`p-4 border shadow-inner ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 group-hover:bg-accent group-hover:text-black' : 'bg-wholesome-bg border-gray-100 group-hover:bg-wholesome-primary group-hover:text-white'}`}>
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>New Admin User</h3>
                  <p className={`text-[10px] mt-1 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Initialize a fresh administrative record in the global registry.</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin-signin')}
                className={`group flex items-center gap-6 p-6 border-2 transition-all text-left ${
                  theme === 'dark' 
                    ? 'border-gold-border/20 bg-accent/5 hover:border-accent' 
                    : 'border-gray-100 bg-white hover:border-wholesome-primary'
                }`}
              >
                <div className={`p-4 border shadow-inner ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 group-hover:bg-accent group-hover:text-black' : 'bg-wholesome-bg border-gray-100 group-hover:bg-wholesome-primary group-hover:text-white'}`}>
                  <LogIn className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Existing Account</h3>
                  <p className={`text-[10px] mt-1 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Proceed with a registered administrator profile already in the hub.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
