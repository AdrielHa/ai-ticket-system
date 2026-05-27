import { useState, useMemo } from 'react';
import {
  Filter, Plus, Search, ChevronDown, ChevronUp, MoreHorizontal,
  ChevronLeft, ChevronRight, CheckSquare, Square, Minus, Bot,
  ArrowUpDown, Trash2, UserCheck, Tag, X
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import TicketDetailPanel from '../components/TicketDetailPanel';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_TICKETS = [
  { id: 'TKT-1042', title: 'Database connection timeout on prod server', status: 'open', priority: 'critical', category: 'System Error', assignee: 'Sarah K.', created: 'May 27, 2026', updated: '5m ago', riskScore: 9, description: 'Production database server is experiencing intermittent connection timeouts every 3-5 minutes. This is causing cascading failures in the order processing pipeline and affecting approximately 800 active users. The issue started at 09:15 UTC and has been escalating since.', statusHistory: [{ status: 'open', date: 'May 27' }], activity: [{ user: 'System', action: 'created this ticket automatically via monitoring alert', time: '5m ago' }, { user: 'Sarah K.', action: 'was assigned to this ticket', time: '4m ago' }], comments: [{ user: 'Sarah K.', text: 'Investigating now. Looks like a connection pool exhaustion issue. Will update in 10 minutes.', time: '3m ago' }], attachments: [{ name: 'db-error-logs.txt', size: '48 KB' }, { name: 'monitoring-screenshot.png', size: '312 KB' }], relatedTickets: [{ id: 'TKT-1031', title: 'Slow query performance on analytics page', status: 'open' }] },
  { id: 'TKT-1041', title: 'Payment gateway returning 502 errors intermittently', status: 'in-progress', priority: 'high', category: 'Billing', assignee: 'Mike R.', created: 'May 27, 2026', updated: '18m ago', riskScore: 8, description: 'The Stripe payment gateway integration is intermittently returning 502 Bad Gateway errors. Approximately 12% of checkout attempts are failing. Revenue impact is estimated at $4,200/hour. The issue appears to be with the webhook delivery endpoint.', statusHistory: [{ status: 'open', date: 'May 27' }, { status: 'in-progress', date: 'May 27' }], activity: [{ user: 'Mike R.', action: 'changed status to In Progress', time: '15m ago' }, { user: 'Mike R.', action: 'added a comment', time: '10m ago' }], comments: [{ user: 'Mike R.', text: 'Stripe status page shows degraded performance in US-East. Likely their infrastructure issue but checking our webhook config.', time: '10m ago' }], attachments: [{ name: 'stripe-webhook-logs.json', size: '128 KB' }], relatedTickets: [] },
  { id: 'TKT-1040', title: 'SSO authentication failing for enterprise customers', status: 'open', priority: 'high', category: 'Access', assignee: 'Unassigned', created: 'May 27, 2026', updated: '42m ago', riskScore: 7, description: 'Multiple enterprise customers are reporting that SSO login via SAML 2.0 is failing with a signature validation error. The issue affects customers using Okta and Azure AD identity providers. Approximately 340 users are unable to log in.', statusHistory: [{ status: 'open', date: 'May 27' }], activity: [{ user: 'System', action: 'received 14 customer reports for this issue', time: '40m ago' }], comments: [], attachments: [{ name: 'saml-error-trace.xml', size: '22 KB' }], relatedTickets: [{ id: 'TKT-1038', title: 'Email notifications delayed', status: 'resolved' }] },
  { id: 'TKT-1039', title: 'Dashboard charts not rendering correctly in Safari', status: 'in-progress', priority: 'medium', category: 'Technical Support', assignee: 'Lisa P.', created: 'May 26, 2026', updated: '1h ago', riskScore: 4, description: 'Users on Safari 17.x are reporting that recharts components in the dashboard are rendering blank or with corrupted SVG paths. The issue does not occur in Chrome or Firefox. Reproduced on both macOS and iOS devices.', statusHistory: [{ status: 'open', date: 'May 26' }, { status: 'in-progress', date: 'May 26' }], activity: [{ user: 'Lisa P.', action: 'reproduced the issue locally', time: '55m ago' }, { user: 'Lisa P.', action: 'changed status to In Progress', time: '1h ago' }], comments: [{ user: 'Lisa P.', text: 'This is a known recharts issue with Safari SVG rendering. Working on a polyfill-based fix.', time: '50m ago' }], attachments: [{ name: 'safari-console-errors.txt', size: '8 KB' }], relatedTickets: [] },
  { id: 'TKT-1038', title: 'Email notification delivery delayed 30+ minutes', status: 'resolved', priority: 'medium', category: 'Operations', assignee: 'Tom H.', created: 'May 26, 2026', updated: '2h ago', riskScore: 3, description: 'Transactional email notifications sent via SendGrid are being delayed by 30-60 minutes. This affects password reset emails, order confirmations, and alert notifications. The delay appears to be on the SendGrid side based on delivery logs.', statusHistory: [{ status: 'open', date: 'May 26' }, { status: 'in-progress', date: 'May 26' }, { status: 'resolved', date: 'May 26' }], activity: [{ user: 'Tom H.', action: 'resolved this ticket', time: '2h ago', detail: 'SendGrid confirmed infra issue resolved on their side.' }], comments: [{ user: 'Tom H.', text: 'Resolved. SendGrid had a temporary queue backup in the EU region. All queued emails have been delivered.', time: '2h ago' }], attachments: [], relatedTickets: [] },
  { id: 'TKT-1037', title: 'API rate limiting not enforced on webhook endpoints', status: 'open', priority: 'medium', category: 'Technical Support', assignee: 'James W.', created: 'May 25, 2026', updated: '5h ago', riskScore: 5, description: 'The rate limiting middleware is not being applied correctly to the /api/webhooks/* routes. This allows external services to flood the endpoint with requests, causing unnecessary server load. Needs immediate review of the express-rate-limit configuration.', statusHistory: [{ status: 'open', date: 'May 25' }], activity: [{ user: 'James W.', action: 'was assigned to this ticket', time: '4h ago' }], comments: [], attachments: [], relatedTickets: [] },
  { id: 'TKT-1036', title: 'Mobile app crashing on launch for iOS 17.4 users', status: 'in-progress', priority: 'high', category: 'Technical Support', assignee: 'Rachel M.', created: 'May 25, 2026', updated: '6h ago', riskScore: 7, description: 'After the iOS 17.4.1 security update, approximately 15% of active mobile app users are experiencing a crash on launch. The crash occurs in the React Native bridge initialization. Stack trace points to a WebKit JavaScriptCore compatibility issue.', statusHistory: [{ status: 'open', date: 'May 25' }, { status: 'in-progress', date: 'May 25' }], activity: [{ user: 'Rachel M.', action: 'submitted a hotfix build to TestFlight', time: '3h ago' }], comments: [{ user: 'Rachel M.', text: 'Hotfix in TestFlight review. Expect App Store approval within 24 hours.', time: '3h ago' }], attachments: [{ name: 'crash-report.ips', size: '34 KB' }], relatedTickets: [] },
  { id: 'TKT-1035', title: 'CSV export missing last 100 rows of data', status: 'resolved', priority: 'low', category: 'Operations', assignee: 'Tom H.', created: 'May 24, 2026', updated: '1d ago', riskScore: 2, description: 'The bulk CSV export feature was silently truncating results at 9,900 rows due to a hardcoded pagination limit. The fix involved updating the export query to use cursor-based pagination with no upper limit.', statusHistory: [{ status: 'open', date: 'May 24' }, { status: 'resolved', date: 'May 24' }], activity: [{ user: 'Tom H.', action: 'deployed a fix to production', time: '1d ago' }], comments: [], attachments: [], relatedTickets: [] },
  { id: 'TKT-1034', title: 'Slack webhook integration failing silently', status: 'closed', priority: 'low', category: 'Operations', assignee: 'Sarah K.', created: 'May 23, 2026', updated: '2d ago', riskScore: 1, description: 'The Slack webhook URL for the #incidents channel was rotated without updating the integration settings. Notifications were silently failing for 3 days. Fixed by updating the webhook URL in the integrations dashboard.', statusHistory: [{ status: 'open', date: 'May 23' }, { status: 'resolved', date: 'May 23' }, { status: 'closed', date: 'May 24' }], activity: [{ user: 'Sarah K.', action: 'closed this ticket', time: '2d ago' }], comments: [], attachments: [], relatedTickets: [] },
  { id: 'TKT-1033', title: 'Analytics page query performance degradation', status: 'open', priority: 'medium', category: 'System Error', assignee: 'Mike R.', created: 'May 23, 2026', updated: '2d ago', riskScore: 5, description: 'The main analytics dashboard is taking 8-12 seconds to load due to N+1 query issues in the report aggregation service. A full table scan is being performed on the events table without proper index usage. Needs query optimization and index review.', statusHistory: [{ status: 'open', date: 'May 23' }], activity: [{ user: 'Mike R.', action: 'added query profiling data', time: '2d ago' }], comments: [{ user: 'Mike R.', text: 'EXPLAIN ANALYZE shows a full table scan on the events table. Missing composite index on (user_id, created_at).', time: '2d ago' }], attachments: [{ name: 'query-profile.sql', size: '4 KB' }], relatedTickets: [{ id: 'TKT-1042', title: 'Database connection timeout on prod server', status: 'open' }] },
  { id: 'TKT-1032', title: 'Two-factor authentication bypass via API token', status: 'open', priority: 'critical', category: 'Access', assignee: 'Sarah K.', created: 'May 22, 2026', updated: '3d ago', riskScore: 10, description: 'A security researcher disclosed that API tokens generated before March 2026 bypass the 2FA enforcement check introduced in v3.4. Tokens need to be invalidated and users forced to re-authenticate. This is a P0 security vulnerability.', statusHistory: [{ status: 'open', date: 'May 22' }], activity: [{ user: 'System', action: 'flagged as critical security issue', time: '3d ago' }, { user: 'Sarah K.', action: 'escalated to security team', time: '3d ago' }], comments: [{ user: 'Sarah K.', text: 'Coordinating with security team. Patch ETA 48 hours. Affected token list generated.', time: '3d ago' }], attachments: [], relatedTickets: [] },
  { id: 'TKT-1031', title: 'User onboarding wizard skips step 3 on Firefox', status: 'open', priority: 'low', category: 'Technical Support', assignee: 'Lisa P.', created: 'May 21, 2026', updated: '4d ago', riskScore: 2, description: 'New users going through the onboarding wizard on Firefox 124+ are seeing step 3 (workspace configuration) being skipped due to a CSS animation event timing issue. The step completion handler fires before the animation completes.', statusHistory: [{ status: 'open', date: 'May 21' }], activity: [{ user: 'Lisa P.', action: 'reproduced and logged browser-specific details', time: '4d ago' }], comments: [], attachments: [], relatedTickets: [] },
  { id: 'TKT-1030', title: 'Billing cycle renewal failure for annual plans', status: 'in-progress', priority: 'high', category: 'Billing', assignee: 'James W.', created: 'May 20, 2026', updated: '5d ago', riskScore: 8, description: 'Annual plan renewals scheduled for May 20-25 are failing with a Stripe error code card_declined. Investigation shows a webhook processing bug where the renewal attempt uses a stale payment method ID from before a card update.', statusHistory: [{ status: 'open', date: 'May 20' }, { status: 'in-progress', date: 'May 21' }], activity: [{ user: 'James W.', action: 'identified root cause in webhook handler', time: '5d ago' }], comments: [{ user: 'James W.', text: 'Found it. The renewal job is reading from a stale cache. Patching the payment method lookup to always fetch fresh from Stripe.', time: '5d ago' }], attachments: [{ name: 'billing-errors.csv', size: '18 KB' }], relatedTickets: [{ id: 'TKT-1041', title: 'Payment gateway returning 502 errors', status: 'in-progress' }] },
];

const PAGE_SIZE = 8;
const STATUSES = ['All', 'open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['All', 'critical', 'high', 'medium', 'low'];
const CATEGORIES = ['All', 'Technical Support', 'System Error', 'Access', 'Billing', 'Operations', 'Other'];

const cardStyle = {
  background: 'hsl(222,44%,11%)',
  border: '1px solid hsl(217,32%,17%)',
  boxShadow: '0 1px 3px hsl(0,0%,0%/0.25)',
};

const RISK_COLOR = (score) =>
  score >= 8 ? { color: 'hsl(0,84%,72%)', bg: 'hsl(0,84%,60%/0.1)', border: 'hsl(0,84%,60%/0.2)' }
  : score >= 5 ? { color: 'hsl(38,92%,65%)', bg: 'hsl(38,92%,50%/0.1)', border: 'hsl(38,92%,50%/0.2)' }
  : { color: 'hsl(160,84%,55%)', bg: 'hsl(160,84%,39%/0.1)', border: 'hsl(160,84%,39%/0.2)' };

function FilterChip({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
        style={value !== 'All'
          ? { background: 'hsl(217,91%,60%/0.12)', border: '1px solid hsl(217,91%,60%/0.3)', color: 'hsl(217,91%,72%)' }
          : { background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,20%)', color: 'hsl(215,20%,55%)' }}
      >
        {label}{value !== 'All' ? `: ${value}` : ''}
        <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1.5 left-0 z-50 py-1 rounded-xl min-w-[140px] overflow-hidden"
            style={{ background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,22%)', boxShadow: '0 8px 32px hsl(0,0%,0%/0.5)' }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-[12px] transition-colors capitalize"
                style={{ color: value === opt ? 'hsl(217,91%,72%)' : 'hsl(215,20%,60%)', background: value === opt ? 'hsl(217,91%,60%/0.1)' : '' }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'hsl(220,30%,18%)'; }}
                onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = ''; }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default function Tickets() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortKey, setSortKey] = useState('updated');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filtered = useMemo(() => {
    let result = ALL_TICKETS.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      return true;
    });
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const va = a[sortKey] ?? ''; const vb = b[sortKey] ?? '';
        return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }
    return result;
  }, [search, statusFilter, priorityFilter, categoryFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(selected.size === paginated.length ? new Set() : new Set(paginated.map(t => t.id)));
  const allSelected = paginated.length > 0 && selected.size === paginated.length;
  const someSelected = selected.size > 0 && !allSelected;

  const clearFilters = () => { setStatusFilter('All'); setPriorityFilter('All'); setCategoryFilter('All'); setSearch(''); };
  const hasFilters = statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || search;

  const SortIcon = ({ k }) => (
    <span className="ml-1 inline-flex">
      {sortKey === k ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
    </span>
  );

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Management</p>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Tickets</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">{filtered.length} tickets · {ALL_TICKETS.filter(t => t.status === 'open').length} open</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, hsl(217,91%,62%), hsl(217,91%,52%))', boxShadow: '0 1px 3px hsl(0,0%,0%/0.3), inset 0 1px 0 hsl(0,0%,100%/0.1)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg flex-1 max-w-sm transition-all"
          style={{ background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,20%)' }}
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by ID or title..."
            className="bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" /></button>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip label="Status" options={STATUSES} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
          <FilterChip label="Priority" options={PRIORITIES} value={priorityFilter} onChange={v => { setPriorityFilter(v); setPage(1); }} />
          <FilterChip label="Category" options={CATEGORIES} value={categoryFilter} onChange={v => { setCategoryFilter(v); setPage(1); }} />
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors" style={{ border: '1px solid hsl(217,32%,20%)' }}>
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: 'hsl(217,91%,60%/0.08)', border: '1px solid hsl(217,91%,60%/0.2)' }}
          >
            <span className="text-[12px] font-semibold text-primary">{selected.size} selected</span>
            <div className="w-px h-4 bg-border mx-1" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <UserCheck className="w-3.5 h-3.5" /> Assign
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Tag className="w-3.5 h-3.5" /> Label
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-destructive/80 hover:bg-destructive/10 transition-colors ml-auto">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(217,32%,18%)', background: 'hsl(220,47%,10%)' }}>
                <th className="px-4 py-3.5 w-10">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : someSelected ? <Minus className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                {[
                  { label: 'Ticket', key: 'id', cls: 'min-w-[220px]' },
                  { label: 'Category', key: 'category', cls: 'hidden md:table-cell' },
                  { label: 'Priority', key: 'priority', cls: '' },
                  { label: 'Status', key: 'status', cls: '' },
                  { label: 'Assignee', key: 'assignee', cls: 'hidden lg:table-cell' },
                  { label: 'Created', key: 'created', cls: 'hidden xl:table-cell' },
                  { label: 'Updated', key: 'updated', cls: 'hidden xl:table-cell' },
                  { label: 'AI Risk', key: 'riskScore', cls: 'hidden lg:table-cell' },
                ].map(col => (
                  <th key={col.key} className={`text-left px-4 py-3.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors ${col.cls}`} onClick={() => toggleSort(col.key)}>
                    <span className="flex items-center gap-0.5 whitespace-nowrap">{col.label}<SortIcon k={col.key} /></span>
                  </th>
                ))}
                <th className="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((ticket, i) => {
                const risk = RISK_COLOR(ticket.riskScore);
                const isSelected = selected.has(ticket.id);
                return (
                  <tr
                    key={ticket.id}
                    style={{
                      borderBottom: i < paginated.length - 1 ? '1px solid hsl(217,32%,15%)' : '',
                      background: isSelected ? 'hsl(217,91%,60%/0.05)' : '',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'hsl(220,30%,13%)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = ''; }}
                  >
                    <td className="px-4 py-3.5">
                      <button onClick={e => { e.stopPropagation(); toggleSelect(ticket.id); }} className="text-muted-foreground hover:text-foreground transition-colors">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer min-w-[220px]" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-mono text-muted-foreground/60">{ticket.id}</span>
                        <span className="text-[13px] text-foreground font-medium max-w-xs truncate">{ticket.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell" onClick={() => setSelectedTicket(ticket)}>
                      <span className="text-[12px] text-muted-foreground px-2.5 py-1 rounded-lg cursor-pointer" style={{ background: 'hsl(217,32%,18%)', border: '1px solid hsl(217,32%,23%)' }}>{ticket.category}</span>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedTicket(ticket)}><PriorityBadge priority={ticket.priority} /></td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedTicket(ticket)}><StatusBadge status={ticket.status} /></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-[13px] text-muted-foreground cursor-pointer" onClick={() => setSelectedTicket(ticket)}>{ticket.assignee}</td>
                    <td className="px-4 py-3.5 hidden xl:table-cell text-[12px] text-muted-foreground cursor-pointer" onClick={() => setSelectedTicket(ticket)}>{ticket.created}</td>
                    <td className="px-4 py-3.5 hidden xl:table-cell text-[12px] text-muted-foreground/70 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>{ticket.updated}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-3 h-3 flex-shrink-0" style={{ color: risk.color }} />
                        <span className="text-[12px] font-bold" style={{ color: risk.color }}>{ticket.riskScore}</span>
                        <div className="flex-1 h-1 rounded-full overflow-hidden min-w-[32px]" style={{ background: 'hsl(217,32%,20%)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${ticket.riskScore * 10}%`, background: risk.color, opacity: 0.6 }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: '1px solid hsl(217,32%,17%)', background: 'hsl(220,47%,10%)' }}>
          <p className="text-[12px] text-muted-foreground">
            Showing <span className="font-medium text-foreground">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-7 h-7 rounded-lg text-[12px] font-medium transition-all"
                style={page === p
                  ? { background: 'hsl(217,91%,60%)', color: 'white' }
                  : { color: 'hsl(215,20%,55%)' }}
                onMouseEnter={e => { if (page !== p) e.currentTarget.style.background = 'hsl(220,30%,16%)'; }}
                onMouseLeave={e => { if (page !== p) e.currentTarget.style.background = ''; }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <TicketDetailPanel ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
}