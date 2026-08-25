import { useState, useEffect } from 'react';
import { milkApi, cowApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { useAuth } from '../context/AuthContext';
import { Plus, Droplets, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function Milk() {
  const { user }  = useAuth();
  const [cows, setCows]       = useState([]);
  const [logs, setLogs]       = useState([]);
  const [breedComp, setBreed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [form, setForm]       = useState({
    cowId: '', quantityLitres: '', session: 'MORNING',
    date: new Date().toISOString().split('T')[0],
    fatPercentage: '4.5',
  });

  const loadMilkData = () => {
    const farmerId = user?.farmerId;
    Promise.all([
      farmerId ? cowApi.getByFarmer(farmerId) : cowApi.getAll(),
      milkApi.getBreedComp(farmerId),
    ]).then(([c, b]) => {
      const cowList = c.data?.data?.content || c.data?.data || dynamicStore.getCows();
      setCows(cowList);
      if (cowList.length > 0 && !form.cowId) {
        setForm(p => ({ ...p, cowId: String(cowList[0].id) }));
        setLogs(dynamicStore.getMilkLogs(cowList[0].id));
      }

      const breedData = (b.data?.data || dynamicStore.getBreedComparison()).map(row => ({
        breed: String(row[0] || '').replace(/_/g, ' '),
        avgLitres: Number(Number(row[1] || 0).toFixed(2)),
      }));
      setBreed(breedData);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMilkData();
    const unsubscribe = dynamicStore.subscribe(() => loadMilkData());
    return () => unsubscribe();
  }, [user]);

  const loadLogs = (cowId) => {
    if (!cowId) return;
    setLogs(dynamicStore.getMilkLogs(cowId));
  };

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      await milkApi.log({
        cow: { id: Number(form.cowId) },
        quantityLitres: Number(form.quantityLitres),
        session: form.session,
        date: form.date,
        fatPercentage: form.fatPercentage ? Number(form.fatPercentage) : 4.5,
      });
      toast.success('Milk yield collection entry saved! 🥛');
      setShowLog(false);
      loadMilkData();
      loadLogs(form.cowId);
    } catch (err) {
      toast.error('Failed to log milk yield');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald">
                <Sparkles size={11} /> Production Tracker
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>Milk Yield Analytics & Collection</h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Record daily milk collection sessions and track production performance by breed standard.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowLog(true)} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={15} /> Log Milk Collection
          </button>
        </div>
      </div>

      {/* Breed Performance Chart */}
      {breedComp.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplets size={18} style={{ color: 'var(--color-sky)' }} />
            Average Milk Yield Comparison by Breed Standard
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={breedComp} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="breed" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} angle={-15} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
              <Tooltip contentStyle={{ background: '#0b130f', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10, color: 'white' }}
                formatter={(v) => [`${v} Liters / day`, 'Avg Yield']} />
              <Bar dataKey="avgLitres" fill="var(--color-sky)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cow Selector & History Panel */}
      <div className="grid-2">
        <div className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Select Cattle Ear Tag</h3>
          <select className="select" value={form.cowId} onChange={e => { setForm(p => ({...p, cowId: e.target.value})); loadLogs(e.target.value); }}>
            <option value="">— Select registered cow —</option>
            {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber} ({c.breed?.replace(/_/g,' ')})</option>)}
          </select>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Historical Yield Logs</h3>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>
              Select a cattle ear tag to view past milking sessions
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
              {logs.slice(0, 15).map(l => (
                <div key={l.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.025)',
                  borderRadius: 10, border: '1px solid var(--color-border)'
                }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{l.date}</div>
                    <span className={`badge ${l.session === 'MORNING' ? 'badge-amber' : 'badge-sky'}`} style={{ marginTop: 2 }}>
                      {l.session} SESSION
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-marigold)' }}>{l.quantityLitres} L</div>
                    {l.fatPercentage && <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Fat Content: {l.fatPercentage}% · ₹{l.earnings || Math.round(l.quantityLitres * 48)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Yield Modal */}
      {showLog && (
        <div className="pro-modal-backdrop" onClick={() => setShowLog(false)}>
          <div className="pro-modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>🥛 Log Milk Collection</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowLog(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Cattle Tag ID *</label>
                <select className="select" required value={form.cowId}
                  onChange={e => setForm(p => ({...p, cowId: e.target.value}))}>
                  <option value="">— Select cow —</option>
                  {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber} ({c.breed?.replace(/_/g,' ')})</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="input font-mono-tabular" value={form.date}
                    onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Milking Session</label>
                  <select className="select" value={form.session}
                    onChange={e => setForm(p => ({...p, session: e.target.value}))}>
                    <option value="MORNING">Morning Session</option>
                    <option value="EVENING">Evening Session</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Liters *</label>
                  <input type="number" step="0.1" min="0" className="input font-mono-tabular" placeholder="e.g. 14.5" required
                    value={form.quantityLitres}
                    onChange={e => setForm(p => ({...p, quantityLitres: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat %</label>
                  <input type="number" step="0.1" className="input font-mono-tabular" placeholder="e.g. 4.5"
                    value={form.fatPercentage}
                    onChange={e => setForm(p => ({...p, fatPercentage: e.target.value}))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowLog(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                  Save Collection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
