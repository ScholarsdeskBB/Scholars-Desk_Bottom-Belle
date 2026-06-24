import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile } from './types';
import { mockDb } from './lib/mockDb';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PayNow from './pages/PayNow';
import History from './pages/History';
import Inbox from './pages/Inbox';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import CourseAssistance from './pages/CourseAssistance';
import ProfileSettings from './pages/ProfileSettings';
import AdminLogin from './pages/AdminLogin';
import AdminSelection from './pages/AdminSelection';
import AdminCreate from './pages/AdminCreate';
import AdminSignIn from './pages/AdminSignIn';
import { AnimatePresence } from 'motion/react';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
}

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });
const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('light');
    }

    // Simulate auth check from localStorage
    const savedUser = mockDb.getAuthUser();
    if (savedUser) {
      setUser(savedUser);
      const userProfile = mockDb.getUser(savedUser.uid);
      setProfile(userProfile);
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Router>
          <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-bg-deep text-text-main' : 'bg-wholesome-bg text-gray-900'} font-sans`}>
            <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={user ? (profile?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-selection" element={<AdminSelection />} />
              <Route path="/admin-create" element={<AdminCreate />} />
              <Route path="/admin-signin" element={<AdminSignIn />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/pay" element={user ? <PayNow /> : <Navigate to="/login" />} />
              <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
              <Route path="/inbox" element={user ? <Inbox /> : <Navigate to="/login" />} />
              <Route path="/support" element={user ? <Support /> : <Navigate to="/login" />} />
              <Route path="/profile-settings" element={user ? <ProfileSettings /> : <Navigate to="/login" />} />
              <Route path="/registration-assistance" element={user ? <CourseAssistance /> : <Navigate to="/login" />} />
              <Route path="/admin" element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
