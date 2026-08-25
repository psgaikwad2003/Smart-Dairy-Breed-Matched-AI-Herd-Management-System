// ============================================================================
// Smart Dairy — Dynamic Reactive Data Engine & Local Persistence Store
// ============================================================================

const STORAGE_KEY = 'sd_dynamic_store_v2';

const INITIAL_DATA = {
  cows: [
    {
      id: 1,
      tagNumber: 'TN-GJ-001',
      breed: 'GIR',
      status: 'ACTIVE',
      lactationCount: 2,
      currentMilkYieldLitres: 16.5,
      dateOfBirth: '2021-03-15',
      farmerId: 1,
      healthStatus: 'HEALTHY',
      lastInseminationDate: '2026-06-10',
      expectedCalvingDate: '2027-03-18',
    },
    {
      id: 2,
      tagNumber: 'TN-GJ-002',
      breed: 'SAHIWAL',
      status: 'ACTIVE',
      lactationCount: 3,
      currentMilkYieldLitres: 18.0,
      dateOfBirth: '2020-08-22',
      farmerId: 1,
      healthStatus: 'HEALTHY',
      lastInseminationDate: '2026-07-02',
      expectedCalvingDate: '2027-04-10',
    },
    {
      id: 3,
      tagNumber: 'TN-GJ-003',
      breed: 'MURRAH',
      status: 'ACTIVE',
      lactationCount: 2,
      currentMilkYieldLitres: 21.0,
      dateOfBirth: '2021-11-05',
      farmerId: 2,
      healthStatus: 'HEALTHY',
      lastInseminationDate: '2026-05-18',
      expectedCalvingDate: '2027-02-22',
    },
    {
      id: 4,
      tagNumber: 'TN-GJ-004',
      breed: 'HF_CROSSBRED',
      status: 'ACTIVE',
      lactationCount: 4,
      currentMilkYieldLitres: 28.5,
      dateOfBirth: '2019-05-10',
      farmerId: 2,
      healthStatus: 'HEALTHY',
      lastInseminationDate: '2026-08-01',
      expectedCalvingDate: '2027-05-09',
    },
    {
      id: 5,
      tagNumber: 'TN-GJ-005',
      breed: 'JERSEY_CROSSBRED',
      status: 'DRY',
      lactationCount: 3,
      currentMilkYieldLitres: 0.0,
      dateOfBirth: '2020-01-30',
      farmerId: 3,
      healthStatus: 'UNDER_OBSERVATION',
      lastInseminationDate: '2026-01-15',
      expectedCalvingDate: '2026-10-24',
    },
    {
      id: 6,
      tagNumber: 'TN-GJ-006',
      breed: 'RED_SINDHI',
      status: 'ACTIVE',
      lactationCount: 1,
      currentMilkYieldLitres: 14.0,
      dateOfBirth: '2022-04-12',
      farmerId: 3,
      healthStatus: 'HEALTHY',
      lastInseminationDate: null,
      expectedCalvingDate: null,
    },
    {
      id: 7,
      tagNumber: 'TN-GJ-007',
      breed: 'JAFFARABADI',
      status: 'ACTIVE',
      lactationCount: 2,
      currentMilkYieldLitres: 22.0,
      dateOfBirth: '2021-07-19',
      farmerId: 4,
      healthStatus: 'HEALTHY',
      lastInseminationDate: '2026-06-25',
      expectedCalvingDate: '2027-03-31',
    },
  ],

  bulls: [
    {
      id: 1,
      name: 'Gir Certified A2A2 Emperor',
      breed: 'GIR',
      ptaMilkKg: 480,
      fatPercentage: 4.8,
      a2a2Certified: true,
      stationGrade: 'A',
      stationName: 'NDDB Central Bull Station Anand',
      netMeritDollar: 650,
      inbreedingRiskPct: 2.1,
    },
    {
      id: 2,
      name: 'Murrah Black Gold Royal',
      breed: 'MURRAH',
      ptaMilkKg: 520,
      fatPercentage: 8.2,
      a2a2Certified: true,
      stationGrade: 'A',
      stationName: 'Rohtak High-Pedigree Semen Bank',
      netMeritDollar: 710,
      inbreedingRiskPct: 1.8,
    },
    {
      id: 3,
      name: 'Sahiwal Elite Champion',
      breed: 'SAHIWAL',
      ptaMilkKg: 410,
      fatPercentage: 5.0,
      a2a2Certified: true,
      stationGrade: 'A',
      stationName: 'Karnal ICAR National Station',
      netMeritDollar: 590,
      inbreedingRiskPct: 2.4,
    },
    {
      id: 4,
      name: 'HF Pro-Volume 90% Female Sexed',
      breed: 'HF_CROSSBRED',
      ptaMilkKg: 890,
      fatPercentage: 3.8,
      a2a2Certified: false,
      stationGrade: 'A',
      stationName: 'SAB Anand High-Tech Semen Lab',
      netMeritDollar: 840,
      inbreedingRiskPct: 3.5,
    },
    {
      id: 5,
      name: 'Jersey Fat-Max Pro',
      breed: 'JERSEY_CROSSBRED',
      ptaMilkKg: 620,
      fatPercentage: 5.4,
      a2a2Certified: true,
      stationGrade: 'B',
      stationName: 'Banas Dairy Artificial Insemination Center',
      netMeritDollar: 680,
      inbreedingRiskPct: 2.9,
    },
  ],

  straws: [
    {
      id: 1,
      batchNo: 'NDDB-GIR-2026-01',
      breed: 'GIR',
      stockQty: 24,
      stationGrade: 'A',
      semenStationName: 'NDDB Central Bull Station Anand',
      productionDate: '2026-01-10',
      expiryDate: '2029-01-10',
      bullId: 1,
    },
    {
      id: 2,
      batchNo: 'MURRAH-BG-2026-05',
      breed: 'MURRAH',
      stockQty: 8, // Low stock for demo
      stationGrade: 'A',
      semenStationName: 'Rohtak High-Pedigree Semen Bank',
      productionDate: '2026-02-14',
      expiryDate: '2029-02-14',
      bullId: 2,
    },
    {
      id: 3,
      batchNo: 'SAHIWAL-EL-2026-02',
      breed: 'SAHIWAL',
      stockQty: 18,
      stationGrade: 'A',
      semenStationName: 'Karnal ICAR National Station',
      productionDate: '2026-03-01',
      expiryDate: '2029-03-01',
      bullId: 3,
    },
    {
      id: 4,
      batchNo: 'HF-SEXED-2026-90',
      breed: 'HF_CROSSBRED',
      stockQty: 4, // Low stock alert
      stationGrade: 'A',
      semenStationName: 'SAB Anand High-Tech Semen Lab',
      productionDate: '2026-04-18',
      expiryDate: '2029-04-18',
      bullId: 4,
    },
    {
      id: 5,
      batchNo: 'JERSEY-FM-2026-08',
      breed: 'JERSEY_CROSSBRED',
      stockQty: 30,
      stationGrade: 'B',
      semenStationName: 'Banas Dairy Artificial Insemination Center',
      productionDate: '2026-05-11',
      expiryDate: '2029-05-11',
      bullId: 5,
    },
  ],

  breedingRecords: [
    {
      id: 1,
      cowId: 1,
      cowTag: 'TN-GJ-001',
      semenStrawId: 1,
      sireName: 'Gir Certified A2A2 Emperor',
      inseminationDate: '2026-06-10',
      expectedCalvingDate: '2027-03-18',
      outcome: 'CONFIRMED_PREGNANT',
      compatibilityStatus: 'MATCH',
      technicianId: 1,
    },
    {
      id: 2,
      cowId: 2,
      cowTag: 'TN-GJ-002',
      semenStrawId: 3,
      sireName: 'Sahiwal Elite Champion',
      inseminationDate: '2026-07-02',
      expectedCalvingDate: '2027-04-10',
      outcome: 'CONFIRMED_PREGNANT',
      compatibilityStatus: 'MATCH',
      technicianId: 1,
    },
    {
      id: 3,
      cowId: 3,
      cowTag: 'TN-GJ-003',
      semenStrawId: 2,
      sireName: 'Murrah Black Gold Royal',
      inseminationDate: '2026-05-18',
      expectedCalvingDate: '2027-02-22',
      outcome: 'CONFIRMED_PREGNANT',
      compatibilityStatus: 'MATCH',
      technicianId: 2,
    },
    {
      id: 4,
      cowId: 5,
      cowTag: 'TN-GJ-005',
      semenStrawId: 5,
      sireName: 'Jersey Fat-Max Pro',
      inseminationDate: '2026-01-15',
      expectedCalvingDate: '2026-10-24',
      outcome: 'DRY_GESTATION',
      compatibilityStatus: 'MATCH',
      technicianId: 3,
    },
  ],

  milkLogs: [
    { id: 101, cowId: 1, date: '2026-08-25', session: 'MORNING', quantityLitres: 9.0, fatPercentage: 4.8, snfPercentage: 8.9, coopName: 'Amul (Anand)', earnings: 441.0 },
    { id: 102, cowId: 1, date: '2026-08-25', session: 'EVENING', quantityLitres: 7.5, fatPercentage: 4.7, snfPercentage: 8.8, coopName: 'Amul (Anand)', earnings: 360.0 },
    { id: 103, cowId: 2, date: '2026-08-25', session: 'MORNING', quantityLitres: 9.5, fatPercentage: 4.9, snfPercentage: 9.0, coopName: 'Amul (Anand)', earnings: 468.0 },
    { id: 104, cowId: 2, date: '2026-08-25', session: 'EVENING', quantityLitres: 8.5, fatPercentage: 4.8, snfPercentage: 8.9, coopName: 'Amul (Anand)', earnings: 416.5 },
    { id: 105, cowId: 3, date: '2026-08-25', session: 'MORNING', quantityLitres: 11.0, fatPercentage: 7.8, snfPercentage: 9.4, coopName: 'Amul (Anand)', earnings: 627.0 },
    { id: 106, cowId: 4, date: '2026-08-25', session: 'MORNING', quantityLitres: 15.0, fatPercentage: 3.8, snfPercentage: 8.5, coopName: 'Amul (Anand)', earnings: 690.0 },
  ],

  farmers: [
    { id: 1, name: 'Ramesh Patel', phone: '+91 98250 11223', village: 'Anand Central', district: 'Anand', state: 'Gujarat', cattleCount: 2, dailyYield: 34.5 },
    { id: 2, name: 'Suresh Parmar', phone: '+91 98791 44556', village: 'Bhadran', district: 'Anand', state: 'Gujarat', cattleCount: 2, dailyYield: 49.5 },
    { id: 3, name: 'Jitendra Chaudhari', phone: '+91 97243 88990', village: 'Palanpur', district: 'Banas Kantha', state: 'Gujarat', cattleCount: 2, dailyYield: 14.0 },
    { id: 4, name: 'Mahesh Rabari', phone: '+91 99092 33445', village: 'Mehsana Rural', district: 'Mehsana', state: 'Gujarat', cattleCount: 1, dailyYield: 22.0 },
  ],

  notifications: [
    { id: 1, type: 'LOW_STOCK', message: 'CRITICAL ALERT: Murrah Black Gold Royal batch #MURRAH-BG-2026-05 has only 8 straws remaining!', readStatus: false, createdAt: '2026-08-25T08:30:00Z' },
    { id: 2, type: 'LOW_STOCK', message: 'WARNING: HF Pro-Volume Sexed batch #HF-SEXED-2026-90 has only 4 straws remaining!', readStatus: false, createdAt: '2026-08-25T09:15:00Z' },
    { id: 3, type: 'CALVING_REMINDER', message: 'Upcoming Calving: Cattle TN-GJ-005 expected calving date approaching on 2026-10-24.', readStatus: false, createdAt: '2026-08-24T14:20:00Z' },
    { id: 4, type: 'BREEDING_CONFIRMED', message: 'Insemination Procedure Verified: Cattle TN-GJ-001 crossed with Certified A2A2 Gir Sire.', readStatus: true, createdAt: '2026-08-23T11:00:00Z' },
  ],

  healthLogs: [
    { id: 1, cowTag: 'TN-GJ-001', vaccineName: 'FMD (Foot & Mouth Disease)', dueDate: '2026-09-05', status: 'DUE', type: 'VACCINE' },
    { id: 2, cowTag: 'TN-GJ-002', vaccineName: 'HS (Hemorrhagic Septicemia)', dueDate: '2026-09-12', status: 'DUE', type: 'VACCINE' },
    { id: 3, cowTag: 'TN-GJ-003', vaccineName: 'Deworming (Albendazole 3g)', dueDate: '2026-08-20', status: 'DONE', type: 'DEWORMING' },
    { id: 4, cowTag: 'TN-GJ-004', vaccineName: 'Brucellosis S19 Dose', dueDate: '2026-08-15', status: 'DONE', type: 'VACCINE' },
  ]
};

// Internal State & Subscriptions
let store = null;
const listeners = new Set();

function loadStore() {
  if (store) return store;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      store = JSON.parse(raw);
    } else {
      store = JSON.parse(JSON.stringify(INITIAL_DATA));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch {
    store = JSON.parse(JSON.stringify(INITIAL_DATA));
  }
  return store;
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Failed to save dynamicStore to localStorage:', err);
  }
  listeners.forEach(cb => cb(store));
}

export const dynamicStore = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  resetToDefault() {
    store = JSON.parse(JSON.stringify(INITIAL_DATA));
    saveStore();
    return store;
  },

  // ---- Summary KPI ----
  getSummary(farmerId) {
    const s = loadStore();
    const activeCows = s.cows.filter(c => !farmerId || String(c.farmerId) === String(farmerId));
    const pendingBreedings = s.breedingRecords.filter(b => b.outcome === 'PENDING_CHECK' || b.outcome === 'CONFIRMED_PREGNANT').length;
    const confirmedPregnancies = s.breedingRecords.filter(b => b.outcome === 'CONFIRMED_PREGNANT').length;
    const lowStockAlerts = s.straws.filter(st => st.stockQty <= 10).length;

    return {
      activeCows: activeCows.length,
      pendingBreedings,
      confirmedPregnancies,
      lowStockAlerts,
      upcomingCalvings: confirmedPregnancies,
      totalDailyMilkYieldLitres: activeCows.reduce((sum, c) => sum + (Number(c.currentMilkYieldLitres) || 0), 0),
    };
  },

  // ---- Cows CRUD ----
  getCows(farmerId) {
    const s = loadStore();
    if (farmerId) return s.cows.filter(c => String(c.farmerId) === String(farmerId));
    return s.cows;
  },

  getCowById(id) {
    const s = loadStore();
    return s.cows.find(c => String(c.id) === String(id)) || null;
  },

  addCow(cowData) {
    const s = loadStore();
    const newCow = {
      id: Date.now(),
      tagNumber: cowData.tagNumber || `TN-GJ-${Math.floor(100 + Math.random() * 900)}`,
      breed: cowData.breed || 'GIR',
      status: cowData.status || 'ACTIVE',
      lactationCount: Number(cowData.lactationCount) || 1,
      currentMilkYieldLitres: Number(cowData.currentMilkYieldLitres) || 12.0,
      dateOfBirth: cowData.dateOfBirth || new Date().toISOString().split('T')[0],
      farmerId: Number(cowData.farmerId) || 1,
      healthStatus: 'HEALTHY',
      lastInseminationDate: null,
      expectedCalvingDate: null,
    };
    s.cows.unshift(newCow);

    // Auto-generate notification
    s.notifications.unshift({
      id: Date.now() + 1,
      type: 'GENERAL',
      message: `New cattle ear-tag ${newCow.tagNumber} (${newCow.breed.replace(/_/g, ' ')}) registered successfully.`,
      readStatus: false,
      createdAt: new Date().toISOString(),
    });

    saveStore();
    return newCow;
  },

  updateCowStatus(id, newStatus) {
    const s = loadStore();
    const cow = s.cows.find(c => String(c.id) === String(id));
    if (cow) {
      cow.status = newStatus;
      saveStore();
    }
    return cow;
  },

  deleteCow(id) {
    const s = loadStore();
    s.cows = s.cows.filter(c => String(c.id) !== String(id));
    saveStore();
  },

  // ---- Bulls & Recommendations ----
  getBulls() {
    return loadStore().bulls;
  },

  getBullById(id) {
    return loadStore().bulls.find(b => String(b.id) === String(id)) || null;
  },

  getRecommendations(cowId, a2a2Only = false) {
    const s = loadStore();
    const cow = s.cows.find(c => String(c.id) === String(cowId));
    const cowBreed = cow?.breed || 'GIR';

    let availableStraws = s.straws.filter(st => st.stockQty > 0);

    return availableStraws.map((straw, idx) => {
      const bull = s.bulls.find(b => String(b.id) === String(straw.bullId)) || {
        name: `${straw.breed.replace(/_/g, ' ')} Pedigree Bull`,
        ptaMilkKg: 450,
        a2a2Certified: true,
        netMeritDollar: 600,
      };

      const isSameBreed = straw.breed === cowBreed || (cowBreed.includes('CROSSBRED') && straw.breed.includes('CROSSBRED'));
      const rank = idx === 0 ? '#1 Recommended' : idx === 1 ? '#2 Best Match' : `#${idx + 1} Alternative`;

      return {
        semenStrawId: straw.id,
        bullName: bull.name,
        bullBreed: straw.breed,
        batchNo: straw.batchNo,
        stockQty: straw.stockQty,
        ptaMilkKg: bull.ptaMilkKg || 450,
        a2a2Status: bull.a2a2Certified,
        recommendationRank: rank,
        stationGrade: straw.stationGrade,
        netMeritIndex: bull.netMeritDollar || 620,
        expectedCalfExoticBloodPct: straw.breed.includes('HF') ? 62.5 : 25.0,
        estimatedInbreedingPct: 1.8,
        rationale: isSameBreed
          ? `High genetic compatibility score for ${cowBreed.replace(/_/g, ' ')} dam with +${bull.ptaMilkKg || 450}kg yield improvement.`
          : `Crossbreed combination boosting overall vigor and lactation capacity.`,
      };
    }).filter(r => !a2a2Only || r.a2a2Status);
  },

  // ---- Insemination & Breeding ----
  confirmBreeding(data) {
    const s = loadStore();
    const cow = s.cows.find(c => String(c.id) === String(data.cowId));
    const straw = s.straws.find(st => String(st.id) === String(data.semenStrawId));
    const bull = s.bulls.find(b => String(b.id) === String(straw?.bullId));

    if (straw && straw.stockQty > 0) {
      straw.stockQty -= 1;
    }

    const insDate = new Date(data.inseminationDate || Date.now());
    const calvingDate = new Date(insDate.getTime() + 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const record = {
      id: Date.now(),
      cowId: Number(data.cowId),
      cowTag: cow?.tagNumber || `TN-GJ-${data.cowId}`,
      semenStrawId: Number(data.semenStrawId),
      sireName: bull?.name || straw?.breed?.replace(/_/g, ' ') || 'Pedigree Sire',
      inseminationDate: insDate.toISOString().split('T')[0],
      expectedCalvingDate: calvingDate,
      outcome: 'CONFIRMED_PREGNANT',
      compatibilityStatus: data.compatibilityStatus || 'MATCH',
      overrideReason: data.overrideReason || null,
      technicianId: Number(data.technicianId) || 1,
    };

    s.breedingRecords.unshift(record);

    if (cow) {
      cow.lastInseminationDate = record.inseminationDate;
      cow.expectedCalvingDate = record.expectedCalvingDate;
    }

    // Trigger Notification
    s.notifications.unshift({
      id: Date.now() + 1,
      type: 'BREEDING_CONFIRMED',
      message: `Artificial Insemination recorded for cattle ${record.cowTag} with sire ${record.sireName}. Expected Calving: ${calvingDate}`,
      readStatus: false,
      createdAt: new Date().toISOString(),
    });

    saveStore();
    return record;
  },

  updateBreedingOutcome(id, outcome) {
    const s = loadStore();
    const rec = s.breedingRecords.find(r => String(r.id) === String(id));
    if (rec) {
      rec.outcome = outcome;
      saveStore();
    }
    return rec;
  },

  getCalvings(daysAhead = 30) {
    const s = loadStore();
    return s.breedingRecords
      .filter(r => r.outcome === 'CONFIRMED_PREGNANT')
      .map(r => ({
        id: r.id,
        cowId: r.cowId,
        cow: { tagNumber: r.cowTag },
        expectedCalvingDate: r.expectedCalvingDate,
        outcome: r.outcome,
      }));
  },

  // ---- Straw Inventory ----
  getStraws() {
    return loadStore().straws;
  },

  addStraw(data) {
    const s = loadStore();
    const newStraw = {
      id: Date.now(),
      batchNo: data.batchNo || `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      breed: data.breed || 'GIR',
      stockQty: Number(data.stockQty) || 20,
      stationGrade: data.stationGrade || 'A',
      semenStationName: data.semenStationName || 'Central Bull Station',
      productionDate: data.productionDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || '2029-01-01',
      bullId: Number(data.bullId) || 1,
    };

    s.straws.unshift(newStraw);
    saveStore();
    return newStraw;
  },

  restockStraw(id, qty) {
    const s = loadStore();
    const straw = s.straws.find(st => String(st.id) === String(id));
    if (straw) {
      straw.stockQty += Number(qty);
      saveStore();
    }
    return straw;
  },

  // ---- Milk Logs ----
  getMilkLogs(cowId) {
    const s = loadStore();
    if (cowId) return s.milkLogs.filter(l => String(l.cowId) === String(cowId));
    return s.milkLogs;
  },

  addMilkLog(data) {
    const s = loadStore();
    const cowId = Number(data.cow?.id || data.cowId);
    const cow = s.cows.find(c => String(c.id) === String(cowId));

    const qty = Number(data.quantityLitres) || 0.0;
    const newLog = {
      id: Date.now(),
      cowId,
      cowTag: cow?.tagNumber || `Cow #${cowId}`,
      date: data.date || new Date().toISOString().split('T')[0],
      session: data.session || 'MORNING',
      quantityLitres: qty,
      fatPercentage: Number(data.fatPercentage) || 4.5,
      snfPercentage: 8.8,
      coopName: data.coopName || 'Amul (Anand)',
      earnings: Math.round((46.0 + 0.8 * Math.max(0, (Number(data.fatPercentage) || 4.5) - 4.0)) * qty),
    };

    s.milkLogs.unshift(newLog);

    if (cow) {
      cow.currentMilkYieldLitres = qty;
    }

    saveStore();
    return newLog;
  },

  getBreedComparison() {
    const s = loadStore();
    const map = {};
    s.cows.forEach(c => {
      if (!map[c.breed]) map[c.breed] = { total: 0, count: 0 };
      map[c.breed].total += Number(c.currentMilkYieldLitres || 12);
      map[c.breed].count += 1;
    });

    return Object.entries(map).map(([breed, { total, count }]) => [
      breed,
      Number((total / count).toFixed(2)),
    ]);
  },

  // ---- Farmers ----
  getFarmers() {
    return loadStore().farmers;
  },

  addFarmer(data) {
    const s = loadStore();
    const f = {
      id: Date.now(),
      name: data.name || 'New Farmer',
      phone: data.phone || '+91 98000 00000',
      village: data.village || 'Anand',
      district: data.district || 'Anand',
      state: data.state || 'Gujarat',
      cattleCount: 0,
      dailyYield: 0,
    };
    s.farmers.unshift(f);
    saveStore();
    return f;
  },

  // ---- Notifications ----
  getNotifications() {
    return loadStore().notifications;
  },

  markNotificationRead(id) {
    const s = loadStore();
    const notif = s.notifications.find(n => String(n.id) === String(id));
    if (notif) {
      notif.readStatus = true;
      saveStore();
    }
  },

  markAllNotificationsRead() {
    const s = loadStore();
    s.notifications.forEach(n => { n.readStatus = true; });
    saveStore();
  },

  // ---- Health & Vaccines ----
  getHealthLogs() {
    return loadStore().healthLogs;
  },

  markVaccinated(id) {
    const s = loadStore();
    const item = s.healthLogs.find(h => String(h.id) === String(id));
    if (item) {
      item.status = 'DONE';
      saveStore();
    }
    return item;
  },

  addHealthLog(data) {
    const s = loadStore();
    const item = {
      id: Date.now(),
      cowTag: data.cowTag || 'TN-GJ-001',
      vaccineName: data.vaccineName || 'Routine Inspection',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      status: 'DUE',
      type: data.type || 'VACCINE',
    };
    s.healthLogs.unshift(item);
    saveStore();
    return item;
  }
};
