import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  Lock, 
  Eye, 
  User, 
  AlertCircle, 
  FileText,
  RefreshCw
} from 'lucide-react';
import api from '../api/client';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/audit-logs', {
        params: { action: actionFilter === 'ALL' ? undefined : actionFilter, limit: 50 },
      });
      if (res.success && res.data?.logs) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      setError(err.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Audit & Compliance Trail</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable operational access records tracking evidence downloads, status mutations, officer assignments, and routing changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="STATUS_CHANGED">Status Changed</option>
            <option value="OFFICER_ASSIGNED">Officer Assigned</option>
            <option value="EVIDENCE_ACCESSED">Evidence Accessed</option>
            <option value="EVIDENCE_UPLOADED">Evidence Uploaded</option>
            <option value="INFORMATION_REQUESTED">Information Requested</option>
            <option value="CASE_TRANSFERRED">Case Transferred</option>
            <option value="ROUTING_CHANGED">Routing Policy Changed</option>
          </select>
        </div>
        <span className="text-xs text-slate-400">{logs.length} audit entries</span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading tamper-resistant audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Metadata Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{log.actorId?.name || log.actorRole}</span>
                      <span className="text-[10px] text-slate-400 block uppercase">[{log.actorRole}]</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {log.resourceType}: <span className="text-slate-400">{log.resourceId}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {JSON.stringify(log.metadata)}
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
