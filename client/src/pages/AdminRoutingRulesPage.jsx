import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Layers,
  AlertCircle,
  Building
} from 'lucide-react';
import api from '../api/client';

export default function AdminRoutingRulesPage() {
  const [rules, setRules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('*');
  const [jurisdiction, setJurisdiction] = useState('ALL');
  const [departmentId, setDepartmentId] = useState('');
  const [channel, setChannel] = useState('DIRECT_DISPATCH');
  const [priority, setPriority] = useState(50);
  const [creating, setCreating] = useState(false);

  const fetchRulesAndDepts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesRes, deptsRes] = await Promise.all([
        api.get('/admin/routing-rules'),
        api.get('/admin/departments'),
      ]);

      if (rulesRes.success && rulesRes.data?.rules) {
        setRules(rulesRes.data.rules);
      }
      if (deptsRes.success && deptsRes.data?.departments) {
        setDepartments(deptsRes.data.departments);
      }
    } catch (err) {
      setError(err.message || 'Failed to load routing rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRulesAndDepts();
  }, []);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!ruleName || !category || !departmentId) return;

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/admin/routing-rules', {
        name: ruleName,
        category,
        subcategory,
        jurisdiction,
        departmentId,
        channel,
        priority: Number(priority),
      });

      if (res.success) {
        setSuccess(`Routing rule "${ruleName}" successfully created.`);
        setModalOpen(false);
        setRuleName('');
        setCategory('');
        await fetchRulesAndDepts();
      }
    } catch (err) {
      setError(err.message || 'Failed to create rule.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this deterministic routing rule?')) return;
    try {
      const res = await api.delete(`/admin/routing-rules/${ruleId}`);
      if (res.success) {
        setSuccess('Rule removed successfully.');
        await fetchRulesAndDepts();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete rule.');
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deterministic Routing Rules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Rules-based engine that routes incident categories directly to verified authorized public units without AI hallucination.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Routing Rule</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading active routing policies...</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Category Matching</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Target Department</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold font-mono text-[10px] text-slate-800">
                      #{r.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-nyay-800">{r.category}</span>
                    <span className="text-slate-400 text-[10px] block">Sub: {r.subcategory}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.jurisdiction}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.departmentId?.name || 'Assigned Desk'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {r.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteRule(r._id)}
                      className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add Rule */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Add Deterministic Routing Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Rule Name:</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Cyber Banking Phishing Direct Routing"
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Category:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Cyber Crime"
                    className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Subcategory (* for all):</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="*"
                    className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Target Department:</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose destination unit --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Dispatch Channel:</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  >
                    <option value="DIRECT_DISPATCH">Direct Dispatch</option>
                    <option value="ELECTRONIC_API">Electronic API</option>
                    <option value="MANUAL_QUEUE">Manual Queue</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Priority (1-100):</label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save Routing Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
