import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Filter, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function AuthorityDashboard() {
  const { user, role } = useAuth();
  const [metrics, setMetrics] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsRes, complaintsRes] = await Promise.all([
        api.get('/authority/metrics'),
        api.get('/authority/complaints', {
          params: {
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            category: categoryFilter === 'ALL' ? undefined : categoryFilter,
            urgency: urgencyFilter === 'ALL' ? undefined : urgencyFilter,
            search: searchTerm || undefined,
          },
        }),
      ]);

      if (metricsRes.success && metricsRes.data?.metrics) {
        setMetrics(metricsRes.data.metrics);
      }
      if (complaintsRes.success && complaintsRes.data?.complaints) {
        setComplaints(complaintsRes.data.complaints);
      }
    } catch (err) {
      setError(err.message || 'Failed to load authority dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, categoryFilter, urgencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Authority Case Management</h1>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold uppercase tracking-wider">
              {role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{user?.name}</strong> • Official Public Grievance Queue
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="civic-card p-4 bg-white border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cases</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total || 0}</p>
        </div>

        <div className="civic-card p-4 bg-white border border-cyan-200 bg-cyan-50/30">
          <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">Under Review</span>
          <p className="text-2xl font-black text-cyan-900 mt-1">{metrics.underReview || 0}</p>
        </div>

        <div className="civic-card p-4 bg-white border border-amber-200 bg-amber-50/30">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Info Needed</span>
          <p className="text-2xl font-black text-amber-900 mt-1">{metrics.infoRequested || 0}</p>
        </div>

        <div className="civic-card p-4 bg-white border border-purple-200 bg-purple-50/30">
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Assigned</span>
          <p className="text-2xl font-black text-purple-900 mt-1">{metrics.assigned || 0}</p>
        </div>

        <div className="civic-card p-4 bg-white border border-indigo-200 bg-indigo-50/30">
          <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Investigation</span>
          <p className="text-2xl font-black text-indigo-900 mt-1">{metrics.investigation || 0}</p>
        </div>

        <div className="civic-card p-4 bg-white border border-emerald-200 bg-emerald-50/30">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Resolved</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{metrics.resolved || 0}</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NYAY ID, text, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ROUTED">Routed (New)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="INFORMATION_REQUESTED">Info Requested</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="INVESTIGATION">In Investigation</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nyay-700 mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading cases from authority queue...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No complaints currently match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Case Reference</th>
                  <th className="py-3.5 px-4">Category & Domain</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Officer</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-nyay-950 block">
                        {c.complaintNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{c.category}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{c.subcategory || 'Standard'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{c.userId?.name || 'Citizen'}</p>
                      <p className="text-[10px] text-slate-400">{c.userId?.phone || c.userId?.email || 'Verified'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.urgency === 'Emergency' ? 'bg-red-100 text-red-800' : c.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">
                        {c.assignedOfficer?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/authority/complaints/${c._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-[11px] transition shadow-xs"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
