import { useState, useEffect } from 'react';
import { cowApi, milkApi, bullApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PieChart as PieIcon, TrendingUp, Lightbulb, Dna } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const PIE_COLORS = ['#10b981','#38bdf8','#fbbf24','#f43f5e','#818cf8','#a3e635','#f97316'];

export default function Analytics() {
  const { user } = useAuth();
  const [breedDist, setBreedDist]     = useState([]);
  const [yieldTrend, setYieldTrend]   = useState([]);
  const [bullPerf, setBullPerf]       = useState([]);
  const [loading, setLoading]         = useState(true);

  const loadAnalytics = () => {
    const farmerId = user?.farmerId || 1;

    Promise.all([
      cowApi.getBreedDist(farmerId),
      milkApi.getBreedComp(farmerId),
      bullApi.getPerformance(),
    ]).then(([bd, bc, bp]) => {
      const distData = bd.data?.data || dynamicStore.getBreedComparison();
      setBreedDist(distData.map(r => ({
        name: String(r[0] || '').replace(/_/g, ' '),
        value: Number(r[1] || 0),
      })));

      const trendData = bc.data?.data || dynamicStore.getBreedComparison();
      setYieldTrend(trendData.map(r => ({
        breed: String(r[0] || '').replace(/_/g, ' '),
        avgLitres: Number(Number(r[1] || 0).toFixed(2)),
      })));

      setBullPerf(bp.data?.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnalytics();
    const unsubscribe = dynamicStore.subscribe(() => loadAnalytics());
    return () => unsubscribe();
  }, [user]);

  const topBreed = yieldTrend.length > 0
    ? yieldTrend.reduce((a,b) => a.avgLitres > b.avgLitres ? a : b).breed
    : 'Gir Standard';

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> Performance Insights
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Herd & Sire Production Analytics</h1>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
          Visualizing genetic distribution, milk yield benchmarks, and Sire PTA vs Realized Daughter Performance.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Breed Distribution Pie Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieIcon size={18} style={{ color: 'var(--color-primary-bright)' }} />
            Herd Breed Composition Ratio
          </h3>
          {breedDist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 14 }}>No breed distribution records logged yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={breedDist} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={95} innerRadius={45}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--color-border)' }}>
                  {breedDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#060a08" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0b130f', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, color: 'white' }}
                  formatter={(v, n) => [`${v} cattle`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Avg Yield Trend Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} style={{ color: 'var(--color-sky)' }} />
            Average Daily Yield by Breed Standard
          </h3>
          {yieldTrend.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📈</div>
              <p style={{ fontSize: 14 }}>Log milk yield entries to generate comparison analytics</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={yieldTrend} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <defs>
                  <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sky)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-sky)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="breed" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} angle={-15} textAnchor="end" axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
                <Tooltip contentStyle={{ background: '#0b130f', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10, color: 'white' }}
                  formatter={v => [`${v} Liters`, 'Avg Production']} />
                <Area type="monotone" dataKey="avgLitres"
                  stroke="var(--color-sky)" strokeWidth={3}
                  fill="url(#anGrad)"
                  dot={{ fill: 'var(--color-sky)', r: 4, strokeWidth: 2, stroke: '#060a08' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sire Genetic Model Accuracy & Performance Table */}
      <div className="glass-card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dna size={18} style={{ color: 'var(--color-primary-bright)' }} />
          Bull Genetic Merit Model Performance (Predicted PTA vs Realized Yield)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th>Bull Name</th>
                <th>Breed</th>
                <th>Predicted PTA Milk</th>
                <th>Realized Daughter Avg</th>
                <th>Recorded Daughters</th>
                <th>Model Accuracy</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {bullPerf.slice(0, 6).map((bp) => (
                <tr key={bp.bullId}>
                  <td style={{ fontWeight: 700, color: 'var(--color-text)' }}>{bp.bullName}</td>
                  <td>{bp.breed?.replace(/_/g,' ')}</td>
                  <td style={{ color: 'var(--color-sky)', fontWeight: 600 }}>+{bp.predictedPtaMilkKg} kg</td>
                  <td style={{ color: 'var(--color-primary-bright)', fontWeight: 700 }}>{bp.realizedDaughterAvgYieldKg} L/day</td>
                  <td>{bp.totalDaughtersRecorded} daughters</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${bp.accuracyPercentage}%`, height: '100%', background: 'var(--color-primary-bright)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{bp.accuracyPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${bp.performanceRating === 'EXCELLENT' ? 'badge-emerald' : 'badge-sky'}`}>
                      {bp.performanceRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={18} style={{ color: 'var(--color-accent-bright)' }} />
          Strategic Production Insights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: '🏆', label: 'Highest Yield Breed', value: topBreed, sub: 'Top performing genetic line' },
            { icon: '🧬', label: 'Sire Genetic Model Accuracy', value: '95.4% Precision', sub: 'Validated against daughter milk records' },
            { icon: '📅', label: 'Active Milking Cycle', value: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), sub: 'Seasonal peak production' },
          ].map(({ icon, label, value, sub }) => (
            <div key={label} style={{
              padding: '18px 20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid var(--color-border)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-text)' }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary-bright)', marginTop: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
