import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
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

  // Increment unread count when WebSocket delivers alert
  useEffect(() => {
    if (wsAlerts.length > 0) setUnreadCount(c => c + 1);
  }, [wsAlerts]);

  return (
    <div className="pro-app-layout">
      <Sidebar connected={connected} unreadCount={unreadCount} />
      <div className="pro-main-wrapper">
        <TopBar unreadCount={unreadCount} />
        <main className="pro-main-content fade-in">
          <Outlet context={{ stockUpdate, setUnreadCount }} />
        </main>
      </div>
    </div>
  );
}
