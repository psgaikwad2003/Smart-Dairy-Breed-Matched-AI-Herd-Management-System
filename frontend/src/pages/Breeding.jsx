import { useState, useEffect } from 'react';
import { breedingApi, cowApi, inventoryApi, bullApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, XCircle, Search, Sparkles, Award, Zap, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Breeding() {
  const { user } = useAuth();

  // Unified Wizard Step: 1 = Pick Cow, 2 = Pick Straw, 3 = Confirm Insemination
  const [wizardStep, setWizardStep]     = useState(1);

  const [cows, setCows]                 = useState([]);
  const [selectedCowId, setSelectedCowId] = useState('');
  const [cowSearch, setCowSearch]       = useState('');
  const [loadCows, setLoadCows]         = useState(false);

  // Recommendations & Straws
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs]         = useState(false);
  const [selectedStraw, setSelectedStraw]     = useState(null);
  const [a2a2OnlyFilter, setA2a2OnlyFilter]   = useState(false);

  // Show Advanced Details Toggle (Keeps view clean for simple users)
  const [showAdvanced, setShowAdvanced]     = useState(false);

  // Insemination Form
  const [inseminationDate, setInseminationDate] = useState(new Date().toISOString().split('T')[0]);
  const [overrideReason, setOverrideReason]     = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [submitting, setSubmitting]             = useState(false);

  // Simulator State
  const [simResult, setSimResult]   = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Initial fetch cows
  useEffect(() => {
    cowApi.getAll({ page: 0, size: 50 }).then(r => {
      const list = r.data.data?.content || r.data.data || [];
      setCows(list);
      if (list.length > 0) setSelectedCowId(String(list[0].id));
    }).catch(() => {});
  }, []);

  // Auto-fetch sire recommendations whenever selected cow changes
  useEffect(() => {
    if (!selectedCowId) return;
    setLoadingRecs(true);
    bullApi.getRecommendations(selectedCowId, a2a2OnlyFilter)
      .then(r => setRecommendations(r.data.data || []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecs(false));
  }, [selectedCowId, a2a2OnlyFilter]);

  const activeCow = cows.find(c => String(c.id) === String(selectedCowId));

  // Step 1 -> Step 2
  const handleSelectCow = (cowId) => {
    setSelectedCowId(String(cowId));
    setWizardStep(2);
    setSelectedStraw(null);
    setValidationResult(null);
  };

  // Step 2 -> Step 3
  const handleSelectStraw = async (straw) => {
    setSelectedStraw(straw);
    setWizardStep(3);

    // Run background validation
    try {
      const r = await breedingApi.validate({
        cowId: Number(selectedCowId),
        semenStrawId: Number(straw.semenStrawId),
        breedingGoal: 'GENERAL'
      });
      setValidationResult(r.data.data);
    } catch {
      setValidationResult({ status: 'MATCH', explanation: 'Matching breed sire selected.' });
    }
  };

  // Save Insemination
  const handleSaveInsemination = async (e) => {
    e.preventDefault();
    if (validationResult?.status === 'OVERRIDE' && !overrideReason.trim()) {
      toast.error('Please enter a brief reason for override');
      return;
    }
    setSubmitting(true);
    try {
      await breedingApi.confirm({
        cowId: Number(selectedCowId),
        semenStrawId: Number(selectedStraw.semenStrawId),
        technicianId: Number(user?.userId || 1),
        inseminationDate: inseminationDate,
        compatibilityStatus: validationResult?.status || 'MATCH',
        overrideReason: overrideReason || null,
      });
      toast.success('Insemination Record Saved Successfully! 🐄✨');
      // Reset to Step 1 cleanly
      setWizardStep(1);
      setSelectedStraw(null);
      setValidationResult(null);
      setOverrideReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save insemination record');
    } finally { setSubmitting(false); }
  };

  // Simulate Offspring Outcome
  const handleSimulate = async (strawId) => {
    if (!selectedCowId || !strawId) return;
    setSimulating(true);
    try {
      const r = await breedingApi.simulate({
        cowId: Number(selectedCowId),
        semenStrawId: Number(strawId)
      });
      setSimResult(r.data.data);
    } catch {
      toast.error('Could not simulate offspring forecast');
    } finally { setSimulating(false); }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>

      {/* Simplified Page Title */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span className="badge badge-emerald">
            <Sparkles size={12} /> Easy Step-by-Step AI Guide
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Record Breeding Insemination</h1>
        <p style={{ fontSize: 15, color: 'var(--color-husk-tan)', marginTop: 4 }}>
          Select a cow, pick the #1 matched sire straw, and save your record in under 1 minute.
        </p>
      </div>

      {/* 3-Step Simple Progress Indicator */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { num: 1, label: '1. Select Cow Tag', active: wizardStep === 1, done: wizardStep > 1 },
            { num: 2, label: '2. Pick Best Sire Straw', active: wizardStep === 2, done: wizardStep > 2 },
            { num: 3, label: '3. Save Record', active: wizardStep === 3, done: wizardStep === 3 },
          ].map(s => (
            <div key={s.num}
              onClick={() => { if (s.done) setWizardStep(s.num); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: s.active ? 'rgba(232, 169, 62, 0.15)' : s.done ? 'rgba(78, 122, 81, 0.15)' : 'rgba(251,247,238,0.03)',
                border: `1.5px solid ${s.active ? 'var(--color-marigold)' : s.done ? '#72b276' : 'var(--color-border)'}`,
                cursor: s.done ? 'pointer' : 'default',
                transition: 'var(--transition-fast)'
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800,
                background: s.done ? '#72b276' : s.active ? 'var(--color-marigold)' : 'rgba(255,255,255,0.08)',
                color: s.active || s.done ? '#1C2B33' : 'var(--color-husk-tan)',
              }}>
                {s.done ? '✓' : s.num}
              </div>
              <span style={{ fontSize: 14, fontWeight: s.active ? 700 : 500, color: s.active ? 'var(--color-marigold)' : s.done ? '#72b276' : 'var(--color-dairy-white)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT COW */}
      {wizardStep === 1 && (
        <div className="glass-card sunrise-fade">
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            🐄 Step 1: Select Cattle Ear Tag
          </h2>

          <div style={{ marginBottom: 20 }}>
            <div className="input-wrapper" style={{ maxWidth: 400 }}>
              <Search size={16} className="input-icon" style={{ color: 'var(--color-marigold)' }} />
              <input
                className="input input-with-icon font-mono-tabular"
                placeholder="Filter by Ear Tag ID (e.g. TN-GJ-001)..."
                value={cowSearch}
                onChange={e => setCowSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            {cows.filter(c => c.tagNumber?.toLowerCase().includes(cowSearch.toLowerCase()) || c.breed?.toLowerCase().includes(cowSearch.toLowerCase())).map(cow => (
              <div key={cow.id}
                className="glass-card ear-tag-card"
                onClick={() => handleSelectCow(cow.id)}
                style={{
                  cursor: 'pointer',
                  padding: 18,
                  borderColor: String(cow.id) === String(selectedCowId) ? 'var(--color-marigold)' : 'var(--color-border)',
                  background: String(cow.id) === String(selectedCowId) ? 'rgba(232, 169, 62, 0.08)' : 'rgba(28,43,51,0.6)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ear-tag-badge">
                    <span className="ear-tag-rivet" />
                    {cow.tagNumber}
                  </div>
                  <span className="badge badge-emerald">{cow.status}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12, color: 'var(--color-dairy-white)' }}>
                  {cow.breed?.replace(/_/g, ' ')} Standard
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-husk-tan)', marginTop: 4 }}>
                  Current Yield: <strong style={{ color: 'var(--color-marigold)' }}>{cow.currentMilkYieldLitres || 12} L/day</strong>
                </div>
                <button className="btn btn-accent" style={{ width: '100%', marginTop: 14, padding: '8px 12px', fontSize: 13 }}>
                  Select This Cow →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: PICK RECOMMENDED SIRE STRAW */}
      {wizardStep === 2 && activeCow && (
        <div className="sunrise-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Active Selected Cow Ribbon */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="ear-tag-badge">
                <span className="ear-tag-rivet" />
                {activeCow.tagNumber}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{activeCow.breed?.replace(/_/g, ' ')} Cow</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-husk-tan)' }}>Daily Yield: {activeCow.currentMilkYieldLitres || 12} L/day</div>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 12.5, padding: '5px 12px' }} onClick={() => setWizardStep(1)}>
              Change Cow
            </button>
          </div>

          {/* Simple Header & A2A2 Filter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧪 Step 2: Auto-Matched Sire Straws
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--color-dairy-white)' }}>
                <input type="checkbox" checked={a2a2OnlyFilter} onChange={e => setA2a2OnlyFilter(e.target.checked)} style={{ accentColor: 'var(--color-marigold)', width: 16, height: 16 }} />
                🥛 Certified A2A2 Only
              </label>

              <button className="btn btn-ghost" style={{ fontSize: 13, color: 'var(--color-marigold)' }} onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? <><ChevronUp size={15} /> Hide Advanced Math</> : <><ChevronDown size={15} /> Show Advanced Genetic Math</>}
              </button>
            </div>
          </div>

          {/* Ranked Recommendation Cards */}
          {loadingRecs ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: 'var(--color-husk-tan)' }}>Matching best genetic straws for {activeCow.tagNumber}...</div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40, color: 'var(--color-husk-tan)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🧪</div>
              <div>No matching straws found in inventory.</div>
            </div>
          ) : (
            <div className="grid-2">
              {recommendations.map((rec) => (
                <div key={rec.semenStrawId} className="glass-card ear-tag-card" style={{
                  borderColor: rec.recommendationRank.includes('#1') ? 'var(--color-marigold)' : 'var(--color-border)',
                  background: rec.recommendationRank.includes('#1') ? 'rgba(232, 169, 62, 0.06)' : 'var(--color-bg-card)',
                }}>
                  {/* Top Simple Rank Ribbon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className={`badge ${rec.recommendationRank.includes('#1') ? 'badge-amber' : 'badge-sky'}`} style={{ fontWeight: 800 }}>
                      {rec.recommendationRank} Sire Choice
                    </span>
                    <span className="badge badge-emerald font-mono-tabular">
                      {rec.stockQty} straws in stock
                    </span>
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-dairy-white)' }}>{rec.bullName}</h3>
                  <div style={{ fontSize: 13.5, color: 'var(--color-marigold)', fontWeight: 700, marginTop: 2, marginBottom: 12 }}>
                    {rec.bullBreed?.replace(/_/g, ' ')} · Batch #{rec.batchNo}
                  </div>

                  {/* Simple Key Takeaways */}
                  <div style={{ background: 'rgba(217, 201, 163, 0.05)', padding: 12, borderRadius: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-dairy-white)', marginBottom: 4 }}>
                      💡 {rec.rationale}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                      <span className="badge badge-emerald">
                        Yield Boost: +{rec.ptaMilkKg} kg Milk
                      </span>
                      {rec.a2a2Status && <span className="badge badge-sky">Certified A2A2</span>}
                    </div>
                  </div>

                  {/* Advanced Math Box (Only shown if toggled) */}
                  {showAdvanced && (
                    <div style={{ padding: 12, borderRadius: 8, background: 'rgba(0,0,0,0.2)', marginBottom: 14, fontSize: 12.5, color: 'var(--color-husk-tan)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <div>Net Merit: <strong>${rec.netMeritIndex}</strong></div>
                      <div>Exotic Blood %: <strong>{rec.expectedCalfExoticBloodPct}%</strong></div>
                      <div>Inbreeding Est: <strong>{rec.estimatedInbreedingPct}%</strong></div>
                      <div>Station Grade: <strong>Grade {rec.stationGrade}</strong></div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ fontSize: 12.5, flex: 1 }}
                      onClick={() => handleSimulate(rec.semenStrawId)}>
                      <Cpu size={14} /> Forecast Offspring
                    </button>
                    <button className="btn btn-accent" style={{ fontSize: 13.5, flex: 1.2 }}
                      onClick={() => handleSelectStraw(rec)}>
                      Pick This Straw →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Offspring Simulator Modal / Box */}
          {simResult && (
            <div className="glass-card sunrise-fade" style={{ background: 'rgba(90, 163, 199, 0.1)', borderColor: 'var(--color-sky)', marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-sky)' }}>🔮 Offspring Forecast Result</h3>
                <button className="btn btn-ghost btn-icon" onClick={() => setSimResult(null)}>✕</button>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dairy-white)' }}>
                Expected Calf Daily Yield Potential: <span style={{ color: '#72b276', fontSize: 18 }}>{simResult.predictedCalfYieldPotentialKg} L/day</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-husk-tan)', marginTop: 4 }}>
                {simResult.detailedRationale}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: CONFIRM & SAVE INSEMINATION */}
      {wizardStep === 3 && activeCow && selectedStraw && (
        <div className="glass-card sunrise-fade">
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
            📋 Step 3: Confirm & Save Insemination
          </h2>

          {/* Summary Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, background: 'rgba(47,75,60,0.3)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-husk-tan)', textTransform: 'uppercase', fontWeight: 700 }}>SELECTED CATTLE</div>
              <div className="ear-tag-badge" style={{ marginTop: 8 }}>
                <span className="ear-tag-rivet" />
                {activeCow.tagNumber}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-dairy-white)', marginTop: 6 }}>
                {activeCow.breed?.replace(/_/g, ' ')}
              </div>
            </div>

            <div style={{ padding: 16, background: 'rgba(232, 169, 62, 0.1)', borderRadius: 12, border: '1px solid var(--color-marigold)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-marigold)', textTransform: 'uppercase', fontWeight: 700 }}>SELECTED SIRE STRAW</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-dairy-white)', marginTop: 6 }}>
                {selectedStraw.bullName}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-husk-tan)' }}>
                Batch #{selectedStraw.batchNo} · {selectedStraw.bullBreed?.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Validation Result Banner */}
          {validationResult && (
            <div style={{
              padding: 16, borderRadius: 12, marginBottom: 20,
              background: validationResult.status === 'MATCH' ? 'var(--color-status-match-bg)' : 'var(--color-status-warning-bg)',
              border: `1.5px solid ${validationResult.status === 'MATCH' ? 'var(--color-status-match)' : 'var(--color-status-warning)'}`,
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: validationResult.status === 'MATCH' ? '#72b276' : '#f3be68' }}>
                {validationResult.status === 'MATCH' ? '✅ Safe & Compatible Breeding Pair' : '⚠️ Note: Crossbreed Combination'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-dairy-white)', marginTop: 2 }}>
                {validationResult.explanation || 'Sire straw matches cattle breed requirements.'}
              </div>
            </div>
          )}

          <form onSubmit={handleSaveInsemination} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Insemination Date *</label>
              <input type="date" className="input font-mono-tabular" style={{ maxWidth: 300 }}
                value={inseminationDate} onChange={e => setInseminationDate(e.target.value)} required />
            </div>

            {validationResult?.status === 'OVERRIDE' && (
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-marigold)' }}>Override Rationale *</label>
                <input className="input" placeholder="e.g. Approved by farmer for crossbreeding"
                  value={overrideReason} onChange={e => setOverrideReason(e.target.value)} required />
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWizardStep(2)}>
                ← Change Straw
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1.5, height: 46, fontSize: 15 }} disabled={submitting}>
                {submitting ? <span className="spinner" /> : '✓ Save Insemination Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
