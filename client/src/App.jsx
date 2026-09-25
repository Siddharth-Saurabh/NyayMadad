import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Shield, Sparkles, FileText, Lock } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-nyay-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-nyay-700 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">NyayMadad</span>
                <span className="hidden sm:inline-block ml-2 text-xs bg-nyay-700 text-nyay-200 px-2 py-0.5 rounded font-mono">
                  v1.0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-slate-300">Tell us what happened. We’ll help you report it.</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nyay-100 text-nyay-800 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-nyay-600" /> AI-Powered Crime Reporting & Complaint Routing System
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Tell us what happened. <br className="hidden sm:inline" />
              <span className="text-nyay-700">We’ll help you report it.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              A secure citizen-focused platform that simplifies incident reporting through natural language, 
              AI-assisted complaint structuring, evidence protection, and deterministic jurisdiction routing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="civic-card p-6">
              <div className="w-10 h-10 bg-blue-100 text-nyay-700 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Natural Language & Voice</h3>
              <p className="text-sm text-slate-600">
                Describe the incident in plain everyday language or spoken voice without navigating complex penal codes.
              </p>
            </div>

            <div className="civic-card p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Assisted Drafting</h3>
              <p className="text-sm text-slate-600">
                AI extracts key facts, checks for missing required fields, and synthesizes a formal draft for citizen review.
              </p>
            </div>

            <div className="civic-card p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Deterministic Routing</h3>
              <p className="text-sm text-slate-600">
                Rules-based jurisdiction dispatch directly routes the case to authorized departments and maintains audit trails.
              </p>
            </div>
          </div>
        </main>

        <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            NyayMadad — AI-Powered Crime Reporting & Complaint Routing System. Built for civic safety and transparent justice.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
