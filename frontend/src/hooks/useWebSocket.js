import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || '/ws';

export function useWebSocket(userId) {
  const [connected, setConnected]     = useState(false);
  const [stockUpdate, setStockUpdate] = useState(null);
  const [alerts, setAlerts]           = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // Subscribe to real-time stock updates
        client.subscribe('/topic/stock-updates', (msg) => {
          try {
            const update = JSON.parse(msg.body);
            setStockUpdate(update);
            if (update.stockQty <= 5) {
              toast.error(`⚠️ Low stock: ${update.breed} — only ${update.stockQty} straws left`, {
                duration: 5000,
                id: `stock-${update.strawId}`,
              });
            }
          } catch {}
        });

        // Subscribe to user-specific alerts
        client.subscribe(`/queue/alerts-${userId}`, (msg) => {
          try {
            const alert = JSON.parse(msg.body);
            setAlerts((prev) => [alert, ...prev]);
            toast(`🔔 ${alert.message}`, {
              duration: 6000,
              style: {
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--color-accent)',
                color: 'var(--color-text)',
              },
            });
          } catch {}
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.warn('STOMP error:', frame.headers['message']);
      },
    });

    try {
      client.activate();
      clientRef.current = client;
    } catch (e) {
      console.warn('WebSocket connection failed to initialize:', e);
    }

    return () => {
      try { client.deactivate(); } catch {}
    };
  }, [userId]);

  return { connected, stockUpdate, alerts };
}
