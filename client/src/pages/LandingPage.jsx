import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Mic, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  UserCheck, 
  Search,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nyay-50 border border-nyay-200 text-nyay-900 text-xs font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-nyay-600" />
            <span>AI-Assisted Citizen Crime Reporting & Jurisdictional Routing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            Tell us what happened. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nyay-700 via-nyay-600 to-indigo-700">
              We’ll help you report it.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No complex legal jargon or confusing departmental codes. Simply describe your incident through plain text or spoken voice, review your structured draft, and get guided to the right authorized authority.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-bold text-base shadow-lg shadow-nyay-700/25 transition transform hover:-translate-y-0.5"
            >
              <FileText className="w-5 h-5" />
              <span>Report an Incident Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs transition"
            >
              <span>How It Works</span>
            </Link>
          </div>

          {/* Core Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200/80 text-left">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Plain Language</p>
                <p className="text-[11px] text-slate-500">Text or voice in your own words</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Deterministic Routing</p>
                <p className="text-[11px] text-slate-500">Rules-based dispatch to units</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Protected Evidence</p>
                <p className="text-[11px] text-slate-500">SHA-256 integrity verification</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Human-in-the-Loop</p>
                <p className="text-[11px] text-slate-500">Reviewed by assigned officers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-nyay-600">The NyayMadad Workflow</h2>
          <h3 className="text-3xl font-extrabold text-slate-950">How Incident Reporting Works</h3>
          <p className="text-sm text-slate-600">Built to ensure every citizen report is structured, factual, and delivered directly to the right desk.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="civic-card p-6 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-mono">01</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">1. Describe Incident</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak or type what happened. Explain events in plain English, Hindi, or Punjabi without selecting legal penal codes.
            </p>
          </div>

          <div className="civic-card p-6 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-mono">02</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">2. AI Assistance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI extracts dates, locations, loss amounts, identifies missing information, and asks targeted clarifying questions.
            </p>
          </div>

          <div className="civic-card p-6 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-mono">03</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">3. Citizen Review</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review and edit the formal complaint summary. Attach screenshots or documents with cryptographic hash protection.
            </p>
          </div>

          <div className="civic-card p-6 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-mono">04</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">4. Dispatch & Track</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic routing delivers the case to the appropriate Cyber, Police, or Safety unit. Track progress with a unique NYAY reference ID.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Callout Card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-700/60 text-xs font-bold uppercase tracking-wider">
              <PhoneCall className="w-3.5 h-3.5" /> Immediate Physical Danger?
            </div>
            <h3 className="text-2xl font-black">Call 112 for Active Emergencies</h3>
            <p className="text-xs text-red-100 max-w-md">
              NyayMadad is an assistance platform for structured complaint submission. For active crimes, medical emergencies, or physical threats in progress, dial 112 immediately.
            </p>
          </div>
          <a
            href="tel:112"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-white text-red-700 font-extrabold text-sm shadow-md hover:bg-red-50 transition"
          >
            Call 112 Emergency
          </a>
        </div>
      </section>
    </div>
  );
}
