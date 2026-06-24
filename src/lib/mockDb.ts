import { UserProfile, PaymentRecord, Notification, SystemConfig, ChatMessage, LoginRecord, CourseRegistration, ChatSession } from '../types';

const USERS_KEY = 'scholars_users';
const PAYMENTS_KEY = 'scholars_payments';
const NOTIFICATIONS_KEY = 'scholars_notifications';
const CONFIG_KEY = 'scholars_config';
const AUTH_KEY = 'scholars_auth_user';
const CHATS_KEY = 'scholars_chats';
const SESSIONS_KEY = 'scholars_chat_sessions';
const LOGIN_RECORDS_KEY = 'scholars_login_records';
const REGISTRATIONS_KEY = 'scholars_registrations';

export const mockDb = {
  // Auth
  getAuthUser: (): any => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  setAuthUser: (user: any) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Users
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: UserProfile) => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.uid === user.uid);
    if (index > -1) users[index] = user;
    else users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getUser: (uid: string) => {
    return mockDb.getUsers().find(u => u.uid === uid) || null;
  },
  updateUserProfile: (uid: string, updates: Partial<UserProfile>) => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index > -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },
  updatePasswordByEmail: (email: string, newPassword: string) => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index > -1) {
      users[index].password = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },

  // Payments
  getPayments: (): PaymentRecord[] => {
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => {
    const payments = mockDb.getPayments();
    const newPayment = { ...payment, id: Math.random().toString(36).substr(2, 9) };
    payments.push(newPayment as PaymentRecord);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return newPayment;
  },
  updatePayment: (id: string, updates: Partial<PaymentRecord>) => {
    const payments = mockDb.getPayments();
    const index = payments.findIndex(p => p.id === id);
    if (index > -1) {
      payments[index] = { ...payments[index], ...updates };
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    }
  },

  // Notifications
  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addNotification: (note: Omit<Notification, 'id'>) => {
    const notes = mockDb.getNotifications();
    const newNote = { ...note, id: Math.random().toString(36).substr(2, 9) };
    notes.push(newNote as Notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notes));
    return newNote;
  },
  updateNotification: (id: string, updates: Partial<Notification>) => {
    const notes = mockDb.getNotifications();
    const index = notes.findIndex(n => n.id === id);
    if (index > -1) {
      notes[index] = { ...notes[index], ...updates };
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notes));
    }
  },

  // Config
  getConfig: (): SystemConfig => {
    const data = localStorage.getItem(CONFIG_KEY);
    if (data) return JSON.parse(data);
    const initial: SystemConfig = {
      paymentAccountNumber: '3037868618',
      bankName: 'John Doe',
      bank: 'First Bank',
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: 'system'
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(initial));
    return initial;
  },
  saveConfig: (config: SystemConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  // Chats
  getChats: (): ChatMessage[] => {
    const data = localStorage.getItem(CHATS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => {
    const chats = mockDb.getChats();
    const newMsg = { ...msg, id: Math.random().toString(36).substr(2, 9) };
    chats.push(newMsg as ChatMessage);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    return newMsg;
  },
  markChatsAsRead: () => {
    const chats = mockDb.getChats();
    chats.forEach(c => c.isRead = true);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  // Sessions
  getSessions: (): ChatSession[] => {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  getStudentSession: (studentId: string): ChatSession | null => {
    const sessions = mockDb.getSessions();
    return sessions.find(s => s.studentId === studentId && s.status === 'active') || null;
  },
  saveSession: (session: ChatSession) => {
    const sessions = mockDb.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index > -1) sessions[index] = session;
    else sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },
  createSession: (studentId: string, representativeName?: string): ChatSession => {
    const session: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      representativeName: representativeName || 'Rep Chidinma',
      status: 'active',
      startedAt: new Date().toISOString()
    };
    mockDb.saveSession(session);
    return session;
  },

  // Login Records
  getLoginRecords: (): LoginRecord[] => {
    const data = localStorage.getItem(LOGIN_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addLoginRecord: (record: Omit<LoginRecord, 'id'>) => {
    const records = mockDb.getLoginRecords();
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    records.push(newRecord as LoginRecord);
    localStorage.setItem(LOGIN_RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  },

  // Registrations
  getRegistrations: (studentId?: string): CourseRegistration[] => {
    const data = localStorage.getItem(REGISTRATIONS_KEY);
    let regs: CourseRegistration[] = data ? JSON.parse(data) : [];
    
    // Seed data if empty
    if (regs.length === 0) {
      regs = [
        { id: 'reg1', studentId: 'student-demo', courseCode: 'GS 120', courseName: 'Life Skills', credits: 1, status: 'active', institution: 'BYU-Pathway Worldwide', semester: 'Spring 2026' },
        { id: 'reg2', studentId: 'student-demo', courseCode: 'ENG 101', courseName: 'English Composition', credits: 3, status: 'active', institution: 'BYU-Pathway Worldwide', semester: 'Spring 2026' },
        { id: 'reg3', studentId: 'student-demo', courseCode: 'PC 101', courseName: 'Professional Career', credits: 2, status: 'pending', institution: 'BYU-Pathway Worldwide', semester: 'Spring 2026' },
        { id: 'reg4', studentId: 'student-demo', courseCode: 'MATH 108', courseName: 'Math for the Real World', credits: 3, status: 'active', institution: 'BYU-Idaho', semester: 'Spring 2026' },
      ];
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));
    }

    if (studentId) {
      return regs.filter(r => r.studentId === studentId);
    }
    return regs;
  },
  addRegistration: (reg: Omit<CourseRegistration, 'id'>) => {
    const regs = mockDb.getRegistrations();
    const newReg = { ...reg, id: Math.random().toString(36).substr(2, 9) };
    regs.push(newReg as CourseRegistration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));
    return newReg;
  }
};
