import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, User, ShieldCheck, Clock, MessageSquare, AlertCircle, 
  CheckCircle2, Loader2, Info, ChevronRight, Minimize2, Maximize2, 
  Layout, Cpu, Terminal, BookOpen, HelpCircle
} from 'lucide-react';
import { Paperclip, Image, Mic, MoreVertical, Search, Smile, CheckCheck, XCircle } from 'lucide-react';
import { useAuth, useTheme } from '../App';
import { mockDb } from '../lib/mockDb';
import { ChatMessage, CourseRegistration, ChatSession } from '../types';
import { GoogleGenAI } from "@google/genai";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for videos/large files

const REGISTRATION_PROBLEMS = [
  "Course not appearing in student portal",
  "Waitlist status for core requirements",
  "Incorrect credit evaluation (Transfer)",
  "Tuition payment not reflecting in BYU-I",
  "Prerequisite override request",
  "Withdrawal deadline inquiry",
  "Degree plan advising error",
  "Ensign College to BYU-I transition"
];

export default function Support() {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [selectedReg, setSelectedReg] = useState<CourseRegistration | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [attachment, setAttachment] = useState<ChatMessage['attachment']>(undefined);

  useEffect(() => {
    if (user) {
      const activeSession = mockDb.getStudentSession(user.uid);
      if (activeSession) {
        setCurrentSession(activeSession);
      } else {
        const newSession = mockDb.createSession(user.uid);
        setCurrentSession(newSession);
      }

      const data = mockDb.getChats();
      // Filter chats for this user (or all if admin)
      if (profile?.role === 'admin') {
        setMessages(data);
      } else {
        setMessages(data.filter(m => m.senderId === user?.uid || (m.senderRole === 'admin' && m.content.includes(user?.email || ''))));
      }

      const regs = mockDb.getRegistrations(user.uid);
      setRegistrations(regs);
    }
  }, [user, profile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Maximum size is 50MB.");
      return;
    }

    setAttachment({
      url: URL.createObjectURL(file),
      type: type === 'video' ? 'file' : type, // mapping video to file for simplified display or handle separately
      name: file.name,
      size: file.size
    });
  };

  const handleFeedback = (satisfied: boolean) => {
    if (!currentSession) return;
    
    const status = satisfied ? 'satisfied' : 'unsatisfied';
    const updatedSession = { 
      ...currentSession, 
      status, 
      resolvedAt: new Date().toISOString() 
    };
    mockDb.saveSession(updatedSession);
    setCurrentSession(updatedSession);

    // Add system message about resolution
    const systemMsg: Omit<ChatMessage, 'id'> = {
      senderId: 'system',
      senderRole: 'system',
      content: satisfied ? "User is satisfied with the assistance. Session archiving..." : "User requested more help. A representative will extend for 5 mins.",
      timestamp: new Date().toISOString(),
      isRead: true
    };
    mockDb.addChatMessage(systemMsg);
    setMessages(prev => [...prev, mockDb.addChatMessage(systemMsg)]);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    let finalInput = input;
    if (selectedReg || selectedProblem) {
      const context = `[CONTEXT: RegistrationID=${selectedReg?.id || 'N/A'}, Course=${selectedReg?.courseCode || 'N/A'}, ProblemType=${selectedProblem || 'General'}] `;
      finalInput = context + input;
    }

    const userMsg: Omit<ChatMessage, 'id'> = {
      senderId: user.uid,
      senderRole: 'student',
      content: input, // Show clean input to user
      timestamp: new Date().toISOString(),
      isRead: false,
      attachment: attachment ? { ...attachment } : undefined
    };

    const savedUserMsg = mockDb.addChatMessage(userMsg);
    setMessages(prev => [...prev, savedUserMsg]);
    setInput('');
    setAttachment(undefined);
    setLoading(true);

    // AI Response (Framed as Customer Care Rep)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const history = messages.slice(-10).map(m => `${m.senderRole}: ${m.content}`).join('\n');
      
      const prompt = `You are a Senior Customer Care Representative for the Scholars Help Desk (Tuition & Registry Portal).
      Your goal is to assist students with their tuition payments and course registrations for BU-Pathway, Ensign College, or BYU-Idaho.
      
      CRITICAL CONTEXT:
      - Selected Course: ${selectedReg ? `${selectedReg.courseCode} - ${selectedReg.courseName} (${selectedReg.institution})` : 'None Selected'}
      - Problem Category: ${selectedProblem || 'General Inquiry'}
      
      Registry Protocol:
      1. Frame every response as "Scholars Help Desk Representative".
      2. If a specific course is linked, address it directly (e.g., "I see you are inquiring about your ${selectedReg?.courseCode} registration").
      3. For BYU-Idaho or BYU-Pathway related issues, mention that our registry logs are synced with the Church Education System (CES).
      4. Be concise, professional, and helpful.
      
      User Information: ${user.email} (${user.uid})
      
      Conversation history:
      ${history}
      
      User message: ${finalInput}
      
      Respond as the Customer Care Rep.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const aiMsg: Omit<ChatMessage, 'id'> = {
        senderId: 'system-ai',
        senderRole: 'admin',
        content: response.text || "Our system is currently processing high traffic. A representative will be with you shortly.",
        timestamp: new Date().toISOString(),
        isRead: false
      };

      const savedAiMsg = mockDb.addChatMessage(aiMsg);
      setMessages(prev => [...prev, savedAiMsg]);
      
    } catch (err) {
      console.error("Support AI failure:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsMinimized(false)}
          className={`p-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform ${theme === 'dark' ? 'bg-accent text-black' : 'bg-wholesome-primary text-white'}`}
        >
          <MessageSquare className="w-5 h-5" />
          Live registry channel
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'text-text-main' : 'text-gray-900'}`}>
      <header className={`mb-6 flex items-center justify-between border-b pb-6 ${theme === 'dark' ? 'border-gold-border' : 'border-gray-100'}`}>
        <div>
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px] mb-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
            <Cpu className="w-3 h-3" /> Secure P2P Channel: ACTIVE
          </div>
          <h1 className={`text-3xl font-serif font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Scholars Chat Desk</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 border ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
              Online: {currentSession?.representativeName || 'Rep Chidinma'}
            </span>
          </div>
        </div>
      </header>

      <div className={`flex-1 border shadow-2xl flex relative overflow-hidden ${theme === 'dark' ? 'bg-bg-card border-gold-border' : 'bg-white border-gray-100'}`}>
        {/* Sidebar: Identity & Registrations - Bybit style */}
        <div className={`hidden lg:flex w-80 border-r flex-col overflow-y-auto custom-scrollbar-vertical ${theme === 'dark' ? 'border-gold-border/20 bg-bg-deep/50' : 'border-gray-50 bg-gray-50/50'}`}>
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-50'}`}>
            <div className={`text-[10px] font-black uppercase tracking-[3px] mb-4 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Registry Identity</div>
            <div className={`p-4 border ${theme === 'dark' ? 'bg-white/5 border-gold-border/10' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 border flex items-center justify-center ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-wholesome-surface border-wholesome-primary/10 text-wholesome-primary'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase truncate max-w-[120px]">{user?.displayName}</div>
                  <div className={`text-[9px] font-mono ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{user?.uid}</div>
                </div>
              </div>
              <div className={`space-y-2 border-t pt-3 ${theme === 'dark' ? 'border-gold-border/10' : 'border-gray-50'}`}>
                <div className={`flex justify-between text-[8px] uppercase tracking-widest font-black ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                  <span>Institution</span>
                  <span className={theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}>{profile?.currentClassOrProgram || 'Loading...'}</span>
                </div>
                <div className={`flex justify-between text-[8px] uppercase tracking-widest font-black ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                  <span>Risk Level</span>
                  <span className="text-green-500">Normal</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-50'}`}>
            <div className={`text-[10px] font-black uppercase tracking-[3px] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-current ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
               <BookOpen className="w-3 h-3" /> Active Registrations
            </div>
            <div className="space-y-3">
              {registrations.length > 0 ? registrations.map(reg => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedReg(selectedReg?.id === reg.id ? null : reg)}
                  className={`w-full text-left p-3 border transition-all group ${
                    selectedReg?.id === reg.id 
                      ? (theme === 'dark' ? 'border-accent bg-accent/5' : 'border-wholesome-primary bg-wholesome-surface') 
                      : (theme === 'dark' ? 'border-gold-border/10 bg-white/2 hover:bg-white/5' : 'border-gray-100 bg-white hover:bg-gray-50')
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-black transition-colors ${theme === 'dark' ? 'text-text-main group-hover:text-accent' : 'text-black group-hover:text-wholesome-primary'}`}>{reg.courseCode}</span>
                    <span className={`text-[7px] uppercase px-1.5 py-0.5 font-bold ${
                      reg.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                  <div className={`text-[9px] truncate lowercase font-mono opacity-70 italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>{reg.courseName}</div>
                </button>
              )) : (
                <div className={`text-[9px] italic ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>No active registrations synced.</div>
              )}
            </div>
            <p className={`text-[8px] mt-4 leading-relaxed tracking-wider uppercase font-mono ${theme === 'dark' ? 'text-text-muted/50' : 'text-gray-400'}`}>
              Select a course to link it to the chat session. This allows for specific registry investigation.
            </p>
          </div>

          <div className="p-6 flex-1">
            <div className={`text-[10px] font-black uppercase tracking-[3px] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-current ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
              <HelpCircle className="w-3 h-3" /> Problem Categories
            </div>
            <div className="grid grid-cols-1 gap-2">
              {REGISTRATION_PROBLEMS.map(prob => (
                <button
                  key={prob}
                  onClick={() => setSelectedProblem(selectedProblem === prob ? '' : prob)}
                  className={`text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                    selectedProblem === prob 
                      ? (theme === 'dark' ? 'bg-accent text-black border-accent' : 'bg-wholesome-primary text-white border-wholesome-primary') 
                      : (theme === 'dark' ? 'bg-transparent text-text-muted border-gold-border/20 hover:border-accent/40 hover:text-text-main' : 'bg-transparent text-gray-400 border-gray-100 hover:border-wholesome-primary/40 hover:text-black')
                  }`}
                >
                  {prob}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 border-t ${theme === 'dark' ? 'border-gold-border/20' : 'border-gray-50'}`}>
             <div className={`flex items-center gap-2 text-[9px] font-mono ${theme === 'dark' ? 'text-accent/40' : 'text-wholesome-primary/40'}`}>
               <ShieldCheck className="w-3 h-3" /> E2E_ENCRYPTED_SESSION
             </div>
          </div>
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col relative ${theme === 'dark' ? 'bg-bg-deep' : 'bg-[#e5ddd5]'}`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://pic-cdn.static-bytedance.com/img/vibrant/1920/1080')] bg-repeat" />

          <div className={`p-3 text-white flex items-center justify-between z-10 shadow-md ${theme === 'dark' ? 'bg-[#262d31]' : 'bg-[#075e54]'}`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full flex items-center justify-center text-white ring-1 ring-white/30 overflow-hidden bg-white/20">
                 <img 
                   src="https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1974&auto=format&fit=crop" 
                   alt="Rep Chidinma" 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
               </div>
               <div>
                 <span className="text-[14px] font-bold tracking-tight">{currentSession?.representativeName || 'Rep Chidinma'}</span>
                 <div className="text-[10px] opacity-80 leading-none flex items-center gap-1">
                   <div className="w-2 h-2 bg-green-400 rounded-full" /> Online
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 opacity-70 cursor-pointer" />
              <MoreVertical className="w-5 h-5 opacity-70 cursor-pointer" />
              <button 
                onClick={() => setIsMinimized(true)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {(selectedReg || selectedProblem) && (
            <div className={`p-3 flex items-center justify-between gap-4 border-b ${theme === 'dark' ? 'bg-accent/10 border-accent/20' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>
                  <div className={`w-1 h-3 ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
                  Context Active
                </div>
                <div className="flex gap-2">
                   {selectedReg && (
                     <div className={`px-2 py-0.5 border text-[8px] font-bold rounded-sm ${theme === 'dark' ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                       Course: {selectedReg.courseCode}
                     </div>
                   )}
                   {selectedProblem && (
                     <div className={`px-2 py-0.5 border text-[8px] font-bold rounded-sm ${theme === 'dark' ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-wholesome-primary/10 border-wholesome-primary/20 text-wholesome-primary'}`}>
                       Problem: {selectedProblem}
                     </div>
                   )}
                </div>
              </div>
              <button 
                onClick={() => { setSelectedReg(null); setSelectedProblem(''); }}
                className={`text-[8px] font-black uppercase tracking-widest underline ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`}
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar-vertical" ref={scrollRef}>
            <div className="mx-auto max-w-sm text-center">
              <div className={`inline-block px-4 py-1.5 border text-[8px] font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'bg-accent/5 border-accent/20 text-accent' : 'bg-wholesome-surface border-wholesome-primary/20 text-wholesome-primary'}`}>
                Session Started: {new Date().toLocaleTimeString()}
              </div>
              <p className={`text-[9px] uppercase tracking-[2px] leading-relaxed ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                 NOTICE: You are currently chatting with an official Scholars Registry Representative. All interactions are logged for audit compliance.
              </p>
            </div>

            <AnimatePresence>
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.senderRole === 'student' ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div className={`max-w-[85%] ${m.senderRole === 'student' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-3 py-2 text-[13px] shadow-sm relative ${
                      m.senderRole === 'student' 
                        ? (theme === 'dark' ? 'bg-[#056162] text-white rounded-lg rounded-tr-none' : 'bg-[#dcf8c6] text-black rounded-lg rounded-tr-none') 
                        : (theme === 'dark' ? 'bg-[#262d31] text-white rounded-lg rounded-tl-none' : 'bg-white text-black rounded-lg rounded-tl-none')
                    }`}>
                      {m.attachment && (
                        <div className={`mb-2 border-b pb-2 ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                          {m.attachment.type === 'image' && (
                            <img src={m.attachment.url} alt="at" className="max-w-full rounded h-auto" />
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Paperclip className={`w-3 h-3 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                            <span className="text-[10px] font-bold">{m.attachment.name}</span>
                            <span className="text-[8px] opacity-50">{(m.attachment.size / (1024*1024)).toFixed(2)}MB</span>
                          </div>
                        </div>
                      )}
                      <p className="leading-snug">{m.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] opacity-40 font-mono tracking-tighter">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {m.senderRole === 'student' && <CheckCheck className={`w-3 h-3 ${m.isRead ? 'text-blue-400' : 'text-gray-400 opacity-40'}`} />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Satisfaction Buttons */}
              {messages.length > 5 && currentSession?.status === 'active' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-6 gap-3">
                  <button 
                    onClick={() => handleFeedback(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Satisfied
                  </button>
                  <button 
                    onClick={() => handleFeedback(false)}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                  >
                    <AlertCircle className="w-4 h-4" /> Please Help
                  </button>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`p-4 border flex items-center gap-3 ${theme === 'dark' ? 'bg-bg-card border-gold-border/20' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex gap-1">
                      <div className={`w-1.5 h-1.5 animate-bounce ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
                      <div className={`w-1.5 h-1.5 animate-bounce delay-75 ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
                      <div className={`w-1.5 h-1.5 animate-bounce delay-150 ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`}>Rep Analyzing Session...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSend} className={`p-3 border-t z-10 ${theme === 'dark' ? 'bg-[#1e2428] border-gold-border/20' : 'bg-[#f0f2f5] border-gray-100'}`}>
            {attachment && (
              <div className={`mb-2 p-2 border rounded flex items-center justify-between ${theme === 'dark' ? 'bg-accent/10 border-accent/20' : 'bg-wholesome-surface border-wholesome-primary/10'}`}>
                <div className="flex items-center gap-2">
                  <Paperclip className={`w-4 h-4 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
                  <span className="text-[10px] font-bold truncate max-w-[200px]">{attachment.name}</span>
                </div>
                <button onClick={() => setAttachment(undefined)} className="text-red-500"><XCircle className="w-4 h-4" /></button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-1">
                <Smile className={`w-6 h-6 cursor-pointer transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`} />
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'file')} />
                  <Paperclip className={`w-6 h-6 cursor-pointer transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`} />
                </label>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                  <Image className={`w-6 h-6 cursor-pointer transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`} />
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className={`w-full border-none rounded-full py-2.5 px-5 text-[14px] outline-none ${theme === 'dark' ? 'bg-[#33383b] text-text-main placeholder:text-text-muted/50' : 'bg-white text-black placeholder:text-gray-400'}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={currentSession?.status === 'satisfied'}
                />
              </div>
              <div className="flex items-center gap-2">
                {input.trim() || attachment ? (
                  <button
                    type="submit"
                    className="w-10 h-10 bg-[#00a884] flex items-center justify-center rounded-full text-white shadow-md hover:scale-105 transition-transform"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <Mic className={`w-6 h-6 cursor-pointer transition-colors ${theme === 'dark' ? 'text-text-muted hover:text-accent' : 'text-gray-400 hover:text-wholesome-primary'}`} />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
