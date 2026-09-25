import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightCircle, 
  UserCheck, 
  Search, 
  HelpCircle,
  FileCheck,
  ShieldAlert,
  SendHorizontal
} from 'lucide-react';

const STATUS_CONFIGS = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    icon: Clock,
  },
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: SendHorizontal,
  },
  ROUTING: {
    label: 'Routing',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    icon: ArrowRightCircle,
  },
  ROUTED: {
    label: 'Routed',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: ArrowRightCircle,
  },
  RECEIVED: {
    label: 'Received',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    icon: FileCheck,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    icon: Search,
  },
  INFORMATION_REQUESTED: {
    label: 'Action Required: Info Needed',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: HelpCircle,
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  ASSIGNED: {
    label: 'Officer Assigned',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: UserCheck,
  },
  PROCESSING: {
    label: 'Processing',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: Clock,
  },
  INVESTIGATION: {
    label: 'Under Investigation',
    bg: 'bg-indigo-100',
    text: 'text-indigo-900',
    border: 'border-indigo-300',
    icon: Search,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-300',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    icon: CheckCircle2,
  },
  TRANSFERRED: {
    label: 'Transferred',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: ArrowRightCircle,
  },
  ROUTING_FAILED: {
    label: 'Manual Dispatch Queue',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: ShieldAlert,
  },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.DRAFT;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
