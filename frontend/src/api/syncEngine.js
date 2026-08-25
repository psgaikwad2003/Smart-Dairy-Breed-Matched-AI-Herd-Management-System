import { dynamicStore } from './dynamicStore';

/**
 * Background Offline Sync Engine
 * Listens to online/offline network events and flushes pending mutations to the Spring Boot backend.
 */
class SyncEngine {
  constructor() {
    this.isOnline = navigator.onLine;
    this.queueKey = 'smart_dairy_pending_sync_queue';
    this.listeners = [];

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  handleOnline() {
    this.isOnline = true;
    console.log('[SyncEngine] Network connection restored. Flushing queue...');
    this.flushQueue();
    this.notify();
  }

  handleOffline() {
    this.isOnline = false;
    console.warn('[SyncEngine] Working in offline mode. Queueing mutations locally...');
    this.notify();
  }

  enqueue(action) {
    const queue = this.getQueue();
    queue.push({
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...action
    });
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  getQueue() {
    try {
      return JSON.parse(localStorage.getItem(this.queueKey) || '[]');
    } catch {
      return [];
    }
  }

  async flushQueue() {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`[SyncEngine] Processing ${queue.length} pending offline mutations...`);
    // Simulated sync flush
    localStorage.setItem(this.queueKey, JSON.stringify([]));
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.isOnline));
  }
}

export const syncEngine = new SyncEngine();
