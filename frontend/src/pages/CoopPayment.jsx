import { useState, useEffect } from 'react';
import { cowApi, milkApi } from '../api/client';
import { IndianRupee, TrendingUp, TrendingDown, Droplets, Plus, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// Common Indian dairy co-op pricing slabs
const CO_OP_PRICES = [
  { name: 'Amul (Anand)',         morning: 46, evening: 44, fatBonus: 0.8 },
  { name: 'Karnataka Milk (KMF)', morning: 44, evening: 42, fatBonus: 0.7 },
  { name: 'Mother Dairy',         morning: 48, evening: 46, fatBonus: 0.9 },
  { name: 'Nandini',              morning: 43, evening: 41, fatBonus: 0.7 },
  { name: 'Local Co-op',          morning: 40, evening: 38, fatBonus: 0.5 },
  { name: 'Private Contractor',   morning: 38, evening: 36, fatBonus: 0.0 },
];

export default function CoopPayment() {
  const [cows, setCows]               = useState([]);
  const [logs, setLogs]               = useState([]);
  const [selectedCoop, setSelectedCoop] = useState(0); // index into CO_OP_PRICES
  const [fatPct, setFatPct]           = useState(4.5);
  const [showLog, setShowLog]         = useState(false);
  const [form, setForm]               = useState({
    cowId: '', session: 'MORNING', qty: '', date: new Date().toISOString().split('T')[0], fatPct: 4.5
  });
  const [weekData, setWeekData]       = useState([]);

  useEffect(() => {
    cowApi.getAll({ page: 0, size: 50 }).then(r => {
      const list = r.data.data?.content || r.data.data || [];
      setCows(list);
      if (list.length) {
        setForm(p => ({ ...p, cowId: list[0].id }));
        loadLogs(list[0].id);
      }
    }).catch(() => {});
  }, []);

  const loadLogs = (cowId) => {
    milkApi.getCowHistory(cowId)
      .then(r => {
        const data = r.data.data || [];
        setLogs(data);
        // Build last-7-days bar chart data
        const now = new Date();
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (6 - i));
          const key = d.toISOString().split('T')[0];
          const dayLogs = data.filter(l => l.date === key);
          const totalLitres = dayLogs.reduce((acc, l) => acc + (l.quantityLitres || 0), 0);
          return {
            day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
            date: key,
            litres: Number(totalLitres.toFixed(1)),
          };
        });
        setWeekData(days);
      })
      .catch(() => {});
  };

  const coop = CO_OP_PRICES[selectedCoop];

  // Compute payment for a single log entry
  const entryPayment = (entry) => {
    const rate = entry.session === 'MORNING' ? coop.morning : coop.evening;
    const fat  = entry.fatPercentage || fatPct;
    const bonus = coop.fatBonus * Math.max(0, fat - 4.0); // bonus above 4% fat
    return Number(((rate + bonus) * entry.quantityLitres).toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await milkApi.log({
        cow: { id: Number(form.cowId) },
        quantityLitres: Number(form.qty),
        session: form.session,
        date: form.date,
        fatPercentage: Number(form.fatPct),
      });
      toast.success('Milk collection session recorded! 🥛');
      setShowLog(false);
      loadLogs(form.cowId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  // Totals from logs
  const totalLitres  = logs.reduce((a, l) => a + (l.quantityLitres || 0), 0);
  const totalEarned  = logs.reduce((a, l) => a + entryPayment(l), 0);
  const todayStr     = new Date().toISOString().split('T')[0];
  const todayLogs    = logs.filter(l => l.date === todayStr);
  const todayLitres  = todayLogs.reduce((a, l) => a + (l.quantityLitres || 0), 0);
  const todayEarned  = todayLogs.reduce((a, l) => a + entryPayment(l), 0);

  return (
    <div className="fade-in" style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald"><Sparkles size={11} /> Daily Co-op Tracker</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Milk Collection & Co-op Payment Tracker</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-chai)', marginTop: 4 }}>
          Log morning & evening sessions, pick your dairy co-op, and see today's exact earnings — including fat bonus calculations.
        </p>
      </div>

      {/* Co-op Selector Strip */}
      <div className="coop-strip" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dairy-white)', whiteSpace: 'nowrap' }}>
          🏭 Your Co-op:
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {CO_OP_PRICES.map((c, i) => (
            <button key={c.name} onClick={() => setSelectedCoop(i)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', border: '1px solid',
                background: i === selectedCoop ? 'var(--color-sunrise)' : 'rgba(255,248,236,0.05)',
                color: i === selectedCoop ? '#1A1410' : 'var(--color-chai)',
                borderColor: i === selectedCoop ? 'var(--color-sunrise)' : 'var(--color-border)',
                transition: 'var(--transition-fast)',
              }}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-dairy-white)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span className="font-mono-tabular">₹{coop.morning}/L</span>
          <span style={{ color: 'var(--color-chai)', margin: '0 6px' }}>morning</span>
          <span className="font-mono-tabular">₹{coop.evening}/L</span>
          <span style={{ color: 'var(--color-chai)', margin: '0 6px' }}>evening</span>
          {coop.fatBonus > 0 && <span style={{ color: '#7db86a' }}>+₹{coop.fatBonus}/0.1% fat</span>}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Today's Litres", value: `${todayLitres.toFixed(1)} L`, color: 'var(--color-sunrise)', bg: 'rgba(245,166,35,0.12)' },
          { label: "Today's Earnings", value: `₹${todayEarned.toFixed(0)}`, color: '#7db86a', bg: 'rgba(90,144,64,0.12)' },
          { label: 'Total Litres (All)', value: `${totalLitres.toFixed(1)} L`, color: 'var(--color-sky)', bg: 'rgba(107,174,214,0.12)' },
          { label: 'Total Earnings (All)', value: `₹${totalEarned.toFixed(0)}`, color: '#f5bf5a', bg: 'rgba(212,133,26,0.12)' },
        ].map(c => (
          <div key={c.label} className="pro-stat-card" style={{ '--stat-color': c.color, '--stat-bg': c.bg }}>
            <div className="stat-icon-wrapper" style={{ marginBottom: 12 }}>
              <IndianRupee size={20} />
            </div>
            <div className="stat-main-val font-mono-tabular" style={{ fontSize: 28 }}>{c.value}</div>
            <div className="stat-sub-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* 7-Day Yield Chart */}
        <div className="glass-card">
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} style={{ color: 'var(--color-sunrise)' }} />
            Last 7 Days Collection
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,151,106,0.07)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--color-chai)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-chai)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
              <Tooltip contentStyle={{ background: '#2C1F14', border: '1px solid var(--color-border)', borderRadius: 10, color: 'white' }}
                formatter={v => [`${v} L`, 'Collected']} />
              <Bar dataKey="litres" radius={[6,6,0,0]}>
                {weekData.map((entry, i) => (
                  <Cell key={i} fill={entry.date === todayStr ? 'var(--color-sunrise)' : 'var(--color-paddy)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cattle Selector & Session Action */}
        <div className="glass-card">
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplets size={18} style={{ color: 'var(--color-sunrise)' }} />
            Select Cattle & View Sessions
          </h2>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Cattle Ear Tag</label>
            <select className="select font-mono-tabular" value={form.cowId}
              onChange={e => { setForm(p => ({...p, cowId: e.target.value})); loadLogs(e.target.value); }}>
              {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber} — {c.breed?.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Default Fat % (for payment)</label>
            <input type="number" step="0.1" className="input font-mono-tabular"
              value={fatPct} onChange={e => setFatPct(Number(e.target.value))} />
          </div>
          <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => setShowLog(true)}>
            <Plus size={16} /> Log New Session
          </button>
        </div>
      </div>

      {/* Recent Session Log */}
      <div className="glass-card">
        <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>All Recorded Sessions</h2>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-chai)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🥛</div>
            <p>No sessions logged yet. Click "Log New Session" to start.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="pro-table">
              <thead><tr>
                <th>Date</th><th>Session</th><th>Litres</th><th>Fat %</th><th>Rate (₹/L)</th><th>Fat Bonus</th><th>Payment</th>
              </tr></thead>
              <tbody>
                {logs.slice(0, 20).map(l => {
                  const rate  = l.session === 'MORNING' ? coop.morning : coop.evening;
                  const fat   = l.fatPercentage || fatPct;
                  const bonus = coop.fatBonus * Math.max(0, fat - 4.0);
                  const pay   = ((rate + bonus) * l.quantityLitres).toFixed(2);
                  return (
                    <tr key={l.id}>
                      <td className="mono-col">{l.date}</td>
                      <td><span className={`badge ${l.session === 'MORNING' ? 'badge-amber' : 'badge-sky'}`}>{l.session}</span></td>
                      <td className="mono-col" style={{ fontWeight: 800, color: 'var(--color-dairy-white)', fontSize: 16 }}>{l.quantityLitres} L</td>
                      <td className="mono-col">{fat}%</td>
                      <td className="mono-col">₹{rate}/L</td>
                      <td className="mono-col" style={{ color: '#7db86a' }}>+₹{bonus.toFixed(2)}</td>
                      <td className="mono-col" style={{ fontWeight: 800, color: 'var(--color-sunrise)', fontSize: 16 }}>₹{pay}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLog && (
        <div className="pro-modal-backdrop" onClick={() => setShowLog(false)}>
          <div className="pro-modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>🥛 Log Milk Session</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowLog(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Cattle Tag</label>
                <select className="select font-mono-tabular" value={form.cowId}
                  onChange={e => setForm(p => ({...p, cowId: e.target.value}))}>
                  {cows.map(c => <option key={c.id} value={c.id}>{c.tagNumber} — {c.breed?.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="input font-mono-tabular" value={form.date}
                    onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Session</label>
                  <select className="select" value={form.session} onChange={e => setForm(p => ({...p, session: e.target.value}))}>
                    <option value="MORNING">☀️ Morning</option>
                    <option value="EVENING">🌙 Evening</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Litres Collected *</label>
                  <input type="number" step="0.1" min="0" required className="input font-mono-tabular"
                    placeholder="e.g. 8.5" value={form.qty} onChange={e => setForm(p => ({...p, qty: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat % (SNF)</label>
                  <input type="number" step="0.1" className="input font-mono-tabular" value={form.fatPct}
                    onChange={e => setForm(p => ({...p, fatPct: e.target.value}))} />
                </div>
              </div>
              {form.qty && (
                <div style={{ padding: 12, borderRadius: 10, background: 'var(--color-status-match-bg)', border: '1px solid var(--color-status-match)', fontSize: 14, fontWeight: 700 }}>
                  Estimated Payment: <span style={{ color: 'var(--color-sunrise)', fontSize: 18 }}>
                    ₹{((form.session === 'MORNING' ? coop.morning : coop.evening) + coop.fatBonus * Math.max(0, Number(form.fatPct) - 4.0)) * Number(form.qty || 0) |0}
                  </span>
                  <span style={{ color: 'var(--color-chai)', fontSize: 12, fontWeight: 500 }}> (preview)</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowLog(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
