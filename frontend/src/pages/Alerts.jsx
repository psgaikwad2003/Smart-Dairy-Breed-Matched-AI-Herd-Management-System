import { useState, useEffect, useCallback } from 'react';
import { notifApi } from '../api/client';
import { Bell, Check, CheckCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ALERT_COLORS = {
  LOW_STOCK:              'badge-danger',
  BREED_MISMATCH_BLOCKED: 'badge-danger',
  BREED_MISMATCH_OVERRIDE:'badge-warning',
  CALVING_REMINDER:       'badge-info',
  HEAT_CYCLE:             'badge-warning',
  RE_INSEMINATION_WINDOW: 'badge-warning',
  BREEDING_CONFIRMED:     'badge-success',
  GENERAL:                'badge-muted',
};

const ALERT_ICONS = {
  LOW_STOCK:              '⚠️',
  BREED_MISMATCH_BLOCKED: '🚫',
  BREED_MISMATCH_OVERRIDE:'🔶',
  CALVING_REMINDER:       '🐣',
  HEAT_CYCLE:             '🌡️',
  RE_INSEMINATION_WINDOW: '🔁',
  BREEDING_CONFIRMED:     '✅',
  GENERAL:                '📢',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const [totalPages, setTotal] = useState(1);

  const load = useCallback((p = 0) => {
    setLoading(true);
    notifApi.getAll({ page: p, size: 20 })
      .then(r => {
        const data = r.data.data;
        setAlerts(data?.content || []);
        setTotal(data?.totalPages || 1);
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page]);

  const markRead = async (id) => {
    await notifApi.markRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, readStatus: true } : a));
  };

  const markAll = async () => {
    await notifApi.markAllRead();
    setAlerts(prev => prev.map(a => ({ ...a, readStatus: true })));
    toast.success('All alerts marked as read');
  };

  const unread = alerts.filter(a => !a.readStatus).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={24} style={{ color: 'var(--color-primary)' }} />
              Alerts
              {unread > 0 && (
                <span style={{ background: 'var(--color-danger)', color: 'white', borderRadius: '100px', fontSize: 13, padding: '2px 10px', fontWeight: 700 }}>
                  {unread}
                </span>
              )}
            </h1>
            <p className="page-subtitle">Real-time notifications for herd events</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => load(page)}><RefreshCw size={14} /></button>
            {unread > 0 && (
              <button className="btn btn-secondary" onClick={markAll}><CheckCheck size={14} /> Mark all read</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          Array(6).fill(null).map((_, i) => (
            <div key={i} className="card" style={{ padding: '14px 18px' }}>
              <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '85%' }} />
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔔</div>
            <h3>No alerts yet</h3>
            <p>You'll see breeding events, low stock, and calving reminders here</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 18px',
              background: alert.readStatus ? 'var(--color-bg-card)' : 'rgba(52,211,153,0.04)',
              border: `1px solid ${alert.readStatus ? 'var(--color-border)' : 'rgba(52,211,153,0.2)'}`,
              borderRadius: 12, transition: 'var(--transition)',
            }}>
              <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>
                {ALERT_ICONS[alert.type] || '📢'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`badge ${ALERT_COLORS[alert.type] || 'badge-muted'}`}>
                    {alert.type?.replace(/_/g, ' ')}
                  </span>
                  {!alert.readStatus && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                  )}
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {alert.message}
                </div>
              </div>
              {!alert.readStatus && (
                <button className="btn btn-ghost" style={{ padding: '6px', flexShrink: 0 }}
                  onClick={() => markRead(alert.id)} title="Mark as read">
                  <Check size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage(p => p-1)}>← Prev</button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--color-text-muted)', padding: '0 8px' }}>
            Page {page+1} of {totalPages}
          </span>
          <button className="btn btn-secondary" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
