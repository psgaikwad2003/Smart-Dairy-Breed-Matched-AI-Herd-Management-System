import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dynamicStore } from '../api/dynamicStore';
import { Settings as SettingsIcon, ShieldCheck, Bell, Dna, Save, RefreshCw, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || user?.name || 'Technician Manager',
    email: user?.email || 'admin@smartdairy.com',
    role: user?.role || 'ADMIN',
    inbreedingThreshold: '6.25',
    lowStockThreshold: '10',
    a2a2Preference: true,
    realtimeAlerts: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System preferences and breeding AI guardrails saved successfully! ⚙️');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all dynamic local data back to initial sample state?')) {
      dynamicStore.resetToDefault();
      toast.success('Dynamic store restored to default initial dataset! 🔄');
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <SettingsIcon size={11} /> System Preferences
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Account & Breeding AI Settings</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
          Customize user profile, safety thresholds for inbreeding algorithms, and real-time alert preferences.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: User Profile */}
        <div className="glass-card">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-marigold)' }} />
            Field Operator Profile
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="input" value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Email / Username</label>
              <input className="input" value={profile.email} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <input className="input font-mono-tabular" value={profile.role} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Sector District</label>
              <input className="input" defaultValue="Anand Central Dairy Sector" />
            </div>
          </div>
        </div>

        {/* Section 2: Breeding AI Safety Guardrails */}
        <div className="glass-card">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dna size={18} style={{ color: 'var(--color-marigold)' }} />
            Genetic Breeding Guardrail Thresholds
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Max Allowed Inbreeding Coefficient (%)</label>
              <input type="number" step="0.01" className="input font-mono-tabular"
                value={profile.inbreedingThreshold}
                onChange={e => setProfile(p => ({ ...p, inbreedingThreshold: e.target.value }))} />
              <span style={{ fontSize: 12, color: 'var(--color-husk-tan)', marginTop: 4, display: 'block' }}>
                Combinations above this % trigger mandatory technician override rationale.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Low Stock Semen Warning Threshold</label>
              <input type="number" className="input font-mono-tabular"
                value={profile.lowStockThreshold}
                onChange={e => setProfile(p => ({ ...p, lowStockThreshold: e.target.value }))} />
              <span style={{ fontSize: 12, color: 'var(--color-husk-tan)', marginTop: 4, display: 'block' }}>
                Triggers visual milk-drop alert when batch falls below count.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Toggles & Data Store Reset */}
        <div className="glass-card">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} style={{ color: 'var(--color-marigold)' }} />
            Real-Time Field Notifications & Data Engine
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(251,247,238,0.03)', borderRadius: 10, cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-dairy-white)' }}>WebSocket Field Alerts</div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Receive real-time push alerts when new breeding logs or low stock items are recorded.</div>
              </div>
              <input type="checkbox" checked={profile.realtimeAlerts} onChange={e => setProfile(p => ({ ...p, realtimeAlerts: e.target.checked }))} style={{ accentColor: 'var(--color-marigold)', width: 18, height: 18 }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(251,247,238,0.03)', borderRadius: 10, cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-dairy-white)' }}>Default Certified A2A2 Sire Filter</div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Automatically prioritize A2A2 certified sire straws in breeding recommendations.</div>
              </div>
              <input type="checkbox" checked={profile.a2a2Preference} onChange={e => setProfile(p => ({ ...p, a2a2Preference: e.target.checked }))} style={{ accentColor: 'var(--color-marigold)', width: 18, height: 18 }} />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.025)', borderRadius: 10, border: '1px solid var(--color-border)', marginTop: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-dairy-white)' }}>Restore Default Demo Data Engine</div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Resets all locally added cows, straws, milk logs, and breeding events back to factory defaults.</div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={handleResetData} style={{ fontSize: 13, padding: '8px 14px' }}>
                <RotateCcw size={14} /> Reset Local Data
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="submit" className="btn btn-accent" style={{ padding: '10px 24px', fontSize: 14.5 }}>
            <Save size={16} /> Save Preference Settings
          </button>
        </div>
      </form>
    </div>
  );
}
