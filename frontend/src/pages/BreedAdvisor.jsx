import { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ChevronRight, Dna, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// 1. STEP 1: Main Animal Types
const ANIMALS = [
  {
    id: 'COW',
    name: 'Cows (Cattle Bovine)',
    icon: '🐄',
    image: '/images/indigenous_gir_cow.png',
    subText: 'Indigenous Zebu (A2) & High-Yield Crossbreds (HF / Jersey)',
  },
  {
    id: 'BUFFALO',
    name: 'Buffaloes (Bubaline)',
    icon: '🐃',
    image: '/images/murrah_buffalo.png',
    subText: 'High Fat Black Gold (Murrah, Jaffrabadi, Surti)',
  },
  {
    id: 'GOAT',
    name: 'Goats (Caprine)',
    icon: '🐐',
    image: '/images/dairy_goat_jamnapari.png',
    subText: 'Medicinal A2 Dairy Goats (Jamnapari, Barbari, Beetal)',
  },
  {
    id: 'CAMEL',
    name: 'Camels (Camelid)',
    icon: '🐪',
    image: '/images/dairy_camel_kachchhi.png',
    subText: 'Therapeutic Desert Milk (Kachchhi, Bikaneri)',
  },
];

// 2. STEP 2 & 3: Categories & Breed Info nested under each Animal Type
const LIVESTOCK_DATA = {
  COW: [
    {
      id: 'INDIGENOUS_COW',
      categoryName: 'Indigenous Desi Cow (Gir / Sahiwal / Red Sindhi)',
      image: '/images/indigenous_gir_cow.png',
      origin: 'Gujarat & Punjab (Kathiawar / Sahiwal)',
      fatPct: '4.8 - 5.2%',
      avgYield: '12 - 20 Litres/day',
      desc: 'Native Indian Zebu cattle with prominent humps, high heat tolerance, tick resistance, and A2 Beta-Casein milk production.',
      suitableSires: [
        { sire: 'Gir Certified A2A2 Bull (PTA Milk +450kg)', vigor: '98% Excellent', calfWeight: '28-30 kg', outcome: 'Pure A2A2 Calf with high heat resistance and 18L+ milk capacity' },
        { sire: 'Sahiwal Premium Straw (PTA Milk +380kg)', vigor: '95% Very High', calfWeight: '27-29 kg', outcome: 'Robust F1 Indigenous cross with high fat % and strong immunity' },
      ],
      unsuitableSires: [
        { sire: 'Pure Holstein Friesian (100% HF)', whyNot: '❌ Severe Dystocia (Calving Difficulty): Pure HF sire creates oversized calf (42kg+) causing uterine rupture in Gir cow. High HF blood calves (>75%) suffer severe heat stroke in Indian summers.' },
        { sire: 'Same Sire Bloodline (Inbred Gir)', whyNot: '❌ Inbreeding Depression: Reduces calf immunity by 35% and increases infant mortality rate.' },
        { sire: 'Murrah Buffalo Straw', whyNot: '❌ Interspecies Chromosome Mismatch: Cattle (60 chromosomes) vs Buffalo (50 chromosomes) results in total fertilization failure.' },
      ]
    },
    {
      id: 'CROSSBREED_COW',
      categoryName: 'Exotic & Crossbreed Cow (HF Cross / Jersey Cross)',
      image: '/images/crossbreed_hf_cow.png',
      origin: 'India / Europe Cross (F1 / F2 Generation)',
      fatPct: '3.6 - 4.2%',
      avgYield: '20 - 32 Litres/day',
      desc: 'High-yielding commercial crossbred cows designed for maximum daily milk volume production.',
      suitableSires: [
        { sire: 'HF Proven Sire (PTA Milk +850kg, NM$ +$620)', vigor: '93% Good', calfWeight: '36-40 kg', outcome: 'Commercial high-volume producer (28L+ per day)' },
        { sire: 'Jersey Sire (Sexed Straw 90% Female)', vigor: '96% Excellent', calfWeight: '30-34 kg', outcome: 'Improved milk fat % (4.2%) and easier calving' },
      ],
      unsuitableSires: [
        { sire: 'Unproven Local Country Bull', whyNot: '❌ Genetic Merit Degradation: Drops daughter milk yield potential by up to 50% compared to mother.' },
        { sire: 'Pure Gir Bull on High-HF Cross', whyNot: '❌ Lactation Yield Regression: F1 back-cross results in sudden drop of milk volume from 25L to 12L.' },
      ]
    }
  ],

  BUFFALO: [
    {
      id: 'MURRAH_BUFFALO',
      categoryName: 'Murrah Buffalo (Jet Black Gold)',
      image: '/images/murrah_buffalo.png',
      origin: 'Haryana (Rohtak / Hisar / Jind)',
      fatPct: '7.0 - 8.5%',
      avgYield: '14 - 22 Litres/day',
      desc: 'The black gold of Indian dairy farming — famous for tightly curved horns and rich, creamy milk (7-8.5% fat) perfect for ghee & paneer.',
      suitableSires: [
        { sire: 'Murrah Pedigree Bull (NDDB Grade A)', vigor: '99% Outstanding', calfWeight: '34-38 kg', outcome: 'Heavy jet-black calf with 8%+ fat milk potential and long reproductive life' },
        { sire: 'Nili-Ravi Sire Straw', vigor: '94% High', calfWeight: '33-36 kg', outcome: 'High milk volume with excellent wallowing & heat adaptation' },
      ],
      unsuitableSires: [
        { sire: 'Cattle Cow Semen (Gir / HF / Sahiwal)', whyNot: '❌ Genetic Incompatibility: Buffaloes have 50 chromosomes; cattle have 60 chromosomes. Conception rate is 0%.' },
        { sire: 'Uncertified Local Bull Straw', whyNot: '❌ High Risk of Repeat Breeding & Silent Heat: Unscreened bulls transmit Brucellosis and Trichomoniasis.' },
      ]
    },
    {
      id: 'JAFFRABADI_BUFFALO',
      categoryName: 'Jaffrabadi & Surti Buffalo',
      image: '/images/murrah_buffalo.png',
      origin: 'Gujarat (Saurashtra / Kutch)',
      fatPct: '7.5 - 9.0%',
      avgYield: '15 - 24 Litres/day',
      desc: 'Heavy-framed buffaloes with broad drooped horns, giving highest milk fat content for premium commercial butter.',
      suitableSires: [
        { sire: 'Jaffrabadi Heavy Grade Sire Straw', vigor: '97% Excellent', calfWeight: '36-40 kg', outcome: 'Massive frame daughter with peak fat percentage for premium ghee manufacturing' },
      ],
      unsuitableSires: [
        { sire: 'Small Breed Cow Semen', whyNot: '❌ Chromosomal Incompatibility: Interspecies fertilization impossible.' },
      ]
    }
  ],

  GOAT: [
    {
      id: 'JAMNAPARI_GOAT',
      categoryName: 'Jamnapari Dairy Goat',
      image: '/images/dairy_goat_jamnapari.png',
      origin: 'Uttar Pradesh (Etawah / Yamuna Valley)',
      fatPct: '4.5 - 5.5%',
      avgYield: '2.5 - 4.5 Litres/day',
      desc: 'Tall, majestic goat breed with convex Roman nose and long pendulous ears, producing high-value medicinal A2 milk.',
      suitableSires: [
        { sire: 'Jamnapari Pedigree Buck Straw (ICAR-CIRG Grade A)', vigor: '98% Excellent', kidWeight: '3.5-4.2 kg', outcome: 'Tall majestic frame daughter with high daily milk yield and medicinal quality' },
        { sire: 'Beetal Premium Buck Straw', vigor: '95% High', kidWeight: '3.2-3.8 kg', outcome: 'Twinning potential with high lactation length' },
      ],
      unsuitableSires: [
        { sire: 'Sheep / Ram Straw', whyNot: '❌ Interspecies Fertilization Failure: Goats (60 chromosomes) and Sheep (54 chromosomes) create non-viable hybrid embryos that abort early.' },
        { sire: 'Small Barbari Buck on Large Jamnapari Doe', whyNot: '❌ Size & Frame Regression: Substantially reduces daughter height and milk udder capacity.' },
      ]
    },
    {
      id: 'BARBARI_BEETAL_GOAT',
      categoryName: 'Barbari & Beetal Dairy Goat',
      image: '/images/dairy_goat_jamnapari.png',
      origin: 'Punjab & Uttar Pradesh',
      fatPct: '4.2 - 5.0%',
      avgYield: '2.0 - 3.5 Litres/day',
      desc: 'Compact, highly prolific dairy goats with frequent twinning & triplet births.',
      suitableSires: [
        { sire: 'Beetal Pedigree Buck Straw', vigor: '96% High', kidWeight: '3.0-3.5 kg', outcome: 'High prolificacy (twinning & triplets) with high milk yield' },
      ],
      unsuitableSires: [
        { sire: 'Cattle Cow / Bull Straw', whyNot: '❌ Total Biological Mismatch: Impossible fertilization across species.' },
      ]
    }
  ],

  CAMEL: [
    {
      id: 'KACHCHHI_CAMEL',
      categoryName: 'Kachchhi & Bikaneri Dairy Camel',
      image: '/images/dairy_camel_kachchhi.png',
      origin: 'Gujarat (Kutch) & Rajasthan',
      fatPct: '2.5 - 3.5%',
      avgYield: '6.0 - 12.0 Litres/day',
      desc: 'Desert therapeutic milk producers rich in natural insulin-like proteins used for health remedies.',
      suitableSires: [
        { sire: 'Kachchhi Grade-A Stud Camel Straw', vigor: '97% Excellent', calfWeight: '32-38 kg', outcome: 'High lactation adaptation in arid desert conditions with insulin-rich milk' },
      ],
      unsuitableSires: [
        { sire: 'Cattle / Buffalo Semen', whyNot: '❌ Interspecies Chromosomal Isolation: Camelids belong to Camelidae family (74 chromosomes) and cannot cross with bovines.' },
      ]
    }
  ]
};

export default function BreedAdvisor() {
  const [step, setStep] = useState(1); // 1 = Select Animal, 2 = Select Category, 3 = View Info
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Step 1: Select Animal Type
  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    const categories = LIVESTOCK_DATA[animal.id] || [];
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
    setStep(2);
  };

  // Step 2: Select Category
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setStep(3);
  };

  const categoriesForAnimal = selectedAnimal ? (LIVESTOCK_DATA[selectedAnimal.id] || []) : [];

  return (
    <div className="fade-in" style={{ maxWidth: 1150, margin: '0 auto' }}>
      {/* Step Progress Breadcrumb Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald">
                <Sparkles size={11} /> Guided Livestock Selection Wizard
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Dairy Livestock & Breed Compatibility Wizard</h1>
          </div>

          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)} style={{ borderRadius: 'var(--radius-pill)' }}>
              <ArrowLeft size={16} /> Back to Step {step - 1}
            </button>
          )}
        </div>

        {/* Wizard Steps Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: step >= 1 ? 'var(--color-pasture)' : 'var(--color-husk-tan)' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: step >= 1 ? 'var(--color-pasture)' : 'var(--color-surface-alt)', color: step >= 1 ? 'white' : 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
            1. Select Animal
          </div>
          <ChevronRight size={16} style={{ color: 'var(--color-husk-tan)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: step >= 2 ? 'var(--color-pasture)' : 'var(--color-husk-tan)' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: step >= 2 ? 'var(--color-pasture)' : 'var(--color-surface-alt)', color: step >= 2 ? 'white' : 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</span>
            2. Choose Category
          </div>
          <ChevronRight size={16} style={{ color: 'var(--color-husk-tan)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: step >= 3 ? 'var(--color-pasture)' : 'var(--color-husk-tan)' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: step >= 3 ? 'var(--color-pasture)' : 'var(--color-surface-alt)', color: step >= 3 ? 'white' : 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</span>
            3. Breed & Sire Info
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STEP 1: CHOOSE ANIMAL TYPE */}
      {/* =================================================================== */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', marginBottom: 20 }}>
            Step 1: Choose Your Dairy Animal Type
          </h2>

          <div className="grid-2" style={{ gap: 20 }}>
            {ANIMALS.map(anim => (
              <div key={anim.id} onClick={() => handleSelectAnimal(anim)}
                className="glass-card" style={{ cursor: 'pointer', padding: 20, display: 'flex', gap: 20, alignItems: 'center', transition: 'var(--transition-normal)' }}>
                <div style={{ width: 140, height: 110, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '2px solid var(--color-border)' }}>
                  <img src={anim.image} alt={anim.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>{anim.icon}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>{anim.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-husk-tan)', marginBottom: 12 }}>{anim.subText}</p>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-pasture)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Select Categories <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: CHOOSE CATEGORY / BREED FOR SELECTED ANIMAL */}
      {/* =================================================================== */}
      {step === 2 && selectedAnimal && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: 6 }}>
                Selected: {selectedAnimal.icon} {selectedAnimal.name}
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>
                Step 2: Choose Category / Breed
              </h2>
            </div>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>
              <RefreshCw size={14} /> Change Animal
            </button>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {categoriesForAnimal.map(cat => (
              <div key={cat.id} onClick={() => handleSelectCategory(cat)}
                className="glass-card" style={{ cursor: 'pointer', padding: 24, border: '2px solid var(--color-border)', transition: 'var(--transition-normal)' }}>
                <div style={{ height: 160, borderRadius: 14, overflow: 'hidden', marginBottom: 16, border: '1.5px solid var(--color-border)' }}>
                  <img src={cat.image} alt={cat.categoryName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>{cat.categoryName}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--color-husk-tan)', marginBottom: 16, lineHeight: 1.5 }}>{cat.desc}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-alt)', padding: '10px 14px', borderRadius: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-husk-tan)' }}>Origin: {cat.origin}</span>
                  <span className="font-mono-tabular" style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-marigold)' }}>{cat.fatPct} Fat</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>
                  View Full Sire & Breed Info <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: FULL CATEGORY & SIRE COMPATIBILITY INFORMATION */}
      {/* =================================================================== */}
      {step === 3 && selectedCategory && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: 6 }}>
                Category: {selectedCategory.categoryName}
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)' }}>
                Detailed Breed & Sire Compatibility Guide
              </h2>
            </div>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              <RefreshCw size={14} /> Choose Another Category
            </button>
          </div>

          {/* Category Overview Photo Card */}
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'center' }}>
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '2px solid var(--color-border)', height: 200 }}>
                <img src={selectedCategory.image} alt={selectedCategory.categoryName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>{selectedCategory.categoryName}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginBottom: 16 }}>{selectedCategory.desc}</p>

                <div className="grid-3" style={{ gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--color-surface-alt)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-husk-tan)' }}>ORIGIN</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>{selectedCategory.origin}</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--color-surface-alt)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-husk-tan)' }}>FAT %</div>
                    <div className="font-mono-tabular" style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-marigold)', marginTop: 2 }}>{selectedCategory.fatPct}</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--color-surface-alt)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-husk-tan)' }}>DAILY YIELD</div>
                    <div className="font-mono-tabular" style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-pasture)', marginTop: 2 }}>{selectedCategory.avgYield}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Sires vs Forbidden Sires */}
          <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
            {/* SUITABLE SIRE STRAWS */}
            <div className="glass-card" style={{ border: '2px solid var(--color-status-match)', background: 'var(--color-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-status-match)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} /> RECOMMENDED SIRES / BUCK STRAWS (TO USE)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedCategory.suitableSires.map((s, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 12, background: 'var(--color-status-match-bg)', border: '1px solid rgba(37,107,42,0.3)' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)' }}>{s.sire}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '8px 0', fontSize: 12.5 }}>
                      <div><span style={{ color: 'var(--color-husk-tan)' }}>Offspring Vigor:</span> <strong style={{ color: 'var(--color-status-match)' }}>{s.vigor}</strong></div>
                      <div><span style={{ color: 'var(--color-husk-tan)' }}>Est Birth Wt:</span> <strong style={{ color: 'var(--color-text)' }}>{s.calfWeight || s.kidWeight}</strong></div>
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
                {selectedCategory.unsuitableSires.map((u, i) => (
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
      )}
    </div>
  );
}
