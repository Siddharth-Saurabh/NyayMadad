import React from 'react';
import { HelpCircle, PhoneCall, Shield, AlertTriangle, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpCenterPage() {
  const faqs = [
    {
      q: 'Do I need to know legal IPC / BNS section numbers to report a crime?',
      a: 'No. NyayMadad is designed specifically so you can describe what happened in everyday words. AI extracts the facts and prepares a formal document for public authorities.',
    },
    {
      q: 'What if someone is in immediate physical danger right now?',
      a: 'Do not wait for online complaint triage. Immediately dial 112 or your local police emergency station. Online reporting is for structured complaint submission and investigation queues.',
    },
    {
      q: 'How is my evidence protected against tampering?',
      a: 'Every evidence file uploaded to NyayMadad is immediately hashed using SHA-256 cryptographic standards. The hash is recorded in an immutable audit ledger, guaranteeing chain-of-custody verification for court or police proceedings.',
    },
    {
      q: 'Can the AI make official legal decisions or dismiss my case?',
      a: 'Never. In NyayMadad, AI is strictly assistive. Only authorized human investigating officers and department administrators can accept, investigate, or resolve complaints.',
    },
    {
      q: 'How do I respond if an officer requests additional details?',
      a: 'When an officer requests clarification, an alert will appear on your Citizen Dashboard. Open your case tracker, type your response, attach any requested documents, and submit.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Help Center & Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Common answers regarding incident reporting, evidence handling, and case tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="civic-card p-5 bg-white border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">National Emergency (112)</h3>
          <p className="text-xs text-slate-500">24/7 direct police and rescue dispatch</p>
        </div>

        <div className="civic-card p-5 bg-white border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Cyber Helpline (1930)</h3>
          <p className="text-xs text-slate-500">Immediate banking and online fraud freeze</p>
        </div>

        <div className="civic-card p-5 bg-white border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Online Tracking</h3>
          <p className="text-xs text-slate-500">Track cases anytime with NYAY ID</p>
        </div>
      </div>

      {/* FAQ list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="civic-card p-5 bg-white border border-slate-200 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-nyay-600 flex-shrink-0" />
                {f.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
