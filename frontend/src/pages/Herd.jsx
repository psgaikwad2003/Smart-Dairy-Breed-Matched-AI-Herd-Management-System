import { useState, useEffect } from 'react';
import { cowApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Tag, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  ACTIVE:   'badge-success',
  DRY:      'badge-warning',
  SOLD:     'badge-muted',
  DECEASED: 'badge-danger',
};

const BREEDS = ['GIR','SAHIWAL','RED_SINDHI','THARPARKAR','RATHI','HARIANA','HF','JERSEY','HF_CROSSBRED','JERSEY_CROSSBRED','MURRAH','JAFFARABADI','BANNI','MEHSANA','PANDHARPURI'];

export default function Herd() {
  const { user } = useAuth();
  const [cows, setCows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newCow, setNewCow]   = useState({ tagNumber: '', name: '', breed: 'GIR', status: 'ACTIVE', farmerId: user?.farmerId });

  const load = () => {
    setLoading(true);
    const req = user?.farmerId ? cowApi.getByFarmer(user.farmerId) : cowApi.getAll({ page: 0, size: 50 });
    req.then(r => setCows(r.data.data?.content || r.data.data || []))
       .catch(() => setCows([]))
       .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = cows.filter(c =>
    c.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
    c.breed?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await cowApi.create(newCow);
      toast.success('Cow registered! 🐄');
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register cow');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">My Herd 🐄</h1>
            <p className="page-subtitle">{cows.length} cattle registered</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={load}><RefreshCw size={14} /></button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Cow</button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input" style={{ paddingLeft: 36 }}
            placeholder="Search by tag or breed…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tag Number</th>
                <th>Breed</th>
                <th>Status</th>
                <th>Lactation</th>
                <th>Current Yield</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(null).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(null).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No cattle found. Add your first cow!
                  </td>
                </tr>
              ) : (
                filtered.map(cow => (
                  <tr key={cow.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag size={12} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{cow.tagNumber}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-dim)' }}>{cow.breed?.replace(/_/g, ' ')}</td>
                    <td><span className={`badge ${STATUS_COLORS[cow.status] || 'badge-muted'}`}>{cow.status}</span></td>
                    <td style={{ color: 'var(--color-text-dim)' }}>{cow.lactationCount ?? '—'}</td>
                    <td>
                      {cow.currentMilkYieldLitres
                        ? <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{cow.currentMilkYieldLitres}L</span>
                        : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{cow.dateOfBirth || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}
                          onClick={() => toast('Breeding history — coming soon!', { icon: '🧬' })}>
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cow Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🐄 Register New Cow</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Tag Number *</label>
                <input className="input" placeholder="e.g. TN-GJ-001" required
                  value={newCow.tagNumber} onChange={e => setNewCow(p => ({ ...p, tagNumber: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Breed *</label>
                <select className="select" value={newCow.breed}
                  onChange={e => setNewCow(p => ({ ...p, breed: e.target.value }))}>
                  {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="select" value={newCow.status}
                  onChange={e => setNewCow(p => ({ ...p, status: e.target.value }))}>
                  {['ACTIVE','DRY','SOLD','DECEASED'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Register Cow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
