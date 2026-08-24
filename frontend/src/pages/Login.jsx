import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [form, setForm]     = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.phone, form.password);
    setLoading(false);
    if (result.ok) {
      toast.success('Welcome back! 🐄');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <Toaster position="top-right" toastOptions={{ style: {
        background: 'var(--color-bg-card)', color: 'var(--color-text)',
        border: '1px solid var(--color-border)', borderRadius: 10,
      }}} />

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card fade-in" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: 'var(--shadow-glow)',
          }}>🐄</div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Smart Dairy</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            Breed-Matched AI & Herd Management
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone" type="tel" className="input"
              placeholder="9876543210"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password" type="password" className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? <span className="spinner" /> : '🔑 Sign In'}
          </button>
        </form>

        {/* Demo credentials hint & quick fill */}
        <div style={{
          marginTop: 20, padding: '12px 14px',
          background: 'rgba(52, 211, 153, 0.06)',
          borderRadius: 8, border: '1px solid rgba(52,211,153,0.15)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Demo Quick Login
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 8px', flex: 1 }}
              onClick={() => setForm({ phone: '9876543230', password: 'password123' })}>
              👑 Admin
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 8px', flex: 1 }}
              onClick={() => setForm({ phone: '9876543221', password: 'password123' })}>
              🩺 Tech
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 8px', flex: 1 }}
              onClick={() => setForm({ phone: '9876543210', password: 'password123' })}>
              🌾 Farmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
