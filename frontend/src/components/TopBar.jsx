import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Plus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ unreadCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/herd?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="pro-topbar">
      {/* Ear-Tag Quick Search */}
      <form onSubmit={handleSearchSubmit} style={{ width: 360 }}>
        <div className="input-wrapper">
          <Search size={16} className="input-icon" style={{ color: 'var(--color-marigold)' }} />
          <input
            type="text"
            className="input input-with-icon font-mono-tabular"
            placeholder="Search ear-tag ID or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: 40, fontSize: 13.5, borderRadius: 'var(--radius-pill)' }}
          />
          <span style={{
            position: 'absolute', right: 12, fontSize: 10.5, fontWeight: 700,
            color: 'var(--color-chai)', background: 'var(--color-surface-alt)',
            padding: '2px 6px', borderRadius: 4, border: '1px solid var(--color-border)',
          }}>⌘K</span>
        </div>
      </form>

      {/* Right Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* System Status Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 12.5, fontWeight: 700, color: 'var(--color-status-match)',
          background: 'var(--color-status-match-bg)', padding: '6px 14px',
          borderRadius: 'var(--radius-pill)', border: '1px solid rgba(37,107,42,0.3)',
        }}>
          <CheckCircle2 size={14} />
          <span>System Ready</span>
        </div>

        {/* Quick Action */}
        <button className="btn btn-primary" onClick={() => navigate('/breeding')}
          style={{ height: 38, padding: '0 16px', fontSize: 13, borderRadius: 'var(--radius-pill)' }}>
          <Plus size={15} /> Record Insemination
        </button>

        {/* Notifications */}
        <button onClick={() => navigate('/alerts')}
          style={{
            position: 'relative', width: 40, height: 40, borderRadius: '50%',
            background: 'var(--color-surface-alt)', border: '1.5px solid var(--color-border)',
            color: 'var(--color-husk-tan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-marigold)'; e.currentTarget.style.color = 'var(--color-marigold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-husk-tan)'; }}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -3, right: -3,
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--color-status-mismatch)', color: 'white',
              fontSize: 10.5, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--color-surface)',
            }}>{unreadCount > 9 ? '•' : unreadCount}</span>
          )}
        </button>

        {/* Profile Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '5px 14px 5px 6px', borderRadius: 'var(--radius-pill)',
          background: 'var(--color-surface-alt)', border: '1.5px solid var(--color-border)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--color-pasture)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#FFFDF7',
          }}>{(user?.fullName || 'U')[0]}</div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>
            {user?.fullName?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
