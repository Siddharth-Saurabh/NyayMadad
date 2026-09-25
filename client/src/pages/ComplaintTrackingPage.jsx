import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Building, 
  UserCheck, 
  Clock, 
  FileText, 
  Download, 
  AlertCircle, 
  Send, 
  HelpCircle,
  Lock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import TimelineView from '../components/TimelineView';
import EvidenceUploader from '../components/EvidenceUploader';

export default function ComplaintTrackingPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [infoRequests, setInfoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response to Info Request state
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(null);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [compRes, timeRes, evidRes, infoRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/complaints/${id}/timeline`),
        api.get(`/complaints/${id}/evidence`).catch(() => ({ success: true, data: { evidenceList: [] } })),
        api.get(`/complaints/${id}/info-requests`).catch(() => ({ success: true, data: { infoRequests: [] } })),
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
      if (infoRes.success && infoRes.data?.infoRequests) {
        setInfoRequests(infoRes.data.infoRequests);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const handleRespondToRequest = async (requestId) => {
    if (!responseText.trim()) return;
    setSubmittingResponse(true);
    setResponseSuccess(null);

    try {
      const res = await api.post(`/info-requests/${requestId}/respond`, {
        response: responseText.trim(),
      });

      if (res.success) {
        setResponseText('');
        setResponseSuccess('Clarification successfully submitted to the investigating officer.');
        await fetchCaseDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit clarification.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nyay-700 mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Retrieving official case records...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error || 'Complaint record not found.'}</span>
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-nyay-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Citizen Dashboard
        </Link>
      </div>
    );
  }

  const pendingRequest = infoRequests.find(r => r.status === 'PENDING');

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-slate-400">
          Last updated: {new Date(complaint.updatedAt).toLocaleString()}
        </span>
      </div>

      {/* Case Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-nyay-950">
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Category: <strong className="text-slate-800">{complaint.category}</strong> {complaint.subcategory ? `• ${complaint.subcategory}` : ''}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Filed On</span>
            <p className="text-xs font-semibold text-slate-800">
              {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Assigned Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" /> Designated Department
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {complaint.assignedDepartment?.name || 'Awaiting Routing Dispatch'}
            </p>
            {complaint.assignedDepartment?.contactPhone && (
              <p className="text-[11px] text-slate-500">Helpline: {complaint.assignedDepartment.contactPhone}</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" /> Investigating Officer
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {complaint.assignedOfficer ? complaint.assignedOfficer.name : 'Pending Desk Assignment'}
            </p>
            {complaint.assignedOfficer?.badgeNumber && (
              <p className="text-[11px] text-slate-500">Badge: {complaint.assignedOfficer.badgeNumber}</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Assigned Urgency
            </span>
            <p className={`text-xs font-extrabold mt-1 ${
              complaint.urgency === 'Emergency' ? 'text-red-600' : 'text-slate-900'
            }`}>
              {complaint.urgency} Priority
            </p>
            <p className="text-[11px] text-slate-500">
              {complaint.requiresEmergencyResponse ? 'Immediate field alert sent' : 'Standard procedural track'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Required: Officer Information Request Box */}
      {pendingRequest && (
        <div className="civic-card p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                Official Information Requested
              </h3>
              <p className="text-xs text-amber-900 mt-1 font-medium">
                Investigating Officer <strong className="text-amber-950">{pendingRequest.officerName}</strong> has requested clarification:
              </p>
              <div className="mt-2 p-3 bg-white/90 rounded-xl border border-amber-200 text-xs text-slate-900 font-semibold italic">
                "{pendingRequest.question}"
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-amber-950">Your Clarification / Response:</label>
            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Provide the requested details (e.g. transaction ID, exact timing, names)..."
              className="w-full text-xs p-3 border border-amber-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-600 focus:outline-none"
            />
            {responseSuccess && (
              <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{responseSuccess}</span>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRespondToRequest(pendingRequest._id)}
                disabled={!responseText.trim() || submittingResponse}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingResponse ? 'Submitting...' : 'Submit Clarification'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Complaint Statement & Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Confirmed Statement */}
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileText className="w-4 h-4 text-nyay-700" /> Formal Complaint Statement
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
              {complaint.citizenEditedComplaint || complaint.originalStatement}
            </div>

            {complaint.resolutionSummary && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <p className="text-xs font-bold text-emerald-900">Official Case Resolution Summary:</p>
                <p className="text-xs text-emerald-800">{complaint.resolutionSummary}</p>
              </div>
            )}
          </div>

          {/* Attached Evidence Records */}
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" /> Protected Evidence ({evidenceList.length})
              </h3>
              <span className="text-[11px] text-slate-400">Cryptographically Verified</span>
            </div>

            {evidenceList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                No evidence files uploaded with this complaint.
              </p>
            ) : (
              <div className="space-y-2">
                {evidenceList.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs transition"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{ev.originalFileName}</span>
                        <span className="text-[10px] px-2 py-0.2 bg-emerald-100 text-emerald-800 font-mono rounded font-bold">
                          {ev.integrityStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        SHA-256: {ev.fileHash}
                      </p>
                    </div>

                    <a
                      href={`/api/evidence/${ev._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-nyay-700 hover:text-nyay-900 hover:bg-white rounded-lg border border-slate-200 transition"
                      title="Download Evidence"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Allow uploading additional evidence if case is active */}
            {!['RESOLVED', 'CLOSED'].includes(complaint.status) && (
              <div className="pt-2">
                <EvidenceUploader
                  complaintId={complaint._id}
                  onUploadSuccess={fetchCaseDetails}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Progress Timeline */}
        <div className="space-y-4">
          <div className="civic-card p-6 bg-white border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-nyay-700" /> Case Timeline & Audit Log
            </h3>
            <TimelineView timeline={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
