import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, FlaskConical, Dna, BarChart3,
  Bell, Users, LogOut, Wifi, WifiOff, Droplets
} from 'lucide-react';

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/herd',      icon: PawPrint,        label: 'My Herd' },
  { to: '/breeding',  icon: Dna,             label: 'Breeding AI' },
  { to: '/inventory', icon: FlaskConical,    label: 'Semen Inventory' },
  { to: '/milk',      icon: Droplets,        label: 'Milk Yield' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  { to: '/alerts',    icon: Bell,            label: 'Alerts' },
];

const adminItems = [
  { to: '/farmers',   icon: Users,           label: 'Farmers' },
];

export default function Sidebar({ connected, unreadCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🐄</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>
              Smart Dairy
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Herd Management
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
          {user?.fullName || user?.name || 'User'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <span className="badge badge-success" style={{ fontSize: 10 }}>
            {user?.role?.replace('_', ' ')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: connected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
            {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8,
            fontSize: 14, fontWeight: 500,
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            background: isActive ? 'var(--color-primary-glow)' : 'transparent',
            border: isActive ? '1px solid rgba(52,211,153,0.2)' : '1px solid transparent',
            transition: 'var(--transition)',
            textDecoration: 'none',
          })}>
            <Icon size={16} />
            {label}
            {label === 'Alerts' && unreadCount > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'var(--color-danger)',
                color: 'white', borderRadius: '100px', fontSize: 10,
                padding: '1px 6px', fontWeight: 700,
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </NavLink>
        ))}

        {(user?.role === 'ADMIN') && (
          <>
            <div style={{ padding: '10px 12px 4px', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8 }}>
              Admin
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                transition: 'var(--transition)', textDecoration: 'none',
                border: '1px solid transparent',
              })}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--color-border)' }}>
        <button className="btn btn-ghost" onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
