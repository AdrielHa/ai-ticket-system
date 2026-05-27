import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Download } from 'lucide-react';

const volumeData = [
  { month: 'Dec', created: 210, resolved: 195 },
  { month: 'Jan', created: 247, resolved: 230 },
  { month: 'Feb', created: 189, resolved: 180 },
  { month: 'Mar', created: 304, resolved: 278 },
  { month: 'Apr', created: 275, resolved: 260 },
  { month: 'May', created: 198, resolved: 187 },
];

const resolutionData = [
  { day: 'Mon', hours: 2.1 }, { day: 'Tue', hours: 3.4 },
  { day: 'Wed', hours: 1.8 }, { day: 'Thu', hours: 4.2 },
  { day: 'Fri', hours: 2.9 }, { day: 'Sat', hours: 1.2 }, { day: 'Sun', hours: 0.8 },
];

const categoryData = [
  { name: 'Infrastructure', value: 32, color: 'hsl(217,91%,60%)' },
  { name: 'Frontend', value: 21, color: 'hsl(160,84%,39%)' },
  { name: 'Auth', value: 18, color: 'hsl(38,92%,50%)' },
  { name: 'Payments', value: 15, color: 'hsl(0,84%,60%)' },
  { name: 'Other', value: 14, color: 'hsl(271,81%,56%)' },
];

const agentData = [
  { name: 'Sarah K.', tickets: 48, resolved: 45, rate: 94 },
  { name: 'Tom H.', tickets: 39, resolved: 37, rate: 95 },
  { name: 'Mike R.', tickets: 31, resolved: 28, rate: 90 },
  { name: 'Lisa P.', tickets: 27, resolved: 24, rate: 89 },
  { name: 'Rachel M.', tickets: 22, resolved: 19, rate: 86 },
];

const tooltipStyle = {
  contentStyle: { background: 'hsl(222,44%,11%)', border: '1px solid hsl(217,32%,17%)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: 'hsl(213,31%,91%)' },
};

export default function Reports() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Reports</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Last 6 months overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets (6mo)', value: '1,423', delta: '+8.2%', positive: false },
          { label: 'Resolution Rate', value: '93.4%', delta: '+2.1%', positive: true },
          { label: 'Avg Resolution Time', value: '2.4h', delta: '-18min', positive: true },
          { label: 'Customer Satisfaction', value: '4.7/5', delta: '+0.3', positive: true },
        ].map(({ label, value, delta, positive }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
            <span className={`text-xs font-medium ${positive ? 'text-success' : 'text-destructive'}`}>{delta}</span>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">Ticket Volume</h3>
          <p className="text-xs text-muted-foreground mb-5">Created vs Resolved (monthly)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,32%,17%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(215,20%,55%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215,20%,55%)' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="created" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">By Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Ticket distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
                <span className="text-xs font-medium text-foreground">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">Avg Resolution Time</h3>
          <p className="text-xs text-muted-foreground mb-5">Hours per day (this week)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,32%,17%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215,20%,55%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215,20%,55%)' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="hours" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ fill: 'hsl(217,91%,60%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Agent Performance</h3>
          <div className="space-y-3">
            {agentData.map((agent) => (
              <div key={agent.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{agent.name}</span>
                    <span className="text-xs font-medium text-success">{agent.rate}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${agent.rate}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{agent.tickets} tickets</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}