import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  PhoneCall, 
  Bell, 
  User, 
  ChevronDown, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Layers, 
  LogOut,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';
import EmergencyModal from './EmergencyModal';

export default function Navbar() {
  const { user, role, switchPersona, notifications, unreadCount, currentPersona } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthority = ['officer', 'department_admin', 'system_admin'].includes(role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-tr from-nyay-700 to-nyay-500 rounded-xl shadow-inner group-hover:scale-105 transition">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-white">NyayMadad</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-nyay-800 text-nyay-300 border border-nyay-700">
                    Govt Portal
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden md:block">AI-Assisted Citizen Justice & Reporting</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {!isAuthority ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      location.pathname === '/dashboard' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Complaints
                  </Link>
                  <Link
                    to="/report"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      location.pathname === '/report' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Report Incident
                  </Link>
                  <Link
                    to="/how-it-works"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      location.pathname === '/how-it-works' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    How It Works
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/authority"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      location.pathname === '/authority' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Case Queue
                  </Link>
                  {role === 'system_admin' && (
                    <>
                      <Link
                        to="/admin/routing"
                        className={`px-3 py-1.5 rounded-lg transition ${
                          location.pathname === '/admin/routing' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Routing Engine
                      </Link>
                      <Link
                        to="/admin/audit"
                        className={`px-3 py-1.5 rounded-lg transition ${
                          location.pathname === '/admin/audit' ? 'bg-nyay-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Audit Logs
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Emergency Hotline Button */}
            <button
              onClick={() => setEmergencyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold shadow transition animate-pulse"
              title="Emergency Help 112"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 112</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationMenu(!showNotificationMenu);
                  setShowPersonaMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</span>
                    <span className="text-xs text-slate-500">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet. Updates about your complaints will appear here.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} className="p-3 hover:bg-slate-50 transition text-xs space-y-1">
                          <p className="font-semibold text-slate-900">{n.title}</p>
                          <p className="text-slate-600">{n.message}</p>
                          <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPersonaMenu(!showPersonaMenu);
                  setShowNotificationMenu(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
              >
                <div className="w-6 h-6 rounded-full bg-nyay-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentPersona.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold leading-none">{currentPersona.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentPersona.role.replace('_', ' ')}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-100 border-b border-slate-200">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Switch Persona / Role</p>
                    <p className="text-[11px] text-slate-500">Test different user permissions in real-time</p>
                  </div>
                  <div className="p-1 space-y-0.5">
                    {DEMO_PERSONAS.map((p) => (
                      <button
                        key={p.role}
                        onClick={() => {
                          switchPersona(p.role);
                          setShowPersonaMenu(false);
                          if (p.role === 'citizen') {
                            navigate('/dashboard');
                          } else {
                            navigate('/authority');
                          }
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                          role === p.role ? 'bg-nyay-50 font-semibold text-nyay-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 mt-0.5">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{p.name}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{p.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}
