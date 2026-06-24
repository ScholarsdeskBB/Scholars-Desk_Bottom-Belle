import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useTheme } from '../App';
import { CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Globe2, Loader2, RefreshCcw, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SystemConfig } from '../types';
import { mockDb } from '../lib/mockDb';
import { GoogleGenAI } from "@google/genai";

function LatestCurrencyRate({ amount }: { amount: string }) {
  const { theme } = useTheme();
  const [conversion, setConversion] = useState<{ rate: number, localAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const convertCurrency = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Perform a high-speed research of the current USD to NGN (Nigerian Naira) exchange rate. Return JSON only: { "rate": number }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = response.text;
      
      // Clean up the response if it contains markdown code blocks
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedJson);
      setConversion(data);
    } catch (err) {
      console.error("Rate fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount) convertCurrency();
  }, [amount]);

  // Business logic: 
  // 1. Add a 2.5% "Safe-Buffer & Business Incentive"
  // 2. Hide the $5 gateway fee by adding it to the USD base BEFORE conversion
  const incentivizedRate = conversion ? Math.round(conversion.rate * 1.025) : 0;
  const totalUsdWithFee = Number(amount) + 5;
  const totalNaira = conversion ? Math.round(totalUsdWithFee * incentivizedRate) : 0;

  return (
    <div className={`p-8 border mb-8 relative overflow-hidden group transition-all ${theme === 'dark' ? 'bg-accent/5 border-accent/20' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
      <div className={`flex justify-between items-center mb-6 border-b pb-4 text-left ${theme === 'dark' ? 'border-gold-border/20' : 'border-wholesome-primary/10'}`}>
        <div className="flex items-center gap-2">
          <Globe2 className={`w-4 h-4 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
          <span className={`text-[11px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Official Exchange Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Live rate cluster active</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 py-4">
          <Loader2 className={`w-5 h-5 animate-spin ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
          <span className={`text-[10px] font-black uppercase tracking-[3px] animate-pulse ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Running High-Speed Research Agent...</span>
        </div>
      ) : conversion ? (
        <div className="space-y-6 text-left">
          <div className={`p-6 border ${theme === 'dark' ? 'bg-white/5 border-gold-border/10' : 'bg-white border-gray-100'}`}>
            <div className={`text-[9px] font-black uppercase tracking-[3px] mb-3 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Current Dollar to Naira rate calculation</div>
            <div className={`text-2xl font-black tracking-tighter leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Your Fee is <span className={`underline underline-offset-8 ${theme === 'dark' ? 'text-accent decoration-accent/30' : 'text-wholesome-primary decoration-wholesome-primary/30'}`}>₦{totalNaira.toLocaleString()}</span>
            </div>
            <div className={`flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
              Official Currency Exchange Rate: <span className={theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}>${(Number(amount) + 5).toLocaleString()}</span>
            </div>
            <p className={`text-[8px] selection:bg-accent mt-4 p-2 border border-dashed ${theme === 'dark' ? 'text-accent/50 bg-accent/5 border-accent/10' : 'text-wholesome-primary/60 bg-wholesome-surface border-wholesome-primary/20'}`}> Includes net tuition + platform gateway fee + 2.5% business incentive </p>
          </div>
          <div className={`flex justify-between items-center text-[8px] font-mono uppercase tracking-widest italic ${theme === 'dark' ? 'text-text-muted/60' : 'text-gray-400'}`}>
            <span>Anchor: 1 USD = ₦{incentivizedRate}</span>
            <span>Ref: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
          </div>
        </div>
      ) : (
        <button 
          onClick={convertCurrency}
          className={`w-full text-[10px] font-black uppercase tracking-[4px] transition-all py-4 border ${theme === 'dark' ? 'text-accent hover:text-white border-accent/20 hover:bg-accent/5' : 'text-wholesome-primary hover:bg-wholesome-primary hover:text-white border-wholesome-primary/20'}`}
        >
          Initiate High-Speed Exchange Lookup
        </button>
      )}
    </div>
  );
}

export default function PayNow() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [institution, setInstitution] = useState('BYU-Pathway Worldwide');
  const [amount, setAmount] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [adminAccountNumber, setAdminAccountNumber] = useState('Loading...');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    const data = mockDb.getConfig();
    setConfig(data);
    setAdminAccountNumber(data.paymentAccountNumber);
  }, []);

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const paymentData = {
        amount: Number(amount),
        studentId: user?.uid,
        studentEmail: user?.email,
        fullName,
        studentUsername,
        studentPassword,
        currentCity,
        accountNumber: adminAccountNumber,
        institution,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      mockDb.addPayment(paymentData as any);

      mockDb.addNotification({
        recipientId: user?.uid,
        title: 'Tuition Payment Processing',
        content: `Your payment of $${amount} for ${institution} has been flagged for confirmation. Please hold on as we verify the transaction with the banking institution.`,
        isRead: false,
        timestamp: new Date().toISOString(),
        type: 'info'
      });

      setSuccess(true);
      setTimeout(() => navigate('/history'), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-12 border shadow-2xl ${theme === 'dark' ? 'bg-bg-card border-accent' : 'bg-white border-wholesome-primary'}`}
        >
          <div className={`w-20 h-20 border rounded-full flex items-center justify-center mx-auto mb-8 ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-green-50 border-green-200 text-green-600'}`}>
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className={`text-3xl font-serif font-bold mb-6 uppercase tracking-widest leading-tight ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Payment Recorded</h2>
          <p className={`mb-8 leading-relaxed italic text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>
            Please hold on for confirmation. Your tuition fee payment will proceed immediately the confirmation is completed by the Scholars Help Desk registry.
          </p>
          <div className={`animate-pulse font-black uppercase tracking-[4px] text-[10px] mb-8 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
            Registry Processing...
          </div>
          <button
            onClick={() => navigate('/inbox')}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 border font-black uppercase tracking-[3px] text-xs transition-all ${theme === 'dark' ? 'border-accent text-accent hover:bg-accent hover:text-black' : 'border-wholesome-primary text-wholesome-primary hover:bg-wholesome-primary hover:text-white'}`}
          >
            Monitor Official Inbox <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 py-12 transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 md:p-12 border shadow-sm ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}
          >
            <div className={`flex justify-between items-center mb-10 border-b pb-6 ${theme === 'dark' ? 'border-gold-border' : 'border-gray-100'}`}>
              <h2 className={`text-3xl font-serif font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>
                {step === 1 ? 'Step 1: Requirements' : 'Step 2: Bank Transfer'}
              </h2>
              <div className={`text-[10px] font-black uppercase tracking-[3px] px-4 py-1 border ${theme === 'dark' ? 'text-accent bg-accent/5 border-accent/20' : 'text-wholesome-primary bg-wholesome-surface border-wholesome-primary/20'}`}>
                Phase {step} of 2
              </div>
            </div>

            {error && (
              <div className={`px-4 py-3 mb-6 flex items-center gap-2 text-xs uppercase border ${theme === 'dark' ? 'bg-red-950/20 border-red-500/50 text-red-100' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Target Institution</label>
                    <div className="relative">
                      <select
                        className={`w-full px-5 py-4 border rounded-none focus:border-accent outline-none appearance-none cursor-pointer ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 text-text-main' : 'bg-gray-50 border-gray-200 text-black'}`}
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                      >
                        <option>BYU-Pathway Worldwide</option>
                        <option>Ensign College</option>
                        <option>BYU-Idaho</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Amount (USD)</label>
                    <input
                      type="number"
                      required
                      className={`w-full px-5 py-4 border rounded-none outline-none transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 text-text-main focus:border-accent' : 'bg-gray-50 border-gray-200 text-black focus:border-wholesome-primary'}`}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Full Name</label>
                    <input
                      type="text"
                      required
                      className={`w-full px-5 py-4 border rounded-none outline-none transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 text-text-main focus:border-accent' : 'bg-gray-50 border-gray-200 text-black focus:border-wholesome-primary'}`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Current City</label>
                    <input
                      type="text"
                      required
                      className={`w-full px-5 py-4 border rounded-none outline-none transition-all ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 text-text-main focus:border-accent' : 'bg-gray-50 border-gray-200 text-black focus:border-wholesome-primary'}`}
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className={`p-8 border-l-2 ${theme === 'dark' ? 'bg-bg-deep border-accent' : 'bg-wholesome-surface border-wholesome-primary'}`}>
                  <div className={`flex items-center gap-3 font-black uppercase tracking-[3px] text-xs mb-6 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                    <ShieldCheck className="w-5 h-5" /> Portal Authorization
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>School Username</label>
                      <input
                        type="text"
                        required
                        className={`w-full border px-5 py-3 outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-gold-border/30 text-text-main focus:border-accent' : 'bg-white border-gray-200 text-black focus:border-wholesome-primary'}`}
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>School Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className={`w-full border px-5 py-3 outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-gold-border/30 text-text-main focus:border-accent' : 'bg-white border-gray-200 text-black focus:border-wholesome-primary'}`}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-9 transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full font-black py-5 uppercase tracking-[3px] transition-all active:scale-[0.98] ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white hover:opacity-90'}`}
                >
                  Proceed to Payment Details
                </button>
              </form>
            ) : (
              <div className="space-y-10">
               <div className={`p-10 border border-dashed text-center ${theme === 'dark' ? 'bg-bg-deep border-accent/20' : 'bg-wholesome-surface border-wholesome-primary/20'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-[4px] mb-6 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Secure Receiving Institution Details</p>
                  
                  <div className="space-y-4">
                    <LatestCurrencyRate amount={amount} />

                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Account Number</span>
                      <span className={`text-3xl font-mono font-black tracking-[4px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>{config?.paymentAccountNumber}</span>
                    </div>
                    <div className={`flex justify-center gap-10 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gold-border/10' : 'border-gray-100'}`}>
                      <div className="text-left">
                        <span className={`text-[10px] uppercase font-bold block mb-1 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Bank</span>
                        <span className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{config?.bank}</span>
                      </div>
                      <div className="text-left">
                        <span className={`text-[10px] uppercase font-bold block mb-1 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Bank Name</span>
                        <span className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>{config?.bankName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full font-black py-6 uppercase tracking-[4px] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 group ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
                  >
                    {loading ? 'Transmitting Flag...' : (
                      <>
                        Notify Payment Done 🔔
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className={`w-full text-[10px] font-black uppercase tracking-[2px] transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-text-main' : 'text-gray-400 hover:text-wholesome-primary'}`}
                  >
                    Go back to requirements
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className={`p-10 border opacity-70 ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-xs font-black uppercase tracking-[4px] mb-8 border-b pb-4 italic ${theme === 'dark' ? 'text-accent border-gold-border' : 'text-wholesome-primary border-gray-100'}`}>Global Awareness</h3>
            <p className={`text-[11px] leading-relaxed font-serif italic mb-6 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>
              "Honesty is the foundation of our academic community. Ensure payments are physically completed before notification to maintain institutional trust."
            </p>
            <ShieldCheck className={`w-8 h-8 opacity-20 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
