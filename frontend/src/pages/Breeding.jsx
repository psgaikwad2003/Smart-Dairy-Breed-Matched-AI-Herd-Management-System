import { useState } from 'react';
import { breedingApi, cowApi, inventoryApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Dna, CheckCircle, XCircle, AlertCircle, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const BREEDING_GOALS = ['PUREBRED', 'CROSSBRED', 'GENERAL'];

const CompatIcon = ({ status }) => {
  if (status === 'MATCH')    return <CheckCircle size={20} style={{ color: 'var(--color-primary)' }} />;
  if (status === 'OVERRIDE') return <AlertCircle size={20} style={{ color: 'var(--color-accent)' }} />;
  if (status === 'BLOCKED')  return <XCircle size={20} style={{ color: 'var(--color-danger)' }} />;
  return null;
};

const CompatBanner = ({ result }) => {
  if (!result) return null;
  const colors = {
    MATCH:    { bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.3)',  text: 'var(--color-primary)' },
    OVERRIDE: { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.3)', text: 'var(--color-accent)' },
    BLOCKED:  { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', text: 'var(--color-danger)' },
  };
  const c = colors[result.status] || colors.BLOCKED;

  return (
    <div style={{
      padding: '16px 20px', borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <CompatIcon status={result.status} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: c.text }}>
            {result.status === 'MATCH' ? '✅ Breed Match' :
             result.status === 'OVERRIDE' ? '⚠️ Mismatch — Override Allowed' :
             '🚫 Breed Mismatch — BLOCKED'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 2 }}>
            {result.explanation}
          </div>
        </div>
      </div>

      {result.alternatives?.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recommended Alternatives
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.alternatives.map(a => (
              <span key={a} className="badge badge-info">{a.replace(/_/g, ' ')}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Breeding() {
  const { user } = useAuth();

  // Step 1: Validate
  const [step, setStep]       = useState(1); // 1 = validate, 2 = confirm
  const [cows, setCows]       = useState([]);
  const [straws, setStraws]   = useState([]);
  const [cowSearch, setCowSearch] = useState('');
  const [form, setForm]       = useState({
    cowId: '', semenStrawId: '', breedingGoal: 'GENERAL', overrideReason: '',
    technicianId: user?.userId, inseminationDate: new Date().toISOString().split('T')[0],
    compatibilityStatus: '',
  });
  const [result, setResult]   = useState(null);
  const [loadCows, setLoadCows]       = useState(false);
  const [strawsLoading, setStrawsLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Search cows by tag
  const searchCow = async () => {
    if (!cowSearch) return;
    setLoadCows(true);
    try {
      const r = await cowApi.getByTag(cowSearch.trim());
      const cow = r.data.data;
      setCows([cow]);
      setForm(p => ({ ...p, cowId: cow.id }));
    } catch {
      toast.error('Cow not found with that tag');
    } finally { setLoadCows(false); }
  };

  // Load straws for a breed
  const loadStraws = async (breed) => {
    if (!breed) return;
    setStrawsLoading(true);
    try {
      const r = await inventoryApi.getAvailable(breed);
      setStraws(r.data.data || []);
    } catch { setStraws([]); }
    finally { setStrawsLoading(false); }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!form.cowId || !form.semenStrawId) {
      toast.error('Select a cow and a semen straw first');
      return;
    }
    setValidating(true);
    try {
      const r = await breedingApi.validate({
        cowId: Number(form.cowId),
        semenStrawId: Number(form.semenStrawId),
        breedingGoal: form.breedingGoal,
      });
      const data = r.data.data;
      setResult(data);
      setForm(p => ({ ...p, compatibilityStatus: data.status }));
      if (data.status !== 'BLOCKED') setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Validation failed');
    } finally { setValidating(false); }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (result?.status === 'OVERRIDE' && !form.overrideReason.trim()) {
      toast.error('Override reason is required');
      return;
    }
    setConfirming(true);
    try {
      await breedingApi.confirm({
        cowId: Number(form.cowId),
        semenStrawId: Number(form.semenStrawId),
        technicianId: Number(form.technicianId || user?.userId),
        inseminationDate: form.inseminationDate,
        compatibilityStatus: form.compatibilityStatus,
        overrideReason: form.overrideReason || null,
      });
      toast.success('✅ Insemination recorded successfully!');
      setStep(1);
      setResult(null);
      setForm(p => ({ ...p, cowId: '', semenStrawId: '', overrideReason: '', compatibilityStatus: '' }));
      setCows([]); setStraws([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Confirmation failed');
    } finally { setConfirming(false); }
  };

  const selectedCow   = cows.find(c => c.id === Number(form.cowId));
  const selectedStraw = straws.find(s => s.id === Number(form.semenStrawId));

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Breeding AI 🧬</h1>
        <p className="page-subtitle">Validate breed compatibility and record inseminations</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        {['Select Cattle & Semen', 'Confirm Insemination'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              background: step > i ? 'var(--color-primary)' : step === i+1 ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.06)',
              color: step > i ? '#0a0f0d' : step === i+1 ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: step === i+1 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            }}>{i+1}</div>
            <span style={{ fontSize: 13, color: step === i+1 ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: step === i+1 ? 600 : 400 }}>
              {s}
            </span>
            {i < 1 && <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />}
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Left: Step 1 — Select */}
        {step === 1 && (
          <form onSubmit={handleValidate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Cow Search */}
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                🐄 Select Cow
              </h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input className="input" placeholder="Search by ear tag…"
                  value={cowSearch} onChange={e => setCowSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchCow()} />
                <button type="button" className="btn btn-secondary" onClick={searchCow}
                  disabled={loadCows}>
                  {loadCows ? <span className="spinner" /> : <Search size={14} />}
                </button>
              </div>

              {selectedCow && (
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--color-primary-glow)',
                  border: '1px solid rgba(52,211,153,0.2)',
                }}>
                  <div style={{ fontWeight: 600 }}>{selectedCow.tagNumber}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 2 }}>
                    {selectedCow.breed?.replace(/_/g, ' ')} · {selectedCow.status}
                    {selectedCow.lactationCount && ` · Lactation ${selectedCow.lactationCount}`}
                  </div>
                </div>
              )}
            </div>

            {/* Semen Selection */}
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>🧪 Select Semen Straw</h3>

              {selectedCow && (
                <button type="button" className="btn btn-secondary" style={{ marginBottom: 12, fontSize: 12 }}
                  onClick={() => loadStraws(selectedCow.breed)}>
                  Load compatible straws for {selectedCow.breed?.replace(/_/g, ' ')}
                </button>
              )}

              {straws.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {straws.map(s => (
                    <label key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      padding: '10px 12px', borderRadius: 8,
                      background: form.semenStrawId == s.id ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.semenStrawId == s.id ? 'rgba(52,211,153,0.3)' : 'var(--color-border)'}`,
                      transition: 'var(--transition)',
                    }}>
                      <input type="radio" name="straw" value={s.id}
                        checked={form.semenStrawId == s.id}
                        onChange={e => setForm(p => ({ ...p, semenStrawId: e.target.value }))}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {s.breed?.replace(/_/g, ' ')} — {s.batchNo}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {s.semenStationName} · Grade {s.stationGrade} · {s.stockQty} straws left
                        </div>
                      </div>
                      <span className={`badge ${s.stockQty <= 5 ? 'badge-danger' : 'badge-success'}`}>
                        {s.stockQty}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                  {selectedCow ? 'Click above to load compatible straws' : 'Select a cow first'}
                </div>
              )}
            </div>

            {/* Breeding Goal */}
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>🎯 Breeding Goal</h3>
              <select className="select" value={form.breedingGoal}
                onChange={e => setForm(p => ({ ...p, breedingGoal: e.target.value }))}>
                {BREEDING_GOALS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ justifyContent: 'center' }} disabled={validating}>
              {validating ? <span className="spinner" /> : <><Dna size={16} /> Validate Breed Compatibility</>}
            </button>
          </form>
        )}

        {/* Left: Step 2 — Confirm */}
        {step === 2 && (
          <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>📋 Confirm Insemination</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>COW</div>
                  <div style={{ fontWeight: 600 }}>{selectedCow?.tagNumber || `ID: ${form.cowId}`}</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>SEMEN STRAW</div>
                  <div style={{ fontWeight: 600 }}>{selectedStraw?.batchNo || `ID: ${form.semenStrawId}`}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Insemination Date</label>
                  <input type="date" className="input" value={form.inseminationDate}
                    onChange={e => setForm(p => ({ ...p, inseminationDate: e.target.value }))} />
                </div>

                {result?.status === 'OVERRIDE' && (
                  <div className="form-group">
                    <label className="form-label">Override Reason * (required for mismatch)</label>
                    <input className="input" placeholder="e.g. Farmer request — approved by VET Dr. Sharma"
                      value={form.overrideReason}
                      onChange={e => setForm(p => ({ ...p, overrideReason: e.target.value }))} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                onClick={() => setStep(1)}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}
                disabled={confirming}>
                {confirming ? <span className="spinner" /> : '✅ Confirm Insemination'}
              </button>
            </div>
          </form>
        )}

        {/* Right: Result Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Compatibility Result */}
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Compatibility Result</h3>
            {result ? (
              <CompatBanner result={result} />
            ) : (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🧬</div>
                <p>Fill in the form and validate to see the breed compatibility result</p>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="card" style={{ background: 'rgba(52,211,153,0.04)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 10 }}>How It Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['✅ MATCH', 'Breeds are compatible — insemination recommended'],
                ['⚠️ OVERRIDE', 'Mismatch allowed with veterinary reason (audit logged)'],
                ['🚫 BLOCKED', 'Cross-species or harmful combination — insemination prevented'],
              ].map(([s, d]) => (
                <div key={s} style={{ fontSize: 13 }}>
                  <strong>{s}</strong>
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
