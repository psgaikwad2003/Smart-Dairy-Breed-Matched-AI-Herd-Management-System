import { useState, useEffect } from 'react';
import { farmerApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { Users, Plus, Phone, MapPin, Search, RefreshCw, X, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Farmers() {
  const [farmers, setFarmers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    name: '', phone: '', address: '', village: '', district: '', state: 'Gujarat'
  });

  const loadFarmers = () => {
    setLoading(true);
    farmerApi.getAll()
      .then(r => setFarmers(r.data?.data || dynamicStore.getFarmers()))
      .catch(() => setFarmers(dynamicStore.getFarmers()))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFarmers();
    const unsubscribe = dynamicStore.subscribe(() => loadFarmers());
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await farmerApi.create(newFarmer);
      toast.success('Farmer registered successfully! 👨‍🌾');
      setShowAdd(false);
      setNewFarmer({ name: '', phone: '', address: '', village: '', district: '', state: 'Gujarat' });
      loadFarmers();
    } catch (err) {
      toast.error('Failed to register farmer');
    }
  };

  const filtered = farmers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.phone?.includes(search) ||
    f.village?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald">
                <ShieldCheck size={11} /> Registered Co-operative Directory
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Farmer Directory</h1>
            <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
              Manage registered dairy farmers, locations, and linked cattle herds across rural sectors.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={loadFarmers} style={{ borderRadius: 'var(--radius-pill)' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-accent" onClick={() => setShowAdd(true)} style={{ borderRadius: 'var(--radius-pill)' }}>
              <Plus size={16} /> Register New Farmer
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="input-wrapper" style={{ maxWidth: 380 }}>
          <Search size={16} className="input-icon" style={{ color: 'var(--color-marigold)' }} />
          <input className="input input-with-icon" placeholder="Search farmer name, phone, or village..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--color-husk-tan)', fontWeight: 600 }}>
          Total Registered: <strong style={{ color: 'var(--color-dairy-white)' }}>{filtered.length} Farmers</strong>
        </div>
      </div>

      {/* Farmers Grid */}
      {loading ? (
        <div className="grid-3">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="glass-card"><div className="skeleton" style={{ height: 120 }} /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-husk-tan)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍🌾</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-dairy-white)' }}>No Farmers Registered Yet</div>
          <p style={{ fontSize: 14, marginTop: 4 }}>Register your first dairy farmer to link cattle ear tags.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(f => (
            <div key={f.id} className="glass-card ear-tag-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-pasture)', color: 'var(--color-marigold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16,
                    border: '2px solid var(--color-marigold)'
                  }}>
                    {f.name[0]}
                  </div>
                  <span className="badge badge-emerald">Active Farmer</span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-dairy-white)' }}>{f.name}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, fontSize: 13.5, color: 'var(--color-husk-tan)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={14} style={{ color: 'var(--color-marigold)' }} />
                    <span className="font-mono-tabular">{f.phone || '+91 98765 43210'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} style={{ color: 'var(--color-marigold)' }} />
                    <span>{f.village || 'Anand Village'}, {f.district || 'Anand'}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Registered ID:</span>
                <span className="font-mono-tabular" style={{ color: 'var(--color-marigold)', fontWeight: 700 }}>#FARM-{f.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Farmer Modal */}
      {showAdd && (
        <div className="pro-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="pro-modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>👨‍🌾 Register New Farmer</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="input" placeholder="e.g. Ramesh Patel" required
                  value={newFarmer.name} onChange={e => setNewFarmer(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone *</label>
                <input className="input font-mono-tabular" placeholder="e.g. +91 98250 12345" required
                  value={newFarmer.phone} onChange={e => setNewFarmer(p => ({ ...p, phone: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Village</label>
                  <input className="input" placeholder="e.g. Anand"
                    value={newFarmer.village} onChange={e => setNewFarmer(p => ({ ...p, village: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input className="input" placeholder="e.g. Anand"
                    value={newFarmer.district} onChange={e => setNewFarmer(p => ({ ...p, district: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                  Register Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
