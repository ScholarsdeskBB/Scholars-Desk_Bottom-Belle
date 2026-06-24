import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, MessageSquare, CheckCircle } from 'lucide-react';
import { useTheme } from '../App';
import BrandingLogo from '../components/BrandingLogo';

export default function CourseAssistance() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`max-w-4xl mx-auto px-4 py-24 text-center transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-12 relative overflow-hidden border-2 ${theme === 'dark' ? 'bg-bg-card border-accent' : 'bg-white border-wholesome-primary'}`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl ${theme === 'dark' ? 'bg-accent/5' : 'bg-wholesome-primary/5'}`} />
        
        <div className={`inline-flex items-center justify-center p-6 rounded-full mb-8 ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-surface'}`}>
          <GraduationCap className={`w-12 h-12 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
        </div>
        
        <h1 className={`text-4xl font-serif font-bold uppercase tracking-widest mb-6 ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>
          Payment Confirmed
        </h1>
        
        <p className={`italic text-lg max-w-2xl mx-auto mb-12 leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>
          Your tuition verification is complete. Traditionally, students now proceed to course registration in their respective portals.
        </p>
        
        <div className={`p-8 mb-12 text-left border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
          <h3 className={`font-black uppercase tracking-[3px] text-xs mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
            <MessageSquare className="w-4 h-4" /> Registrar Support
          </h3>
          <p className={`text-sm leading-relaxed mb-6 font-mono italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
            Do you require assistance with registering for your next semester courses, or would you like a guided walkthrough of the student portal registration sequence?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/support')}
              className={`flex items-center justify-between px-6 py-4 font-black uppercase tracking-widest text-xs transition-all group ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
            >
              Request Assistance <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center justify-between px-6 py-4 border font-black uppercase tracking-widest text-xs transition-all ${theme === 'dark' ? 'border-gold-border text-text-muted hover:border-accent hover:text-text-main' : 'border-gray-200 text-gray-400 hover:border-wholesome-primary hover:text-black'}`}
            >
              I'm Good, Thanks <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <BrandingLogo className="h-14" />
          <div className={`text-[9px] uppercase tracking-[4px] font-black ${theme === 'dark' ? 'text-accent/40' : 'text-wholesome-primary/40'}`}>
            Academic Secretariat
          </div>
        </div>
      </motion.div>
    </div>
  );
}
