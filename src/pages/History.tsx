import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth, useTheme } from '../App';
import { PaymentRecord } from '../types';
import { Receipt, Clock, CheckCircle2, XCircle, Search, CreditCard, History as HistoryIcon, GraduationCap, Bell, ChevronRight, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockDb } from '../lib/mockDb';

export default function History() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      const data = mockDb.getPayments()
        .filter(p => p.studentId === user.uid)
        .sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime());
      
      setPayments(data);
      setLoading(false);

      // Check for confirmed payments to direct to registration assistance
      const confirmedPayments = data.filter(p => p.status === 'completed');
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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className={`w-5 h-5 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />;
      case 'failed': return <XCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />;
      default: return <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} />;
    }
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 py-12 transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <header className={`mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 ${theme === 'dark' ? 'border-gold-border' : 'border-gray-100'}`}>
        <div>
          <h1 className={`text-4xl font-serif font-bold mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Payment History</h1>
          <p className={`italic text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Track your tuition transactions and status</p>
        </div>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
          <input
            type="text"
            placeholder="Search history..."
            className={`pl-11 pr-4 py-3 rounded-none outline-none text-[10px] uppercase tracking-widest w-full md:w-64 transition-all border ${theme === 'dark' ? 'bg-bg-card border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-100 focus:border-wholesome-primary text-black'}`}
          />
        </div>
      </header>

      {loading ? (
        <div className={`flex justify-center py-20 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-accent' : 'border-wholesome-primary'}`}></div>
        </div>
      ) : payments.length === 0 ? (
        <div className={`p-16 text-center border ${theme === 'dark' ? 'bg-bg-card border-accent/20' : 'bg-white border-gray-100 shadow-sm'}`}>
          <Receipt className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-accent/20' : 'text-gray-200'}`} />
          <h3 className={`text-xl font-bold mb-2 uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>No Transactions Found</h3>
          <p className={`mb-8 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Your tuition payment history will appear here once you make your first payment.</p>
          <Link
            to="/pay"
            className={`inline-flex items-center gap-2 px-10 py-4 rounded-none font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
          >
            Make a Payment
          </Link>
        </div>
      ) : (
        <div className={`grid gap-0 divide-y border ${theme === 'dark' ? 'divide-gold-border border-gold-border' : 'divide-gray-50 border-gray-100 shadow-md'}`}>
          {payments.map((payment, idx) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-8 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${theme === 'dark' ? 'bg-bg-card hover:bg-white/5' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 border rounded-none ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20' : 'bg-gray-50 border-gray-100'}`}>
                  <Receipt className={`w-6 h-6 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{payment.institution}</h4>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
                    {new Date(payment.timestamp as string).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-12">
                <div className="text-right">
                  <p className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className={`text-[9px] font-mono tracking-widest uppercase ${theme === 'dark' ? 'text-accent/50' : 'text-gray-400'}`}>{payment.id}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-none border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  payment.status === 'completed' 
                    ? (theme === 'dark' ? 'bg-green-950/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-700 border-green-100') :
                  payment.status === 'failed' 
                    ? (theme === 'dark' ? 'bg-red-950/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-100') :
                  (theme === 'dark' ? 'bg-amber-950/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-100')
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span className="capitalize">{payment.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
