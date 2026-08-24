import { useState, useEffect } from 'react';
import { inventoryApi } from '../api/client';
import { Plus, PackageOpen, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const GRADES = ['A', 'B', 'C'];
const BREEDS = ['GIR','SAHIWAL','RED_SINDHI','THARPARKAR','RATHI','HARIANA','HF','JERSEY','HF_CROSSBRED','JERSEY_CROSSBRED','MURRAH','JAFFARABADI','BANNI','MEHSANA','PANDHARPURI'];

export default function Inventory() {
  const [straws, setStraws]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [restockId, setRestockId]   = useState(null);
  const [restockQty, setRestockQty] = useState(10);
  const [newStraw, setNewStraw] = useState({
    breed: 'GIR', batchNo: '', semenStationName: '', stationGrade: 'A',
    stockQty: 20, productionDate: '', expiryDate: '', bullId: '',
  });

  const load = () => {
    setLoading(true);
    inventoryApi.getStraws()
      .then(r => setStraws(r.data.data || []))
      .catch(() => setStraws([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.addStraw(newStraw);
      toast.success('Straw batch added!');
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add straw');
    }
  };

  const handleRestock = async () => {
    try {
      await inventoryApi.restock(restockId, Number(restockQty));
      toast.success(`✅ Restocked +${restockQty} straws`);
      setRestockId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Restock failed');
    }
  };

  const lowStock = straws.filter(s => s.stockQty <= 10);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Semen Inventory 🧪</h1>
            <p className="page-subtitle">{straws.length} batches · {lowStock.length} low stock</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={load}><RefreshCw size={14} /></button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Batch</button>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div style={{
          marginBottom: 20, padding: '12px 16px',
          background: 'rgba(248,113,113,0.08)', borderRadius: 10,
          border: '1px solid rgba(248,113,113,0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'var(--color-danger)' }}>
            <strong>{lowStock.length}</strong> batch{lowStock.length > 1 ? 'es' : ''} critically low (&lt;10 straws)
          </span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Batch No.</th>
                <th>Breed</th>
                <th>Station</th>
                <th>Grade</th>
                <th>Stock</th>
                <th>Production</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(6).fill(null).map((_, i) => (
                <tr key={i}>{Array(8).fill(null).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                ))}</tr>
              )) : straws.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                  No inventory. Add your first batch!
                </td></tr>
              ) : straws.map(s => (
                <tr key={s.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
                      {s.batchNo}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-dim)' }}>{s.breed?.replace(/_/g, ' ')}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{s.semenStationName}</td>
                  <td>
                    <span className={`badge ${s.stationGrade === 'A' ? 'badge-success' : s.stationGrade === 'B' ? 'badge-warning' : 'badge-muted'}`}>
                      Grade {s.stationGrade}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontWeight: 700, fontSize: 16,
                        color: s.stockQty <= 3 ? 'var(--color-danger)' :
                               s.stockQty <= 10 ? 'var(--color-warning)' : 'var(--color-primary)',
                      }}>{s.stockQty}</span>
                      {s.stockQty <= 10 && <AlertTriangle size={12} style={{ color: 'var(--color-danger)' }} />}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.productionDate || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.expiryDate || '—'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }}
                      onClick={() => { setRestockId(s.id); setRestockQty(10); }}>
                      <PackageOpen size={12} /> Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🧪 Add Semen Batch</h2>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Batch Number *</label>
                <input className="input" placeholder="e.g. NDDB-GIR-2024-001" required
                  value={newStraw.batchNo} onChange={e => setNewStraw(p => ({ ...p, batchNo: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Breed</label>
                <select className="select" value={newStraw.breed}
                  onChange={e => setNewStraw(p => ({ ...p, breed: e.target.value }))}>
                  {BREEDS.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="select" value={newStraw.stationGrade}
                  onChange={e => setNewStraw(p => ({ ...p, stationGrade: e.target.value }))}>
                  {GRADES.map(g => <option key={g}>Grade {g}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Semen Station Name</label>
                <input className="input" placeholder="e.g. NDDB Anand" value={newStraw.semenStationName}
                  onChange={e => setNewStraw(p => ({ ...p, semenStationName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input type="number" className="input" min={1} value={newStraw.stockQty}
                  onChange={e => setNewStraw(p => ({ ...p, stockQty: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Production Date</label>
                <input type="date" className="input" value={newStraw.productionDate}
                  onChange={e => setNewStraw(p => ({ ...p, productionDate: e.target.value }))} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockId && (
        <div className="modal-overlay" onClick={() => setRestockId(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">📦 Restock Batch</h2>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Quantity to Add</label>
              <input type="number" className="input" min={1} value={restockQty}
                onChange={e => setRestockQty(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRestockId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRestock}>Restock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
