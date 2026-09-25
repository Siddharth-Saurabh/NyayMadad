import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Mic, 
  Sparkles, 
  FileText, 
  Lock, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How NyayMadad Works
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          A transparent overview of how our citizen-centric architecture simplifies reporting while maintaining strict legal rigor and authority oversight.
        </p>
      </div>

      <div className="space-y-8">
        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Natural Voice & Text Ingestion</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
            Citizens do not need to memorize the Indian Penal Code or BNS sections. Whether filing an online phishing complaint, a theft incident, or a safety concern, you speak or write in plain everyday language. Multilingual support handles English, Hindi, Punjabi, and Hinglish.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-purple-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Entity Extraction & Dynamic Clarification</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
            Our AI analysis pipeline extracts essential facts: incident timestamps, loss amounts, identifiers, suspect communications, and location context. If critical information is missing, the system dynamically prompts you with simple follow-up questions to complete the record.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-emerald-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Citizen Review & Cryptographic Evidence Protection</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
            Before submission, you review the synthesized formal complaint draft and can modify any detail. Supporting documents, bank receipts, screenshots, and audio are hashed using SHA-256 to ensure verifiable chain-of-custody integrity.
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-indigo-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">Deterministic Jurisdictional Dispatch</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
            AI is NEVER used to arbitrarily pick government endpoints. Instead, our deterministic routing engine matches the classified incident category and jurisdiction against verified governmental units (e.g. Cyber Crime Division, Women Safety Wing, Local Police Station).
          </p>
        </div>

        <div className="civic-card p-6 bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h3 className="text-lg font-bold text-slate-900">Human Investigation & Transparent Tracking</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
            Assigned investigating officers review the case, can request additional clarification directly within the platform, and provide real-time updates on case investigation, recovery, and final resolution.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-sm shadow transition"
        >
          <FileText className="w-4 h-4" />
          <span>Start Filing a Report</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
