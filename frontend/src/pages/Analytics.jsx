import { useState, useEffect } from 'react';
import { cowApi, milkApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BarChart2 } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const PIE_COLORS = ['#34d399','#60a5fa','#fbbf24','#f87171','#a78bfa','#34d3d3','#fb923c'];

export default function Analytics() {
  const { user } = useAuth();
  const [breedDist, setBreedDist] = useState([]);
  const [yieldTrend, setYieldTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmerId = user?.farmerId;
    if (!farmerId) { setLoading(false); return; }

    Promise.all([
      cowApi.getBreedDist(farmerId),
      milkApi.getBreedComp(farmerId),
    ]).then(([bd, bc]) => {
      setBreedDist((bd.data.data || []).map(r => ({
        name: String(r[0] || '').replace(/_/g, ' '),
        value: Number(r[1] || 0),
      })));
      setYieldTrend((bc.data.data || []).map(r => ({
        breed: String(r[0] || '').replace(/_/g, ' '),
        avgLitres: Number(Number(r[1] || 0).toFixed(2)),
      })));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={22} style={{ color: 'var(--color-primary)' }} /> Analytics
        </h1>
        <p className="page-subtitle">Herd composition and production performance</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Breed Distribution Pie */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Herd Breed Distribution</h3>
          {breedDist.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="icon">📊</div>
              <p>No herd data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={breedDist} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--color-border)' }}>
                  {breedDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }}
                  formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Yield by Breed Area */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Avg. Yield by Breed (Litres/session)</h3>
          {yieldTrend.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="icon">📈</div>
              <p>Log milk yield to see analytics</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={yieldTrend} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="ylGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="breed" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} angle={-15} textAnchor="end" axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
                <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }}
                  formatter={v => [`${v}L`, 'Avg Yield']} />
                <Area type="monotone" dataKey="avgLitres"
                  stroke="var(--color-info)" strokeWidth={2}
                  fill="url(#ylGrad)"
                  dot={{ fill: 'var(--color-info)', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insights Panel */}
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>💡 Smart Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '🐄', label: 'Best Yield Breed', value: yieldTrend.length > 0 ? yieldTrend.reduce((a,b) => a.avgLitres > b.avgLitres ? a : b).breed : '—' },
            { icon: '📊', label: 'Breed Diversity', value: `${breedDist.length} breeds` },
            { icon: '🌾', label: 'Season', value: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
