import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Phone, Lock, Eye, EyeOff, Sparkles, ShieldCheck, Cpu, Activity, Award } from 'lucide-react';

export default function Login() {
  const [form, setForm]         = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.phone, form.password);
    setLoading(false);
    if (result.ok) {
      toast.success('Welcome back to Smart Dairy! 🐄');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(circle at 50% 30%, #0d1a14 0%, #060a08 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0d1712', color: '#f8fafc',
          border: '1px solid rgba(52,211,153,0.3)', borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }
      }} />

      {/* Decorative background lights */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%',
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 1020,
        display: 'grid', gridTemplateColumns: '1fr 460px',
        borderRadius: 28, overflow: 'hidden',
        border: '1px solid rgba(52,211,153,0.2)',
        background: 'rgba(11, 20, 15, 0.75)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(16,185,129,0.12)',
      }}>
        {/* Left Hero Panel */}
        <div style={{
          padding: '56px 48px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,10,8,0.95) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          borderRight: '1px solid rgba(52,211,153,0.12)',
          position: 'relative',
        }}>
          <div>
            {/* Brand Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, boxShadow: '0 0 25px rgba(16,185,129,0.4)',
                border: '1px solid rgba(52,211,153,0.5)',
              }}>
                🐄
              </div>
              <div>
                <h1 className="text-gradient" style={{ fontSize: 24, fontWeight: 800 }}>Smart Dairy</h1>
                <div style={{ fontSize: 11, color: 'var(--color-primary-bright)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Breed-Matched AI & Herd Platform
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
              Precision Dairy Breeding & <span className="text-gradient">Herd Intelligence</span>
            </h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 36 }}>
              Empowering farmers, AI technicians, and veterinarians with real-time semen inventory, genetic compatibility calculations, and automated milk analytics.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: Cpu, title: 'AI Genetic Compatibility Engine', desc: 'Prevents inbreeding and validates semen-cow match' },
                { icon: Activity, title: 'Real-Time Milk Yield Tracking', desc: 'Monitor daily production trends per cow and farmer' },
                { icon: ShieldCheck, title: 'Multi-Tenant Role Access', desc: 'Customized interfaces for Farmers, Techs, Vets & Admins' },
              ].map((f, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '12px 16px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(52,211,153,0.1)',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'rgba(16,185,129,0.15)', color: 'var(--color-primary-bright)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid rgba(16,185,129,0.25)',
                  }}>
                    <f.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 30 }}>
            <Award size={16} style={{ color: 'var(--color-accent)' }} />
            <span>NDDB & ICAR Breed Standard Compliant · Production Grade</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Sign In to Portal</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>
              Enter your registered 10-digit phone number & password
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={17} className="input-icon" />
                <input
                  type="tel" className="input input-with-icon"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input input-with-icon"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, background: 'none', border: 'none',
                    color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ height: 44, fontSize: 15, marginTop: 6, borderRadius: 'var(--radius-sm)' }}>
              {loading ? <span className="spinner" /> : (
                <>
                  <Sparkles size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{
            marginTop: 28, padding: '16px 18px',
            background: 'rgba(16,185,129,0.05)',
            borderRadius: 14, border: '1px solid rgba(52,211,153,0.18)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-primary-bright)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              ⚡ Demo Quick Fill Accounts
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 10px', flex: 1, borderRadius: 8 }}
                onClick={() => setForm({ phone: '9876543230', password: 'password123' })}>
                👑 Admin
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 10px', flex: 1, borderRadius: 8 }}
                onClick={() => setForm({ phone: '9876543221', password: 'password123' })}>
                🩺 Tech
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 10px', flex: 1, borderRadius: 8 }}
                onClick={() => setForm({ phone: '9876543210', password: 'password123' })}>
                🌾 Farmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
