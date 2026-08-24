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
    if (searchQuery.trim()) {
      navigate(`/herd?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="pro-topbar">
      {/* Ear-Tag Quick Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ width: 360 }}>
        <div className="input-wrapper">
          <Search size={16} className="input-icon" style={{ color: 'var(--color-marigold)' }} />
          <input
            type="text"
            className="input input-with-icon font-mono-tabular"
            placeholder="Search ear-tag ID (e.g. TN-GJ-001) or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: 40, fontSize: 13.5, background: 'rgba(251,247,238,0.04)', borderRadius: 'var(--radius-pill)' }}
          />
          <span style={{
            position: 'absolute', right: 12,
            fontSize: 10.5, fontWeight: 700,
            color: 'var(--color-husk-tan)',
            background: 'rgba(217,201,163,0.1)',
            padding: '2px 6px', borderRadius: 4,
            border: '1px solid var(--color-border)',
          }}>
            ⌘K
          </span>
        </div>
      </form>

      {/* Right Action Bar & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* System Healthy Status Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 12.5, fontWeight: 700, color: '#72b276',
          background: 'rgba(78, 122, 81, 0.18)', padding: '6px 14px',
          borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-status-match)',
        }}>
          <CheckCircle2 size={14} />
          <span>System Healthy</span>
        </div>

        {/* Quick Action Button */}
        <button
          className="btn btn-accent"
          onClick={() => navigate('/breeding')}
          style={{ height: 38, padding: '0 16px', fontSize: 13, borderRadius: 'var(--radius-pill)' }}
        >
          <Plus size={16} /> Record Insemination
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => navigate('/alerts')}
          style={{
            position: 'relative', width: 40, height: 40,
            borderRadius: '50%', background: 'rgba(251,247,238,0.04)',
            border: '1px solid var(--color-border)', color: 'var(--color-dairy-white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-marigold)'; e.currentTarget.style.color = 'var(--color-marigold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-dairy-white)'; }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--color-status-mismatch)', color: 'white',
              fontSize: 10.5, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #1C2B33',
            }}>
              {unreadCount > 9 ? '•' : unreadCount}
            </span>
          )}
        </button>

        {/* Technician Profile Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '5px 12px 5px 6px', borderRadius: 'var(--radius-pill)',
          background: 'rgba(251,247,238,0.04)', border: '1px solid var(--color-border)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--color-pasture)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: 'var(--color-marigold)',
            border: '1.5px solid var(--color-marigold)'
          }}>
            {(user?.fullName || 'U')[0]}
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-dairy-white)' }}>
            {user?.fullName?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
