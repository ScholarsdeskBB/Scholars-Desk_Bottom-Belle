import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, School, GraduationCap, ShieldCheck, CreditCard, Lock, Zap, ChevronRight, Globe2, CheckCircle, FileText } from 'lucide-react';
import { useTheme } from '../App';
import BrandingLogo from '../components/BrandingLogo';

const ESSENCE_SLIDES = [
  {
    tag: 'Tuition Architecture',
    title: (theme: string) => <>Precision <br/><span className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} italic`}>Gateways</span></>,
    description: 'Providing specialized financial infrastructure for the global BYU-Pathway community and sister institutions.',
    accent: 'Registry v4.0'
  },
  {
    tag: 'Financial Transparency',
    title: (theme: string) => <>Direct <br/><span className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} italic`}>Audit flows</span></>,
    description: 'Bypassing complex third-party intermediaries for vetted, synchronous tuition transmission.',
    accent: 'Sync Node Active'
  },
  {
    tag: 'Educational Destiny',
    title: (theme: string) => <>Sacred <br/><span className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} italic`}>Bridges</span></>,
    description: 'Forging a secure path between your financial stewardship and your academic graduation.',
    accent: 'End-to-End Auth'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ESSENCE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const institutions = [
    {
      name: 'Ensign College',
      description: 'Seamless integration for domestic and international students at Ensign.',
      icon: <School className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-secondary'}`} />,
      tag: 'Professional Node',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1974&auto=format&fit=crop'
    },
    {
      name: 'BYU-Idaho',
      description: 'Connect your student ID to start auditing your tuition requirements.',
      icon: <GraduationCap className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-secondary'}`} />,
      tag: 'Academic Core',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop'
    },
    {
      name: 'Global Nodes',
      description: 'Connecting localized academic clusters for efficient fee processing.',
      icon: <Globe className={`w-10 h-10 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-secondary'}`} />,
      tag: 'Regional Registry',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop'
    }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-bg-deep text-text-main' : 'bg-wholesome-bg text-on-background'} font-body transition-colors duration-500 selection:bg-accent selection:text-black min-h-screen`}>
      {/* Hero Section - Blended Wholesome/Technical */}
      <section className={`relative px-6 py-20 md:py-32 overflow-hidden border-b ${theme === 'dark' ? 'border-gold-border/20 bg-black' : 'border-gray-100 bg-white'}`}>
        {/* Dark Mode Background Visuals */}
        {theme === 'dark' && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/4" />
            <div className="absolute inset-0 bg-gradient-to-br from-bg-deep via-transparent to-black" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="space-y-6"
              >
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest ${theme === 'dark' ? 'bg-accent/10 text-accent' : 'bg-wholesome-container text-wholesome-primary'}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
                  {ESSENCE_SLIDES[currentSlide].tag} // {ESSENCE_SLIDES[currentSlide].accent}
                </div>
                
                <h1 className={`font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {ESSENCE_SLIDES[currentSlide].title(theme)}
                </h1>
                
                <p className={`font-body text-lg max-w-lg leading-relaxed ${theme === 'dark' ? 'text-text-muted italic border-l-4 border-accent pl-8' : 'text-gray-600'}`}>
                  {ESSENCE_SLIDES[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-8 max-w-md">
              <Link
                to="/login"
                className={`group relative flex items-center justify-between px-10 py-12 rounded-none overflow-hidden transition-all hover:translate-y-[-8px] active:scale-[0.98] ${
                  theme === 'dark' 
                    ? 'bg-accent text-black border-l-4 border-black/30 shadow-[0_40px_80px_rgba(212,175,55,0.25)]' 
                    : 'bg-wholesome-primary text-white border-b-[8px] border-r-[8px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,0.15)]'
                }`}
              >
                {/* Background Pattern for Light Mode */}
                {theme !== 'dark' && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
                )}
                <div className="relative z-10 text-left">
                  <div className={`text-[10px] uppercase font-black tracking-[6px] mb-2 ${theme === 'dark' ? 'opacity-60' : 'opacity-80'}`}>Entrance Gateway</div>
                  <div className="text-4xl font-serif font-black uppercase tracking-tighter">Get Started</div>
                </div>
                <ChevronRight className="w-12 h-12 group-hover:translate-x-3 transition-transform relative z-10" />
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 font-black text-[150px] pointer-events-none select-none italic -rotate-12 translate-x-20 transition-all group-hover:scale-110 group-hover:rotate-0 ${
                  theme === 'dark' ? 'text-black/10' : 'text-white/10'
                }`}>
                  STUDENT
                </div>
              </Link>

              <Link
                to="/admin-login"
                className={`group relative flex items-center justify-between px-10 py-12 rounded-none transition-all hover:translate-y-[-8px] active:scale-[0.98] border-2 overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-bg-card border-gold-border text-text-main hover:border-accent hover:text-accent shadow-[0_30px_60px_rgba(212,175,55,0.1)]' 
                    : 'bg-white border-black border-b-[8px] border-r-[8px] text-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Background Pattern for Light Mode */}
                {theme !== 'dark' && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#000_20px,#000_21px)]" />
                )}
                <div className="relative z-10 text-left">
                  <div className={`text-[10px] uppercase font-black tracking-[6px] mb-2 ${theme === 'dark' ? 'opacity-50' : 'opacity-40'}`}>Authorized Personnel Only</div>
                  <div className="text-4xl font-serif font-black uppercase tracking-tighter">Registry Access</div>
                </div>
                <Lock className="w-12 h-12 group-hover:rotate-12 transition-transform relative z-10" />
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 font-black text-[150px] pointer-events-none select-none italic -rotate-12 translate-x-20 transition-all group-hover:scale-110 group-hover:rotate-0 ${
                  theme === 'dark' ? 'text-accent/5' : 'text-black/5'
                }`}>
                  ADMIN
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              {ESSENCE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-0.5 transition-all duration-500 rounded-full ${currentSlide === i ? `w-12 ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}` : `w-4 ${theme === 'dark' ? 'bg-gold-border/40' : 'bg-gray-200'} hover:bg-opacity-80`}`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 2 }}
              transition={{ duration: 1 }}
              className={`aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative z-10 ${theme === 'dark' ? 'border-4 border-gold-border/20' : ''}`}
            >
              <img 
                className={`w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 ${theme === 'dark' ? 'opacity-80' : ''}`} 
                alt="University students studying" 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-xl max-w-xs z-20 border ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-[#6dfe9c] border-black/5'}`}
            >
              <div className="flex items-center gap-4">
                <ShieldCheck className={`w-6 h-6 ${theme === 'dark' ? 'text-accent' : 'text-on-secondary-container'}`} />
                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-accent' : 'text-on-secondary-container'}`}>Registry Verified Status Active</p>
              </div>
            </motion.div>

            {/* Background Decorative Element */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[120%] h-[120%] rounded-full blur-[100px] opacity-30 ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-surface'}`} />
          </div>
        </div>
      </section>

      {/* Pay Your Fees The Easy Way - Refined */}
      <section className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center mb-20 relative z-10">
          <h2 className={`font-serif text-4xl md:text-5xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Pay Your BYU-Pathway Fees The Easy Way</h2>
          <p className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'} italic`}>Three synchronous steps to secure your academic enrollment</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className={`absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 hidden md:block ${theme === 'dark' ? 'bg-gold-border/20' : 'bg-gray-100'}`} />
          
          {[
            { step: '01', title: 'Link Account', desc: 'Secure connection to your regional financial node in seconds.', icon: <Zap className="w-8 h-8" />, color: theme === 'dark' ? 'bg-bg-card border border-gold-border' : 'bg-wholesome-container' },
            { step: '02', title: 'Verify Audit', desc: 'Real-time manual and automated auditing of your aid profile.', icon: <ShieldCheck className="w-8 h-8" />, color: theme === 'dark' ? 'bg-bg-card border border-accent/20' : 'bg-[#6dfe9c]' },
            { step: '03', title: 'Complete Sync', desc: 'Direct flow ensures the institution receives payment instantly.', icon: <CheckCircle className="w-8 h-8" />, color: theme === 'dark' ? 'bg-accent text-black' : 'bg-primary-container' }
          ].map((item, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className={`p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all group relative z-10 text-center ${theme === 'dark' ? 'bg-bg-card/50 border border-gold-border/20' : 'bg-white border border-gray-100'}`}
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-6 transition-transform`}>
                {item.icon}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-[4px] mb-4 ${theme === 'dark' ? 'text-accent' : 'text-gray-400'}`}>{item.step} // Node Process</div>
              <h3 className={`font-serif text-2xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ads Re-Integrated & Polished */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Ad 1: Process Highlights */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`rounded-[50px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative group border-2 ${theme === 'dark' ? 'bg-bg-card border-gold-border/20' : 'bg-white border-wholesome-primary/10'}`}
          >
            <div className="md:w-2/5 relative">
              <div className={`w-72 h-72 rounded-full border-[12px] overflow-hidden shadow-2xl relative z-10 ${theme === 'dark' ? 'border-accent/10' : 'border-wholesome-surface'}`}>
                <img 
                  className="w-full h-full object-cover" 
                  alt="Advisor" 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={`absolute -top-4 -right-4 p-4 rounded-2xl shadow-lg rotate-12 z-20 border ${theme === 'dark' ? 'bg-accent border-black text-black' : 'bg-[#6dfe9c] border-white'}`}>
                 <Lock className="w-6 h-6" />
              </div>
            </div>
            <div className="md:w-3/5 space-y-8 relative z-10 text-left">
              <div className={`text-[10px] font-black uppercase tracking-[5px] px-4 py-2 rounded-full inline-block ${theme === 'dark' ? 'bg-accent/10 text-accent' : 'bg-wholesome-surface text-wholesome-primary'}`}>
                Registry Support // Active
              </div>
              <h2 className={`font-serif text-4xl md:text-6xl leading-tight tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Need Help Paying Your School Fees?</h2>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>Our dedicated registry team is ready to guide you through synchronous fee resolution and auditing. No obstacle is too great for your educational path.</p>
              <Link 
                to="/support"
                className={`inline-flex items-center gap-4 text-xl font-bold transition-all group ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} hover:gap-6`}
              >
                Contact Support Team <ArrowRight className="w-6 h-6 transition-transform" />
              </Link>
            </div>
            <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[100px] -z-10 translate-x-1/2 translate-y-1/2 ${theme === 'dark' ? 'bg-accent/5' : 'bg-wholesome-surface/50'}`} />
          </motion.div>
        </div>
      </section>

      {/* Global Nodes - Wholesome Cards with Tech Data */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-bg-deep' : 'bg-wholesome-bg'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <p className={`text-xs font-black uppercase tracking-[6px] opacity-60 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Verified Infrastructure</p>
              <h2 className={`font-serif text-4xl md:text-6xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Global Nodes</h2>
            </div>
            <Link to="/login" className={`font-bold flex items-center gap-2 hover:underline ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
              View all institutions <Globe className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {institutions.map((inst, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-[40px] shadow-sm transition-all group overflow-hidden border ${theme === 'dark' ? 'bg-bg-card border-gold-border/20 hover:border-gold-border hover:shadow-2xl' : 'bg-white border-gray-100 hover:shadow-2xl'}`}
              >
                <div className="h-64 rounded-[32px] overflow-hidden mb-6 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src={inst.image} alt={inst.name} />
                  <div className={`absolute top-4 right-4 backdrop-blur px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest shadow-xl ${theme === 'dark' ? 'bg-black/80 border-accent/20 text-accent' : 'bg-white/90 border-white/20 text-black'}`}>
                    {inst.tag}
                  </div>
                </div>
                <div className="p-8 pt-0 space-y-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-accent/10' : 'bg-wholesome-surface'}`}>
                      {inst.icon}
                    </div>
                    <h3 className={`font-serif text-2xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{inst.name}</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>{inst.description}</p>
                  <Link to="/login" className={`inline-flex items-center font-bold group gap-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} >
                    Begin Process <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Transparency - Hardened & Wholesome */}
      <section className={`py-24 border-y ${theme === 'dark' ? 'bg-black border-gold-border/10' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h2 className={`font-serif text-4xl md:text-5xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Financial Transparency</h2>
          <p className={`italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>Vetted, immutable, and synchronous audit trails for every academic dollar.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={`p-12 rounded-[50px] flex flex-col md:flex-row gap-8 group ${theme === 'dark' ? 'bg-bg-card' : 'bg-wholesome-bg'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border group-hover:rotate-6 transition-transform ${theme === 'dark' ? 'bg-black border-gold-border' : 'bg-white border-gray-100'}`}>
              <CreditCard className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'} w-8 h-8`} />
            </div>
            <div className="space-y-4 text-left">
              <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-black'}`}>Direct Flow Payments</h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>Funds move directly from verified regional accounts to institutional registries, eliminating high-latency intermediaries and reducing transmission failure rates globally.</p>
            </div>
          </div>
          <div className={`p-12 rounded-[50px] flex flex-col md:flex-row gap-8 group ${theme === 'dark' ? 'bg-bg-card' : 'bg-wholesome-bg'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border group-hover:-rotate-6 transition-transform ${theme === 'dark' ? 'bg-black border-gold-border' : 'bg-white border-gray-100'}`}>
              <Lock className={`${theme === 'dark' ? 'text-accent' : 'text-wholesome-secondary'} w-8 h-8`} />
            </div>
            <div className="space-y-4 text-left">
              <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-black'}`}>Registry Audit Trail</h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>Every transaction generates an immutable registry ID, providing a secure audit trail accessible to both verified students and financial administrators for complete reconciliation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Blended */}
      <footer className={`w-full py-16 border-t ${theme === 'dark' ? 'bg-black border-gold-border/20' : 'bg-wholesome-bg border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
            <div className="space-y-4 text-center md:text-left">
              <BrandingLogo className="h-12" />
              <p className={`font-body text-sm max-w-xs ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>© 2026 Scholars Tuition & Registry Portal. Empowering sacred academic journeys globally.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              {['Privacy Policy', 'Terms of Service', 'Financial Aid', 'Contact Support'].map((link) => (
                <a key={link} className={`transition-colors text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`} href="#">{link}</a>
              ))}
            </div>
          </div>
          <div className={`flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-6 ${theme === 'dark' ? 'border-gold-border/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className={`text-[10px] font-black uppercase tracking-[4px] ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Registry Infrastructure Active // v4.2.1-prod</span>
            </div>
            <div className="flex gap-8">
              <span className={`text-[8px] font-mono uppercase tracking-[2px] ${theme === 'dark' ? 'text-accent/40' : 'text-gray-300'}`}>SECURED BY AES-256</span>
              <span className={`text-[8px] font-mono uppercase tracking-[2px] ${theme === 'dark' ? 'text-accent/40' : 'text-gray-300'}`}>PROTOCOL: DIRECT SYNC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
