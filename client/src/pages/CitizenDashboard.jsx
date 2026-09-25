import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/complaints', {
        params: { status: statusFilter === 'ALL' ? undefined : statusFilter },
      });
      if (res.success && res.data) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const filteredComplaints = complaints.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.complaintNumber?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term) ||
      c.originalStatement?.toLowerCase().includes(term)
    );
  });

  const activeCount = complaints.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const actionNeededCount = complaints.filter(c => c.status === 'INFORMATION_REQUESTED').length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;

  return (
    <div className="space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Citizen Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong className="text-slate-800">{user?.name || 'Citizen'}</strong>. Track and manage your reported incidents.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Incident</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="civic-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Complaints</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Currently in review or investigation</span>
        </div>

        <div className="civic-card p-5 bg-white border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Action Needed</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-900 mt-2">{actionNeededCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Clarification requested by authority</span>
        </div>

        <div className="civic-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Cases</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-slate-400">Official action completed</span>
        </div>
      </div>

      {/* Action Required Banner if any */}
      {actionNeededCount > 0 && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-bold text-amber-900">Officer Clarification Requested</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              An investigating authority has requested additional information for your active report. Please review and respond to prevent delays.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NYAY number, category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Drafts</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ROUTED">Routed</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="INFORMATION_REQUESTED">Info Requested</option>
            <option value="INVESTIGATION">In Investigation</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nyay-700 mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading your complaint records...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No complaints found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't filed any complaints matching this criteria yet.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-nyay-700 text-white text-xs font-bold shadow hover:bg-nyay-800 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report an Incident</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredComplaints.map((c) => (
              <div key={c._id} className="p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold font-mono text-nyay-900 bg-nyay-50 px-2 py-0.5 rounded border border-nyay-200">
                      {c.complaintNumber}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {c.category} {c.subcategory ? `• ${c.subcategory}` : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {c.citizenEditedComplaint || c.originalStatement}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.assignedDepartment && (
                      <span>Unit: <strong className="text-slate-600">{c.assignedDepartment.name}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/track/${c._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-nyay-50 hover:text-nyay-800 text-slate-700 text-xs font-bold border border-slate-200 transition"
                  >
                    <span>Track Case</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
