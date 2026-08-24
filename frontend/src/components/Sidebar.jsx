import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, FlaskConical, Dna, BarChart3,
  Bell, Users, LogOut, Wifi, WifiOff, Droplets, Sparkles,
  ChevronRight, ShieldCheck
} from 'lucide-react';

const mainNav = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
];

const herdNav = [
  { to: '/herd',      icon: PawPrint,        label: 'My Herd' },
  { to: '/breeding',  icon: Dna,             label: 'Breeding AI' },
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
          color: 'var(--color-text-muted)',
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
            fontSize: 13.5, fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--color-primary-bright)' : 'var(--color-text-dim)',
            background: isActive ? 'linear-gradient(90deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 100%)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--color-primary-bright)' : '3px solid transparent',
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
      {/* Brand Header */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyCenter: 'center',
          fontSize: 22,
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
        }}>
          🐄
        </div>
        <div>
          <div className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>
            Smart Dairy
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>
            Breed AI Platform
          </div>
        </div>
      </div>

      {/* Live Connection Status */}
      <div style={{ padding: '12px 18px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 'var(--radius-xs)',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: 'var(--color-text-dim)' }}>
            <span className={`pulse-dot ${connected ? 'pulse-dot-emerald' : 'pulse-dot-rose'}`} />
            {connected ? 'WebSocket Live' : 'System Offline'}
          </div>
          <div style={{ fontSize: 11, color: connected ? 'var(--color-primary-bright)' : 'var(--color-text-muted)' }}>
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
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

      {/* User Profile & Sign Out Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--color-border)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#000',
              border: '2px solid rgba(251, 191, 36, 0.4)',
            }}>
              {(user?.fullName || user?.name || 'U')[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>
                {user?.fullName || user?.name || 'User'}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--color-text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={11} style={{ color: 'var(--color-primary-bright)' }} />
                {user?.role?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost" onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'center', gap: 8, fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
          <LogOut size={14} /> Sign Out Account
        </button>
      </div>
    </aside>
  );
}
