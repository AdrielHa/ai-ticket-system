import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, change, changeLabel, icon: Icon, trend }) {
  const isPositive = trend === 'up';

  return (
    <div
      className="rounded-xl p-5 group cursor-default transition-all duration-200 relative overflow-hidden"
      style={{
        background: 'hsl(222,44%,11%)',
        border: '1px solid hsl(217,32%,17%)',
        boxShadow: '0 1px 3px hsl(0,0%,0%/0.25)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid hsl(217,32%,24%)';
        e.currentTarget.style.boxShadow = '0 4px 20px hsl(0,0%,0%/0.35), 0 1px 4px hsl(0,0%,0%/0.2)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid hsl(217,32%,17%)';
        e.currentTarget.style.boxShadow = '0 1px 3px hsl(0,0%,0%/0.25)';
        e.currentTarget.style.transform = '';
      }}
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, hsl(217,91%,60%/0.3), transparent)' }} />

      <div className="flex items-start justify-between mb-4">
        <p className="text-[12px] font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(217,91%,60%/0.1)', border: '1px solid hsl(217,91%,60%/0.15)' }}>
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <p className="text-[28px] font-bold text-foreground mb-2.5 leading-none tracking-tight">{value}</p>

      <div className="flex items-center gap-1.5">
        <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold', isPositive ? 'text-success' : 'text-destructive')} style={{ background: isPositive ? 'hsl(160,84%,39%/0.1)' : 'hsl(0,84%,60%/0.1)' }}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
        <span className="text-[11px] text-muted-foreground/70">{changeLabel}</span>
      </div>
    </div>
  );
}