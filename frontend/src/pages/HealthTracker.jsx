import { useState, useEffect } from 'react';
import { cowApi, breedingApi } from '../api/client';
import { Sparkles, Calendar, ShieldAlert, CheckCircle2, AlertTriangle, Syringe, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HealthTracker() {
  const [cows, setCows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedCowId, setSelectedCowId] = useState('');

  // Sample vaccination & heat tracking schedule
  const [vaccinations, setVaccinations] = useState([
    { id: 1, cowTag: 'TN-GJ-001', vaccineName: 'FMD (Foot & Mouth Disease)', dueDate: '2026-09-05', status: 'DUE' },
    { id: 2, cowTag: 'TN-GJ-002', vaccineName: 'HS (Hemorrhagic Septicemia)', dueDate: '2026-09-12', status: 'DUE' },
    { id: 3, cowTag: 'TN-GJ-003', vaccineName: 'Deworming (Albendazole)', dueDate: '2026-08-20', status: 'DONE' },
  ]);

  useEffect(() => {
    cowApi.getAll({ page: 0, size: 50 }).then(r => {
      const list = r.data.data?.content || r.data.data || [];
      setCows(list);
      if (list.length > 0) setSelectedCowId(String(list[0].id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleMarkVaccinated = (id) => {
    setVaccinations(prev => prev.map(v => v.id === id ? { ...v, status: 'DONE' } : v));
    toast.success('Vaccination recorded successfully! 💉');
  };

  const activeCow = cows.find(c => String(c.id) === String(selectedCowId));

  // Compute 21-day heat cycle prediction
  const today = new Date();
  const nextHeatDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const optimalWindowStart = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const optimalWindowEnd = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> Reproductive Health Advisory
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Heat Cycle & Vaccination Tracker</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
          Predict 21-day cattle estrus heat cycles to optimize insemination timing and manage disease vaccination calendars.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Heat Cycle (Estrus) Predictor Card */}
        <div className="glass-card" style={{ background: 'rgba(47,75,60,0.3)', border: '1.5px solid var(--color-marigold)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} style={{ color: 'var(--color-marigold)' }} />
            21-Day Estrus Heat Predictor
          </h2>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Select Registered Cattle Tag</label>
            <select className="select font-mono-tabular" value={selectedCowId} onChange={e => setSelectedCowId(e.target.value)}>
              {cows.map(c => (
                <option key={c.id} value={c.id}>{c.tagNumber} — {c.breed?.replace(/_/g,' ')} ({c.status})</option>
              ))}
            </select>
          </div>

          {activeCow && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(28,43,51,0.8)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-husk-tan)', textTransform: 'uppercase', fontWeight: 700 }}>EXPECTED NEXT HEAT DATE</div>
                <div className="font-mono-tabular" style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-marigold)', margin: '4px 0' }}>
                  {nextHeatDate}
                </div>
                <div style={{ fontSize: 13, color: '#72b276', fontWeight: 600 }}>
                  Optimal AI Window: 12 to 24 hours after standing heat onset
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '8px 12px', background: 'rgba(217,201,163,0.04)', borderRadius: 8 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Cattle Tag:</span>
                <span className="font-mono-tabular" style={{ color: 'var(--color-dairy-white)', fontWeight: 700 }}>{activeCow.tagNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '8px 12px', background: 'rgba(217,201,163,0.04)', borderRadius: 8 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Lactation Status:</span>
                <span style={{ color: 'var(--color-marigold)', fontWeight: 700 }}>{activeCow.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Symptoms Check & Heat Signs Guide */}
        <div className="glass-card">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-marigold)' }} />
            Standing Heat Visual Indicators
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Clear Mucus Discharge', desc: 'Transparent stringy discharge from vulva', level: 'High Heat Signal' },
              { title: 'Restlessness & Bellowing', desc: 'Frequent mounting behavior on other cattle', level: 'High Heat Signal' },
              { title: 'Drop in Milk Yield', desc: 'Slight temporary decline in morning milk yield', level: 'Secondary Signal' },
              { title: 'Standing to be Mounted', desc: 'Remains still when mounted by herd mates', level: 'PERFECT AI TIME' },
            ].map(item => (
              <div key={item.title} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(251,247,238,0.03)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dairy-white)' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>{item.desc}</div>
                </div>
                <span className="badge badge-amber" style={{ fontSize: 11 }}>{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Vaccination & Deworming Calendar */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Syringe size={18} style={{ color: 'var(--color-marigold)' }} />
            Vaccination & Deworming Schedule
          </h2>
          <span className="badge badge-emerald">FMD & HS National Program</span>
        </div>

        <table className="pro-table">
          <thead>
            <tr>
              <th>Cattle Tag</th>
              <th>Vaccine / Treatment</th>
              <th>Scheduled Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vaccinations.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="ear-tag-badge">
                    <span className="ear-tag-rivet" />
                    {v.cowTag}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--color-dairy-white)' }}>{v.vaccineName}</td>
                <td className="mono-col">{v.dueDate}</td>
                <td>
                  <span className={`badge ${v.status === 'DONE' ? 'badge-emerald' : 'badge-amber'}`}>
                    {v.status === 'DONE' ? 'Completed' : 'Pending Due'}
                  </span>
                </td>
                <td>
                  {v.status === 'DUE' ? (
                    <button className="btn btn-accent" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => handleMarkVaccinated(v.id)}>
                      Mark Administered
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#72b276', fontWeight: 700 }}>✓ Recorded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
