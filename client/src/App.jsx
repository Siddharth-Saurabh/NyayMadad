import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Citizen Pages
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportWizard from './pages/ReportWizard';
import ComplaintTrackingPage from './pages/ComplaintTrackingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';

// Authority & Admin Pages
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorityComplaintDetail from './pages/AuthorityComplaintDetail';
import AdminRoutingRulesPage from './pages/AdminRoutingRulesPage';
import AdminAuditLogsPage from './pages/AdminAuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                {/* Public & Citizen Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/report" element={<ReportWizard />} />
                <Route path="/track/:id" element={<ComplaintTrackingPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/privacy" element={<PrivacySecurityPage />} />

                {/* Authority Protected Routes */}
                <Route
                  path="/authority"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'department_admin', 'system_admin']}>
                      <AuthorityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/authority/complaints/:id"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'department_admin', 'system_admin']}>
                      <AuthorityComplaintDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/routing"
                  element={
                    <ProtectedRoute allowedRoles={['department_admin', 'system_admin']}>
                      <AdminRoutingRulesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit"
                  element={
                    <ProtectedRoute allowedRoles={['system_admin']}>
                      <AdminAuditLogsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
