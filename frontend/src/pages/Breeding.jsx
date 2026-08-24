import { useState } from 'react';
import { breedingApi, cowApi, inventoryApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Dna, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Search, Sparkles, ShieldAlert, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const BREEDING_GOALS = ['PUREBRED', 'CROSSBRED', 'GENERAL'];

const CompatBanner = ({ result }) => {
  if (!result) return null;
  const isMatch    = result.status === 'MATCH';
  const isOverride = result.status === 'OVERRIDE';
  const isBlocked  = result.status === 'BLOCKED';

  return (
    <div style={{
      padding: '20px 24px', borderRadius: 16,
      background: isMatch ? 'rgba(16,185,129,0.1)' : isOverride ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)',
      border: `1px solid ${isMatch ? 'rgba(52,211,153,0.3)' : isOverride ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.3)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: isMatch ? 'rgba(16,185,129,0.2)' : isOverride ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.2)',
          color: isMatch ? 'var(--color-primary-bright)' : isOverride ? 'var(--color-accent-bright)' : 'var(--color-rose)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {isMatch ? <CheckCircle2 size={24} /> : isOverride ? <AlertTriangle size={24} /> : <XCircle size={24} />}
        </div>
        <div>
          <div style={{
            fontWeight: 800, fontSize: 18,
            color: isMatch ? 'var(--color-primary-bright)' : isOverride ? 'var(--color-accent-bright)' : 'var(--color-rose)'
          }}>
            {isMatch ? '✅ Genetic Compatibility Match' : isOverride ? '⚠️ Mismatch — Technician Override Required' : '🚫 Prohibited Inbreeding Combination — BLOCKED'}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--color-text-dim)', marginTop: 4, lineHeight: 1.5 }}>
            {result.explanation}
          </div>
        </div>
      </div>

      {result.alternatives?.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recommended Genetic Alternatives
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.alternatives.map(a => (
              <span key={a} className="badge badge-sky">{a.replace(/_/g, ' ')}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Breeding() {
  const { user } = useAuth();
  const [step, setStep]           = useState(1);
  const [cows, setCows]           = useState([]);
  const [straws, setStraws]       = useState([]);
  const [cowSearch, setCowSearch] = useState('');
  const [form, setForm]           = useState({
    cowId: '', semenStrawId: '', breedingGoal: 'GENERAL', overrideReason: '',
    technicianId: user?.userId, inseminationDate: new Date().toISOString().split('T')[0],
    compatibilityStatus: '',
  });
  const [result, setResult]       = useState(null);
  const [loadCows, setLoadCows]   = useState(false);
  const [strawsLoading, setStrawsLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const searchCow = async () => {
    if (!cowSearch) return;
    setLoadCows(true);
    try {
      const r = await cowApi.getByTag(cowSearch.trim());
      const cow = r.data.data;
      setCows([cow]);
      setForm(p => ({ ...p, cowId: cow.id }));
    } catch {
      toast.error('Cattle record not found with that tag ID');
    } finally { setLoadCows(false); }
  };

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
      toast.error('Please select both a cattle profile and a semen straw');
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
      toast.error('Override rationale is mandatory for mismatched breeding');
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
      toast.success('Insemination procedure logged successfully!');
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
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> AI Compatibility Engine
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Breed-Matched Artificial Insemination</h1>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
          Validate bull-cow genetic compatibility, calculate heterosis index, and record AI events.
        </p>
      </div>

      {/* Workflow Step Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {['1. Cattle & Semen Selection', '2. Veterinary Confirmation'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800,
                background: step > i ? 'var(--color-primary-bright)' : step === i+1 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                color: step > i ? '#03180e' : step === i+1 ? 'var(--color-primary-bright)' : 'var(--color-text-muted)',
                border: step === i+1 ? '1px solid var(--color-primary-bright)' : '1px solid var(--color-border)',
              }}>{i+1}</div>
              <span style={{ fontSize: 13.5, color: step === i+1 ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: step === i+1 ? 700 : 500 }}>
                {s}
              </span>
              {i < 1 && <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', marginLeft: 8 }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Left Form Panel */}
        {step === 1 && (
          <form onSubmit={handleValidate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Cow Selection */}
            <div className="glass-card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                🐄 Step 1: Select Cattle Ear Tag
              </h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <Search size={16} className="input-icon" />
                  <input className="input input-with-icon" placeholder="Search tag ID (e.g. TN-GJ-001)..."
                    value={cowSearch} onChange={e => setCowSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && searchCow()} />
                </div>
                <button type="button" className="btn btn-secondary" onClick={searchCow} disabled={loadCows}>
                  {loadCows ? <span className="spinner" /> : 'Search'}
                </button>
              </div>

              {selectedCow && (
                <div style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(52,211,153,0.25)',
                }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-primary-bright)' }}>{selectedCow.tagNumber}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 2 }}>
                    Breed: {selectedCow.breed?.replace(/_/g, ' ')} · Status: {selectedCow.status}
                    {selectedCow.lactationCount && ` · Lactation ${selectedCow.lactationCount}`}
                  </div>
                </div>
              )}
            </div>

            {/* Semen Straw Selection */}
            <div className="glass-card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🧪 Step 2: Select Semen Straw Batch</h3>

              {selectedCow && (
                <button type="button" className="btn btn-secondary" style={{ marginBottom: 14, fontSize: 12.5 }}
                  onClick={() => loadStraws(selectedCow.breed)}>
                  Load Compatible Straws for {selectedCow.breed?.replace(/_/g, ' ')}
                </button>
              )}

              {straws.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {straws.map(s => (
                    <label key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                      padding: '12px 14px', borderRadius: 10,
                      background: form.semenStrawId == s.id ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${form.semenStrawId == s.id ? 'rgba(52,211,153,0.35)' : 'var(--color-border)'}`,
                      transition: 'var(--transition-fast)',
                    }}>
                      <input type="radio" name="straw" value={s.id}
                        checked={form.semenStrawId == s.id}
                        onChange={e => setForm(p => ({ ...p, semenStrawId: e.target.value }))}
                        style={{ accentColor: 'var(--color-primary-bright)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                          {s.breed?.replace(/_/g, ' ')} — Batch #{s.batchNo}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {s.semenStationName} · Station Grade {s.stationGrade}
                        </div>
                      </div>
                      <span className={`badge ${s.stockQty <= 5 ? 'badge-rose' : 'badge-emerald'}`}>
                        {s.stockQty} straws
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                  {selectedCow ? 'Click the button above to load semen inventory' : 'Select a cattle ear tag first'}
                </div>
              )}
            </div>

            {/* Breeding Target Goal */}
            <div className="glass-card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🎯 Step 3: Target Breeding Goal</h3>
              <select className="select" value={form.breedingGoal}
                onChange={e => setForm(p => ({ ...p, breedingGoal: e.target.value }))}>
                {BREEDING_GOALS.map(g => <option key={g} value={g}>{g} Selection Strategy</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: 46, fontSize: 15, borderRadius: 'var(--radius-sm)' }} disabled={validating}>
              {validating ? <span className="spinner" /> : <><Cpu size={18} /> Validate Genetic Compatibility</>}
            </button>
          </form>
        )}

        {/* Confirm Step Form */}
        {step === 2 && (
          <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card">
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📋 Confirm AI Insemination Event</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700 }}>SELECTED CATTLE</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-primary-bright)', marginTop: 2 }}>
                    {selectedCow?.tagNumber || `ID: ${form.cowId}`}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700 }}>SEMEN STRAW BATCH</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-accent-bright)', marginTop: 2 }}>
                    {selectedStraw?.batchNo ? `${selectedStraw.breed?.replace(/_/g, ' ')} (Batch #${selectedStraw.batchNo})` : `ID: ${form.semenStrawId}`}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Insemination Date</label>
                  <input type="date" className="input" value={form.inseminationDate}
                    onChange={e => setForm(p => ({ ...p, inseminationDate: e.target.value }))} />
                </div>

                {result?.status === 'OVERRIDE' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--color-accent-bright)' }}>Technician Override Rationale *</label>
                    <input className="input" placeholder="e.g. Farmer requested crossbreed — approved by Dr. Patel"
                      value={form.overrideReason}
                      onChange={e => setForm(p => ({ ...p, overrideReason: e.target.value }))} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: 'var(--radius-sm)' }} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-sm)' }} disabled={confirming}>
                {confirming ? <span className="spinner" /> : '✅ Record Insemination Event'}
              </button>
            </div>
          </form>
        )}

        {/* Right Result Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card">
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Genetic Match Engine Result</h3>
            {result ? (
              <CompatBanner result={result} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🧬</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>AI Engine Standing By</div>
                <p style={{ fontSize: 13, marginTop: 4 }}>Select a cow and semen straw to trigger real-time compatibility matrix analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
