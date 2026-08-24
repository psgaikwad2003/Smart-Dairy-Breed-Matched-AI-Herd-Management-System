import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Herd from './pages/Herd';
import Breeding from './pages/Breeding';
import Inventory from './pages/Inventory';
import Milk from './pages/Milk';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Farmers from './pages/Farmers';
import Settings from './pages/Settings';
import FeedOptimizer from './pages/FeedOptimizer';
import HealthTracker from './pages/HealthTracker';
import CoopPayment from './pages/CoopPayment';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="herd font-mono-tabular" element={<Herd />} />
        <Route path="herd"            element={<Herd />} />
        <Route path="breeding"        element={<Breeding />} />
        <Route path="inventory"       element={<Inventory />} />
        <Route path="milk"            element={<Milk />} />
        <Route path="analytics"       element={<Analytics />} />
        <Route path="alerts"          element={<Alerts />} />
        <Route path="farmers"         element={<Farmers />} />
        <Route path="feed-optimizer"  element={<FeedOptimizer />} />
        <Route path="health-tracker"  element={<HealthTracker />} />
        <Route path="coop-payment"    element={<CoopPayment />} />
        <Route path="settings"        element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-bg-card)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: 'var(--color-marigold)', secondary: '#1C2B33' } },
            error:   { iconTheme: { primary: 'var(--color-status-mismatch)', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
