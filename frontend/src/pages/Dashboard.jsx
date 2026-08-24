import { useState, useEffect } from 'react';
import { dashboardApi, breedingApi, inventoryApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  PawPrint, FlaskConical, Baby, AlertTriangle,
  TrendingUp, Calendar, ChevronRight, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

/* ---- Mini chart mock data (until milk API is wired) ---- */
const mockTrend = [
  { day: 'Mon', yield: 120 }, { day: 'Tue', yield: 132 }, { day: 'Wed', yield: 118 },
  { day: 'Thu', yield: 145 }, { day: 'Fri', yield: 138 }, { day: 'Sat', yield: 152 },
  { day: 'Sun', yield: 141 },
];

function StatCard({ icon, label, value, color, glow }) {
  return (
    <div className="stat-card" style={{ '--glow': glow }}>
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div className="stat-value">{value ?? <span className="skeleton" style={{ width: 60, height: 32, display: 'block' }} />}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div style={{
        position: 'absolute', top: -10, right: -10,
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary]       = useState(null);
  const [calvings, setCalvings]     = useState([]);
  const [lowStock, setLowStock]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getSummary(user?.farmerId),
      breedingApi.getCalvings(30),
      inventoryApi.getLowStock(10),
    ]).then(([s, c, l]) => {
      setSummary(s.data.data);
      setCalvings(c.data.data?.slice(0, 5) || []);
      setLowStock(l.data.data?.slice(0, 5) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">
              Dashboard 🐄
            </h1>
            <p className="page-subtitle">
              Welcome back, {user?.fullName || 'Farm Manager'} — here's your herd at a glance
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            <Activity size={14} style={{ display: 'inline', marginRight: 4 }} />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard
          icon={<PawPrint size={22} />}
          label="Active Cattle"
          value={summary?.activeCows}
          color="var(--color-primary)"
          glow="rgba(52,211,153,0.2)"
        />
        <StatCard
          icon={<FlaskConical size={22} />}
          label="Pending Breedings"
          value={summary?.pendingBreedings}
          color="var(--color-accent)"
          glow="rgba(251,191,36,0.2)"
        />
        <StatCard
          icon={<Baby size={22} />}
          label="Confirmed Pregnant"
          value={summary?.confirmedPregnancies}
          color="var(--color-info)"
          glow="rgba(96,165,250,0.2)"
        />
        <StatCard
          icon={<AlertTriangle size={22} />}
          label="Low Stock Alerts"
          value={summary?.lowStockAlerts}
          color="var(--color-danger)"
          glow="rgba(248,113,113,0.2)"
        />
      </div>

      {/* Row 2 */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Upcoming Calvings */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
              Upcoming Calvings
            </h3>
            <span className="badge badge-success">{summary?.upcomingCalvings || 0} in 30 days</span>
          </div>

          {calvings.length === 0 && !loading ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="icon">🐄</div>
              <p>No calvings scheduled soon</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(loading ? Array(3).fill(null) : calvings).map((rec, i) => (
                <div key={rec?.id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                  border: '1px solid var(--color-border)',
                }}>
                  {loading ? (
                    <div className="skeleton" style={{ width: '80%', height: 18 }} />
                  ) : (
                    <>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{rec.cow?.tagNumber || `Cow #${rec.cowId}`}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {rec.cow?.breed?.replace('_', ' ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>
                          {rec.expectedCalvingDate}
                        </div>
                        <span className={`badge badge-${rec.outcome === 'CONFIRMED_PREGNANT' ? 'info' : 'warning'}`}>
                          {rec.outcome?.replace('_', ' ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Inventory */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlaskConical size={16} style={{ color: 'var(--color-danger)' }} />
              Low Stock Alert
            </h3>
            <span className="badge badge-danger">Action needed</span>
          </div>

          {lowStock.length === 0 && !loading ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="icon">✅</div>
              <p>All inventory levels are healthy</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(loading ? Array(3).fill(null) : lowStock).map((s, i) => (
                <div key={s?.id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(248,113,113,0.04)', borderRadius: 8,
                  border: '1px solid rgba(248,113,113,0.15)',
                }}>
                  {loading ? (
                    <div className="skeleton" style={{ width: '80%', height: 18 }} />
                  ) : (
                    <>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {s.breed?.replace('_', ' ')}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          Batch: {s.batchNo}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 20, fontWeight: 700,
                          color: s.stockQty <= 3 ? 'var(--color-danger)' : 'var(--color-warning)',
                        }}>{s.stockQty}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>straws left</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Milk Yield Trend Chart */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
            Weekly Milk Yield Trend
          </h3>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Last 7 days · All herd</span>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mockTrend} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
            <Tooltip
              contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }}
              formatter={(val) => [`${val}L`, 'Yield']}
            />
            <Area type="monotone" dataKey="yield"
              stroke="var(--color-primary)" strokeWidth={2}
              fill="url(#yieldGrad)"
              dot={{ fill: 'var(--color-primary)', r: 3, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Override Audit Banner */}
      {summary?.overridesThisMonth > 0 && (
        <div style={{
          marginTop: 20, padding: '14px 18px',
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertTriangle size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
              {summary.overridesThisMonth} breed mismatch override{summary.overridesThisMonth > 1 ? 's' : ''}
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 13, marginLeft: 8 }}>
              recorded this month — review audit log for details
            </span>
          </div>
          <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
        </div>
      )}
    </div>
  );
}
