import { useState, useEffect, useCallback } from 'react';
import { notifApi } from '../api/client';
import { dynamicStore } from '../api/dynamicStore';
import { Bell, Check, CheckCheck, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ALERT_BADGES = {
  LOW_STOCK:              'badge-rose',
  BREED_MISMATCH_BLOCKED: 'badge-rose',
  BREED_MISMATCH_OVERRIDE:'badge-amber',
  CALVING_REMINDER:       'badge-sky',
  HEAT_CYCLE:             'badge-amber',
  RE_INSEMINATION_WINDOW: 'badge-amber',
  BREEDING_CONFIRMED:     'badge-emerald',
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
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);

  const loadAlerts = useCallback(() => {
    setLoading(true);
    notifApi.getAll()
      .then(r => setAlerts(r.data?.data || dynamicStore.getNotifications()))
      .catch(() => setAlerts(dynamicStore.getNotifications()))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAlerts();
    const unsubscribe = dynamicStore.subscribe(() => loadAlerts());
    return () => unsubscribe();
  }, [loadAlerts]);

  const markRead = async (id) => {
    await notifApi.markRead(id);
    loadAlerts();
  };

  const markAllRead = async () => {
    await notifApi.markAllRead();
    toast.success('All notifications marked as read! 🔔');
    loadAlerts();
  };

  const unreadCount = alerts.filter(a => !a.readStatus).length;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald">
                <Sparkles size={11} /> Notification Center
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              System Alerts
              {unreadCount > 0 && (
                <span className="badge badge-rose" style={{ padding: '2px 9px', fontSize: 12 }}>
                  {unreadCount} UNREAD
                </span>
              )}
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Real-time breeding, inventory, calving, and system audit notifications.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={loadAlerts} style={{ borderRadius: 'var(--radius-pill)' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            {unreadCount > 0 && (
              <button className="btn btn-primary" onClick={markAllRead} style={{ borderRadius: 'var(--radius-pill)' }}>
                <CheckCheck size={15} /> Mark All as Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          Array(5).fill(null).map((_, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px' }}>
              <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '80%' }} />
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔔</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>No active notifications</div>
            <p style={{ fontSize: 13, marginTop: 4 }}>You'll receive alerts for low stock, expected calvings, and AI events here.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="glass-card" style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '16px 20px',
              background: alert.readStatus ? 'var(--color-bg-card)' : 'rgba(16,185,129,0.06)',
              borderColor: alert.readStatus ? 'var(--color-border)' : 'rgba(52,211,153,0.3)',
            }}>
              <div style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>
                {ALERT_ICONS[alert.type] || '📢'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className={`badge ${ALERT_BADGES[alert.type] || 'badge-muted'}`}>
                    {alert.type?.replace(/_/g, ' ')}
                  </span>
                  {!alert.readStatus && (
                    <span className="pulse-dot pulse-dot-emerald" />
                  )}
                  <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5, fontWeight: 500 }}>
                  {alert.message}
                </div>
              </div>
              {!alert.readStatus && (
                <button className="btn btn-ghost btn-icon" onClick={() => markRead(alert.id)} title="Mark as Read">
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
