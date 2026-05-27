import { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Zap, ChevronRight, Save } from 'lucide-react';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'data', label: 'Data & Privacy', icon: Database },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-border'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

export default function Settings() {
  const [active, setActive] = useState('profile');
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, weekly: true, critical: true, assigned: true });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <nav className="bg-card border border-border rounded-xl overflow-hidden">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors border-b last:border-b-0 border-border ${
                  active === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === 'profile' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-base font-semibold text-foreground">Profile Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold text-primary">AD</div>
                <div>
                  <button className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Change avatar</button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: 'Admin', type: 'text' },
                  { label: 'Last Name', value: 'User', type: 'text' },
                  { label: 'Email', value: 'admin@company.com', type: 'email' },
                  { label: 'Job Title', value: 'Support Manager', type: 'text' },
                ].map(({ label, value, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                    <input defaultValue={value} type={type}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {active === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-base font-semibold text-foreground">Notification Preferences</h3>
              <div className="space-y-0 divide-y divide-border">
                {[
                  { key: 'email', label: 'Email notifications', desc: 'Receive notifications via email' },
                  { key: 'push', label: 'Push notifications', desc: 'Browser push notifications' },
                  { key: 'sms', label: 'SMS notifications', desc: 'Critical alerts via SMS' },
                  { key: 'weekly', label: 'Weekly digest', desc: 'Weekly performance summary' },
                  { key: 'critical', label: 'Critical alerts', desc: 'Instant alerts for P0 incidents' },
                  { key: 'assigned', label: 'Ticket assignments', desc: 'When tickets are assigned to you' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Toggle checked={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'security' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-base font-semibold text-foreground">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-primary/30 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {(active === 'appearance' || active === 'integrations' || active === 'data') && (
            <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                {active === 'appearance' ? <Palette className="w-6 h-6 text-muted-foreground" /> :
                 active === 'integrations' ? <Zap className="w-6 h-6 text-muted-foreground" /> :
                 <Database className="w-6 h-6 text-muted-foreground" />}
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Coming Soon</p>
              <p className="text-xs text-muted-foreground">This section is under active development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}