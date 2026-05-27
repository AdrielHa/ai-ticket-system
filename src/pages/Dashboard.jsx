import { Ticket, AlertTriangle, CheckCircle2, Clock, Bot, ArrowRight, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', tickets: 24, resolved: 18 },
  { day: 'Tue', tickets: 31, resolved: 27 },
  { day: 'Wed', tickets: 19, resolved: 15 },
  { day: 'Thu', tickets: 42, resolved: 38 },
  { day: 'Fri', tickets: 28, resolved: 22 },
  { day: 'Sat', tickets: 14, resolved: 13 },
  { day: 'Sun', tickets: 9, resolved: 9 },
];

const recentTickets = [
  { id: 'TKT-1042', title: 'Database connection timeout on prod server', status: 'critical', priority: 'critical', assignee: 'Sarah K.', time: '5m ago' },
  { id: 'TKT-1041', title: 'Payment gateway returning 502 errors', status: 'in-progress', priority: 'high', assignee: 'Mike R.', time: '18m ago' },
  { id: 'TKT-1040', title: 'User authentication failing for SSO logins', status: 'open', priority: 'high', assignee: 'Unassigned', time: '42m ago' },
  { id: 'TKT-1039', title: 'Dashboard charts not rendering in Safari', status: 'in-progress', priority: 'medium', assignee: 'Lisa P.', time: '1h ago' },
  { id: 'TKT-1038', title: 'Email notifications delayed by 30+ minutes', status: 'resolved', priority: 'medium', assignee: 'Tom H.', time: '2h ago' },
];

const aiInsights = [
  { text: '3 tickets match a recurring database timeout pattern from last week', severity: 'warning' },
  { text: 'Critical ticket volume up 40% — consider escalation protocol', severity: 'critical' },
  { text: 'Sarah K. has the highest resolution rate this week (94%)', severity: 'positive' },
];

const INSIGHT_STYLES = {
  critical: { bg: 'hsl(0,84%,60%/0.07)',  border: 'hsl(0,84%,60%/0.18)',  color: 'hsl(0,84%,72%)',   dot: 'hsl(0,84%,60%)' },
  warning:  { bg: 'hsl(38,92%,50%/0.07)', border: 'hsl(38,92%,50%/0.18)', color: 'hsl(38,92%,65%)',  dot: 'hsl(38,92%,50%)' },
  positive: { bg: 'hsl(160,84%,39%/0.07)',border: 'hsl(160,84%,39%/0.18)',color: 'hsl(160,84%,55%)', dot: 'hsl(160,84%,39%)' },
};

const cardStyle = {
  background: 'hsl(222,44%,11%)',
  border: '1px solid hsl(217,32%,17%)',
  boxShadow: '0 1px 3px hsl(0,0%,0%/0.25)',
};

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Overview</p>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Good morning, Admin</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Wednesday, May 27, 2026 · 8 active incidents</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium text-success" style={{ background: 'hsl(160,84%,39%/0.08)', border: '1px solid hsl(160,84%,39%/0.18)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Tickets" value="127" change="+12%" changeLabel="vs last week" icon={Ticket} trend="down" />
        <StatCard title="Critical Incidents" value="8" change="+3" changeLabel="since yesterday" icon={AlertTriangle} trend="down" />
        <StatCard title="Resolved Today" value="43" change="+18%" changeLabel="vs yesterday" icon={CheckCircle2} trend="up" />
        <StatCard title="Avg Resolution" value="2.4h" change="-22min" changeLabel="vs last week" icon={Clock} trend="up" />
      </div>

      {/* Chart + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl p-6" style={cardStyle}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Ticket Activity</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">Created vs resolved — last 7 days</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />Created
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />Resolved
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={188}>
            <AreaChart data={chartData} margin={{ left: -8 }}>
              <defs>
                <linearGradient id="gTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160,84%,39%)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,32%,17%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215,20%,45%)' }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215,20%,45%)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,20%)', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 32px hsl(0,0%,0%/0.4)' }}
                labelStyle={{ color: 'hsl(213,31%,85%)', fontWeight: 600 }}
                cursor={{ stroke: 'hsl(217,32%,24%)', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="tickets" stroke="hsl(217,91%,60%)" strokeWidth={2} fill="url(#gTickets)" dot={false} activeDot={{ r: 4, fill: 'hsl(217,91%,60%)', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="resolved" stroke="hsl(160,84%,39%)" strokeWidth={2} fill="url(#gResolved)" dot={false} activeDot={{ r: 4, fill: 'hsl(160,84%,39%)', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl p-6" style={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(217,91%,60%/0.1)', border: '1px solid hsl(217,91%,60%/0.15)' }}>
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">AI Insights</h3>
              <p className="text-[11px] text-muted-foreground">Live pattern analysis</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {aiInsights.map((insight, i) => {
              const s = INSIGHT_STYLES[insight.severity];
              return (
                <div key={i} className="flex gap-2.5 p-3 rounded-lg text-[12px] leading-relaxed" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: s.dot, boxShadow: `0 0 5px ${s.dot}` }} />
                  <span style={{ color: s.color }}>{insight.text}</span>
                </div>
              );
            })}
          </div>
          <Link to="/ai-assistant" className="flex items-center gap-1.5 mt-5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors group">
            Open AI Assistant
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid hsl(217,32%,17%)' }}>
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[13px] font-semibold text-foreground">Recent Tickets</h3>
            <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full" style={{ background: 'hsl(217,32%,17%)' }}>
              {recentTickets.length}
            </span>
          </div>
          <Link to="/tickets" className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors group">
            View all <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: 'hsl(217,32%,15%)' }}>
          {recentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all duration-150"
              style={{ borderBottom: '1px solid hsl(217,32%,15%)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'hsl(220,30%,14%)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <span className="text-[11px] font-mono text-muted-foreground/70 w-20 flex-shrink-0">{ticket.id}</span>
              <p className="text-[13px] text-foreground flex-1 truncate">{ticket.title}</p>
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
              <span className="text-[12px] text-muted-foreground flex-shrink-0 hidden md:block">{ticket.assignee}</span>
              <span className="text-[11px] text-muted-foreground/60 flex-shrink-0">{ticket.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}