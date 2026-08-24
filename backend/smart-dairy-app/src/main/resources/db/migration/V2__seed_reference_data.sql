-- =============================================
-- V2__seed_reference_data.sql
-- Smart Dairy — Realistic Indian Dairy Seed Data
-- =============================================
-- Breeds, bulls, semen straws modeled on real NDDB/state semen station conventions.
-- Batch ID format: <BREED_CODE>-<YEAR>-<SEQUENCE> (e.g., HF-2024-0142)

-- ============================================================
-- 1. SAMPLE FARMERS (across different Indian states)
-- ============================================================
INSERT INTO farmers (name, phone, village, district, state, latitude, longitude) VALUES
('Ramesh Kumar',       '9876543210', 'Khera Khurd',    'Karnal',       'Haryana',       29.6857, 76.9905),
('Suresh Patel',       '9876543211', 'Anand Nagar',    'Anand',        'Gujarat',       22.5645, 72.9289),
('Lakshmi Devi',       '9876543212', 'Sirsa Road',     'Hisar',        'Haryana',       29.1492, 75.7217),
('Mohan Singh',        '9876543213', 'Bhiwani Gate',   'Bhiwani',      'Haryana',       28.7975, 76.1397),
('Geeta Kumari',       '9876543214', 'Viramgam',       'Ahmedabad',    'Gujarat',       23.1204, 72.0370),
('Arjun Yadav',        '9876543215', 'Loni Dehat',     'Ghaziabad',    'Uttar Pradesh', 28.7508, 77.2789),
('Kavita Sharma',      '9876543216', 'Bassi Pathana',  'Fatehgarh Sahib','Punjab',      30.5877, 76.3960),
('Dinesh Jat',         '9876543217', 'Nokha',          'Bikaner',      'Rajasthan',     27.5591, 73.4710);

-- ============================================================
-- 2. USERS (password = bcrypt hash of 'password123')
-- ============================================================
INSERT INTO users (name, phone, password, role, farmer_id) VALUES
('Ramesh Kumar',       '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FARMER',         1),
('Suresh Patel',       '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FARMER',         2),
('Lakshmi Devi',       '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FARMER',         3),
('Dr. Vikram Singh',   '9876543220', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'VET',            NULL),
('Ravi Technician',    '9876543221', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'AI_TECHNICIAN',  NULL),
('Priya Technician',   '9876543222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'AI_TECHNICIAN',  NULL),
('Admin User',         '9876543230', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN',          NULL);

-- ============================================================
-- 3. BULLS — Realistic entries across breeds
--    Registration format: BREED_CODE/STATION_CODE/YEAR/SEQ
-- ============================================================
INSERT INTO bulls (name, breed, source_semen_station, breeding_value_json, registration_no) VALUES
-- Holstein Friesian bulls
('HF Sultan',       'HOLSTEIN_FRIESIAN', 'NDDB Sabarmati Ashram, Anand',
 '{"milk_yield_ebv": 4200, "fat_pct": 3.5, "protein_pct": 3.2, "sire_index": 285}',
 'HF/SAB/2022/001'),
('HF Emperor',      'HOLSTEIN_FRIESIAN', 'Frozen Semen Station, Salon (UP)',
 '{"milk_yield_ebv": 3850, "fat_pct": 3.4, "protein_pct": 3.1, "sire_index": 270}',
 'HF/SAL/2023/015'),
('HF Champion',     'HOLSTEIN_FRIESIAN', 'Central Frozen Semen Station, Hesserghatta',
 '{"milk_yield_ebv": 4500, "fat_pct": 3.6, "protein_pct": 3.3, "sire_index": 300}',
 'HF/HES/2023/008'),

-- Jersey bulls
('Jersey Star',     'JERSEY', 'KLDB, Mattupetty (Kerala)',
 '{"milk_yield_ebv": 3200, "fat_pct": 4.8, "protein_pct": 3.7, "sire_index": 260}',
 'JR/MAT/2022/003'),
('Jersey Pride',    'JERSEY', 'Frozen Semen Station, Dharwad (Karnataka)',
 '{"milk_yield_ebv": 3100, "fat_pct": 4.6, "protein_pct": 3.6, "sire_index": 250}',
 'JR/DHR/2023/011'),

-- Gir bulls
('Gir Mahesh',      'GIR', 'BAIF, Uruli Kanchan (Maharashtra)',
 '{"milk_yield_ebv": 2800, "fat_pct": 4.5, "protein_pct": 3.5, "sire_index": 220}',
 'GR/URK/2021/007'),
('Gir Nandi',       'GIR', 'Junagadh Agricultural University, Gujarat',
 '{"milk_yield_ebv": 2650, "fat_pct": 4.7, "protein_pct": 3.6, "sire_index": 215}',
 'GR/JAU/2022/012'),

-- Sahiwal bulls
('Sahiwal Raja',    'SAHIWAL', 'NDRI, Karnal (Haryana)',
 '{"milk_yield_ebv": 2500, "fat_pct": 5.0, "protein_pct": 3.8, "sire_index": 210}',
 'SW/NDR/2022/004'),
('Sahiwal Ratan',   'SAHIWAL', 'LUVAS, Hisar (Haryana)',
 '{"milk_yield_ebv": 2400, "fat_pct": 4.9, "protein_pct": 3.7, "sire_index": 200}',
 'SW/LUV/2023/009'),

-- Red Sindhi
('Sindhi Lal',      'RED_SINDHI', 'NDRI, Karnal (Haryana)',
 '{"milk_yield_ebv": 2200, "fat_pct": 4.8, "protein_pct": 3.5, "sire_index": 190}',
 'RS/NDR/2023/002'),

-- Tharparkar
('Thar Shakti',     'THARPARKAR', 'CSWRI, Avikanagar (Rajasthan)',
 '{"milk_yield_ebv": 2000, "fat_pct": 4.5, "protein_pct": 3.4, "sire_index": 175}',
 'TP/CSW/2022/006'),

-- Rathi
('Rathi Veera',     'RATHI', 'RAJUVAS, Bikaner (Rajasthan)',
 '{"milk_yield_ebv": 2100, "fat_pct": 4.3, "protein_pct": 3.3, "sire_index": 180}',
 'RT/RAJ/2023/005'),

-- Murrah buffalo bulls
('Murrah Bheem',    'MURRAH', 'CIRB, Hisar (Haryana)',
 '{"milk_yield_ebv": 3500, "fat_pct": 7.0, "protein_pct": 4.2, "sire_index": 310}',
 'MR/CIR/2022/001'),
('Murrah Balram',   'MURRAH', 'Frozen Semen Station, Rohtak (Haryana)',
 '{"milk_yield_ebv": 3400, "fat_pct": 7.2, "protein_pct": 4.3, "sire_index": 305}',
 'MR/ROH/2023/007'),

-- Jaffarabadi buffalo
('Jaffara Titan',   'JAFFARABADI', 'NDDB, Anand (Gujarat)',
 '{"milk_yield_ebv": 3000, "fat_pct": 8.0, "protein_pct": 4.5, "sire_index": 280}',
 'JF/AND/2023/003'),

-- Mehsana buffalo
('Mehsana Tej',     'MEHSANA', 'NDDB Sabarmati, Anand (Gujarat)',
 '{"milk_yield_ebv": 2900, "fat_pct": 7.5, "protein_pct": 4.1, "sire_index": 270}',
 'MS/SAB/2022/010'),

-- HF Crossbred
('HFX Gaurav',      'HF_CROSSBRED', 'NDDB Sabarmati Ashram, Anand',
 '{"milk_yield_ebv": 3600, "fat_pct": 3.8, "protein_pct": 3.3, "sire_index": 255}',
 'HFX/SAB/2023/004'),

-- Jersey Crossbred
('JRX Kisan',       'JERSEY_CROSSBRED', 'KLDB, Mattupetty (Kerala)',
 '{"milk_yield_ebv": 2800, "fat_pct": 4.2, "protein_pct": 3.5, "sire_index": 230}',
 'JRX/MAT/2023/006');

-- ============================================================
-- 4. SEMEN STRAWS — Batch format: BREED_CODE-YEAR-SEQUENCE
--    Station grades: A = top-tier NDDB/state stations, B = regional
-- ============================================================
INSERT INTO semen_straws (bull_id, batch_no, breed, production_date, expiry_date, stock_qty, semen_station_name, station_grade) VALUES
-- HF straws
(1,  'HF-2024-0142',  'HOLSTEIN_FRIESIAN', '2024-01-15', '2026-01-15', 250, 'NDDB Sabarmati Ashram, Anand',            'A'),
(1,  'HF-2024-0278',  'HOLSTEIN_FRIESIAN', '2024-03-20', '2026-03-20', 180, 'NDDB Sabarmati Ashram, Anand',            'A'),
(2,  'HF-2024-0356',  'HOLSTEIN_FRIESIAN', '2024-05-10', '2026-05-10', 120, 'Frozen Semen Station, Salon (UP)',        'B'),
(3,  'HF-2024-0489',  'HOLSTEIN_FRIESIAN', '2024-07-01', '2026-07-01', 300, 'Central Frozen Semen Station, Hesserghatta','A'),

-- Jersey straws
(4,  'JR-2024-0087',  'JERSEY',            '2024-02-10', '2026-02-10', 200, 'KLDB, Mattupetty (Kerala)',               'A'),
(5,  'JR-2024-0195',  'JERSEY',            '2024-06-15', '2026-06-15', 150, 'Frozen Semen Station, Dharwad',           'B'),

-- Gir straws
(6,  'GR-2024-0054',  'GIR',               '2024-01-20', '2026-01-20', 100, 'BAIF, Uruli Kanchan',                    'A'),
(7,  'GR-2024-0112',  'GIR',               '2024-04-05', '2026-04-05', 80,  'Junagadh Agricultural University',       'B'),

-- Sahiwal straws
(8,  'SW-2024-0033',  'SAHIWAL',           '2024-02-28', '2026-02-28', 90,  'NDRI, Karnal',                           'A'),
(9,  'SW-2024-0067',  'SAHIWAL',           '2024-08-12', '2026-08-12', 60,  'LUVAS, Hisar',                           'A'),

-- Red Sindhi
(10, 'RS-2024-0021',  'RED_SINDHI',        '2024-03-15', '2026-03-15', 45,  'NDRI, Karnal',                           'A'),

-- Tharparkar
(11, 'TP-2024-0018',  'THARPARKAR',        '2024-04-20', '2026-04-20', 35,  'CSWRI, Avikanagar',                      'B'),

-- Rathi
(12, 'RT-2024-0025',  'RATHI',             '2024-05-25', '2026-05-25', 40,  'RAJUVAS, Bikaner',                       'B'),

-- Murrah straws
(13, 'MR-2024-0098',  'MURRAH',            '2024-01-10', '2026-01-10', 220, 'CIRB, Hisar',                            'A'),
(14, 'MR-2024-0167',  'MURRAH',            '2024-06-20', '2026-06-20', 175, 'Frozen Semen Station, Rohtak',            'A'),

-- Jaffarabadi
(15, 'JF-2024-0039',  'JAFFARABADI',       '2024-03-01', '2026-03-01', 50,  'NDDB, Anand',                            'A'),

-- Mehsana
(16, 'MS-2024-0045',  'MEHSANA',           '2024-04-10', '2026-04-10', 65,  'NDDB Sabarmati, Anand',                  'A'),

-- HF Crossbred
(17, 'HFX-2024-0076', 'HF_CROSSBRED',      '2024-02-15', '2026-02-15', 130, 'NDDB Sabarmati Ashram, Anand',           'A'),

-- Jersey Crossbred
(18, 'JRX-2024-0058', 'JERSEY_CROSSBRED',   '2024-05-01', '2026-05-01', 95,  'KLDB, Mattupetty',                      'A'),

-- Low-stock straw (for testing low-stock alerts — threshold is typically 10)
(1,  'HF-2023-0899',  'HOLSTEIN_FRIESIAN', '2023-11-01', '2025-11-01', 5,   'NDDB Sabarmati Ashram, Anand',           'A');

-- ============================================================
-- 5. SAMPLE COWS
-- ============================================================
INSERT INTO cows (farmer_id, tag_number, breed, dob, lactation_count, current_milk_yield_litres, status) VALUES
-- Ramesh Kumar's herd (Karnal, Haryana)
(1, 'KRN-HF-001',   'HOLSTEIN_FRIESIAN', '2019-06-15', 3, 18.50, 'ACTIVE'),
(1, 'KRN-HF-002',   'HOLSTEIN_FRIESIAN', '2020-03-22', 2, 16.20, 'ACTIVE'),
(1, 'KRN-SW-001',   'SAHIWAL',           '2018-11-10', 4, 10.80, 'ACTIVE'),
(1, 'KRN-HFX-001',  'HF_CROSSBRED',      '2021-01-05', 1, 14.30, 'ACTIVE'),

-- Suresh Patel's herd (Anand, Gujarat)
(2, 'AND-GR-001',   'GIR',               '2019-08-20', 3, 12.50, 'ACTIVE'),
(2, 'AND-GR-002',   'GIR',               '2020-12-01', 2, 11.00, 'ACTIVE'),
(2, 'AND-MR-001',   'MURRAH',            '2018-05-15', 5, 14.00, 'ACTIVE'),

-- Lakshmi Devi's herd (Hisar, Haryana)
(3, 'HSR-MR-001',   'MURRAH',            '2019-03-10', 3, 16.00, 'ACTIVE'),
(3, 'HSR-MR-002',   'MURRAH',            '2020-07-25', 2, 13.50, 'ACTIVE'),
(3, 'HSR-SW-001',   'SAHIWAL',           '2017-09-12', 5, 9.20,  'DRY'),

-- Mohan Singh's herd
(4, 'BHW-JR-001',   'JERSEY',            '2020-02-14', 2, 13.00, 'ACTIVE'),
(4, 'BHW-JRX-001',  'JERSEY_CROSSBRED',  '2021-06-30', 1, 11.50, 'ACTIVE'),

-- Geeta Kumari's herd
(5, 'AHM-GR-001',   'GIR',               '2019-04-18', 3, 13.20, 'ACTIVE'),
(5, 'AHM-MS-001',   'MEHSANA',           '2018-10-05', 4, 12.00, 'ACTIVE');

-- ============================================================
-- 6. SAMPLE MILK YIELD LOGS (last 7 days for some cows)
-- ============================================================
INSERT INTO milk_yield_logs (cow_id, date, quantity_litres, session) VALUES
-- Cow 1 (KRN-HF-001, HF, ~18.5 L/day)
(1, CURRENT_DATE - 7, 9.50, 'MORNING'),
(1, CURRENT_DATE - 7, 9.00, 'EVENING'),
(1, CURRENT_DATE - 6, 9.80, 'MORNING'),
(1, CURRENT_DATE - 6, 9.20, 'EVENING'),
(1, CURRENT_DATE - 5, 9.30, 'MORNING'),
(1, CURRENT_DATE - 5, 8.90, 'EVENING'),
(1, CURRENT_DATE - 4, 9.60, 'MORNING'),
(1, CURRENT_DATE - 4, 9.10, 'EVENING'),
(1, CURRENT_DATE - 3, 9.40, 'MORNING'),
(1, CURRENT_DATE - 3, 9.00, 'EVENING'),
(1, CURRENT_DATE - 2, 9.70, 'MORNING'),
(1, CURRENT_DATE - 2, 9.30, 'EVENING'),
(1, CURRENT_DATE - 1, 9.50, 'MORNING'),
(1, CURRENT_DATE - 1, 9.00, 'EVENING'),

-- Cow 5 (AND-GR-001, Gir, ~12.5 L/day)
(5, CURRENT_DATE - 7, 6.50, 'MORNING'),
(5, CURRENT_DATE - 7, 6.00, 'EVENING'),
(5, CURRENT_DATE - 6, 6.30, 'MORNING'),
(5, CURRENT_DATE - 6, 6.20, 'EVENING'),
(5, CURRENT_DATE - 5, 6.40, 'MORNING'),
(5, CURRENT_DATE - 5, 6.10, 'EVENING'),

-- Cow 8 (HSR-MR-001, Murrah buffalo, ~16 L/day)
(8, CURRENT_DATE - 5, 8.20, 'MORNING'),
(8, CURRENT_DATE - 5, 7.80, 'EVENING'),
(8, CURRENT_DATE - 4, 8.50, 'MORNING'),
(8, CURRENT_DATE - 4, 7.50, 'EVENING'),
(8, CURRENT_DATE - 3, 8.00, 'MORNING'),
(8, CURRENT_DATE - 3, 8.00, 'EVENING');

-- ============================================================
-- 7. SAMPLE BREEDING RECORDS
-- ============================================================
INSERT INTO breeding_records (cow_id, semen_straw_id, technician_id, insemination_date, compatibility_status, override_reason, outcome, expected_calving_date) VALUES
-- MATCH: HF cow inseminated with HF semen (correct breed match)
(1, 1, 5, CURRENT_DATE - 60, 'MATCH', NULL, 'PENDING', CURRENT_DATE + 222),
-- MATCH: Gir cow inseminated with Gir semen
(5, 7, 5, CURRENT_DATE - 90, 'MATCH', NULL, 'CONFIRMED_PREGNANT', CURRENT_DATE + 192),
-- OVERRIDE: Sahiwal cow inseminated with HF semen (crossbreeding for yield improvement)
(3, 2, 6, CURRENT_DATE - 120, 'OVERRIDE', 'Farmer requested HF crossbreeding to improve milk yield in next generation', 'CONFIRMED_PREGNANT', CURRENT_DATE + 162),
-- MATCH: Murrah buffalo with Murrah semen
(8, 14, 6, CURRENT_DATE - 45, 'MATCH', NULL, 'PENDING', CURRENT_DATE + 265);
