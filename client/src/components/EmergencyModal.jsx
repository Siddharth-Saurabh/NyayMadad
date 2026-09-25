import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, ExternalLink } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const helplines = [
    { number: '112', title: 'National Emergency Helpline', desc: 'Immediate police, fire, or ambulance response', primary: true },
    { number: '1930', title: 'National Cyber Crime Reporting Helpline', desc: 'Financial freeze for immediate UPI/banking fraud' },
    { number: '1091', title: 'Women Safety Helpline', desc: '24/7 dedicated support & distress response' },
    { number: '1098', title: 'Child Helpline', desc: 'National emergency service for children in distress' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-red-500">
        <div className="bg-red-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700/80 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Immediate Emergency Assistance</h2>
              <p className="text-xs text-red-100 mt-0.5">If you or someone else is in immediate danger, call official emergency services now.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-200 hover:text-white rounded-lg hover:bg-red-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>
              <strong>Do not wait for online complaint processing</strong> if an active threat, medical emergency, or physical violence is taking place.
            </span>
          </div>

          <div className="space-y-3">
            {helplines.map((line) => (
              <a
                key={line.number}
                href={`tel:${line.number}`}
                className={`flex items-center justify-between p-4 rounded-xl border transition group ${
                  line.primary
                    ? 'bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-md'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-black ${line.primary ? 'text-white' : 'text-red-600'}`}>
                      {line.number}
                    </span>
                    <span className="font-semibold text-sm">{line.title}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${line.primary ? 'text-red-100' : 'text-slate-500'}`}>
                    {line.desc}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg flex items-center gap-1 text-xs font-bold ${
                  line.primary ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                }`}>
                  <PhoneCall className="w-4 h-4" /> Call Now
                </div>
              </a>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>NyayMadad is an official assistance portal, not a live 911/112 dispatcher.</span>
            <button
              onClick={onClose}
              className="text-slate-700 font-semibold hover:underline"
            >
              Continue to form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
