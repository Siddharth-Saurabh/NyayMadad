import React from 'react';
import { Shield, Lock, FileCheck, Phone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Trust bar */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-nyay-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Public Service Portal</p>
              <p className="text-[11px] text-slate-400">Citizen-centric grievance resolution</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Protected Evidence</p>
              <p className="text-[11px] text-slate-400">SHA-256 integrity hash verification</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Deterministic Dispatch</p>
              <p className="text-[11px] text-slate-400">Jurisdiction-aware rules engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Human in the Loop</p>
              <p className="text-[11px] text-slate-400">Official review by assigned officers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-nyay-400" />
            <span className="font-bold text-white text-base tracking-tight">NyayMadad</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            “Tell us what happened. We’ll help you report it.” An assistive incident intake system for citizens across India.
          </p>
          <p className="text-[11px] text-slate-500">
            AI provides classification and complaint drafting assistance; authorized departmental officers retain full decision-making responsibility.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/report" className="hover:text-white transition">Report an Incident</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Track Existing Complaint</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
            <li><Link to="/help" className="hover:text-white transition">Help Center & FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">National Helplines</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><strong className="text-white">112</strong> — National All-in-One Emergency</li>
            <li><strong className="text-white">1930</strong> — Cyber Financial Fraud Reporting</li>
            <li><strong className="text-white">1091</strong> — Women in Distress Helpline</li>
            <li><strong className="text-white">1098</strong> — Childline India</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Privacy & Ethics</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/privacy" className="hover:text-white transition">Data Privacy & Protection</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">AI Ethics & Fairness Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Audit Log Transparency</Link></li>
            <li><span className="text-slate-500">Version 1.0 Production Release</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 NyayMadad. Built for civic safety, accessible justice, and accountable public service.
      </div>
    </footer>
  );
}
