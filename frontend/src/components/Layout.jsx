import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { notifApi } from '../api/client';

export default function Layout() {
  const { user } = useAuth();
  const { connected, stockUpdate, alerts: wsAlerts } = useWebSocket(user?.userId);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on mount
  useEffect(() => {
    notifApi.getCount()
      .then(r => setUnreadCount(r.data.data || 0))
      .catch(() => {});
  }, []);

  // Increment unread when WebSocket delivers alert
  useEffect(() => {
    if (wsAlerts.length > 0) setUnreadCount(c => c + 1);
  }, [wsAlerts]);

  return (
    <div className="page-layout">
      <Sidebar connected={connected} unreadCount={unreadCount} />
      <main className="main-content fade-in">
        <Outlet context={{ stockUpdate, setUnreadCount }} />
      </main>
    </div>
  );
}
