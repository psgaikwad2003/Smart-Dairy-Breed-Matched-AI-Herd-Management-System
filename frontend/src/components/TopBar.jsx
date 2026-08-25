import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { exportHerdRegisterCSV } from '../utils/exportUtils';
import { dynamicStore } from '../api/dynamicStore';
import { Search, Bell, Plus, CheckCircle2, Sun, Moon, Download, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TopBar({ unreadCount }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('en');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/herd?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleQuickExport = () => {
    const cows = dynamicStore.getCows();
    exportHerdRegisterCSV(cows);
    toast.success('Exporting Herd Register CSV report... 📄');
  };

  return (
    <header className="pro-topbar">
      {/* Ear-Tag Quick Search */}
      <form onSubmit={handleSearchSubmit} style={{ width: 340 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-surface-alt)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--color-border)' }}>
          <Globe size={14} style={{ color: 'var(--color-marigold)' }} />
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
            <option value="en" style={{ background: '#1c2b33' }}>English</option>
            <option value="hi" style={{ background: '#1c2b33' }}>हिंदी</option>
            <option value="gu" style={{ background: '#1c2b33' }}>ગુજરાતી</option>
          </select>
        </div>

        {/* Sunlight / Glassmorphism Theme Toggle */}
        <button onClick={toggleTheme} style={{
          width: 38, height: 38, borderRadius: '50%', background: 'var(--color-surface-alt)',
          border: '1.5px solid var(--color-border)', color: 'var(--color-marigold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }} title="Toggle Sunlight Field Mode">
          {theme === 'sunlight' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Quick CSV Export */}
        <button className="btn btn-secondary" onClick={handleQuickExport} style={{ height: 38, padding: '0 12px', fontSize: 12.5, borderRadius: 'var(--radius-pill)' }} title="Export Herd Register CSV">
          <Download size={14} /> Export CSV
        </button>

        {/* Quick Action */}
        <button className="btn btn-primary" onClick={() => navigate('/breeding')}
          style={{ height: 38, padding: '0 14px', fontSize: 13, borderRadius: 'var(--radius-pill)' }}>
          <Plus size={15} /> Record Insemination
        </button>

        {/* Notifications */}
        <button onClick={() => navigate('/alerts')}
          style={{
            position: 'relative', width: 38, height: 38, borderRadius: '50%',
            background: 'var(--color-surface-alt)', border: '1.5px solid var(--color-border)',
            color: 'var(--color-husk-tan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'var(--transition-fast)',
          }}>
          <Bell size={17} />
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
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 12px 4px 6px', borderRadius: 'var(--radius-pill)',
          background: 'var(--color-surface-alt)', border: '1.5px solid var(--color-border)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--color-pasture)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#FFFDF7',
          }}>{(user?.fullName || 'U')[0]}</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
            {user?.fullName?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
