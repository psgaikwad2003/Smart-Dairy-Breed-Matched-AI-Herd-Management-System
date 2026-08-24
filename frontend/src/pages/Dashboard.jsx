import { useState, useEffect } from 'react';
import { dashboardApi, breedingApi, inventoryApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint, FlaskConical, Baby, AlertTriangle,
  TrendingUp, Calendar, ChevronRight, Activity,
  Plus, ArrowUpRight, ArrowDownRight, Droplets, Sparkles, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const mockTrend = [
  { day: 'Mon', yield: 128 }, { day: 'Tue', yield: 135 }, { day: 'Wed', yield: 122 },
  { day: 'Thu', yield: 148 }, { day: 'Fri', yield: 142 }, { day: 'Sat', yield: 156 },
  { day: 'Sun', yield: 150 },
];

function ProStatCard({ icon, label, value, subText, trend, color, bg, glow }) {
  return (
    <div className="pro-stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
      <div className="stat-header">
        <div className="stat-icon-wrapper">
          {icon}
        </div>
        {trend && (
          <span className={`trend-pill ${trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
            {trend.startsWith('+') ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
        )}
      </div>

      <div className="stat-main-val">
        {value ?? <span className="skeleton" style={{ width: 70, height: 36, display: 'inline-block' }} />}
      </div>
      <div className="stat-sub-label">{label}</div>
      {subText && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{subText}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary]       = useState(null);
  const [calvings, setCalvings]     = useState([]);
  const [lowStock, setLowStock]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [timeRange, setTimeRange]   = useState('7d');

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
      {/* Header Greeting & Action Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 28, flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-emerald">
              <Sparkles size={11} /> Live Dashboard
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>
            Welcome back, <span className="text-gradient">{user?.fullName?.split(' ')[0] || 'Manager'}</span> 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 2 }}>
            Here is your daily herd productivity and breeding AI status summary.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/herd')} style={{ borderRadius: 'var(--radius-pill)' }}>
            <PawPrint size={15} /> My Herd
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/milk')} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Droplets size={15} /> Log Milk
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/breeding')} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={15} /> Breed Match AI
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <ProStatCard
          icon={<PawPrint size={20} />}
          label="Active Dairy Cattle"
          value={summary?.activeCows}
          subText="Registered in active herd"
          trend="+12.4% vs last mo"
          color="var(--color-primary-bright)"
          bg="rgba(16,185,129,0.12)"
        />
        <ProStatCard
          icon={<FlaskConical size={20} />}
          label="Pending Breedings"
          value={summary?.pendingBreedings}
          subText="Awaiting 60-day pregnancy check"
          trend="+4 pending"
          color="var(--color-accent-bright)"
          bg="rgba(245,158,11,0.12)"
        />
        <ProStatCard
          icon={<Baby size={20} />}
          label="Confirmed Pregnant"
          value={summary?.confirmedPregnancies}
          subText="Active gestation tracking"
          trend="+15.0%"
          color="var(--color-sky)"
          bg="rgba(56,189,248,0.12)"
        />
        <ProStatCard
          icon={<AlertTriangle size={20} />}
          label="Low Straw Alerts"
          value={summary?.lowStockAlerts}
          subText="Batches below 10 straws"
          trend="Critical"
          color="var(--color-rose)"
          bg="rgba(244,63,94,0.12)"
        />
      </div>

      {/* Main Charts & Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Weekly Milk Yield Trend */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} style={{ color: 'var(--color-primary-bright)' }} />
                Weekly Milk Yield Trend
              </h3>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Total liters produced across active lactating cows
              </div>
            </div>

            {/* Time Filter Tabs */}
            <div className="tab-group">
              {['7d', '30d', '90d'].map(t => (
                <button key={t} className={`tab-item ${timeRange === t ? 'active' : ''}`}
                  onClick={() => setTimeRange(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={mockTrend} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="yieldGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-bright)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-primary-bright)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
              <Tooltip
                contentStyle={{ background: '#0b130f', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                formatter={(val) => [`${val} Liters`, 'Milk Yield']}
              />
              <Area type="monotone" dataKey="yield"
                stroke="var(--color-primary-bright)" strokeWidth={3}
                fill="url(#yieldGlow)"
                dot={{ fill: 'var(--color-primary-bright)', r: 4, strokeWidth: 2, stroke: '#060a08' }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Summary Insights */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Breeding Efficiency Index
            </div>

            <div style={{
              padding: '16px 18px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(56,189,248,0.06) 100%)',
              border: '1px solid rgba(52,211,153,0.25)', marginBottom: 16
            }}>
              <div style={{ fontSize: 12, color: 'var(--color-primary-bright)', fontWeight: 700 }}>AI Success Rate</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)', margin: '4px 0' }}>87.4%</div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-dim)' }}>
                High genetic compatibility match score across last 50 AI procedures.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Crossbreed Index</span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent-bright)' }}>F1 / F2 Optimal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Avg Insemination Cost</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>₹450 / straw</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Active Farmers</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-bright)' }}>12 Managed</span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={() => navigate('/analytics')}
            style={{ width: '100%', justifyContent: 'center', marginTop: 16, borderRadius: 'var(--radius-sm)' }}>
            View Detailed Analytics <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Row 2: Upcoming Calvings & Low Stock Alerts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Upcoming Calvings Timeline */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={17} style={{ color: 'var(--color-primary-bright)' }} />
              Upcoming Calvings (30 Days)
            </h3>
            <span className="badge badge-emerald">{summary?.upcomingCalvings || 0} Calvings Scheduled</span>
          </div>

          {calvings.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🐄</div>
              <p style={{ fontSize: 14 }}>No expected calvings in the next 30 days</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(loading ? Array(3).fill(null) : calvings).map((rec, i) => (
                <div key={rec?.id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--color-border)',
                }}>
                  {loading ? (
                    <div className="skeleton" style={{ width: '100%', height: 24 }} />
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'rgba(16,185,129,0.12)', color: 'var(--color-primary-bright)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14
                        }}>
                          🐄
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{rec.cow?.tagNumber || `Cow #${rec.cowId}`}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                            {rec.cow?.breed?.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, color: 'var(--color-accent-bright)', fontWeight: 700 }}>
                          {rec.expectedCalvingDate}
                        </div>
                        <span className={`badge badge-${rec.outcome === 'CONFIRMED_PREGNANT' ? 'sky' : 'amber'}`} style={{ marginTop: 2 }}>
                          {rec.outcome?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Semen Inventory Alert List */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlaskConical size={17} style={{ color: 'var(--color-rose)' }} />
              Semen Straw Stock Alerts
            </h3>
            <span className="badge badge-rose">Restock Action Required</span>
          </div>

          {lowStock.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 14 }}>All semen straw inventory levels are sufficient</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(loading ? Array(3).fill(null) : lowStock).map((s, i) => (
                <div key={s?.id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(244,63,94,0.04)',
                  border: '1px solid rgba(244,63,94,0.2)',
                }}>
                  {loading ? (
                    <div className="skeleton" style={{ width: '100%', height: 24 }} />
                  ) : (
                    <>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          {s.breed?.replace(/_/g, ' ')}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          Batch: {s.batchNo} · Station: {s.stationName || 'Central A.I.'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 22, fontWeight: 800,
                          color: s.stockQty <= 3 ? 'var(--color-rose)' : 'var(--color-accent-bright)',
                        }}>
                          {s.stockQty} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)' }}>straws</span>
                        </div>
                        <button className="btn btn-ghost" onClick={() => navigate('/inventory')}
                          style={{ padding: '2px 6px', fontSize: 11, color: 'var(--color-primary-bright)', marginTop: 2 }}>
                          Restock Now →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Override Audit Alert Banner */}
      {summary?.overridesThisMonth > 0 && (
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 20px rgba(245,158,11,0.1)'
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(245,158,11,0.2)', color: 'var(--color-accent-bright)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent-bright)' }}>
              {summary.overridesThisMonth} Breed Mismatch Override{summary.overridesThisMonth > 1 ? 's' : ''} Recorded This Month
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-text-dim)', marginTop: 2 }}>
              A technician explicitly bypassed AI compatibility warnings. Review full audit log for details.
            </div>
          </div>
          <button className="btn btn-accent" onClick={() => navigate('/breeding')} style={{ fontSize: 12.5, padding: '7px 14px' }}>
            Audit Log <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
