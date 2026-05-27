import { Plus, MoreHorizontal, Search, Shield, User } from 'lucide-react';
import { useState } from 'react';

const USERS = [
  { name: 'Sarah Kim', email: 'sarah.k@company.com', role: 'admin', status: 'active', tickets: 48, resolved: 45, joined: 'Jan 12, 2025', avatar: 'SK' },
  { name: 'Mike Rivera', email: 'mike.r@company.com', role: 'agent', status: 'active', tickets: 31, resolved: 28, joined: 'Mar 3, 2025', avatar: 'MR' },
  { name: 'Lisa Park', email: 'lisa.p@company.com', role: 'agent', status: 'active', tickets: 27, resolved: 24, joined: 'Apr 19, 2025', avatar: 'LP' },
  { name: 'Tom Hughes', email: 'tom.h@company.com', role: 'agent', status: 'active', tickets: 39, resolved: 37, joined: 'Feb 8, 2025', avatar: 'TH' },
  { name: 'Rachel Moore', email: 'rachel.m@company.com', role: 'agent', status: 'active', tickets: 22, resolved: 19, joined: 'May 1, 2025', avatar: 'RM' },
  { name: 'James Walsh', email: 'james.w@company.com', role: 'agent', status: 'away', tickets: 15, resolved: 11, joined: 'Jun 14, 2025', avatar: 'JW' },
  { name: 'Emma Chen', email: 'emma.c@company.com', role: 'viewer', status: 'active', tickets: 0, resolved: 0, joined: 'Aug 22, 2025', avatar: 'EC' },
  { name: 'David Osei', email: 'david.o@company.com', role: 'agent', status: 'inactive', tickets: 8, resolved: 8, joined: 'Oct 5, 2024', avatar: 'DO' },
];

const ROLE_COLORS = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  agent: 'bg-success/10 text-success border-success/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

const STATUS_COLORS = {
  active: 'bg-success',
  away: 'bg-warning',
  inactive: 'bg-muted-foreground',
};

export default function Users() {
  const [search, setSearch] = useState('');
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{USERS.length} members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: USERS.length, icon: User },
          { label: 'Admins', value: USERS.filter(u => u.role === 'admin').length, icon: Shield },
          { label: 'Active Now', value: USERS.filter(u => u.status === 'active').length, icon: User },
          { label: 'Avg Tickets', value: Math.round(USERS.reduce((s, u) => s + u.tickets, 0) / USERS.length), icon: User },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search members..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tickets</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Joined</th>
                <th className="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.email} className="hover:bg-accent/40 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[user.status]}`} />
                      <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="text-sm text-foreground">
                      {user.tickets} <span className="text-muted-foreground text-xs">({user.resolved} resolved)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell text-xs text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-3.5">
                    <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}