import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { mockDb } from '../lib/mockDb';
import { Shield, CheckCircle, Info, ShieldCheck, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { useTheme } from '../App';

export default function Login() {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: New Password
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleAuth = async (e: FormEvent) => {
    // ... no changes to logic
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin) {
      if (!agreedToTerms) {
        setError('You must agree to the Terms and Conditions to sign up.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const users = mockDb.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          // Check for admin role
          if (user.role === 'admin') {
            // Allow login with either the registry master key OR their personal account password
            if (password === 'BOLD STEP' || (user.password && user.password === password)) {
              mockDb.setAuthUser({ uid: user.uid, email: user.email });
              
              // Record Registry Login
              mockDb.addLoginRecord({
                userId: user.uid,
                email: user.email,
                role: 'admin',
                timestamp: new Date().toISOString()
              });

              window.location.href = '/admin'; // Redirect admin to admin panel
            } else {
              setError('Invalid Credentials. Please check your Administrator Access Key or personal password.');
            }
          } else {
            // Standard student login - Check password if it exists (for new accounts)
            if (user.password && user.password !== password) {
              setError('Incorrect student password. Please try again or reset your password.');
            } else {
              mockDb.setAuthUser({ uid: user.uid, email: user.email });

              // Record Registry Login
              mockDb.addLoginRecord({
                userId: user.uid,
                email: user.email,
                role: 'student',
                timestamp: new Date().toISOString()
              });

              window.location.href = '/dashboard';
            }
          }
        } else {
          setError('User account not found in our records. Please verify your email or register a new account.');
        }
      } else {
        const users = mockDb.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          setError('A student account with this email already exists.');
          setLoading(false);
          return;
        }

        const uid = Math.random().toString(36).substr(2, 9);
        const role = email.toLowerCase() === 'mainbigbrother@gmail.com' ? 'admin' : 'student';
        
        mockDb.saveUser({
          uid: uid,
          email: email,
          password: password,
          displayName: displayName,
          role: role,
          currentClassOrProgram: currentClass,
          createdAt: new Date().toISOString()
        });
        
        setSignupSuccess(true);
        setIsLogin(true); // Switch to login tab
        setDisplayName('');
        setCurrentClass('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (resetStep === 1) {
      // Step 1: Verify Email
      const users = mockDb.getUsers();
      if (users.find(u => u.email === email)) {
        setTimeout(() => {
          setResetStep(2);
          setLoading(false);
        }, 1000);
      } else {
        setError('No student account found with this email.');
        setLoading(false);
      }
    } else {
      // Step 2: Set New Password
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      
      const success = mockDb.updatePasswordByEmail(email, password);
      if (success) {
        setTimeout(() => {
          setError('');
          setSignupSuccess(true);
          setIsResetMode(false);
          setResetStep(1);
          setLoading(false);
        }, 1000);
      } else {
        setError('Password reset failed. Please contact registry support.');
        setLoading(false);
      }
    }
  };

  if (signupSuccess) {
    return (
      <div className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-12 rounded-sm shadow-2xl w-full max-w-lg border text-center ${theme === 'dark' ? 'bg-bg-card border-accent' : 'bg-white border-wholesome-primary/20'}`}
        >
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-surface'}`}>
            <CheckCircle className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
          </div>
          <h2 className={`text-3xl font-serif font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Registration Complete</h2>
          <p className={`mb-8 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>Your account has been securely provisioned. Please sign in with your credentials to access the portal.</p>
          <button
            onClick={() => setSignupSuccess(false)}
            className={`w-full font-black py-4 rounded-sm uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white hover:bg-wholesome-primary'}`}
          >
            Access Login Portal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 md:p-12 rounded-sm shadow-2xl w-full max-w-lg border ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}
      >
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center p-3 rounded-sm mb-4 ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-surface'}`}>
            {isResetMode ? <KeyRound className={`w-8 h-8 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} /> : <Shield className={`w-8 h-8 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />}
          </div>
          <h2 className={`text-3xl font-serif font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>
            {isResetMode ? 'Security Reset' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className={`mt-2 text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
            {isResetMode ? 'Recover your access key' : 'Access the Scholars Tuition Gateway'}
          </p>
        </div>

        {error && (
          <div className={`px-4 py-3 rounded-sm mb-6 flex items-center gap-2 text-[10px] uppercase tracking-wider border ${theme === 'dark' ? 'bg-red-950/20 border-red-500/50 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <Info className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isResetMode ? (
            <motion.form 
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handlePasswordReset} 
              className="space-y-5"
            >
              {resetStep === 1 ? (
                <div>
                  <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Account Email</label>
                  <input
                    type="email"
                    required
                    className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative">
                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>New Access Key (Password)</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-9 transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Re-enter New Access Key</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-black py-4 rounded-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
              >
                {loading ? 'Processing Registry...' : (resetStep === 1 ? 'Verify Account' : 'Commit New Credentials')}
              </button>
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setResetStep(1); setError(''); }}
                className={`w-full flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest transition-colors py-2 ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
              >
                <ArrowLeft size={12} /> Return to Sign In
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAuth} 
              className="space-y-5"
            >
              {!isLogin && (
            <div className="space-y-5">
              <div>
                <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Student Full Name</label>
                <input
                  type="text"
                  required
                  className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div>
                <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Current Class / Program</label>
                <input
                  type="text"
                  required
                  className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                  placeholder="e.g., Computer Science - Level 300"
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                />
              </div>
            </div>
          )}
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Email / Student Username</label>
            <input
              type="email"
              required
              className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-9 transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-5 py-3 rounded-none transition-all outline-none border ${theme === 'dark' ? 'bg-bg-deep border-gold-border/30 focus:border-accent text-text-main' : 'bg-gray-50 border-gray-200 focus:border-wholesome-primary text-black'}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setIsResetMode(true); setIsLogin(true); setError(''); }}
                className={`text-[9px] uppercase tracking-widest font-black ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} hover:underline`}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-4">
              <div className={`p-4 rounded-sm border overflow-y-auto max-h-32 text-[10px] leading-relaxed font-mono ${theme === 'dark' ? 'bg-bg-deep border-gold-border/20 text-text-muted' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <p className={`font-bold mb-1 uppercase tracking-wider ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Terms & Conditions</p>
                1. Students must provide accurate information. 2. Payments are non-refundable through this portal. 3. Data privacy is strictly maintained. 4. Account info should not be shared. 5. Scholars Help Desk acts as a facilitator for online payment processing.
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className={`mt-1 w-4 h-4 rounded focus:ring-accent accent-accent ${theme === 'dark' ? 'text-accent border-gold-border' : 'text-wholesome-primary border-gray-300'}`}
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className={`text-[10px] uppercase tracking-wider leading-relaxed transition-colors group-hover:text-text-main ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                  I abide by the Scholars Help Desk Terms and Conditions and understand my data is protected.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-black py-4 rounded-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 ${theme === 'dark' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-wholesome-primary text-white'}`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Complete Registration')}
          </button>
        </motion.form>
      )}
      </AnimatePresence>

        <div className={`mt-8 text-center pt-6 border-t ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-100'}`}>
          <p className={`text-[10px] uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>
            {isLogin ? "New to the portal?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`ml-2 font-black hover:underline ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          <Link 
            to="/admin-login" 
            className={`inline-flex items-center gap-2 text-[8px] uppercase tracking-[3px] transition-colors mt-2 ${theme === 'dark' ? 'text-text-muted/40 hover:text-accent' : 'text-gray-300 hover:text-wholesome-primary'}`}
          >
            <ShieldCheck className="w-2.5 h-2.5" /> Registry Gateway
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
