import { useState, useEffect } from 'react';
import { inventoryApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { Plus, PackageOpen, AlertTriangle, RefreshCw, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GRADES = ['A', 'B', 'C'];
const BREEDS = ['GIR','SAHIWAL','RED_SINDHI','THARPARKAR','RATHI','HARIANA','HF','JERSEY','HF_CROSSBRED','JERSEY_CROSSBRED','MURRAH','JAFFARABADI','BANNI','MEHSANA','PANDHARPURI'];

export default function Inventory() {
  const [straws, setStraws]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showAdd, setShowAdd]       = useState(false);
  const [restockId, setRestockId]   = useState(null);
  const [restockQty, setRestockQty] = useState(10);
  const [newStraw, setNewStraw]     = useState({
    breed: 'GIR', batchNo: '', semenStationName: '', stationGrade: 'A',
    stockQty: 20, productionDate: '', expiryDate: '', bullId: '',
  });

  const loadStraws = () => {
    setLoading(true);
    inventoryApi.getStraws()
      .then(r => setStraws(r.data?.data || dynamicStore.getStraws()))
      .catch(() => setStraws(dynamicStore.getStraws()))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStraws();
    const unsubscribe = dynamicStore.subscribe(() => loadStraws());
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.addStraw(newStraw);
      toast.success('Semen straw batch added to inventory! 🧪');
      setShowAdd(false);
      loadStraws();
    } catch (err) {
      toast.error('Failed to add straw batch');
    }
  };

  const handleRestock = async () => {
    try {
      await inventoryApi.restock(restockId, Number(restockQty));
      toast.success(`Restocked +${restockQty} straws successfully!`);
      setRestockId(null);
      loadStraws();
    } catch (err) {
      toast.error('Restock action failed');
    }
  };

  const lowStock = straws.filter(s => s.stockQty <= 10);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald">
                <Sparkles size={11} /> Field Semen Inventory
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Semen Straw Stock Batches</h1>
            <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
              {straws.length} active batches · {lowStock.length} low stock alerts (&lt;10 straws remaining)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={loadStraws} style={{ borderRadius: 'var(--radius-pill)' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-accent" onClick={() => setShowAdd(true)} style={{ borderRadius: 'var(--radius-pill)' }}>
              <Plus size={16} /> Add Semen Straw Batch
            </button>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div style={{
          marginBottom: 24, padding: '16px 22px',
          background: 'var(--color-status-warning-bg)', borderRadius: 14,
          border: '1.5px solid var(--color-status-warning)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <AlertTriangle size={20} style={{ color: 'var(--color-marigold)', flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: 'var(--color-dairy-white)', fontWeight: 600 }}>
            <strong>{lowStock.length} semen batch{lowStock.length > 1 ? 'es' : ''}</strong> with low stock (&lt;10 straws remaining) — order more immediately.
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Status Marker</th>
              <th>Batch Number</th>
              <th>Breed Standard</th>
              <th>Semen Station</th>
              <th>Station Grade</th>
              <th>Available Straws</th>
              <th>Production Date</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array(6).fill(null).map((_, i) => (
              <tr key={i}>{Array(9).fill(null).map((_, j) => (
                <td key={j}><div className="skeleton" style={{ height: 18, width: '80%' }} /></td>
              ))}</tr>
            )) : straws.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-husk-tan)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🧪</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-dairy-white)' }}>No semen straw batches logged</div>
                <p style={{ fontSize: 13.5, marginTop: 4 }}>Add your first semen straw batch to enable breed-matching.</p>
              </td></tr>
            ) : straws.map(s => {
              const isFull  = s.stockQty > 10;
              const isHalf  = s.stockQty > 0 && s.stockQty <= 10;

              return (
                <tr key={s.id}>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`milk-drop-dot ${isFull ? 'milk-drop-full' : isHalf ? 'milk-drop-half' : 'milk-drop-empty'}`} title={isFull ? 'Well Stocked' : isHalf ? 'Low Stock' : 'Out of Stock'} />
                  </td>
                  <td className="mono-col">
                    <span style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--color-marigold)' }}>
                      #{s.batchNo}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-dairy-white)', fontWeight: 600 }}>
                      {s.breed?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: 13.5, color: 'var(--color-husk-tan)' }}>
                    {s.semenStationName || 'Central Bull Station'}
                  </td>
                  <td>
                    <span className={`badge ${s.stationGrade === 'A' ? 'badge-emerald' : s.stationGrade === 'B' ? 'badge-amber' : 'badge-muted'}`}>
                      Grade {s.stationGrade}
                    </span>
                  </td>
                  <td className="mono-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontWeight: 800, fontSize: 16,
                        color: s.stockQty <= 3 ? 'var(--color-status-mismatch)' :
                               s.stockQty <= 10 ? 'var(--color-marigold)' : '#72b276',
                      }}>{s.stockQty} straws</span>
                      {s.stockQty <= 10 && <AlertTriangle size={14} style={{ color: 'var(--color-marigold)' }} />}
                    </div>
                  </td>
                  <td className="mono-col" style={{ fontSize: 13, color: 'var(--color-husk-tan)' }}>{s.productionDate || '—'}</td>
                  <td className="mono-col" style={{ fontSize: 13, color: 'var(--color-husk-tan)' }}>{s.expiryDate || '—'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ fontSize: 12.5, padding: '5px 12px' }}
                      onClick={() => { setRestockId(s.id); setRestockQty(10); }}>
                      <PackageOpen size={13} /> Restock Batch
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Batch Modal */}
      {showAdd && (
        <div className="pro-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="pro-modal-content" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>🧪 Add Semen Straw Batch</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Batch Number *</label>
                <input className="input font-mono-tabular" placeholder="e.g. NDDB-GIR-2024-001" required
                  value={newStraw.batchNo} onChange={e => setNewStraw(p => ({ ...p, batchNo: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Breed Standard</label>
                <select className="select" value={newStraw.breed}
                  onChange={e => setNewStraw(p => ({ ...p, breed: e.target.value }))}>
                  {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Station Quality Grade</label>
                <select className="select" value={newStraw.stationGrade}
                  onChange={e => setNewStraw(p => ({ ...p, stationGrade: e.target.value }))}>
                  {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Semen Station Facility</label>
                <input className="input" placeholder="e.g. NDDB Central Bull Station Anand" value={newStraw.semenStationName}
                  onChange={e => setNewStraw(p => ({ ...p, semenStationName: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Straw Count</label>
                <input type="number" className="input font-mono-tabular" min={1} value={newStraw.stockQty}
                  onChange={e => setNewStraw(p => ({ ...p, stockQty: Number(e.target.value) }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Production Date</label>
                <input type="date" className="input font-mono-tabular" value={newStraw.productionDate}
                  onChange={e => setNewStraw(p => ({ ...p, productionDate: e.target.value }))} />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                  Add Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockId && (
        <div className="pro-modal-backdrop" onClick={() => setRestockId(null)}>
          <div className="pro-modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📦 Restock Straw Batch</h2>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Additional Straws Quantity</label>
              <input type="number" className="input font-mono-tabular" min={1} value={restockQty}
                onChange={e => setRestockQty(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRestockId(null)}>
                Cancel
              </button>
              <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleRestock}>
                Restock Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
