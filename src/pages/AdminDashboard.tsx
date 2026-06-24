import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentRecord, SystemConfig, LoginRecord, ChatMessage, CourseRegistration, ChatSession } from '../types';
import { 
  Settings, ShieldAlert, List, CheckCircle2, Save, Activity, 
  History as HistoryIcon, TrendingUp, Users, Clock, LogOut, 
  MessageSquare, Bell, Search, Terminal, ArrowDown, ArrowUp,
  Cpu, Database, Wifi, Archive, XCircle
} from 'lucide-react';
import { useAuth, useTheme } from '../App';
import { mockDb } from '../lib/mockDb';
import BrandingLogo from '../components/BrandingLogo';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [newBank, setNewBank] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flows' | 'history' | 'config' | 'registry' | 'audit' | 'chat' | 'archived'>('flows');
  const [archiveSubTab, setArchiveSubTab] = useState<'satisfied' | 'unsatisfied'>('satisfied');
  const [users, setUsers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState<string | null>(null);
  const [warningText, setWarningText] = useState('DISHONESTY WARNING: Your payment notification was flagged as fraudulent. Please ensure payments are made before notifying.');

  const fetchData = () => {
    const p = mockDb.getPayments().sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime());
    setPayments(p);
    setUsers(mockDb.getUsers());
    setLogins(mockDb.getLoginRecords().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setChats(mockDb.getChats().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setSessions(mockDb.getSessions());
    setRegistrations(mockDb.getRegistrations());
    
    const d = mockDb.getConfig();
    setConfig(d);
    if (!newAccountNumber) {
      setNewAccountNumber(d.paymentAccountNumber);
      setNewBankName(d.bankName || '');
      setNewBank(d.bank || '');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    completed: payments.filter(p => p.status === 'completed').length,
    flagged: payments.filter(p => p.status === 'failed').length,
    volume: payments.reduce((acc, p) => acc + (p.status === 'completed' ? p.amount : 0), 0),
    activeUsers: users.length,
    unreadChats: chats.filter(c => !c.isRead && c.senderRole !== 'admin').length
  };

  const handleLogout = () => {
    mockDb.clearAuth();
    window.location.href = '/';
  };

  const updatePaymentStatus = (id: string, status: 'completed' | 'failed', feedback?: string, isDishonest?: boolean) => {
    const updates: any = { status, updatedAt: new Date().toISOString() };
    if (feedback) updates.adminFeedback = feedback;
    if (isDishonest) updates.isDishonest = true;
    
    mockDb.updatePayment(id, updates);
    mockDb.addNotification({
      recipientId: payments.find(p => p.id === id)?.studentId || '',
      title: status === 'completed' ? 'Tuition Verified' : 'Payment Discrepancy Alert',
      content: feedback || (status === 'completed' ? 'Your tuition payment has been officially confirmed.' : 'Your payment could not be verified.'),
      type: isDishonest ? 'error' : (status === 'completed' ? 'success' : 'info'),
      isRead: false,
      timestamp: new Date().toISOString()
    });
    setShowWarningModal(null);
    fetchData();
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const saveConfig = () => {
    setSaving(true);
    try {
      mockDb.saveConfig({
        paymentAccountNumber: newAccountNumber,
        bankName: newBankName,
        bank: newBank,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: user?.email || 'admin'
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center gap-6">
      <div className="w-48 h-1 bg-white/5 overflow-hidden">
        <motion.div className="h-full bg-accent" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5 }} />
      </div>
      <div className="text-[10px] text-accent font-black uppercase tracking-[6px] animate-pulse">Initializing Control Unit</div>
    </div>
  );

  return (
    <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep text-text-main' : 'bg-wholesome-bg text-gray-900'}`}>
      {/* Top Header */}
      <header className={`mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-8 sticky top-0 backdrop-blur-md z-40 ${theme === 'dark' ? 'bg-bg-deep/95 border-gold-border' : 'bg-wholesome-bg/95 border-gray-100'}`}>
          <div className="flex items-center gap-6">
            <BrandingLogo className="h-12" />
            <div>
              <div className={`flex items-center gap-3 font-black uppercase tracking-[4px] text-[9px] mb-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                <Activity className="w-3 h-3" /> System Live: 3000_NODE_READY
              </div>
              <h1 className={`text-3xl font-serif font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>
                Mission <span className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} underline underline-offset-8 decoration-accent/30 font-light italic`}>Control</span>
              </h1>
            </div>
          </div>

        <div className="flex items-center gap-4">
          <div className={`flex p-1 border ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-sm'}`}>
            {[
              { id: 'flows', label: 'Flows', icon: List },
              { id: 'history', label: 'History', icon: HistoryIcon },
              { id: 'audit', label: 'Audit', icon: Terminal },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'archived', label: 'Archived', icon: Archive },
              { id: 'registry', label: 'Registry', icon: Users },
              { id: 'config', label: 'Config', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 transition-all flex flex-col items-center gap-1 ${activeTab === tab.id ? (theme === 'dark' ? 'bg-accent text-black' : 'bg-wholesome-primary text-white') : (theme === 'dark' ? 'text-text-muted hover:text-text-main' : 'text-gray-400 hover:text-wholesome-primary')}`}
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px]">
                   <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </div>
                {tab.id === 'chat' && stats.unreadChats > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 font-black uppercase tracking-widest text-[10px]">
            <LogOut className="w-5 h-5" /> Admin Logout
          </button>
        </div>
      </header>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
        {[
          { label: 'Pending flows', val: stats.pending, icon: Clock, color: theme === 'dark' ? 'text-amber-500' : 'text-amber-600' },
          { label: 'Verified', val: stats.completed, icon: CheckCircle2, color: theme === 'dark' ? 'text-green-500' : 'text-green-600' },
          { label: 'Flagged', val: stats.flagged, icon: ShieldAlert, color: theme === 'dark' ? 'text-red-500' : 'text-red-600' },
          { label: 'Inquiries', val: stats.unreadChats, icon: MessageSquare, color: theme === 'dark' ? 'text-accent' : 'text-wholesome-primary' },
          { label: 'Login Load', val: logins.length, icon: Activity, color: theme === 'dark' ? 'text-blue-500' : 'text-blue-600' },
          { label: 'Total Volume', val: `$${stats.volume.toLocaleString()}`, icon: TrendingUp, color: theme === 'dark' ? 'text-accent' : 'text-wholesome-primary' }
        ].map((stat, i) => (
          <div key={i} className={`border p-5 group transition-all ${theme === 'dark' ? 'bg-bg-card border-gold-border/20 hover:border-accent/40 bg-white/[0.01]' : 'bg-white border-gray-100 hover:border-wholesome-primary/40 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[8px] font-black uppercase tracking-[2px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{stat.label}</span>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-30`} />
            </div>
            <div className={`text-xl font-black ${stat.color} tracking-tighter`}>{stat.val}</div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className={`border overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gold-border/20 bg-accent/5' : 'border-gray-50 bg-wholesome-bg'}`}>
                <div className="flex items-center gap-4">
                   <HistoryIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                   <span className={`text-xs font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Global Transaction History</span>
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[65vh] custom-scrollbar-vertical custom-scrollbar-horizontal">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead className={`sticky top-0 z-20 border-b-2 ${theme === 'dark' ? 'bg-bg-card border-accent/20' : 'bg-gray-50 border-wholesome-primary/20'}`}>
                    <tr className="bg-white/[0.02]">
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Ref ID</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Student</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Amount</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Status</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Date/Time</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gold-border/10' : 'divide-gray-50'}`}>
                    {payments.filter(p => p.status !== 'pending').map((p) => (
                      <tr key={p.id} className={`transition-colors group ${theme === 'dark' ? 'hover:bg-accent/[0.03]' : 'hover:bg-gray-50'}`}>
                        <td className="px-8 py-6 font-mono text-[10px] tracking-widest opacity-60">
                          {p.id.slice(0, 12)}...
                        </td>
                        <td className="px-8 py-6">
                          <div className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{p.fullName}</div>
                          <div className={`text-[9px] opacity-60 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{p.studentEmail}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`text-lg font-black tracking-tighter ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>${p.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                             p.status === 'completed' 
                              ? (theme === 'dark' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-100')
                              : (theme === 'dark' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100')
                           }`}>
                             {p.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                             {p.status === 'completed' ? 'Verified' : 'Flagged'}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-mono opacity-60 uppercase tracking-widest">
                          {new Date(p.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {payments.filter(p => p.status !== 'pending').length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <HistoryIcon className={`w-12 h-12 mx-auto mb-4 opacity-10 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                          <div className={`text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>No historical records found</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Existing flow content starts here */}
        {activeTab === 'flows' && (
          <motion.div key="flows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className={`border overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gold-border/20 bg-accent/5' : 'border-gray-50 bg-wholesome-bg'}`}>
                <div className="flex items-center gap-4">
                   <List className={`w-5 h-5 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                   <span className={`text-xs font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Active Tuition Entry Flows</span>
                </div>
                <div className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                  <ArrowDown className="w-4 h-4 animate-bounce" /> Use horizontal scroll for deep audit data
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar-vertical custom-scrollbar-horizontal">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                  <thead className={`sticky top-0 z-20 border-b-2 ${theme === 'dark' ? 'bg-bg-card border-accent/20' : 'bg-gray-50 border-wholesome-primary/20'}`}>
                    <tr className="bg-white/[0.02]">
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Verified Student</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Registry Credentials (Sensitive)</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Institutional Target</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Flow Value</th>
                      <th className={`px-8 py-5 text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Action Audit</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gold-border/10' : 'divide-gray-50'}`}>
                    {payments.filter(p => p.status === 'pending').map((p) => (
                      <tr key={p.id} className={`transition-colors group ${theme === 'dark' ? 'hover:bg-accent/[0.03]' : 'hover:bg-gray-50'}`}>
                        <td className="px-8 py-8">
                          <div className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{p.fullName}</div>
                          <div className={`text-[9px] font-mono mt-1 opacity-60 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{p.studentEmail}</div>
                          <div className={`text-[8px] mt-2 font-black uppercase tracking-[2px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>City: {p.currentCity}</div>
                        </td>
                        <td className={`px-8 py-8 ${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
                           <div className="flex flex-col gap-2 font-mono text-[10px]">
                              <div className="flex items-center gap-2">
                                <span className="opacity-40 uppercase tracking-widest w-24">Username:</span>
                                <span className={`font-bold tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{p.studentUsername}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="opacity-40 uppercase tracking-widest w-24">Password:</span>
                                <span className="text-red-500 font-bold tracking-widest select-all">{p.studentPassword || 'ERR_NO_DATA'}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{p.institution}</div>
                          <div className={`text-[9px] font-mono mt-1 uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>ACC: {p.accountNumber}</div>
                        </td>
                        <td className="px-8 py-8">
                          <div className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>${p.amount.toLocaleString()}</div>
                          <div className={`text-[8px] font-mono mt-1 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{new Date(p.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex flex-col gap-3">
                              <button onClick={() => updatePaymentStatus(p.id, 'completed')} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[3px] hover:bg-green-500 hover:text-black transition-all shadow-xl">
                                <CheckCircle2 className="w-4 h-4" /> Clear for enrollment
                              </button>
                              <button onClick={() => setShowWarningModal(p.id)} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[3px] hover:bg-red-500 hover:text-stone-900 transition-all">
                                <ShieldAlert className="w-4 h-4" /> Flag discrepancy
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className={`border p-8 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className={`flex items-center justify-between mb-8 border-b pb-6 ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-50'}`}>
                <div>
                  <h3 className={`text-xl font-serif font-black uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Entry Log Analysis</h3>
                  <p className={`text-[10px] uppercase tracking-[3px] font-black mt-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Historical registry login audit</p>
                </div>
                <div className={`flex items-center gap-4 px-6 py-3 border ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-surface border-wholesome-primary/20 text-wholesome-primary'}`}>
                   <Activity className="w-4 h-4" />
                   <span className="text-[11px] font-black tracking-widest uppercase">{logins.length} Total Sessions</span>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[70vh] custom-scrollbar-vertical">
                <div className="grid grid-cols-1 gap-4">
                  {logins.map((log) => (
                    <div key={log.id} className={`p-6 border flex items-center justify-between group transition-all ${theme === 'dark' ? 'border-gold-border/20 bg-white/[0.01] hover:border-accent' : 'border-gray-100 bg-gray-50/30 hover:border-wholesome-primary'}`}>
                       <div className="flex items-center gap-6">
                          <div className={`p-4 border transition-all ${log.role === 'admin' ? (theme === 'dark' ? 'border-accent text-accent' : 'border-wholesome-primary text-wholesome-primary') : (theme === 'dark' ? 'border-gold-border/40 text-text-muted' : 'border-gray-200 text-gray-400')} group-hover:bg-accent group-hover:text-black`}>
                             <Users className="w-5 h-5" />
                          </div>
                          <div>
                             <div className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{log.email}</div>
                             <div className="flex items-center gap-4 mt-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
                                   <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-[2px] px-2 py-0.5 rounded-none ${log.role === 'admin' ? (theme === 'dark' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-wholesome-surface text-wholesome-primary border border-wholesome-primary/30') : (theme === 'dark' ? 'bg-white/10 text-text-muted border border-white/10' : 'bg-gray-100 text-gray-400 border border-gray-200')}`}>
                                   {log.role}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className={`text-[9px] font-mono opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
                          Sess_Ref: {log.id}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chat' && (
           <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
              <div className={`border flex flex-col h-full ${theme === 'dark' ? 'bg-bg-card border-gold-border bg-white/[0.01]' : 'bg-white border-gray-100 shadow-xl'}`}>
                 <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gold-border/20 bg-accent/5' : 'border-gray-50 bg-wholesome-bg'}`}>
                    <h3 className={`text-xs font-black uppercase tracking-[4px] flex items-center gap-3 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                      <MessageSquare className="w-4 h-4" /> Live Inquiry Feed
                    </h3>
                    <button onClick={() => mockDb.markChatsAsRead()} className={`text-[9px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}>
                      Mark Cluster As Read
                    </button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar-vertical">
                    {chats.filter(c => {
                      const session = sessions.find(s => s.studentId === c.senderId && s.status === 'active');
                      return c.senderRole === 'system' || (session && c.timestamp >= session.startedAt);
                    }).map((c) => (
                       <div key={c.id} className={`flex ${c.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-5 border relative shadow-sm ${c.senderRole === 'admin' ? (theme === 'dark' ? 'bg-accent/10 border-accent/30 text-text-main' : 'bg-wholesome-surface border-wholesome-primary/30 text-black') : (theme === 'dark' ? 'bg-bg-card border-gold-border/20 text-text-muted' : 'bg-gray-50 border-gray-100 text-gray-700')}`}>
                             {!c.isRead && c.senderRole !== 'admin' && (
                               <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                             )}
                             <div className="flex justify-between items-center gap-10 mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>{c.senderId === 'system-ai' ? 'AI_ENGINE' : c.senderId}</span>
                                <span className={`text-[8px] opacity-40 font-mono italic ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{new Date(c.timestamp).toLocaleString()}</span>
                             </div>
                             {c.content.includes('[CONTEXT:') && (
                               <div className={`mb-2 p-2 border text-[9px] font-mono tracking-widest uppercase ${theme === 'dark' ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-wholesome-surface border-wholesome-primary/40 text-wholesome-primary'}`}>
                                 {c.content.split('] ')[0].replace('[CONTEXT: ', '')}
                               </div>
                             )}
                             <p className="text-xs leading-relaxed">
                               {c.content.includes('[CONTEXT:') ? c.content.split('] ').slice(1).join('] ') : c.content}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className={`p-6 border-t italic text-[10px] uppercase tracking-[3px] text-center ${theme === 'dark' ? 'border-gold-border/20 text-text-muted' : 'border-gray-50 text-gray-400'}`}>
                    Admin Inquiry Responses are facilitated through the Global Support Node
                 </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                 <div className={`border p-8 border-l-4 border-red-600 shadow-md ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] mb-4">
                       <ShieldAlert className="w-4 h-4 animate-pulse" /> Emergency Monitor
                    </div>
                    <p className={`text-xs leading-relaxed italic border-l pl-4 py-2 ${theme === 'dark' ? 'text-text-muted border-red-900/40' : 'text-gray-500 border-red-100'}`}>
                       "Unresolved student discrepancies should be prioritized. 24h follow-up protocol is active on all flagged accounts."
                    </p>
                 </div>
                 <div className={`border p-8 opacity-40 grayscale flex flex-col items-center justify-center gap-6 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <Wifi className={`w-12 h-12 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                    <div className={`text-[9px] font-black uppercase tracking-[4px] text-center italic ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Remote Device Ping Locked to Main Terminal</div>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'archived' && (
           <motion.div key="archived" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className={`flex gap-4 border-b pb-4 ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-100'}`}>
                 {[
                   { id: 'satisfied', label: 'Satisfied Users', icon: CheckCircle2, color: 'text-green-500' },
                   { id: 'unsatisfied', label: 'Unsatisfied Users', icon: XCircle, color: 'text-red-500' }
                 ].map(s => (
                   <button
                    key={s.id}
                    onClick={() => setArchiveSubTab(s.id as any)}
                    className={`px-6 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                      archiveSubTab === s.id 
                        ? (theme === 'dark' ? 'bg-accent/10 border-accent text-accent' : 'bg-wholesome-surface border-wholesome-primary text-wholesome-primary') 
                        : (theme === 'dark' ? 'bg-transparent border-gold-border/20 text-text-muted hover:border-accent/40' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-wholesome-primary/40')
                    }`}
                   >
                     <s.icon className={`w-4 h-4 ${s.color}`} /> {s.label}
                   </button>
                 ))}
              </div>

              <div className={`border overflow-hidden ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-xl'}`}>
                <div className={`p-6 border-b font-black uppercase tracking-[3px] text-[10px] ${theme === 'dark' ? 'border-gold-border/20 bg-accent/5 text-text-muted' : 'border-gray-50 bg-wholesome-bg text-gray-400'}`}>
                  Archives: {archiveSubTab.toUpperCase()} SESSIONS
                </div>
                <div className="overflow-y-auto max-h-[60vh] custom-scrollbar-vertical">
                  <div className={`divide-y ${theme === 'dark' ? 'divide-gold-border/10' : 'divide-gray-50'}`}>
                    {sessions.filter(s => s.status === archiveSubTab).map(s => {
                      const student = users.find(u => u.uid === s.studentId);
                      return (
                        <div key={s.id} className={`p-6 transition-all grid grid-cols-12 gap-6 items-center ${theme === 'dark' ? 'hover:bg-white/[0.01]' : 'hover:bg-gray-50'}`}>
                          <div className="col-span-3">
                            <div className={`text-[12px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{student?.displayName || 'Unknown Student'}</div>
                            <div className={`text-[9px] font-mono ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{student?.email}</div>
                          </div>
                          <div className="col-span-2">
                            <div className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Representative</div>
                            <div className={`text-[11px] ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{s.representativeName}</div>
                          </div>
                          <div className="col-span-3">
                            <div className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Resolved Date</div>
                            <div className={`text-[11px] font-mono ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{new Date(s.resolvedAt || s.startedAt).toLocaleString()}</div>
                          </div>
                          <div className="col-span-2">
                             <div className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Linked Context</div>
                             <div className={`text-[9px] uppercase font-bold ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>{s.problemCategory || 'N/A'}</div>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button 
                              onClick={() => {
                                setActiveTab('chat');
                                // In a real app we'd filter or load this specific session
                              }}
                              className={`px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'border-gold-border/20 hover:bg-accent hover:text-black' : 'border-gray-200 hover:bg-wholesome-primary hover:text-white'}`}
                            >
                              View Log
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {sessions.filter(s => s.status === archiveSubTab).length === 0 && (
                      <div className="p-20 text-center">
                        <Archive className={`w-12 h-12 mx-auto mb-4 opacity-10 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                        <div className={`text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>No archived sessions found in this category</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'registry' && (
          <motion.div key="registry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`border overflow-hidden ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100 shadow-xl'}`}>
             <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar-vertical custom-scrollbar-horizontal">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className={`sticky top-0 z-20 border-b-2 ${theme === 'dark' ? 'bg-bg-card border-accent/20' : 'bg-gray-50 border-wholesome-primary/20'}`}>
                    <tr className="bg-white/[0.02]">
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Student Name</th>
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Verified Email</th>
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] bg-red-500/5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`}>Registry PW</th>
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Course/Program</th>
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Active Courses</th>
                      <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Joined</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gold-border/10' : 'divide-gray-50'}`}>
                    {users.map((u) => (
                      <tr key={u.uid} className={`transition-colors ${theme === 'dark' ? 'hover:bg-accent/[0.01]' : 'hover:bg-gray-50'}`}>
                        <td className="px-8 py-6">
                          <div className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{u.displayName}</div>
                          <div className={`text-[8px] font-mono tracking-[2px] mt-1 ${u.role === 'admin' ? (theme === 'dark' ? 'text-accent' : 'text-wholesome-primary') : (theme === 'dark' ? 'text-text-muted' : 'text-gray-400')}`}>
                             {u.role.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`text-[11px] font-mono tracking-tight ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{u.email}</div>
                        </td>
                        <td className={`px-8 py-6 ${theme === 'dark' ? 'bg-red-500/[0.02]' : 'bg-red-50'}`}>
                          <div className={`text-[11px] font-mono font-bold tracking-widest select-all ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`}>
                             {u.password || 'PORTAL_LOCKED'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{u.currentClassOrProgram}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                             {registrations.filter(r => r.studentId === u.uid).map(r => (
                               <div key={r.id} className={`text-[8px] font-black border px-2 py-1 uppercase tracking-widest ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-surface border-wholesome-primary/20 text-wholesome-primary'}`}>
                                 {r.courseCode}
                               </div>
                             ))}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`text-[10px] font-mono ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{new Date(u.createdAt).toLocaleDateString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'config' && (
          <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-10">
            <div className={`p-12 border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Settings className={`w-32 h-32 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
               </div>
              <h3 className={`text-xl font-serif font-black mb-10 flex items-center gap-3 uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                <Cpu className="w-6 h-6" /> Node Parameters
              </h3>
              <div className="space-y-8 relative z-10">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-[4px] mb-4 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Receiving Point</label>
                  <input type="text" className={`w-full px-8 py-5 border outline-none font-mono font-bold tracking-[4px] text-xl transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 text-accent focus:border-accent' : 'bg-gray-50 border-gray-100 text-black focus:border-wholesome-primary'}`} value={newAccountNumber} onChange={(e) => setNewAccountNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[4px] mb-4 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Bank Institution</label>
                    <input type="text" className={`w-full px-8 py-5 border outline-none font-mono font-bold tracking-[2px] transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 text-accent focus:border-accent' : 'bg-gray-50 border-gray-100 text-black focus:border-wholesome-primary'}`} value={newBank} onChange={(e) => setNewBank(e.target.value)} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[4px] mb-4 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Account Holder Name</label>
                    <input type="text" className={`w-full px-8 py-5 border outline-none font-mono font-bold tracking-[2px] transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 text-accent focus:border-accent' : 'bg-gray-50 border-gray-100 text-black focus:border-wholesome-primary'}`} value={newBankName} onChange={(e) => setNewBankName(e.target.value)} />
                  </div>
                </div>
                <button onClick={saveConfig} disabled={saving} className={`w-full font-black py-6 uppercase tracking-[5px] text-xs transition-all flex items-center justify-center gap-4 ${saveStatus === 'success' ? 'bg-green-600 text-white' : saveStatus === 'error' ? 'bg-red-600 text-white' : (theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white hover:bg-wholesome-primary/90')}`}>
                  <Save className="w-5 h-5" /> {saving ? 'Syncing...' : saveStatus === 'success' ? 'Synchronized' : 'Update Node Config'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-card border-2 border-red-600 p-10 max-w-xl w-full shadow-[0_0_100px_rgba(220,38,38,0.3)] relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
              <div className="flex items-center gap-4 text-red-600 font-black uppercase tracking-[5px] text-sm mb-8">
                <ShieldAlert className="w-8 h-8" /> Security Protocol Zero
              </div>
              <p className="text-[10px] text-text-muted mb-8 uppercase tracking-[4px] leading-relaxed">
                Issuing a dishonesty flag is a critical registry action. Define the verification failure below for permanent student archival.
              </p>
              <textarea
                className="w-full h-40 bg-bg-deep border border-red-500/30 p-6 text-text-main outline-none focus:border-red-600 text-xs font-mono tracking-widest leading-relaxed mb-10"
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setShowWarningModal(null)}
                  className="py-5 border border-gold-border font-black text-[10px] uppercase tracking-[3px] hover:bg-white/5 transition-all"
                >
                  Abort Action
                </button>
                <button
                  onClick={() => updatePaymentStatus(showWarningModal, 'failed', warningText, true)}
                  className="py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[3px] hover:bg-red-700 transition-all shadow-xl"
                >
                  Confirm Red Flag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
