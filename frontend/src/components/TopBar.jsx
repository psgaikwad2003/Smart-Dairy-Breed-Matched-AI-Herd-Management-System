import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search, Bell, Sparkles, Plus, ShieldCheck,
  Calendar, Layers, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ unreadCount, onQuickAction }) {
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
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} style={{ width: 340 }}>
        <div className="input-wrapper">
          <Search size={16} className="input-icon" />
          <input
            type="text"
            className="input input-with-icon"
            placeholder="Search cows (e.g., KRN-HF-001), breed, or straws..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: 38, fontSize: 13, background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-pill)' }}
          />
          <span style={{
            position: 'absolute', right: 10,
            fontSize: 10.5, fontWeight: 700,
            color: 'var(--color-text-muted)',
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 6px', borderRadius: 4,
            border: '1px solid var(--color-border)',
          }}>
            ⌘K
          </span>
        </div>
      </form>

      {/* Right Action Bar & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* System Status Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 12, fontWeight: 600, color: 'var(--color-primary-bright)',
          background: 'rgba(16,185,129,0.08)', padding: '5px 12px',
          borderRadius: 'var(--radius-pill)', border: '1px solid rgba(16,185,129,0.25)',
        }}>
          <CheckCircle2 size={13} />
          <span>System Healthy</span>
        </div>

        {/* Quick Action Button */}
        <button
          className="btn btn-primary"
          onClick={() => navigate('/breeding')}
          style={{ height: 36, padding: '0 14px', fontSize: 12.5, borderRadius: 'var(--radius-pill)' }}
        >
          <Plus size={15} /> New AI Record
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => navigate('/alerts')}
          style={{
            position: 'relative', width: 38, height: 38,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)', color: 'var(--color-text-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-bright)'; e.currentTarget.style.color = 'var(--color-primary-bright)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-dim)'; }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--color-rose)', color: 'white',
              fontSize: 10, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #060a08',
            }}>
              {unreadCount > 9 ? '•' : unreadCount}
            </span>
          )}
        </button>

        {/* User Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '4px 10px 4px 6px', borderRadius: 'var(--radius-pill)',
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#03180e',
          }}>
            {(user?.fullName || 'U')[0]}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
            {user?.fullName?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
