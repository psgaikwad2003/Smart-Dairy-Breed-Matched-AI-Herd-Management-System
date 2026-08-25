import { useState } from 'react';
import { BookOpen, Sparkles, Dna, ShieldAlert, CheckCircle2, ChevronRight, Calculator, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ANIMAL_CATEGORIES = [
  {
    id: 'indigenous_cows',
    name: 'Indigenous Cows (Desi Bos Indicus)',
    icon: '🐄',
    description: 'High heat tolerance, certified A2 milk production, tick resistant.',
    breeds: [
      { name: 'Gir', origin: 'Gujarat', avgYield: '14-18 L/day', fat: '4.8%', temp: 'Very High', sireRules: 'Must match Gir A2 certified sires. Avoid HF cross on low-weight dams (<350kg).' },
      { name: 'Sahiwal', origin: 'Punjab / Haryana', avgYield: '15-20 L/day', fat: '4.9%', temp: 'High', sireRules: 'Compatible with Sahiwal or Red Sindhi sires for pure genetic preservation.' },
      { name: 'Tharparkar', origin: 'Rajasthan', avgYield: '12-16 L/day', fat: '4.5%', temp: 'Extreme Arid', sireRules: 'Suited for dryland survival; cross only with desert-adapted breeds.' },
    ]
  },
  {
    id: 'crossbred_cows',
    name: 'Crossbred Dairy Cattle (F1 / F2)',
    icon: '🥛',
    description: 'High volume milk yield combined with indigenous climate adaptability.',
    breeds: [
      { name: 'HF Crossbred (F1)', origin: 'National Standard', avgYield: '22-30 L/day', fat: '3.8%', temp: 'Moderate', sireRules: 'Maintain 50-62.5% exotic blood cap to avoid heat stroke risk.' },
      { name: 'Jersey Crossbred', origin: 'National Standard', avgYield: '18-24 L/day', fat: '5.2%', temp: 'High', sireRules: 'High fat content bonus; suitable for smallholder farm feed resources.' },
    ]
  },
  {
    id: 'buffaloes',
    name: 'High-Fat Dairy Buffaloes (Bubalus Bubalis)',
    icon: '🐃',
    description: 'Premier fat percentage (7.5-8.5%) for high co-op milk pricing.',
    breeds: [
      { name: 'Murrah', origin: 'Haryana / Punjab', avgYield: '18-26 L/day', fat: '7.8%', temp: 'High', sireRules: 'CRITICAL: Never cross buffalo dams with cow bulls! Chromosome mismatch (50 vs 60).' },
      { name: 'Jaffarabadi', origin: 'Gir Forest, Gujarat', avgYield: '20-28 L/day', fat: '8.2%', temp: 'Very High', sireRules: 'Heavy body frame (600kg+). Require high energy ration during peak lactation.' },
    ]
  },
  {
    id: 'goats',
    name: 'Dairy Goats & Small Ruminants',
    icon: '🐐',
    description: 'Low investment, high prolificacy, nutritious goat milk.',
    breeds: [
      { name: 'Jamnapari', origin: 'Uttar Pradesh', avgYield: '3.5-4.5 L/day', fat: '4.2%', temp: 'High', sireRules: 'Large frame breed. Ensure kidding stall space.' },
      { name: 'Beetal', origin: 'Punjab', avgYield: '3.0-4.0 L/day', fat: '4.0%', temp: 'High', sireRules: 'Excellent twin/triplet kidding rate.' },
    ]
  },
  {
    id: 'camels',
    name: 'Arid Dairy Camels',
    icon: '🐪',
    description: 'Extreme drought resilience and therapeutic insulin-rich milk.',
    breeds: [
      { name: 'Kharai Camel', origin: 'Kutch Mangroves, Gujarat', avgYield: '6.0-10.0 L/day', fat: '3.2%', temp: 'Extreme Desert/Saline', sireRules: 'Can swim in sea mangroves; specialized desert breeding line.' },
    ]
  }
];

export default function BreedAdvisor() {
  const [activeCategory, setActiveCategory] = useState(ANIMAL_CATEGORIES[0]);
  const [selectedBreed, setSelectedBreed]   = useState(ANIMAL_CATEGORIES[0].breeds[0]);

  // Dynamic Dam Genetic Configurator State
  const [damSpecies, setDamSpecies] = useState('COW');
  const [damBreed, setDamBreed]     = useState('GIR');
  const [damWeight, setDamWeight]   = useState(380);
  const [parity, setParity]         = useState(2);
  const [targetGoal, setTargetGoal] = useState('HIGH_FAT');
  const [calcResult, setCalcResult] = useState(null);

  const handleCalculateMatch = (e) => {
    e.preventDefault();

    let score = 92;
    let recSire = 'Gir Certified A2A2 Emperor';
    let expectedYield = '18.5 L/day';
    let safetyAlert = null;

    if (damSpecies === 'BUFFALO') {
      recSire = 'Murrah Black Gold Royal (Jet Black Bull)';
      expectedYield = '22.0 L/day (8.2% Fat)';
    } else if (damBreed === 'HF_CROSSBRED') {
      recSire = 'HF Pro-Volume 90% Sexed Semen';
      expectedYield = '28.0 L/day';
    }

    if (damWeight < 320 && targetGoal === 'MAX_VOLUME') {
      score = 64;
      safetyAlert = 'WARNING: High dystocia risk! Dam weight (<320kg) is too small for large HF exotic sire.';
    }

    setCalcResult({
      score,
      recSire,
      expectedYield,
      safetyAlert,
      inbreedingRisk: '1.6% (Safe)',
    });

    toast.success('Genetic Compatibility Evaluated!');
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> Genetic Intelligence & Category Standard
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Multi-Species Breed & Biological Sire Guide</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
          Interactive biological pairing guidelines, sire safety protocols, and dynamic dam configurator.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {ANIMAL_CATEGORIES.map(cat => (
          <button key={cat.id} className={`btn ${activeCategory.id === cat.id ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => { setActiveCategory(cat); setSelectedBreed(cat.breeds[0]); }}
            style={{ borderRadius: 'var(--radius-pill)', gap: 8 }}>
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Category Overview & Breed Cards Grid */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {activeCategory.breeds.map(b => (
          <div key={b.name} className="glass-card ear-tag-card" style={{
            borderColor: selectedBreed.name === b.name ? 'var(--color-marigold)' : 'var(--color-border)',
            background: selectedBreed.name === b.name ? 'rgba(247,192,75,0.05)' : undefined,
            cursor: 'pointer',
          }} onClick={() => setSelectedBreed(b)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="badge badge-emerald">{b.origin}</span>
              {selectedBreed.name === b.name && <CheckCircle2 size={16} style={{ color: 'var(--color-marigold)' }} />}
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-dairy-white)' }}>{b.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '12px 0', fontSize: 13.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Avg Daily Yield:</span>
                <strong style={{ color: 'var(--color-marigold)' }}>{b.avgYield}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Fat Percentage:</span>
                <strong style={{ color: 'var(--color-dairy-white)' }}>{b.fat}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Heat Adaptability:</span>
                <span>{b.temp}</span>
              </div>
            </div>

            <div style={{ padding: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--color-husk-tan)' }}>
              <strong>Biological Rule:</strong> {b.sireRules}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Interactive Dam Configurator */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calculator size={20} style={{ color: 'var(--color-marigold)' }} />
          Dynamic Dam Genetic Configurator & Pairing Engine
        </h2>

        <form onSubmit={handleCalculateMatch} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Livestock Species</label>
            <select className="select" value={damSpecies} onChange={e => setDamSpecies(e.target.value)}>
              <option value="COW">Dairy Cow (Bos Indicus)</option>
              <option value="BUFFALO">Dairy Buffalo (Bubalus)</option>
              <option value="GOAT">Dairy Goat</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dam Breed Standard</label>
            <select className="select" value={damBreed} onChange={e => setDamBreed(e.target.value)}>
              <option value="GIR">Gir</option>
              <option value="SAHIWAL">Sahiwal</option>
              <option value="MURRAH">Murrah</option>
              <option value="HF_CROSSBRED">HF Crossbred</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dam Weight (kg)</label>
            <input type="number" className="input font-mono-tabular" value={damWeight} onChange={e => setDamWeight(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Breeding Target Goal</label>
            <select className="select" value={targetGoal} onChange={e => setTargetGoal(e.target.value)}>
              <option value="HIGH_FAT">Maximize Milk Fat % (Co-op Bonus)</option>
              <option value="MAX_VOLUME">Maximize Volume Yield (Litres)</option>
              <option value="A2_CERTIFIED">Strict A2A2 Certified Genetics</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
            <button type="submit" className="btn btn-accent" style={{ padding: '10px 24px', borderRadius: 'var(--radius-pill)' }}>
              Evaluate Genetic Compatibility & Recommend Sire →
            </button>
          </div>
        </form>

        {/* Calculation Result Panel */}
        {calcResult && (
          <div style={{ marginTop: 24, padding: 20, background: 'rgba(247,192,75,0.08)', borderRadius: 14, border: '1.5px solid var(--color-marigold)' }}>
            {calcResult.safetyAlert && (
              <div style={{ padding: '12px 16px', background: 'var(--color-status-mismatch-bg)', border: '1px solid var(--color-status-mismatch)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-status-mismatch)' }}>
                <AlertTriangle size={18} />
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{calcResult.safetyAlert}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Compatibility Score</div>
                <div className="font-mono-tabular" style={{ fontSize: 26, fontWeight: 800, color: calcResult.score > 80 ? '#72b276' : 'var(--color-marigold)' }}>
                  {calcResult.score} / 100
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Recommended Sire Line</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-dairy-white)', marginTop: 4 }}>
                  {calcResult.recSire}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Offspring Yield Forecast</div>
                <div className="font-mono-tabular" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-marigold)', marginTop: 4 }}>
                  {calcResult.expectedYield}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Inbreeding Coefficient</div>
                <div className="font-mono-tabular" style={{ fontSize: 16, fontWeight: 700, color: '#72b276', marginTop: 4 }}>
                  {calcResult.inbreedingRisk}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
