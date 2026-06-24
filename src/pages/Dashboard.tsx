import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useTheme } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, History, Bell, ExternalLink, GraduationCap, ChevronRight, ShieldAlert, X, User } from 'lucide-react';
import { Notification as NotificationType } from '../types';
import { mockDb } from '../lib/mockDb';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ pending: 0, completed: 0, inbox: 0 });
  const [flaggedNote, setFlaggedNote] = useState<NotificationType | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      // Payments
      const allPayments = mockDb.getPayments().filter(x => x.studentId === user.uid);
      setCounts(prev => ({
        ...prev,
        pending: allPayments.filter(x => x.status === 'pending').length,
        completed: allPayments.filter(x => x.status === 'completed').length,
      }));

      // Notifications
      const allNotes = mockDb.getNotifications().filter(n => n.recipientId === user.uid && !n.isRead);
      setCounts(prev => ({ ...prev, inbox: allNotes.length }));
      
      // Look for a red flag warning
      const redFlag = allNotes.find(n => n.type === 'error');
      if (redFlag) {
        setFlaggedNote(redFlag);
      }

      // Check for confirmed payments to direct to registration assistance
      const confirmedPayments = allPayments.filter(p => p.status === 'completed');
      if (confirmedPayments.length > 0) {
        const seenConfirms = JSON.parse(localStorage.getItem(`seen_reg_assist_${user.uid}`) || '[]');
        const newConfirmed = confirmedPayments.find(p => !seenConfirms.includes(p.id));
        
        if (newConfirmed) {
          localStorage.setItem(`seen_reg_assist_${user.uid}`, JSON.stringify([...seenConfirms, newConfirmed.id]));
          navigate('/registration-assistance');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds for local data updates
    return () => clearInterval(interval);
  }, [user]);

  const dismissFlag = () => {
    if (flaggedNote) {
      mockDb.updateNotification(flaggedNote.id, { isRead: true });
      setFlaggedNote(null);
    }
  };

  const iconsColor = theme === 'dark' ? 'text-accent' : 'text-wholesome-primary';
  const stats = [
    { label: 'Pending Payments', value: counts.pending.toString(), icon: <CreditCard className={`w-5 h-5 ${iconsColor}`} />, border: theme === 'dark' ? 'border-accent/20' : 'border-gray-100' },
    { label: 'Completed', value: counts.completed.toString(), icon: <GraduationCap className={`w-5 h-5 ${iconsColor}`} />, border: theme === 'dark' ? 'border-accent/20' : 'border-gray-100' },
    { label: 'Unread Notifications', value: counts.inbox.toString(), icon: <Bell className={`w-5 h-5 ${iconsColor}`} />, border: theme === 'dark' ? 'border-accent/20' : 'border-gray-100' },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <AnimatePresence>
        {flaggedNote && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className={`p-10 max-w-xl w-full shadow-2xl relative overflow-hidden border-2 ${theme === 'dark' ? 'bg-bg-card border-red-600 shadow-[0_0_100px_rgba(220,38,38,0.3)]' : 'bg-white border-red-500 shadow-xl'}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
              <div className="flex items-center gap-4 text-red-600 mb-8">
                <ShieldAlert className="w-10 h-10" />
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{flaggedNote.title}</h2>
              </div>
              
              <div className={`border-l-4 border-red-600 p-6 mb-10 ${theme === 'dark' ? 'bg-red-600/5' : 'bg-red-50'}`}>
                <p className="text-sm font-bold uppercase tracking-widest mb-4">Official Disciplinary Content:</p>
                <div className={`text-[11px] leading-relaxed font-mono italic whitespace-pre-wrap ${theme === 'dark' ? 'text-red-100' : 'text-red-900'}`}>
                  {flaggedNote.content}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={`text-[9px] uppercase tracking-[3px] font-black text-center mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                  Please resolve this discrepancy immediately to avoid account suspension.
                </div>
                <button
                  onClick={dismissFlag}
                  className="w-full bg-red-600 text-white font-black py-4 uppercase tracking-[4px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 group"
                >
                  Confirm Receipt of Warning <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className={`mb-12 border-l-4 pl-8 relative min-h-[160px] flex flex-col justify-end pb-4 overflow-hidden rounded-r-xl ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop" 
            alt="Students on campus" 
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-bg-deep via-bg-deep/80 to-transparent' : 'from-wholesome-bg via-wholesome-bg/80 to-transparent'}`} />
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={`flex items-center gap-3 font-black uppercase tracking-[4px] text-[9px] mb-2 font-mono ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-ping ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
              STATION_ID: {user?.uid?.slice(0, 8).toUpperCase()}_ONLINE
            </div>
            <h1 className={`text-4xl font-serif font-black uppercase tracking-tight ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Active Node: {profile?.displayName || 'Student'}</h1>
            <p className={`mt-2 italic text-sm tracking-widest uppercase font-serif underline underline-offset-4 ${theme === 'dark' ? 'text-text-muted decoration-accent/20' : 'text-gray-500 decoration-wholesome-primary/20'}`}>Secure Academic Pathway Interface</p>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, borderColor: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-wholesome-primary)' }}
            className={`p-8 rounded-none shadow-2xl border flex items-center gap-6 group transition-all ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}
          >
            <div className={`p-4 border rounded-none group-hover:bg-accent/5 transition-colors ${theme === 'dark' ? 'border-gold-border' : 'border-gray-100'}`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[3px] mb-1 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{stat.label}</p>
              <p className={`text-3xl font-serif font-black tracking-tighter ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`border rounded-sm p-10 flex flex-col justify-between overflow-hidden relative group ${theme === 'dark' ? 'bg-bg-card border-accent' : 'bg-wholesome-surface border-wholesome-primary/20'}`}>
          <div className="relative z-10">
            <h2 className={`text-3xl font-serif font-bold mb-4 uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Pay Your Tuition</h2>
            <p className={`mb-8 max-w-sm leading-relaxed italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>
              Quickly pay your fees for BYU-Pathway, Ensign College, or BYU-Idaho using our secure gateway.
            </p>
            <Link
              to="/pay"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-sm font-black uppercase tracking-widest transition-all active:scale-95 ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
            >
              Start Payment <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <CreditCard className={`absolute -right-12 -bottom-12 w-64 h-64 opacity-5 group-hover:rotate-12 transition-transform duration-700 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
        </div>

        <div className="grid gap-6">
          <Link
            to="/history"
            className={`p-8 rounded-sm border shadow-sm transition-all flex items-center justify-between group ${theme === 'dark' ? 'bg-bg-card border-gold-border hover:border-accent' : 'bg-white border-gray-100 hover:border-wholesome-primary/30'}`}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 border rounded-sm transition-colors ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 group-hover:border-accent/40' : 'bg-gray-50 border-gray-100 group-hover:border-wholesome-primary/20'}`}>
                <History className={`w-6 h-6 transition-colors ${theme === 'dark' ? 'text-text-muted group-hover:text-accent' : 'text-gray-400 group-hover:text-wholesome-primary'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Payment History</h3>
                <p className={`text-xs uppercase tracking-wider italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Review your past transactions</p>
              </div>
            </div>
            <ChevronRight className={`w-6 h-6 transition-all group-hover:translate-x-1 ${theme === 'dark' ? 'text-text-muted group-hover:text-accent' : 'text-gray-300 group-hover:text-wholesome-primary'}`} />
          </Link>

          <div className={`p-8 rounded-sm border shadow-sm ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest border-b pb-4 ${theme === 'dark' ? 'text-text-main border-gold-border' : 'text-black border-gray-100'}`}>
              <ExternalLink className={`w-5 h-5 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} /> Quick Links
            </h3>
            <div className="space-y-4">
              <a href="https://byupathway.edu" target="_blank" rel="noreferrer" className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest group ${theme === 'dark' ? 'text-accent hover:text-accent/80' : 'text-wholesome-primary hover:opacity-80'}`}>
                BYU-Pathway Student Portal <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://ensign.edu" target="_blank" rel="noreferrer" className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest group ${theme === 'dark' ? 'text-accent hover:text-accent/80' : 'text-wholesome-primary hover:opacity-80'}`}>
                Ensign College Dashboard <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://byui.edu" target="_blank" rel="noreferrer" className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest group ${theme === 'dark' ? 'text-accent hover:text-accent/80' : 'text-wholesome-primary hover:opacity-80'}`}>
                BYU-Idaho Student Account <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
