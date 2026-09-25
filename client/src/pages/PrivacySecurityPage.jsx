import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, FileText, KeyRound } from 'lucide-react';

export default function PrivacySecurityPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Lock className="w-3.5 h-3.5" /> Security & Privacy Charter
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy, Cryptography & Data Governance
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          How NyayMadad protects citizen statements, handles sensitive evidence, and maintains immutable audit accountability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Data Minimization Principle</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We collect only the factual incident data required for formal public grievance intake and departmental investigation. Raw biometric or unnecessary personal identity data is never persistently stored on application nodes.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">SHA-256 Evidence Hashing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All submitted screenshots, bank PDFs, audio files, and photographs are processed with NIST-compliant SHA-256 cryptographic hashing. The digital fingerprint is permanently recorded in the case ledger to prove un-tampered authenticity.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict server-side authorization boundaries guarantee that citizens can only access their own files, while investigating officers can only review cases within their assigned jurisdictional remit.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Immutable Audit Trails</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every critical action—viewing evidence, updating case status, reassigning officers, or transferring departments—generates a tamper-resistant audit event with timestamp and actor attribution.
          </p>
        </div>
      </div>
    </div>
  );
}
