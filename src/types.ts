export type Role = 'student' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  password?: string;
  displayName: string;
  role: Role;
  avatarUrl?: string;
  currentClassOrProgram: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  studentId: string;
  studentEmail: string;
  fullName: string;
  studentUsername: string;
  studentPassword?: string;
  currentCity: string;
  accountNumber: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  institution: 'BYU-Pathway Worldwide' | 'Ensign College' | 'BYU-Idaho';
  adminFeedback?: string;
  isDishonest?: boolean;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  timestamp: string;
}

export interface SystemConfig {
  paymentAccountNumber: string;
  bankName: string;
  bank: string;
  updatedAt: string;
  lastUpdatedBy: string;
}

export interface CourseRegistration {
  id: string;
  studentId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  status: 'active' | 'pending' | 'dropped';
  institution: 'BYU-Pathway Worldwide' | 'Ensign College' | 'BYU-Idaho';
  semester: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'student' | 'admin' | 'system' | 'system-ai';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachment?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
    name: string;
    size: number;
  };
}

export type SessionStatus = 'active' | 'satisfied' | 'unsatisfied' | 'archived';

export interface ChatSession {
  id: string;
  studentId: string;
  representativeName?: string;
  status: SessionStatus;
  startedAt: string;
  resolvedAt?: string;
  linkedCourseCode?: string;
  problemCategory?: string;
}

export interface LoginRecord {
  id: string;
  userId: string;
  email: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
  role: Role;
}
