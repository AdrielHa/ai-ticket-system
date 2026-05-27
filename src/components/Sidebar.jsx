import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Ticket, Bot, Users, BarChart3, Settings,
  Zap, X, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Tickets', icon: Ticket, path: '/tickets' },
  { label: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const content = (
    <div className="flex flex-col h-full" style={{ background: 'hsl(222,47%,7%)', borderRight: '1px solid hsl(217,32%,14%)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid hsl(217,32%,14%)' }}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 0 1px hsl(217,91%,70%/0.3), 0 4px 12px hsl(217,91%,60%/0.25)' }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[13px] text-foreground tracking-tight leading-none">AI Ticket</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 tracking-wide uppercase font-medium">System</span>
        </div>
        <button onClick={onClose} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group relative select-none',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'hsl(217,91%,60%/0.1)', border: '1px solid hsl(217,91%,60%/0.15)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              {!active && (
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ background: 'hsl(220,30%,18%/0.6)' }} />
              )}
              <Icon className={cn('w-4 h-4 relative z-10 flex-shrink-0', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors')} />
              <span className="relative z-10 flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto relative z-10 text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid hsl(217,32%,14%)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-150 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0" style={{ background: 'hsl(217,91%,60%/0.15)', border: '1px solid hsl(217,91%,60%/0.2)' }}>AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-none mb-0.5">Admin User</p>
            <p className="text-[11px] text-muted-foreground truncate">admin@company.com</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-success" style={{ boxShadow: '0 0 6px hsl(160,84%,39%/0.6)' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col h-screen sticky top-0">
        {content}
      </aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden flex flex-col"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}