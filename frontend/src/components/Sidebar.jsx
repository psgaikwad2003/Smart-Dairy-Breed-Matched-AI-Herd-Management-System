import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, FlaskConical, Dna, BarChart3,
  Bell, Users, LogOut, Wifi, WifiOff, Droplets, ShieldCheck,
  Settings as SettingsIcon, Utensils, HeartPulse, IndianRupee, BookOpen
} from 'lucide-react';

const mainNav = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard' },
];
const herdNav = [
  { to: '/herd',          icon: PawPrint,        label: 'My Cattle Herd' },
  { to: '/breeding',      icon: Dna,             label: 'Sire Match & AI' },
  { to: '/breed-advisor', icon: BookOpen,        label: 'Breed & Category Guide' },
  { to: '/milk',          icon: Droplets,        label: 'Milk Yield Logs' },
  { to: '/coop-payment',  icon: IndianRupee,     label: 'Co-op Payment' },
  { to: '/feed-optimizer',icon: Utensils,        label: 'Feed Optimizer' },
  { to: '/health-tracker',icon: HeartPulse,      label: 'Heat & Vaccines' },
];
const supplyNav = [
  { to: '/inventory',     icon: FlaskConical,    label: 'Semen Straw Stock' },
];
const insightsNav = [
  { to: '/analytics',     icon: BarChart3,       label: 'Analytics' },
  { to: '/alerts',        icon: Bell,            label: 'Alerts' },
];
const adminNav = [
  { to: '/farmers',       icon: Users,           label: 'Farmer Directory' },
  { to: '/settings',      icon: SettingsIcon,    label: 'Settings' },
];

export default function Sidebar({ connected, unreadCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const renderGroup = (title, items) => (
    <div style={{ marginBottom: 20 }}>
      {title && (
        <div style={{ padding: '0 14px 5px', fontSize: 10.5, fontWeight: 700, color: 'var(--color-chai)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '9px 14px', borderRadius: var_sm,
            fontSize: 14, fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--color-pasture)' : 'var(--color-husk-tan)',
            background: isActive ? 'var(--color-pasture-tint)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--color-pasture)' : '3px solid transparent',
            transition: 'var(--transition-fast)',
            textDecoration: 'none',
          })}>
            <Icon size={17} style={{ color: 'inherit', flexShrink: 0 }} />
            <span>{label}</span>
            {label === 'Alerts' && unreadCount > 0 && (
              <span className="badge badge-rose" style={{ marginLeft: 'auto', padding: '1px 7px', fontSize: 10 }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="pro-sidebar">
      {/* Brand Header */}
      <div style={{
        padding: '18px 16px 14px',
        borderBottom: '1.5px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--color-surface)',
      }}>
        <div className="milk-drop-frame" style={{ width: 42, height: 42, flexShrink: 0 }}>
          <div className="milk-drop-frame-inner" style={{ fontSize: 20 }}>🐄</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', lineHeight: 1.1 }}>
            Smart Dairy
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--color-marigold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3, fontWeight: 700 }}>
            Breed-Matched AI
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{ padding: '10px 14px 4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 12px', borderRadius: 'var(--radius-sm)',
          background: connected ? 'var(--color-status-match-bg)' : 'var(--color-status-mismatch-bg)',
          border: `1px solid ${connected ? 'rgba(37,107,42,0.3)' : 'rgba(192,57,43,0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: connected ? 'var(--color-status-match)' : 'var(--color-status-mismatch)' }}>
            <span className={`milk-drop-dot ${connected ? 'milk-drop-full' : 'milk-drop-empty'}`} />
            {connected ? 'Live Sync Active' : 'Offline Mode'}
          </div>
          {connected ? <Wifi size={13} style={{ color: 'var(--color-status-match)' }} /> : <WifiOff size={13} style={{ color: 'var(--color-status-mismatch)' }} />}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {renderGroup('Operations', mainNav)}
        {renderGroup('Herd & Breeding', herdNav)}
        {renderGroup('Inventory', supplyNav)}
        {renderGroup('Reports', insightsNav)}
        {renderGroup('Admin', adminNav)}
      </nav>

      {/* User Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1.5px solid var(--color-border)', background: 'var(--color-surface-alt)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-pasture)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color: '#FFFDF7',
          }}>{(user?.fullName || user?.name || 'U')[0]}</div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>
              {user?.fullName || user?.name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-chai)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={11} style={{ color: 'var(--color-marigold)' }} />
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'center', gap: 8, fontSize: 13, padding: '8px 10px', borderRadius: 8 }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// small helper to avoid string eval in template literal inside JSX
const var_sm = 'var(--radius-sm)';
