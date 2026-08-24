import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, FlaskConical, Dna, BarChart3,
  Bell, Users, LogOut, Wifi, WifiOff, Droplets, ShieldCheck
} from 'lucide-react';

const mainNav = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
];

const herdNav = [
  { to: '/herd',      icon: PawPrint,        label: 'My Herd' },
  { to: '/breeding',  icon: Dna,             label: 'Breeding AI & Sires' },
  { to: '/milk',      icon: Droplets,        label: 'Milk Yield Logs' },
];

const supplyNav = [
  { to: '/inventory', icon: FlaskConical,    label: 'Semen Inventory' },
];

const insightsNav = [
  { to: '/analytics', icon: BarChart3,       label: 'Analytics & Yield' },
  { to: '/alerts',    icon: Bell,            label: 'System Alerts' },
];

const adminNav = [
  { to: '/farmers',   icon: Users,           label: 'Farmer Directory' },
];

export default function Sidebar({ connected, unreadCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavGroup = (title, items) => (
    <div style={{ marginBottom: 18 }}>
      {title && (
        <div style={{
          padding: '0 14px 6px',
          fontSize: 10.5,
          fontWeight: 700,
          color: 'var(--color-husk-tan)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
            fontSize: 14, fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--color-marigold)' : 'var(--color-dairy-white)',
            background: isActive ? 'linear-gradient(90deg, rgba(232,169,62,0.18) 0%, rgba(47,75,60,0.1) 100%)' : 'transparent',
            borderLeft: isActive ? '3.5px solid var(--color-marigold)' : '3.5px solid transparent',
            transition: 'var(--transition-fast)',
            textDecoration: 'none',
            position: 'relative',
          })}>
            <Icon size={17} style={{ color: 'inherit', opacity: 0.9 }} />
            <span>{label}</span>
            {label.includes('Alerts') && unreadCount > 0 && (
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
      {/* Ear-Tag Styled Brand Header */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(47, 75, 60, 0.4)'
      }}>
        <div className="milk-drop-frame" style={{ width: 44, height: 44, flexShrink: 0 }}>
          <div className="milk-drop-frame-inner" style={{ fontSize: 20 }}>
            🐄
          </div>
        </div>
        <div>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-dairy-white)', lineHeight: 1.1 }}>
            Smart Dairy
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--color-marigold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3, fontWeight: 700 }}>
            Breed-Matched AI
          </div>
        </div>
      </div>

      {/* Field Connection Status */}
      <div style={{ padding: '12px 18px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 'var(--radius-xs)',
          background: 'rgba(251, 247, 238, 0.03)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--color-dairy-white)' }}>
            <span className={`milk-drop-dot ${connected ? 'milk-drop-full' : 'milk-drop-empty'}`} />
            {connected ? 'Real-Time Sync' : 'Offline Mode'}
          </div>
          <div style={{ fontSize: 11, color: connected ? 'var(--color-marigold)' : 'var(--color-text-muted)' }}>
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav style={{ flex: 1, padding: '10px 14px', overflowY: 'auto' }}>
        {renderNavGroup('Overview', mainNav)}
        {renderNavGroup('Herd & Breeding', herdNav)}
        {renderNavGroup('Semen Inventory', supplyNav)}
        {renderNavGroup('Analytics & Alerts', insightsNav)}

        {user?.role === 'ADMIN' && renderNavGroup('Administration', adminNav)}
      </nav>

      {/* Technician / Vet Profile Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--color-border)',
        background: 'rgba(28, 43, 51, 0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--color-pasture)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: 'var(--color-marigold)',
              border: '2px solid var(--color-marigold)',
            }}>
              {(user?.fullName || user?.name || 'U')[0]}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-dairy-white)', lineHeight: 1.1 }}>
                {user?.fullName || user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-marigold)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <ShieldCheck size={12} style={{ color: 'var(--color-marigold)' }} />
                {user?.role?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost" onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'center', gap: 8, fontSize: 13, padding: '8px 10px', borderRadius: 8, background: 'rgba(251,247,238,0.04)' }}>
          <LogOut size={14} /> Sign Out Account
        </button>
      </div>
    </aside>
  );
}
