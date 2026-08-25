import { useState, useEffect } from 'react';
import { cowApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, RefreshCw, Filter, Sparkles, X, ChevronRight, Trash2, Edit3, Eye } from 'lucide-react';
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
  const [cows, setCows]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  // Modals
  const [showAdd, setShowAdd]             = useState(false);
  const [viewCow, setViewCow]             = useState(null);
  const [editStatusCow, setEditStatusCow] = useState(null);

  const [newCow, setNewCow]               = useState({
    tagNumber: '', breed: 'GIR', status: 'ACTIVE', lactationCount: 1, currentMilkYieldLitres: 14.0, farmerId: user?.farmerId || 1
  });

  const loadCows = () => {
    setLoading(true);
    cowApi.getAll()
      .then(r => setCows(r.data?.data || dynamicStore.getCows()))
      .catch(() => setCows(dynamicStore.getCows()))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCows();
    const unsubscribe = dynamicStore.subscribe(() => loadCows());
    return () => unsubscribe();
  }, [user]);

  const filtered = cows.filter(c => {
    const matchesSearch = c.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
                          c.breed?.toLowerCase().includes(search.toLowerCase());
    const matchesBreed  = selectedBreed === 'ALL' || c.breed === selectedBreed;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesBreed && matchesStatus;
  });

  const handleAddCow = async (e) => {
    e.preventDefault();
    try {
      await cowApi.create(newCow);
      toast.success('New cattle ear-tag registered successfully! 🐄');
      setShowAdd(false);
      setNewCow({ tagNumber: '', breed: 'GIR', status: 'ACTIVE', lactationCount: 1, currentMilkYieldLitres: 14.0, farmerId: user?.farmerId || 1 });
      loadCows();
    } catch (err) {
      toast.error('Failed to register cattle');
    }
  };

  const handleUpdateStatus = (cowId, status) => {
    dynamicStore.updateCowStatus(cowId, status);
    toast.success(`Cattle status updated to ${status}! 🏷️`);
    setEditStatusCow(null);
    loadCows();
  };

  const handleDeleteCow = (cowId, tag) => {
    if (window.confirm(`Are you sure you want to remove cattle ear tag ${tag}?`)) {
      dynamicStore.deleteCow(cowId);
      toast.success(`Cattle tag ${tag} removed from directory.`);
      loadCows();
    }
  };

  return (
    <div className="fade-in">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-emerald">
              <Sparkles size={11} /> Live Cattle Directory
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>
            Herd Ear-Tag Profiles ({cows.length})
          </h1>
          <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
            Field-tested cattle ear-tag tracking, lactation status, and dynamic yield history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={loadCows} style={{ borderRadius: 'var(--radius-pill)' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-accent" onClick={() => setShowAdd(true)} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={16} /> Register New Cattle Tag
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div className="input-wrapper" style={{ width: 340 }}>
            <Search size={16} className="input-icon" style={{ color: 'var(--color-marigold)' }} />
            <input
              type="text" className="input input-with-icon font-mono-tabular"
              placeholder="Search ear-tag (e.g. TN-GJ-001) or breed..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={14} style={{ color: 'var(--color-husk-tan)' }} />
              <select
                className="select"
                value={selectedBreed}
                onChange={e => setSelectedBreed(e.target.value)}
                style={{ width: 170, height: 38, borderRadius: 'var(--radius-pill)', fontSize: 13 }}
              >
                <option value="ALL">All Breeds ({cows.length})</option>
                {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            <select
              className="select"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ width: 150, height: 38, borderRadius: 'var(--radius-pill)', fontSize: 13 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRY">DRY</option>
              <option value="SOLD">SOLD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Cattle Ear Tag ID</th>
              <th>Breed Standard</th>
              <th>Lactation Status</th>
              <th>Lactation Count</th>
              <th>Current Daily Yield</th>
              <th>Expected Calving</th>
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
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-husk-tan)' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🐄</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-dairy-white)' }}>No cattle records found</div>
                  <p style={{ fontSize: 13.5, marginTop: 4 }}>Try clearing search filters or register a new cattle tag.</p>
                </td>
              </tr>
            ) : (
              filtered.map(cow => (
                <tr key={cow.id}>
                  <td className="mono-col">
                    <div className="ear-tag-badge" style={{ cursor: 'pointer' }} onClick={() => setViewCow(cow)}>
                      <span className="ear-tag-rivet" />
                      {cow.tagNumber}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-dairy-white)', fontWeight: 600 }}>
                      {cow.breed?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGES[cow.status] || 'badge-muted'}`}
                      style={{ cursor: 'pointer' }} onClick={() => setEditStatusCow(cow)} title="Click to update status">
                      {cow.status} ✏️
                    </span>
                  </td>
                  <td className="mono-col">
                    {cow.lactationCount ?? 1}
                  </td>
                  <td className="mono-col">
                    {cow.currentMilkYieldLitres ? (
                      <span style={{ color: 'var(--color-marigold)', fontWeight: 800 }}>
                        {cow.currentMilkYieldLitres} L/day
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>0 L/day</span>
                    )}
                  </td>
                  <td className="mono-col" style={{ color: 'var(--color-husk-tan)', fontSize: 13.5 }}>
                    {cow.expectedCalvingDate || 'Not gestating'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 12.5, padding: '4px 8px' }}
                        onClick={() => setViewCow(cow)}>
                        <Eye size={13} /> View Profile
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: 12.5, padding: '4px 8px', color: 'var(--color-status-mismatch)' }}
                        onClick={() => handleDeleteCow(cow.id, cow.tagNumber)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Cow Profile Modal */}
      {viewCow && (
        <div className="pro-modal-backdrop" onClick={() => setViewCow(null)}>
          <div className="pro-modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="ear-tag-badge" style={{ fontSize: 18 }}>
                  <span className="ear-tag-rivet" />
                  {viewCow.tagNumber}
                </div>
                <span className={`badge ${STATUS_BADGES[viewCow.status] || 'badge-muted'}`}>{viewCow.status}</span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setViewCow(null)}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 16, background: 'var(--color-surface-alt)', borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Breed Standard:</span><div style={{ fontWeight: 800 }}>{viewCow.breed?.replace(/_/g, ' ')}</div></div>
                <div><span style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Daily Yield:</span><div className="font-mono-tabular" style={{ fontWeight: 800, color: 'var(--color-marigold)' }}>{viewCow.currentMilkYieldLitres || 12} L/day</div></div>
                <div><span style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Lactation Count:</span><div className="font-mono-tabular" style={{ fontWeight: 800 }}>{viewCow.lactationCount || 1}</div></div>
                <div><span style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Date of Birth:</span><div className="font-mono-tabular">{viewCow.dateOfBirth || '2021-04-10'}</div></div>
              </div>

              <div style={{ padding: 14, background: 'rgba(78, 122, 81, 0.15)', borderRadius: 12, border: '1px solid #72b276' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#72b276' }}>BREEDING & GESTATION STATUS</div>
                <div style={{ fontSize: 13.5, color: 'var(--color-dairy-white)', marginTop: 4 }}>
                  Last Inseminated: <strong>{viewCow.lastInseminationDate || '2026-06-10'}</strong>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--color-marigold)', marginTop: 2 }}>
                  Expected Calving Date: <strong>{viewCow.expectedCalvingDate || '2027-03-18'}</strong>
                </div>
              </div>

              <button className="btn btn-accent" style={{ width: '100%', marginTop: 8 }}
                onClick={() => setViewCow(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editStatusCow && (
        <div className="pro-modal-backdrop" onClick={() => setEditStatusCow(null)}>
          <div className="pro-modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🏷️ Update Status for {editStatusCow.tagNumber}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {['ACTIVE', 'DRY', 'SOLD', 'DECEASED'].map(st => (
                <button key={st} className={`btn ${editStatusCow.status === st ? 'btn-accent' : 'btn-secondary'}`}
                  onClick={() => handleUpdateStatus(editStatusCow.id, st)} style={{ justifyContent: 'center' }}>
                  Set Status: {st}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setEditStatusCow(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Cow Modal */}
      {showAdd && (
        <div className="pro-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="pro-modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>🐄 Register Cattle Ear-Tag</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCow} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Ear Tag ID / Number *</label>
                <input className="input font-mono-tabular" placeholder="e.g. TN-GJ-008" required
                  value={newCow.tagNumber} onChange={e => setNewCow(p => ({ ...p, tagNumber: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Breed Standard *</label>
                <select className="select" value={newCow.breed}
                  onChange={e => setNewCow(p => ({ ...p, breed: e.target.value }))}>
                  {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Initial Lactation Status</label>
                  <select className="select" value={newCow.status}
                    onChange={e => setNewCow(p => ({ ...p, status: e.target.value }))}>
                    {['ACTIVE','DRY','SOLD'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Daily Yield (L/day)</label>
                  <input type="number" step="0.5" className="input font-mono-tabular" value={newCow.currentMilkYieldLitres}
                    onChange={e => setNewCow(p => ({ ...p, currentMilkYieldLitres: Number(e.target.value) }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                  Save Ear Tag Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
