import { useState, useEffect } from 'react';
import { cowApi } from '../api/client';
import { Sparkles, Calculator, Utensils, IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FeedOptimizer() {
  const [cows, setCows]               = useState([]);
  const [selectedCowId, setSelectedCowId] = useState('');
  const [cowWeight, setCowWeight]     = useState(400); // kg
  const [targetYield, setTargetYield] = useState(12); // Liters/day
  const [fatPct, setFatPct]           = useState(4.5); // %
  const [milkPrice, setMilkPrice]     = useState(45); // ₹/Liter

  // Feed Prices per kg (INR)
  const [greenFeedPrice, setGreenFeedPrice] = useState(2.5); // ₹/kg (Barseem/Maize)
  const [dryFeedPrice, setDryFeedPrice]     = useState(7.0); // ₹/kg (Wheat Straw/Bhusa)
  const [concFeedPrice, setConcFeedPrice]   = useState(26.0); // ₹/kg (Pashu Aahar Concentrate)

  useEffect(() => {
    cowApi.getAll({ page: 0, size: 50 }).then(r => {
      const list = r.data.data?.content || r.data.data || [];
      setCows(list);
      if (list.length > 0) {
        setSelectedCowId(String(list[0].id));
        setTargetYield(list[0].currentMilkYieldLitres || 12);
      }
    }).catch(() => {});
  }, []);

  const activeCow = cows.find(c => String(c.id) === String(selectedCowId));

  // Calculations based on NDDB / ICAR Dairy Nutrition Standards
  // Maintenance DM = 2% of body weight
  // Production DM = 0.4 kg concentrate per liter of milk
  const maintenanceDM = (cowWeight * 0.02);
  const productionDM  = (targetYield * 0.4);
  const totalDryMatter = (maintenanceDM + productionDM).toFixed(1);

  // Recommended Feed Ration Mix
  const reqGreenFodder = Math.round(totalDryMatter * 1.8); // kg wet green fodder
  const reqDryFodder   = Math.round(totalDryMatter * 0.6); // kg dry straw
  const reqConcentrate = Number((productionDM + 1.2).toFixed(1)); // kg concentrate feed

  // Daily Financials
  const dailyGreenCost = Math.round(reqGreenFodder * greenFeedPrice);
  const dailyDryCost   = Math.round(reqDryFodder * dryFeedPrice);
  const dailyConcCost  = Math.round(reqConcentrate * concFeedPrice);
  const totalFeedCost  = dailyGreenCost + dailyDryCost + dailyConcCost;

  const grossDailyRevenue = Math.round(targetYield * milkPrice);
  const netDailyProfit    = grossDailyRevenue - totalFeedCost;
  const monthlyProfit     = netDailyProfit * 30;

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-emerald">
            <Sparkles size={11} /> NDDB Ration Balancer AI
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Pashu Aahar Feed & Profit Optimizer</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-husk-tan)', marginTop: 2 }}>
          Optimize daily feed ration mix (Green, Dry Fodder & Concentrate) to maximize daily milk yield and net profit per cow.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Input Parameters Form */}
        <div className="glass-card">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Utensils size={18} style={{ color: 'var(--color-marigold)' }} />
            Cattle & Milk Parameters
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Select Registered Cattle</label>
              <select className="select font-mono-tabular" value={selectedCowId} onChange={e => {
                setSelectedCowId(e.target.value);
                const c = cows.find(x => String(x.id) === e.target.value);
                if (c) setTargetYield(c.currentMilkYieldLitres || 12);
              }}>
                {cows.map(c => (
                  <option key={c.id} value={c.id}>{c.tagNumber} — {c.breed?.replace(/_/g,' ')} ({c.currentMilkYieldLitres || 12} L/day)</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Cattle Body Weight (kg)</label>
                <input type="number" className="input font-mono-tabular" value={cowWeight}
                  onChange={e => setCowWeight(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Target Milk Yield (L/day)</label>
                <input type="number" step="0.5" className="input font-mono-tabular" value={targetYield}
                  onChange={e => setTargetYield(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Milk Fat %</label>
                <input type="number" step="0.1" className="input font-mono-tabular" value={fatPct}
                  onChange={e => setFatPct(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Co-op Milk Price (₹/Liter)</label>
                <input type="number" step="0.5" className="input font-mono-tabular" value={milkPrice}
                  onChange={e => setMilkPrice(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-husk-tan)', marginBottom: 8 }}>LOCAL FEED MARKET PRICES (₹/kg)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11 }}>Green Fodder</label>
                  <input type="number" step="0.1" className="input font-mono-tabular" value={greenFeedPrice}
                    onChange={e => setGreenFeedPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 11 }}>Dry Straw</label>
                  <input type="number" step="0.1" className="input font-mono-tabular" value={dryFeedPrice}
                    onChange={e => setDryFeedPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 11 }}>Concentrate</label>
                  <input type="number" step="0.5" className="input font-mono-tabular" value={concFeedPrice}
                    onChange={e => setConcFeedPrice(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Net Profit & Revenue Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(47,75,60,0.3)', border: '1.5px solid var(--color-marigold)' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-marigold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Daily Financial Forecast
            </div>

            <div style={{ padding: 18, background: 'rgba(28,43,51,0.8)', borderRadius: 14, border: '1px solid var(--color-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--color-husk-tan)' }}>Net Daily Profit Per Cow</div>
              <div className="font-mono-tabular" style={{ fontSize: 36, fontWeight: 800, color: netDailyProfit > 0 ? '#72b276' : 'var(--color-status-mismatch)', margin: '4px 0' }}>
                ₹{netDailyProfit} / day
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--color-dairy-white)', fontWeight: 600 }}>
                Estimated Monthly Profit: <span style={{ color: 'var(--color-marigold)' }}>₹{monthlyProfit.toLocaleString('en-IN')} / month</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Daily Milk Gross Revenue:</span>
                <span className="font-mono-tabular" style={{ fontWeight: 700, color: 'var(--color-dairy-white)' }}>₹{grossDailyRevenue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Total Daily Feed Cost:</span>
                <span className="font-mono-tabular" style={{ fontWeight: 700, color: 'var(--color-status-mismatch)' }}>- ₹{totalFeedCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--color-husk-tan)' }}>Feed Cost Ratio:</span>
                <span className="font-mono-tabular" style={{ fontWeight: 700, color: 'var(--color-marigold)' }}>
                  {((totalFeedCost / (grossDailyRevenue || 1)) * 100).toFixed(1)}% of Revenue
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 10, background: 'rgba(217,201,163,0.06)', marginTop: 16, fontSize: 12.5, color: 'var(--color-husk-tan)' }}>
            💡 <strong>Nutritional Tip:</strong> Feeding 1 kg concentrate per 2.5 Liters of milk maintains optimal body condition score without milk drop.
          </div>
        </div>
      </div>

      {/* Recommended Daily Feed Mix Breakup */}
      <div className="glass-card">
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calculator size={18} style={{ color: 'var(--color-marigold)' }} />
          Recommended Daily Ration Mix ({activeCow?.tagNumber || 'Selected Cattle'})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(78, 122, 81, 0.15)', border: '1px solid #72b276' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#72b276', textTransform: 'uppercase' }}>GREEN FODDER (BARSEEM/MAIZE)</div>
            <div className="font-mono-tabular" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-dairy-white)', margin: '6px 0' }}>
              {reqGreenFodder} kg <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-husk-tan)' }}>/ day</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Daily Cost: ₹{dailyGreenCost}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(232, 169, 62, 0.15)', border: '1px solid var(--color-marigold)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-marigold)', textTransform: 'uppercase' }}>DRY FODDER (WHEAT STRAW/BHUSA)</div>
            <div className="font-mono-tabular" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-dairy-white)', margin: '6px 0' }}>
              {reqDryFodder} kg <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-husk-tan)' }}>/ day</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Daily Cost: ₹{dailyDryCost}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(90, 163, 199, 0.15)', border: '1px solid var(--color-sky)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-sky)', textTransform: 'uppercase' }}>PASHU AAHAR CONCENTRATE</div>
            <div className="font-mono-tabular" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-dairy-white)', margin: '6px 0' }}>
              {reqConcentrate} kg <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-husk-tan)' }}>/ day</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-husk-tan)' }}>Daily Cost: ₹{dailyConcCost}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
