-- =============================================
-- V3__add_sire_recommendation_fields.sql
-- Smart Dairy — Genetic Merit Sire Recommendation Schema & Data
-- =============================================

-- Add genetic merit fields to Bulls
ALTER TABLE bulls
ADD COLUMN IF NOT EXISTS pta_milk_kg DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pta_fat_pct DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pta_protein_pct DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_merit_index DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sire_fertility_index DECIMAL(5,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS daughter_fertility_index DECIMAL(5,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS inbreeding_coefficient_pct DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS a2a2_status BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS exotic_blood_pct DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS calving_ease_score INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS productive_life_years DECIMAL(4,2) DEFAULT 3.5;

-- Add lineage & genetic fields to Cows
ALTER TABLE cows
ADD COLUMN IF NOT EXISTS exotic_blood_pct DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS lineage_bull_ids VARCHAR(500),
ADD COLUMN IF NOT EXISTS last_yield_kg_per_day DECIMAL(6,2) DEFAULT 0;

-- Populate Genetic Merit Reference Values for Bulls
UPDATE bulls SET
  pta_milk_kg = 420.0, pta_fat_pct = 0.15, pta_protein_pct = 0.10, net_merit_index = 650.0,
  sire_fertility_index = 104.0, daughter_fertility_index = 102.0, inbreeding_coefficient_pct = 1.2,
  a2a2_status = TRUE, exotic_blood_pct = 100.0, calving_ease_score = 2, productive_life_years = 4.2
WHERE id = 1;

UPDATE bulls SET
  pta_milk_kg = 385.0, pta_fat_pct = 0.12, pta_protein_pct = 0.08, net_merit_index = 580.0,
  sire_fertility_index = 98.0, daughter_fertility_index = 99.0, inbreeding_coefficient_pct = 1.8,
  a2a2_status = FALSE, exotic_blood_pct = 100.0, calving_ease_score = 3, productive_life_years = 3.8
WHERE id = 2;

UPDATE bulls SET
  pta_milk_kg = 510.0, pta_fat_pct = 0.18, pta_protein_pct = 0.14, net_merit_index = 780.0,
  sire_fertility_index = 106.0, daughter_fertility_index = 105.0, inbreeding_coefficient_pct = 0.8,
  a2a2_status = TRUE, exotic_blood_pct = 100.0, calving_ease_score = 1, productive_life_years = 4.8
WHERE id = 3;

UPDATE bulls SET
  pta_milk_kg = 280.0, pta_fat_pct = 0.35, pta_protein_pct = 0.22, net_merit_index = 520.0,
  sire_fertility_index = 102.0, daughter_fertility_index = 104.0, inbreeding_coefficient_pct = 1.0,
  a2a2_status = TRUE, exotic_blood_pct = 100.0, calving_ease_score = 1, productive_life_years = 4.0
WHERE id = 4;

UPDATE bulls SET
  pta_milk_kg = 260.0, pta_fat_pct = 0.32, pta_protein_pct = 0.20, net_merit_index = 490.0,
  sire_fertility_index = 100.0, daughter_fertility_index = 101.0, inbreeding_coefficient_pct = 1.1,
  a2a2_status = TRUE, exotic_blood_pct = 100.0, calving_ease_score = 2, productive_life_years = 3.9
WHERE id = 5;

UPDATE bulls SET
  pta_milk_kg = 180.0, pta_fat_pct = 0.25, pta_protein_pct = 0.18, net_merit_index = 410.0,
  sire_fertility_index = 101.0, daughter_fertility_index = 103.0, inbreeding_coefficient_pct = 0.5,
  a2a2_status = TRUE, exotic_blood_pct = 0.0, calving_ease_score = 1, productive_life_years = 5.0
WHERE id = 6;

UPDATE bulls SET
  pta_milk_kg = 210.0, pta_fat_pct = 0.30, pta_protein_pct = 0.20, net_merit_index = 460.0,
  sire_fertility_index = 103.0, daughter_fertility_index = 102.0, inbreeding_coefficient_pct = 0.4,
  a2a2_status = TRUE, exotic_blood_pct = 0.0, calving_ease_score = 1, productive_life_years = 5.2
WHERE id = 8;

UPDATE bulls SET
  pta_milk_kg = 320.0, pta_fat_pct = 0.45, pta_protein_pct = 0.30, net_merit_index = 600.0,
  sire_fertility_index = 105.0, daughter_fertility_index = 104.0, inbreeding_coefficient_pct = 0.6,
  a2a2_status = TRUE, exotic_blood_pct = 0.0, calving_ease_score = 1, productive_life_years = 5.5
WHERE id = 13;

UPDATE bulls SET
  pta_milk_kg = 360.0, pta_fat_pct = 0.22, pta_protein_pct = 0.15, net_merit_index = 540.0,
  sire_fertility_index = 102.0, daughter_fertility_index = 101.0, inbreeding_coefficient_pct = 0.9,
  a2a2_status = TRUE, exotic_blood_pct = 50.0, calving_ease_score = 2, productive_life_years = 4.3
WHERE id = 17;

-- Populate Cow Genetic & Lineage Metadata
UPDATE cows SET exotic_blood_pct = 100.0, lineage_bull_ids = '2,5', last_yield_kg_per_day = 18.5 WHERE id = 1;
UPDATE cows SET exotic_blood_pct = 100.0, lineage_bull_ids = '1,3', last_yield_kg_per_day = 16.2 WHERE id = 2;
UPDATE cows SET exotic_blood_pct = 0.0, lineage_bull_ids = '9', last_yield_kg_per_day = 10.8 WHERE id = 3;
UPDATE cows SET exotic_blood_pct = 50.0, lineage_bull_ids = '1,8', last_yield_kg_per_day = 14.3 WHERE id = 4;
UPDATE cows SET exotic_blood_pct = 0.0, lineage_bull_ids = '7', last_yield_kg_per_day = 12.5 WHERE id = 5;
