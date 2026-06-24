import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth, useTheme } from '../App';
import { Notification } from '../types';
import { Bell, Mail, MailOpen, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { mockDb } from '../lib/mockDb';

export default function Inbox() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      const data = mockDb.getNotifications()
        .filter(n => n.recipientId === user.uid)
        .sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime());
      setNotifications(data);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (id: string, currentStatus: boolean) => {
    if (currentStatus) return;
    mockDb.updateNotification(id, { isRead: true });
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <header className={`mb-12 border-l-4 pl-8 ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}>
        <h1 className={`text-4xl font-serif font-bold mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Official Inbox</h1>
        <p className={`italic text-[11px] uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Secure Desk Communications</p>
      </header>

      {loading ? (
        <div className={`flex justify-center py-20 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className={`p-16 text-center border ${theme === 'dark' ? 'bg-bg-card border-accent/20' : 'bg-white border-gray-100 shadow-xl'}`}>
          <Bell className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-accent/10' : 'text-gray-200'}`} />
          <h3 className={`text-xl font-bold mb-2 uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Inbox Activity Clear</h3>
          <p className={`italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Check back later for tuition updates.</p>
        </div>
      ) : (
        <div className={`grid divide-y border shadow-lg ${theme === 'dark' ? 'bg-bg-card divide-gold-border border-gold-border' : 'bg-white divide-gray-50 border-gray-100'}`}>
          {notifications.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => markAsRead(note.id, note.isRead)}
              className={`p-8 transition-all cursor-pointer relative overflow-hidden group ${
                note.isRead 
                  ? 'opacity-60' 
                  : (theme === 'dark' ? 'bg-white/2' : 'bg-wholesome-surface/50')
              } ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              {!note.isRead && (
                <div className={`absolute top-0 left-0 w-1 h-full ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
              )}
              
              <div className="flex gap-8 items-start">
                <div className={`p-4 border rounded-none transition-colors ${theme === 'dark' ? 'border-gold-border' : 'border-gray-100'} ${note.isRead ? (theme === 'dark' ? 'text-text-muted' : 'text-gray-400') : (theme === 'dark' ? 'text-accent' : 'text-wholesome-primary')}`}>
                  {note.isRead ? <MailOpen className="w-6 h-6 border-gold-border/20" /> : <Mail className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className={`text-lg uppercase tracking-widest font-bold ${note.isRead ? (theme === 'dark' ? 'text-text-muted' : 'text-gray-400') : (theme === 'dark' ? 'text-text-main' : 'text-black')}`}>
                      {note.title}
                    </h4>
                    {!note.isRead && (
                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-none tracking-[2px] ${theme === 'dark' ? 'bg-accent text-black' : 'bg-wholesome-primary text-white'}`}>Primary</span>
                    )}
                  </div>
                  <p className={`leading-relaxed text-sm mb-6 border-l pl-6 italic ${theme === 'dark' ? 'text-text-muted border-gold-border/30' : 'text-gray-600 border-gray-200'}`}>
                    {note.content}
                  </p>
                  <div className={`flex items-center gap-6 text-[10px] font-black uppercase tracking-[2px] ${theme === 'dark' ? 'text-accent/50' : 'text-wholesome-primary/60'}`}>
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(note.timestamp as string).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified Communication</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
