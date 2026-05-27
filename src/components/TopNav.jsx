import { Bell, Search, Menu, Plus, Command } from 'lucide-react';
import { useState } from 'react';

export default function TopNav({ onMenuClick, title }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="h-14 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30"
      style={{
        background: 'hsl(220,47%,8%/0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid hsl(217,32%,14%/0.8)',
      }}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-accent"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-[13px] font-semibold text-foreground hidden sm:block tracking-tight">{title}</h1>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ml-auto cursor-text"
        style={{
          background: searchFocused ? 'hsl(220,30%,14%)' : 'hsl(220,30%,12%)',
          border: searchFocused ? '1px solid hsl(217,91%,60%/0.4)' : '1px solid hsl(217,32%,17%)',
          boxShadow: searchFocused ? '0 0 0 3px hsl(217,91%,60%/0.08)' : 'none',
          width: searchFocused ? '280px' : '220px',
        }}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
          <kbd className="flex items-center justify-center text-[10px] text-muted-foreground/60 rounded px-1 py-0.5 font-mono" style={{ background: 'hsl(220,30%,18%)', border: '1px solid hsl(217,32%,22%)' }}>
            <Command className="w-2.5 h-2.5" />
          </kbd>
          <kbd className="flex items-center justify-center text-[10px] text-muted-foreground/60 rounded px-1.5 py-0.5 font-mono" style={{ background: 'hsl(220,30%,18%)', border: '1px solid hsl(217,32%,22%)' }}>K</kbd>
        </div>
      </div>

      {/* New Ticket */}
      <button
        className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, hsl(217,91%,62%), hsl(217,91%,52%))',
          boxShadow: '0 1px 3px hsl(0,0%,0%/0.3), 0 0 0 1px hsl(217,91%,60%/0.2), inset 0 1px 0 hsl(0,0%,100%/0.1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform = ''}
      >
        <Plus className="w-3.5 h-3.5" />
        New Ticket
      </button>

      {/* Bell */}
      <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-accent">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 6px hsl(217,91%,60%/0.8)' }} />
      </button>

      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-primary cursor-pointer transition-all duration-150 hover:scale-105"
        style={{ background: 'hsl(217,91%,60%/0.15)', border: '1px solid hsl(217,91%,60%/0.25)' }}
      >
        AD
      </div>
    </header>
  );
}