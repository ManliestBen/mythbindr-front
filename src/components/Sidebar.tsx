import { NavLink } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../auth/AuthProvider';
import SystemStatus from './SystemStatus';

interface NavItem {
  to: string;
  label: string;
  /** Not yet built — routes to a placeholder. */
  soon?: boolean;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/campaigns', label: 'Campaigns', soon: true },
  { to: '/npcs', label: 'NPCs', soon: true },
  { to: '/locations', label: 'Locations', soon: true },
  { to: '/encounters', label: 'Encounters', soon: true },
  { to: '/items', label: 'Items', soon: true },
  { to: '/notes', label: 'Notes', soon: true },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { theme } = useTheme();
  const { user, logout, busy } = useAuth();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-app-border bg-app-surface">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-app-border bg-app-surface2 font-heading text-xl font-bold text-brand">
          M
        </div>
        <div>
          <div className="font-heading text-lg font-bold leading-none">
            Myth<span className="text-brand">Bindr</span>
          </div>
          <div className="mt-1 text-[11px] italic text-fg-muted">
            {theme.tagline}
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm',
                isActive
                  ? 'bg-app-surface2 text-fg'
                  : 'text-fg-muted hover:text-fg',
              ].join(' ')
            }
          >
            <span className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {item.label}
            </span>
            {item.soon && (
              <span className="rounded-full border border-app-border px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-fg-muted">
                soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="border-t border-app-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium">
                  {user.displayName}
                </span>
                {user.isAdmin && (
                  <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => logout()}
              disabled={busy}
              className="rounded-md border border-app-border px-2 py-1 text-[11px] text-fg-muted hover:text-fg disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-app-border px-5 py-3">
        <SystemStatus />
      </div>
    </aside>
  );
}
