import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  UserCheck, 
  Clock, 
  FileText, 
  Download, 
  AlertCircle, 
  Send, 
  HelpCircle, 
  Lock, 
  ArrowRightCircle, 
  CheckCircle2, 
  Check, 
  Building,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import TimelineView from '../components/TimelineView';
import { useAuth } from '../context/AuthContext';

export default function AuthorityComplaintDetail() {
  const { id } = useParams();
  const { user, role } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Action Modals State
  const [activeModal, setActiveModal] = useState(null); // 'STATUS' | 'ASSIGN' | 'INFO_REQUEST' | 'TRANSFER'
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields for Modals
  const [newStatus, setNewStatus] = useState('UNDER_REVIEW');
  const [statusNote, setStatusNote] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [infoQuestion, setInfoQuestion] = useState('');
  const [targetDeptId, setTargetDeptId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError(null);

      const [compRes, timeRes, evidRes, offRes, deptRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/complaints/${id}/timeline`),
        api.get(`/complaints/${id}/evidence`).catch(() => ({ success: true, data: { evidenceList: [] } })),
        api.get('/authority/officers').catch(() => ({ success: true, data: { officers: [] } })),
        api.get('/admin/departments').catch(() => ({ success: true, data: { departments: [] } })),
      ]);

      if (compRes.success && compRes.data?.complaint) {
        setComplaint(compRes.data.complaint);
      }
      if (timeRes.success && timeRes.data?.timeline) {
        setTimeline(timeRes.data.timeline);
      }
      if (evidRes.success && evidRes.data?.evidenceList) {
        setEvidenceList(evidRes.data.evidenceList);
      }
      if (offRes.success && offRes.data?.officers) {
        setOfficers(offRes.data.officers);
      }
      if (deptRes.success && deptRes.data?.departments) {
        setDepartments(deptRes.data.departments);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve case records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  // Handle Status Update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionSuccess(null);
    try {
      const res = await api.patch(`/authority/complaints/${id}/status`, {
        status: newStatus,
        note: statusNote,
        resolutionSummary: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? resolutionSummary : undefined,
      });
      if (res.success) {
        setActionSuccess(`Status transitioned to ${newStatus}`);
        setActiveModal(null);
        await fetchCase();
      }
    } catch (err) {
      setError(err.message || 'Status transition failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Officer Assignment
  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    if (!selectedOfficerId) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/authority/complaints/${id}/assign`, {
        officerId: selectedOfficerId,
        note: 'Assigned via Authority Portal',
      });
      if (res.success) {
        setActionSuccess('Officer assigned successfully.');
        setActiveModal(null);
        await fetchCase();
      }
    } catch (err) {
      setError(err.message || 'Officer assignment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Request Info
  const handleRequestInfo = async (e) => {
    e.preventDefault();
    if (!infoQuestion.trim()) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/authority/complaints/${id}/request-info`, {
        question: infoQuestion.trim(),
      });
      if (res.success) {
        setActionSuccess('Information request dispatched to citizen.');
        setActiveModal(null);
        setInfoQuestion('');
        await fetchCase();
      }
    } catch (err) {
      setError(err.message || 'Information request failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Case Transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!targetDeptId || !transferReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/authority/complaints/${id}/transfer`, {
        targetDepartmentId: targetDeptId,
        reason: transferReason.trim(),
      });
      if (res.success) {
        setActionSuccess('Case successfully transferred to target department.');
        setActiveModal(null);
        await fetchCase();
      }
    } catch (err) {
      setError(err.message || 'Case transfer failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nyay-700 mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Loading case file from secure queue...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error || 'Case file not found.'}</span>
        </div>
        <Link to="/authority" className="inline-flex items-center gap-1.5 text-xs font-bold text-nyay-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Authority Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/authority"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Queue</span>
        </Link>
        <span className="text-xs text-slate-400">
          Case ID: {complaint._id}
        </span>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Case Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-slate-900">
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Category: <strong className="text-slate-800">{complaint.category}</strong> {complaint.subcategory ? `• ${complaint.subcategory}` : ''}
            </p>
          </div>

          {/* Action Modals Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setNewStatus(complaint.status);
                setActiveModal('STATUS');
              }}
              className="px-3.5 py-2 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow-xs transition"
            >
              Update Status
            </button>

            <button
              onClick={() => setActiveModal('ASSIGN')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              Assign Officer
            </button>

            <button
              onClick={() => setActiveModal('INFO_REQUEST')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition"
            >
              Request Info
            </button>

            <button
              onClick={() => setActiveModal('TRANSFER')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Transfer Unit
            </button>
          </div>
        </div>

        {/* Info Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Citizen / Complainant</span>
            <p className="font-bold text-slate-900 mt-0.5">{complaint.userId?.name || 'Citizen'}</p>
            <p className="text-[11px] text-slate-500">{complaint.userId?.email || 'N/A'}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Department</span>
            <p className="font-bold text-slate-900 mt-0.5">{complaint.assignedDepartment?.name || 'Unassigned'}</p>
            <p className="text-[11px] text-slate-500">{complaint.assignedDepartment?.jurisdiction || ''}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Investigating Officer</span>
            <p className="font-bold text-slate-900 mt-0.5">{complaint.assignedOfficer?.name || 'Not Yet Assigned'}</p>
            <p className="text-[11px] text-slate-500">{complaint.assignedOfficer?.rank || ''}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Assessed Urgency</span>
            <p className={`font-bold mt-0.5 ${complaint.urgency === 'Emergency' ? 'text-red-600' : 'text-slate-900'}`}>
              {complaint.urgency} Priority
            </p>
            <p className="text-[11px] text-slate-500">Mode: {complaint.reportingMode || 'TEXT'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Separation of Information Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Layer 1: Citizen Provided Statement */}
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> 1. Citizen's Original Statement (Unfiltered)
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">Citizen Input</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
              {complaint.originalStatement}
            </div>
          </div>

          {/* Layer 2: AI-Assisted Fact Extraction */}
          <div className="civic-card p-6 bg-white border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" /> 2. AI-Assisted Information Extraction
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded">AI Assistive</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Financial Loss</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {complaint.extractedInformation?.financialLoss?.amount
                    ? `₹${complaint.extractedInformation.financialLoss.amount.toLocaleString('en-IN')}`
                    : 'None stated'}
                </p>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Suspects / Identifiers</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {complaint.extractedInformation?.suspects?.length > 0
                    ? complaint.extractedInformation.suspects.join(', ')
                    : 'Unidentified'}
                </p>
              </div>
            </div>
          </div>

          {/* Layer 3: Citizen Confirmed Formal Complaint */}
          <div className="civic-card p-6 bg-white border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Confirmed Complaint Document
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Citizen Confirmed</span>
            </div>
            <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
              {complaint.citizenEditedComplaint || complaint.aiGeneratedComplaint || complaint.originalStatement}
            </div>
          </div>

          {/* Layer 4: Attached Evidence */}
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" /> 4. Evidence Attachments ({evidenceList.length})
              </span>
              <span className="text-[11px] text-slate-400">Cryptographically Hashed</span>
            </div>
            {evidenceList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                No evidence documents attached.
              </p>
            ) : (
              <div className="space-y-2">
                {evidenceList.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{ev.originalFileName}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">SHA-256: {ev.fileHash}</p>
                    </div>
                    <a
                      href={`/api/evidence/${ev._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Timeline */}
        <div className="space-y-4">
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-nyay-700" /> Case History & Timeline
            </h3>
            <TimelineView timeline={timeline} />
          </div>
        </div>
      </div>

      {/* Modal 1: Status Transition */}
      {activeModal === 'STATUS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Transition Complaint Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Select New Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="INVESTIGATION">In Investigation</option>
                  <option value="RESOLVED">Resolved (Action Complete)</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Official Case Note:</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Note detailing reasons or investigative actions taken..."
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                />
              </div>

              {(newStatus === 'RESOLVED' || newStatus === 'CLOSED') && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Resolution Summary (for Citizen):</label>
                  <textarea
                    rows={2}
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    placeholder="Summary of action taken, recovery, or investigation closure..."
                    className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Officer */}
      {activeModal === 'ASSIGN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Assign Investigating Officer</h3>
            <form onSubmit={handleAssignOfficer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Select Officer:</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose active officer --</option>
                  {officers.map((off) => (
                    <option key={off._id} value={off._id}>
                      {off.name} ({off.rank} - {off.badgeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedOfficerId || actionLoading}
                  className="px-5 py-2 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {actionLoading ? 'Assigning...' : 'Assign Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Request Information */}
      {activeModal === 'INFO_REQUEST' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Request Information from Citizen</h3>
            <form onSubmit={handleRequestInfo} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Clarification Question:</label>
                <textarea
                  rows={4}
                  value={infoQuestion}
                  onChange={(e) => setInfoQuestion(e.target.value)}
                  placeholder="Specify the exact documentation, transaction number, or clarification needed..."
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!infoQuestion.trim() || actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {actionLoading ? 'Sending...' : 'Send Request to Citizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Transfer Case */}
      {activeModal === 'TRANSFER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Transfer Case to Another Department</h3>
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Target Department:</label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value)}
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose department --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Reason for Jurisdictional Transfer:</label>
                <textarea
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Explain jurisdiction mismatch or appropriate referral reasons..."
                  className="w-full text-xs mt-1 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nyay-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!targetDeptId || !transferReason.trim() || actionLoading}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {actionLoading ? 'Transferring...' : 'Execute Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
