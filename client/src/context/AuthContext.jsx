import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const DEMO_PERSONAS = [
  {
    role: 'citizen',
    name: 'Aarav Sharma',
    title: 'Citizen Complainant',
    email: 'citizen@nyaymadad.gov.in',
    badge: 'Citizen',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'officer',
    name: 'Inspector Vikram Rathore',
    title: 'Cyber Forensic Inspector',
    email: 'officer@nyaymadad.gov.in',
    badge: 'Investigating Officer',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    role: 'department_admin',
    name: 'ACP Priya Mukherjee',
    title: 'Assistant Commissioner of Police (Cyber Division)',
    email: 'deptadmin@nyaymadad.gov.in',
    badge: 'Department Admin',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'system_admin',
    name: 'Rajesh Nambiar',
    title: 'National Police Grid IT Admin',
    email: 'sysadmin@nyaymadad.gov.in',
    badge: 'System Admin',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('nyay_demo_role') || 'citizen');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setRole(res.data.user.role);
      }
    } catch (err) {
      console.warn('Profile fetch notice (using fallback state):', err.message);
      const fallbackPersona = DEMO_PERSONAS.find(p => p.role === role) || DEMO_PERSONAS[0];
      setUser({
        _id: 'mock_user_id',
        name: fallbackPersona.name,
        email: fallbackPersona.email,
        role: fallbackPersona.role,
        identityVerified: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Ignore notifications error in disconnected mode
    }
  };

  const switchPersona = async (newRole) => {
    localStorage.setItem('nyay_demo_role', newRole);
    setRole(newRole);
    try {
      const res = await api.post('/auth/demo-switch', { role: newRole });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Persona switch call fallback:', err.message);
      await fetchProfile();
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        notifications,
        unreadCount,
        switchPersona,
        refreshProfile: fetchProfile,
        refreshNotifications: fetchNotifications,
        currentPersona: DEMO_PERSONAS.find(p => p.role === role) || DEMO_PERSONAS[0],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
