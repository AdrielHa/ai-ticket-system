import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  open:          { bg: 'hsl(217,91%,60%/0.1)', color: 'hsl(217,91%,72%)', border: 'hsl(217,91%,60%/0.2)', dot: 'hsl(217,91%,60%)' },
  'in-progress': { bg: 'hsl(38,92%,50%/0.1)',  color: 'hsl(38,92%,65%)',  border: 'hsl(38,92%,50%/0.2)',  dot: 'hsl(38,92%,50%)' },
  resolved:      { bg: 'hsl(160,84%,39%/0.1)', color: 'hsl(160,84%,55%)', border: 'hsl(160,84%,39%/0.2)', dot: 'hsl(160,84%,39%)' },
  closed:        { bg: 'hsl(217,32%,17%/0.6)',  color: 'hsl(215,20%,50%)', border: 'hsl(217,32%,22%)',     dot: 'hsl(215,20%,50%)' },
  critical:      { bg: 'hsl(0,84%,60%/0.1)',    color: 'hsl(0,84%,72%)',   border: 'hsl(0,84%,60%/0.2)',   dot: 'hsl(0,84%,60%)' },
};

const PRIORITY_CONFIG = {
  critical: { bg: 'hsl(0,84%,60%/0.1)',    color: 'hsl(0,84%,72%)',   border: 'hsl(0,84%,60%/0.2)',   dot: 'hsl(0,84%,60%)' },
  high:     { bg: 'hsl(38,92%,50%/0.1)',   color: 'hsl(38,92%,65%)',  border: 'hsl(38,92%,50%/0.2)',  dot: 'hsl(38,92%,50%)' },
  medium:   { bg: 'hsl(217,91%,60%/0.1)',  color: 'hsl(217,91%,72%)', border: 'hsl(217,91%,60%/0.2)', dot: 'hsl(217,91%,60%)' },
  low:      { bg: 'hsl(217,32%,17%/0.6)',  color: 'hsl(215,20%,55%)', border: 'hsl(217,32%,22%)',     dot: 'hsl(215,20%,55%)' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold capitalize tracking-wide"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot, boxShadow: `0 0 4px ${cfg.dot}` }} />
      {status?.replace('-', ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold capitalize tracking-wide"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {priority}
    </span>
  );
}