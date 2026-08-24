import { useState, useEffect } from 'react';
import { cowApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Tag, RefreshCw, Filter, Sparkles, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_BADGES = {
  ACTIVE:   'badge-emerald',
  DRY:      'badge-amber',
  SOLD:     'badge-muted',
  DECEASED: 'badge-rose',
};

const BREEDS = ['GIR','SAHIWAL','RED_SINDHI','THARPARKAR','RATHI','HARIANA','HF','JERSEY','HF_CROSSBRED','JERSEY_CROSSBRED','MURRAH','JAFFARABADI','BANNI','MEHSANA','PANDHARPURI'];

export default function Herd() {
  const { user } = useAuth();
  const [cows, setCows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [showAdd, setShowAdd]     = useState(false);
  const [newCow, setNewCow]       = useState({ tagNumber: '', breed: 'GIR', status: 'ACTIVE', farmerId: user?.farmerId });

  const loadCows = () => {
    setLoading(true);
    const req = user?.farmerId ? cowApi.getByFarmer(user.farmerId) : cowApi.getAll({ page: 0, size: 50 });
    req.then(r => setCows(r.data.data?.content || r.data.data || []))
       .catch(() => setCows([]))
       .finally(() => setLoading(false));
  };

  useEffect(loadCows, []);

  const filtered = cows.filter(c => {
    const matchesSearch = c.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
                          c.breed?.toLowerCase().includes(search.toLowerCase());
    const matchesBreed  = selectedBreed === 'ALL' || c.breed === selectedBreed;
    return matchesSearch && matchesBreed;
  });

  const handleAddCow = async (e) => {
    e.preventDefault();
    try {
      await cowApi.create(newCow);
      toast.success('New cattle registered successfully! 🐄');
      setShowAdd(false);
      loadCows();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register cattle');
    }
  };

  return (
    <div className="fade-in">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-emerald">
              <Sparkles size={11} /> Herd Management
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>
            Registered Cattle Herd ({cows.length})
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
            Manage individual cow profiles, lactation status, and historical milk yields.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={loadCows} style={{ borderRadius: 'var(--radius-pill)' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={15} /> Register New Cow
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div className="input-wrapper" style={{ width: 360 }}>
            <Search size={16} className="input-icon" />
            <input
              type="text" className="input input-with-icon"
              placeholder="Search tag number (e.g. TN-GJ-001) or breed..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
            <select
              className="select"
              value={selectedBreed}
              onChange={e => setSelectedBreed(e.target.value)}
              style={{ width: 180, height: 38, borderRadius: 'var(--radius-pill)' }}
            >
              <option value="ALL">All Breeds ({cows.length})</option>
              {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Tag Number</th>
              <th>Breed</th>
              <th>Lactation Status</th>
              <th>Lactation Count</th>
              <th>Current Milk Yield</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(6).fill(null).map((_, i) => (
                <tr key={i}>
                  {Array(7).fill(null).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 18, width: '80%' }} /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-text-muted)' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🐄</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>No cattle profiles found</div>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Try clearing search filters or add a new cattle record.</p>
                </td>
              </tr>
            ) : (
              filtered.map(cow => (
                <tr key={cow.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(16,185,129,0.12)', color: 'var(--color-primary-bright)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12
                      }}>
                        <Tag size={14} />
                      </div>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--color-text)' }}>
                        {cow.tagNumber}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>
                      {cow.breed?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGES[cow.status] || 'badge-muted'}`}>
                      {cow.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>
                      {cow.lactationCount ?? '—'}
                    </span>
                  </td>
                  <td>
                    {cow.currentMilkYieldLitres ? (
                      <span style={{ color: 'var(--color-primary-bright)', fontWeight: 700 }}>
                        {cow.currentMilkYieldLitres} L/day
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    {cow.dateOfBirth || '—'}
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6 }}
                      onClick={() => toast(`Viewing AI history for ${cow.tagNumber}`, { icon: '🧬' })}>
                      AI History <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Cow Modal */}
      {showAdd && (
        <div className="pro-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="pro-modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>🐄 Register Cattle Profile</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCow} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Ear Tag ID / Number *</label>
                <input className="input" placeholder="e.g. KRN-HF-001" required
                  value={newCow.tagNumber} onChange={e => setNewCow(p => ({ ...p, tagNumber: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Breed Standard *</label>
                <select className="select" value={newCow.breed}
                  onChange={e => setNewCow(p => ({ ...p, breed: e.target.value }))}>
                  {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Lactation Status</label>
                <select className="select" value={newCow.status}
                  onChange={e => setNewCow(p => ({ ...p, status: e.target.value }))}>
                  {['ACTIVE','DRY','SOLD','DECEASED'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: 'var(--radius-sm)' }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}>
                  Save Cow Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
