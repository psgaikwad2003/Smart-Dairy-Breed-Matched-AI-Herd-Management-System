import { useState, useEffect } from 'react';
import { milkApi, cowApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Plus, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

export default function Milk() {
  const { user }  = useAuth();
  const [cows, setCows]       = useState([]);
  const [logs, setLogs]       = useState([]);
  const [breedComp, setBreed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({
    cowId: '', quantityLitres: '', session: 'MORNING',
    date: new Date().toISOString().split('T')[0],
    fatPercentage: '',
  });

  useEffect(() => {
    const farmerId = user?.farmerId;
    Promise.all([
      farmerId ? cowApi.getByFarmer(farmerId) : cowApi.getAll({ page: 0, size: 50 }),
      farmerId ? milkApi.getBreedComp(farmerId) : Promise.resolve({ data: { data: [] } }),
    ]).then(([c, b]) => {
      const cowList = c.data.data?.content || c.data.data || [];
      setCows(cowList);
      setBreed((b.data.data || []).map(row => ({
        breed: String(row[0] || '').replace(/_/g, ' '),
        avgLitres: Number(Number(row[1] || 0).toFixed(2)),
      })));
    }).finally(() => setLoading(false));
  }, []);

  const loadLogs = (cowId) => {
    if (!cowId) return;
    milkApi.getCowHistory(cowId)
      .then(r => setLogs(r.data.data || []))
      .catch(() => setLogs([]));
  };

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      await milkApi.log({
        cow: { id: Number(form.cowId) },
        quantityLitres: Number(form.quantityLitres),
        session: form.session,
        date: form.date,
        fatPercentage: form.fatPercentage ? Number(form.fatPercentage) : null,
      });
      toast.success('Yield logged! 🥛');
      setShowLog(false);
      loadLogs(form.cowId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log yield');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Milk Yield 🥛</h1>
            <p className="page-subtitle">Track daily production and breed performance</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowLog(true)}>
            <Plus size={14} /> Log Yield
          </button>
        </div>
      </div>

      {/* Breed Comparison Chart */}
      {breedComp.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplets size={16} style={{ color: 'var(--color-info)' }} />
            Average Yield by Breed
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breedComp} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="breed" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} angle={-20} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
              <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }}
                formatter={(v) => [`${v}L avg`, 'Yield']} />
              <Bar dataKey="avgLitres" fill="var(--color-info)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cow Selector + Log Table */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Select Cow</h3>
          <select className="select" onChange={e => { setForm(p => ({...p, cowId: e.target.value})); loadLogs(e.target.value); }}>
            <option value="">— Select a cow —</option>
            {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber} ({c.breed?.replace(/_/g,' ')})</option>)}
          </select>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Recent Logs</h3>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
              Select a cow to view yield history
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {logs.slice(0, 15).map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{l.date}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{l.session}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{l.quantityLitres}L</div>
                    {l.fatPercentage && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Fat: {l.fatPercentage}%</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Modal */}
      {showLog && (
        <div className="modal-overlay" onClick={() => setShowLog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🥛 Log Milk Yield</h2>
            <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Cow *</label>
                <select className="select" required value={form.cowId}
                  onChange={e => setForm(p => ({...p, cowId: e.target.value}))}>
                  <option value="">— Select cow —</option>
                  {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="input" value={form.date}
                    onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Session</label>
                  <select className="select" value={form.session}
                    onChange={e => setForm(p => ({...p, session: e.target.value}))}>
                    <option value="MORNING">Morning</option>
                    <option value="EVENING">Evening</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity (Litres) *</label>
                  <input type="number" step="0.1" min="0" className="input" placeholder="12.5" required
                    value={form.quantityLitres}
                    onChange={e => setForm(p => ({...p, quantityLitres: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat % (optional)</label>
                  <input type="number" step="0.1" className="input" placeholder="4.2"
                    value={form.fatPercentage}
                    onChange={e => setForm(p => ({...p, fatPercentage: e.target.value}))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowLog(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Log Yield</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
