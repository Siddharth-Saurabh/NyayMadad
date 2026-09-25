import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  User, 
  Shield, 
  HelpCircle, 
  SendHorizontal 
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function TimelineView({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
        No case history entries recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {timeline.map((item, index) => {
        const isLatest = index === timeline.length - 1;
        return (
          <div key={item._id || index} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isLatest
                  ? 'bg-nyay-600 border-nyay-200 text-white shadow-md ring-4 ring-nyay-100'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
            >
              {isLatest ? (
                <CheckCircle2 className="w-3 h-3 text-white" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              )}
            </div>

            {/* Content card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.toStatus} size="sm" />
                  {item.fromStatus && item.fromStatus !== 'INITIAL' && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span>from {item.fromStatus.replace('_', ' ')}</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(item.createdAt || item.timestamp).toLocaleString()}
                </span>
              </div>

              {item.note && (
                <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {item.note}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                <User className="w-3 h-3" />
                <span>Actor: {item.changedBy?.name || item.actorRole || 'System'}</span>
                <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">
                  {item.actorRole}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
