import { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Info, ChevronRight, Dna, HeartPulse, Sliders, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  {
    id: 'INDIGENOUS_COW',
    name: 'Indigenous Cows (Desi Bovine)',
    icon: '🐄',
    image: '/images/indigenous_gir_cow.png',
    desc: 'Native Indian Zebu breeds with hump, high heat tolerance, tick resistance, and A2 milk production.',
    breeds: [
      {
        name: 'Gir Cow',
        origin: 'Gujarat (Kathiawar)',
        fatPct: '4.8 - 5.2%',
        avgYield: '12 - 18 Litres/day',
        suitableSires: [
          { sire: 'Gir Certified Bull (PTA Milk +450kg)', vigor: '98% Excellent', calfWeight: '28-30 kg', outcome: 'Pure A2A2 Calf with high heat resistance and 18L+ milk capacity' },
          { sire: 'Sahiwal Premium Straw (PTA Milk +380kg)', vigor: '95% Very High', calfWeight: '27-29 kg', outcome: 'Robust F1 Indigenous cross with high fat % and strong immunity' },
        ],
        unsuitableSires: [
          { sire: 'Pure Holstein Friesian (100% HF)', whyNot: '❌ Severe Dystocia (Calving Difficulty): Pure HF sire creates oversized calf (42kg+) causing uterine rupture in Gir cow. High HF blood calves (>75%) suffer severe heat stroke in Indian summers.' },
          { sire: 'Same Sire Bloodline (Inbred Gir)', whyNot: '❌ Inbreeding Depression: Reduces calf immunity by 35% and increases infant mortality rate.' },
          { sire: 'Murrah Buffalo Straw', whyNot: '❌ Interspecies Chromosome Mismatch: Cattle (60 chromosomes) vs Buffalo (50 chromosomes) results in total fertilization failure.' },
        ]
      },
      {
        name: 'Sahiwal Cow',
        origin: 'Punjab / Haryana',
        fatPct: '4.5 - 5.0%',
        avgYield: '14 - 20 Litres/day',
        suitableSires: [
          { sire: 'Sahiwal Pedigree Bull (PTA Milk +520kg)', vigor: '97% Excellent', calfWeight: '29-31 kg', outcome: 'High lactation length (305 days) with peak fat content' },
          { sire: 'Gir Pedigree Bull (A2A2 Certified)', vigor: '96% High', calfWeight: '28-30 kg', outcome: 'A2 Milk line expansion with strong tropical disease tolerance' },
        ],
        unsuitableSires: [
          { sire: 'Heavy Exotic HF Straw (>85% Blood)', whyNot: '❌ Tropical Infertility & Mastitis Risk: Crossbred calves with >75% HF blood suffer high somatic cell count and repeat breeding issues in humid zones.' },
          { sire: 'Jersey Pure Bull on Maiden Heifer', whyNot: '❌ Birth Weight Disproportion: High risk of difficult delivery if heifer weight is under 280 kg.' },
        ]
      }
    ]
  },
  {
    id: 'CROSSBREED_COW',
    name: 'Crossbreed & Exotic Cows (HF / Jersey)',
    icon: '🥛',
    image: '/images/crossbreed_hf_cow.png',
    desc: 'High-yielding crossbred cattle (F1/F2 HF & Jersey crosses) optimized for commercial milk production.',
    breeds: [
      {
        name: 'HF Crossbreed (Holstein Cross)',
        origin: 'India / Europe Cross',
        fatPct: '3.6 - 4.0%',
        avgYield: '20 - 32 Litres/day',
        suitableSires: [
          { sire: 'HF Proven Sire (PTA Milk +850kg, NM$ +$620)', vigor: '92% Good', calfWeight: '36-40 kg', outcome: 'Commercial high-volume producer (28L+ per day)' },
          { sire: 'Jersey Sire (Sexed Straw 90% Female)', vigor: '96% Excellent', calfWeight: '30-34 kg', outcome: 'Improved milk fat % (4.2%) and easier calving' },
        ],
        unsuitableSires: [
          { sire: 'Unproven Local Scrub Bull', whyNot: '❌ Genetic Merit Degradation: Drops daughter milk yield potential by up to 50% compared to mother.' },
          { sire: 'Pure Gir Bull on High-HF Cross', whyNot: '❌ Lactation Yield Regression: F1 back-cross results in sudden drop of milk volume from 25L to 12L.' },
        ]
      }
    ]
  },
  {
    id: 'BUFFALO',
    name: 'Indian Water Buffaloes (Murrah / Surti)',
    icon: '🐃',
    image: '/images/murrah_buffalo.png',
    desc: 'Black gold of Indian dairy — famous for high milk fat percentage (7-8%) ideal for ghee & paneer.',
    breeds: [
      {
        name: 'Murrah Buffalo',
        origin: 'Haryana (Rohtak/Hisar)',
        fatPct: '7.0 - 8.5%',
        avgYield: '14 - 22 Litres/day',
        suitableSires: [
          { sire: 'Murrah Pedigree Bull (NDDB Grade A)', vigor: '99% Outstanding', calfWeight: '34-38 kg', outcome: 'Heavy jet-black calf with 8%+ fat milk potential and long reproductive life' },
          { sire: 'Nili-Ravi Sire Straw', vigor: '94% High', calfWeight: '33-36 kg', outcome: 'High milk volume with excellent wallowing & heat adaptation' },
        ],
        unsuitableSires: [
          { sire: 'Cattle Cow Semen (Gir / HF / Sahiwal)', whyNot: '❌ Genetic Incompatibility: Buffaloes have 50 chromosomes; cattle have 60 chromosomes. Conception rate is 0%.' },
          { sire: 'Uncertified Local Bull Straw', whyNot: '❌ High Risk of Repeat Breeding & Silent Heat: Unscreened bulls transmit Brucellosis and Trichomoniasis.' },
        ]
      }
    ]
  }
];

export default function BreedAdvisor() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selectedBreedIndex, setSelectedBreedIndex] = useState(0);

  // Custom User Configurator State
  const [customForm, setCustomForm] = useState({
    species: 'INDIGENOUS_COW',
    breedName: 'Gir Cow',
    parity: 'MAIDEN_HEIFER',
    weightKg: 290,
    targetGoal: 'MAXIMIZE_FAT',
  });

  const [customResult, setCustomResult] = useState(null);

  const category = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
  const breed = category.breeds[selectedBreedIndex] || category.breeds[0];

  const handleCustomCalculate = (e) => {
    e.preventDefault();
    const { species, breedName, parity, weightKg, targetGoal } = customForm;

    let matchSires = [];
    let blockedSires = [];

    if (species === 'BUFFALO') {
      matchSires = [
        { sire: 'Murrah Grade-A Sire (NDDB Straw #MU-804)', vigor: '99% Outstanding', calfWeight: '34-36 kg', outcome: `Optimized for ${targetGoal === 'MAXIMIZE_FAT' ? '8.2% Fat Content' : '18L/day Milk Yield'}` },
        { sire: 'Nili-Ravi Sexed Straw (90% Female)', vigor: '95% Very High', calfWeight: '32-35 kg', outcome: 'High milk yield female buffalo calf with long lactation persistence' },
      ];
      blockedSires = [
        { sire: 'Cow Semen (Gir / Sahiwal / HF)', whyNot: '❌ Chromosome Mismatch: Buffaloes (50 chromosomes) vs Cattle (60 chromosomes) leads to 0% conception rate.' },
        { sire: 'Unscreened Local Scrub Bull', whyNot: '❌ Transmission of Brucellosis disease and Silent Heat issues.' },
      ];
    } else if (species === 'INDIGENOUS_COW') {
      const isLowWeightHeifer = parity === 'MAIDEN_HEIFER' && weightKg < 310;
      matchSires = [
        { sire: `${breedName.includes('Gir') ? 'Gir Certified A2A2 Bull' : 'Sahiwal Premium Sire'}`, vigor: '98% Excellent', calfWeight: isLowWeightHeifer ? '26-28 kg' : '29-31 kg', outcome: `Easy calving with pure A2 milk production and high heat tolerance` },
        { sire: 'Jersey Sexed Semen Straw (Easy Calving)', vigor: '94% High', calfWeight: '27-29 kg', outcome: 'F1 Cross with 4.8% fat and smooth birth' },
      ];
      blockedSires = [
        { sire: 'Pure Holstein Friesian (100% HF Heavy Sire)', whyNot: isLowWeightHeifer ? '❌ SEVERE DYSTOCIA HAZARD: Dam weight is only ' + weightKg + 'kg! Heavy HF calf (40kg+) will cause severe uterine tearing or death during delivery.' : '❌ Heat Stress Hazard: >75% HF cross calves suffer severe sunstroke and panting in Indian summers.' },
        { sire: 'Same Father Sire Line', whyNot: '❌ Inbreeding Depression: Inbreeding reduces milk yield by 15% and increases infant calf mortality.' },
      ];
    } else { // CROSSBREED_COW
      matchSires = [
        { sire: 'HF Proven Sire (PTA Milk +850kg)', vigor: '93% Good', calfWeight: '36-39 kg', outcome: 'High-volume commercial producer (26L - 32L daily capacity)' },
        { sire: 'Jersey Sexed Straw', vigor: '96% Excellent', calfWeight: '30-33 kg', outcome: 'Higher milk fat (4.2%) and lower feed intake requirement' },
      ];
      blockedSires = [
        { sire: 'Low Merit Local Country Bull', whyNot: '❌ Genetic Merit Loss: Reduces mother\'s high milk inheritance by over 40%.' },
      ];
    }

    setCustomResult({ matchSires, blockedSires });
    toast.success('Custom Sire Evaluation Generated! 🧬');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> AI Sire & Species Compatibility Engine
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Livestock Category & Custom Sire Match Guide</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
          Select standard livestock categories or configure your custom animal parameters to receive tailored sire recommendations and calf vigor forecasts.
        </p>
      </div>

      {/* CUSTOM USER ANIMAL CONFIGURATOR SECTION */}
      <div className="glass-card" style={{ marginBottom: 32, border: '2px solid var(--color-marigold)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sliders size={22} style={{ color: 'var(--color-marigold)' }} />
          Custom Animal Selector & Compatibility Configurator
        </h2>

        <form onSubmit={handleCustomCalculate} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Animal Category</label>
            <select className="select font-mono-tabular" value={customForm.species}
              onChange={e => setCustomForm(p => ({ ...p, species: e.target.value }))}>
              <option value="INDIGENOUS_COW">🐄 Indigenous Cow (Gir / Sahiwal)</option>
              <option value="CROSSBREED_COW">🥛 Crossbreed Cow (HF / Jersey)</option>
              <option value="BUFFALO">🐃 Water Buffalo (Murrah / Surti)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Specific Breed Name</label>
            <input type="text" className="input" placeholder="e.g. Gir, Sahiwal, Murrah"
              value={customForm.breedName} onChange={e => setCustomForm(p => ({ ...p, breedName: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Lactation Stage / Parity</label>
            <select className="select" value={customForm.parity}
              onChange={e => setCustomForm(p => ({ ...p, parity: e.target.value }))}>
              <option value="MAIDEN_HEIFER">🐣 Maiden Heifer (1st Insemination)</option>
              <option value="1ST_LACTATION">🥛 1st Lactation Cow</option>
              <option value="MULTIPLE_LACTATION">🐄 2nd+ Lactation Cow</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dam Body Weight (kg)</label>
            <input type="number" className="input font-mono-tabular" min="200" max="700"
              value={customForm.weightKg} onChange={e => setCustomForm(p => ({ ...p, weightKg: Number(e.target.value) }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Target Goal</label>
            <select className="select" value={customForm.targetGoal}
              onChange={e => setCustomForm(p => ({ ...p, targetGoal: e.target.value }))}>
              <option value="MAXIMIZE_FAT">🧀 Maximize Milk Fat % (Ghee/Paneer)</option>
              <option value="MAXIMIZE_VOLUME">🥛 Maximize Daily Milk Volume (Litres)</option>
              <option value="PURE_A2">🛡️ Pure A2 Milk & High Disease Resistance</option>
              <option value="EASY_CALVING">🐣 Easy Birth (Zero Calving Risk)</option>
            </select>
          </div>

          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-accent" style={{ width: '100%', height: 44 }}>
              <Dna size={18} /> Evaluate Custom Compatibility
            </button>
          </div>
        </form>

        {/* CUSTOM EVALUATION RESULT DISPLAY */}
        {customResult && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1.5px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
              🎯 Custom Evaluation for <span style={{ color: 'var(--color-marigold)' }}>{customForm.breedName}</span> ({customForm.weightKg} kg, {customForm.parity.replace('_',' ')})
            </h3>

            <div className="grid-2">
              <div style={{ padding: 16, borderRadius: 14, background: 'var(--color-status-match-bg)', border: '1px solid rgba(37,107,42,0.3)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-status-match)', marginBottom: 12 }}>
                  ✅ RECOMMENDED SIRE MATCHES
                </h4>
                {customResult.matchSires.map((s, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: 10, background: 'var(--color-surface)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{s.sire}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-husk-tan)', marginTop: 4 }}>
                      Calf Vigor: <strong>{s.vigor}</strong> | Est Weight: <strong>{s.calfWeight}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-pasture)', marginTop: 4 }}>
                      ✨ {s.outcome}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 16, borderRadius: 14, background: 'var(--color-status-mismatch-bg)', border: '1px solid rgba(192,57,43,0.3)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-status-mismatch)', marginBottom: 12 }}>
                  ❌ FORBIDDEN SIRES FOR THIS ANIMAL
                </h4>
                {customResult.blockedSires.map((u, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: 10, background: 'var(--color-surface)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-status-mismatch)' }}>{u.sire}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text)', marginTop: 4, lineHeight: 1.4 }}>
                      {u.whyNot}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Species Category Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {CATEGORIES.map(cat => {
          const isActive = cat.id === activeCategory;
          return (
            <div key={cat.id} onClick={() => { setActiveCategory(cat.id); setSelectedBreedIndex(0); }}
              style={{
                cursor: 'pointer', padding: '16px 20px', borderRadius: 16,
                background: isActive ? 'var(--color-surface)' : 'var(--color-surface-alt)',
                border: `2px solid ${isActive ? 'var(--color-pasture)' : 'var(--color-border)'}`,
                boxShadow: isActive ? 'var(--shadow-card-md)' : 'none',
                transition: 'var(--transition-normal)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
              <div style={{ fontSize: 32 }}>{cat.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: isActive ? 'var(--color-pasture)' : 'var(--color-text)' }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)', marginTop: 2 }}>{cat.breeds.length} Standard Breeds</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Overview Card with Generated Photograph */}
      <div className="glass-card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'center' }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '2px solid var(--color-border)', height: 180 }}>
            <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-emerald">{category.icon} Selected Category</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>{category.name}</h2>
            <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginBottom: 16 }}>{category.desc}</p>

            {/* Breed Sub-Selector */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>Select Breed:</span>
              {category.breeds.map((b, idx) => (
                <button key={b.name} onClick={() => setSelectedBreedIndex(idx)}
                  className={`btn ${idx === selectedBreedIndex ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 14px', fontSize: 13, borderRadius: 'var(--radius-pill)' }}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Breed Parameters Summary */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-husk-tan)', textTransform: 'uppercase' }}>ORIGIN REGION</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginTop: 4 }}>{breed.origin}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-husk-tan)', textTransform: 'uppercase' }}>MILK FAT CONTENT</div>
          <div className="font-mono-tabular" style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-marigold)', marginTop: 4 }}>{breed.fatPct}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-husk-tan)', textTransform: 'uppercase' }}>DAILY MILK YIELD RANGE</div>
          <div className="font-mono-tabular" style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-pasture)', marginTop: 4 }}>{breed.avgYield}</div>
        </div>
      </div>

      {/* Recommended vs Blocked Sire Compatibility Grid */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* SUITABLE SIRE STRAWS */}
        <div className="glass-card" style={{ border: '2px solid var(--color-status-match)', background: 'var(--color-surface)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-status-match)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={20} /> RECOMMENDED SIRE STRAWS (TO USE)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {breed.suitableSires.map((s, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: 'var(--color-status-match-bg)', border: '1px solid rgba(37,107,42,0.3)' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)' }}>{s.sire}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '8px 0', fontSize: 12.5 }}>
                  <div><span style={{ color: 'var(--color-husk-tan)' }}>Calf Vigor:</span> <strong style={{ color: 'var(--color-status-match)' }}>{s.vigor}</strong></div>
                  <div><span style={{ color: 'var(--color-husk-tan)' }}>Est Birth Wt:</span> <strong style={{ color: 'var(--color-text)' }}>{s.calfWeight}</strong></div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--color-husk-tan)', borderTop: '1px stroke var(--color-border)', paddingTop: 6 }}>
                  ✨ <strong>Expected Outcome:</strong> {s.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UNSUITABLE / DANGEROUS SIRE STRAWS */}
        <div className="glass-card" style={{ border: '2px solid var(--color-status-mismatch)', background: 'var(--color-surface)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-status-mismatch)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={20} /> UNSUITABLE SIRES (DO NOT USE)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {breed.unsuitableSires.map((u, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: 'var(--color-status-mismatch-bg)', border: '1px solid rgba(192,57,43,0.3)' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-status-mismatch)' }}>{u.sire}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text)', marginTop: 6, lineHeight: 1.5 }}>
                  {u.whyNot}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
