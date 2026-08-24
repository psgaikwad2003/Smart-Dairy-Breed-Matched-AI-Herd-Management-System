-- =============================================
-- V1__init_schema.sql
-- Smart Dairy — Initial Database Schema
-- =============================================

-- ---- Farmers ----
CREATE TABLE farmers (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    phone           VARCHAR(15)     NOT NULL UNIQUE,
    village         VARCHAR(100),
    district        VARCHAR(100),
    state           VARCHAR(50),
    latitude        DECIMAL(10,7),
    longitude       DECIMAL(10,7),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_farmers_phone ON farmers(phone);
CREATE INDEX idx_farmers_district ON farmers(district);

-- ---- Users (Auth) ----
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    phone           VARCHAR(15)     NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL CHECK (role IN ('FARMER','AI_TECHNICIAN','VET','ADMIN')),
    farmer_id       BIGINT          REFERENCES farmers(id) ON DELETE SET NULL,
    enabled         BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- ---- Bulls ----
CREATE TABLE bulls (
    id                  BIGSERIAL       PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL,
    breed               VARCHAR(30)     NOT NULL,
    source_semen_station VARCHAR(200),
    breeding_value_json JSONB,
    registration_no     VARCHAR(50)     UNIQUE,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bulls_breed ON bulls(breed);

-- ---- Cows ----
CREATE TABLE cows (
    id                          BIGSERIAL       PRIMARY KEY,
    farmer_id                   BIGINT          NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    tag_number                  VARCHAR(50)     NOT NULL UNIQUE,
    breed                       VARCHAR(30)     NOT NULL,
    dob                         DATE,
    lactation_count             INTEGER         DEFAULT 0,
    current_milk_yield_litres   DECIMAL(6,2)    DEFAULT 0.00,
    status                      VARCHAR(10)     NOT NULL DEFAULT 'ACTIVE'
                                                CHECK (status IN ('ACTIVE','DRY','SOLD','DECEASED')),
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cows_farmer ON cows(farmer_id);
CREATE INDEX idx_cows_breed ON cows(breed);
CREATE INDEX idx_cows_status ON cows(status);

-- ---- Semen Straws ----
CREATE TABLE semen_straws (
    id                  BIGSERIAL       PRIMARY KEY,
    bull_id             BIGINT          NOT NULL REFERENCES bulls(id) ON DELETE CASCADE,
    batch_no            VARCHAR(50)     NOT NULL,
    breed               VARCHAR(30)     NOT NULL,
    production_date     DATE,
    expiry_date         DATE,
    stock_qty           INTEGER         NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    semen_station_name  VARCHAR(200),
    station_grade       VARCHAR(1)      CHECK (station_grade IN ('A','B','C')),
    version             BIGINT          NOT NULL DEFAULT 0,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_semen_breed ON semen_straws(breed);
CREATE INDEX idx_semen_bull ON semen_straws(bull_id);
CREATE INDEX idx_semen_stock ON semen_straws(stock_qty);

-- ---- Breeding Records ----
CREATE TABLE breeding_records (
    id                      BIGSERIAL       PRIMARY KEY,
    cow_id                  BIGINT          NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    semen_straw_id          BIGINT          NOT NULL REFERENCES semen_straws(id),
    technician_id           BIGINT          NOT NULL REFERENCES users(id),
    insemination_date       DATE            NOT NULL,
    compatibility_status    VARCHAR(10)     NOT NULL CHECK (compatibility_status IN ('MATCH','OVERRIDE','BLOCKED')),
    override_reason         VARCHAR(500),
    outcome                 VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                                            CHECK (outcome IN ('PENDING','CONFIRMED_PREGNANT','FAILED')),
    calf_id                 BIGINT,
    expected_calving_date   DATE,
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_breeding_cow ON breeding_records(cow_id);
CREATE INDEX idx_breeding_technician ON breeding_records(technician_id);
CREATE INDEX idx_breeding_outcome ON breeding_records(outcome);
CREATE INDEX idx_breeding_calving ON breeding_records(expected_calving_date);

-- ---- Milk Yield Logs ----
CREATE TABLE milk_yield_logs (
    id                  BIGSERIAL       PRIMARY KEY,
    cow_id              BIGINT          NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    date                DATE            NOT NULL,
    quantity_litres     DECIMAL(6,2)    NOT NULL CHECK (quantity_litres > 0),
    session             VARCHAR(10)     NOT NULL CHECK (session IN ('MORNING','EVENING')),
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_milk_cow_date_session UNIQUE (cow_id, date, session)
);

CREATE INDEX idx_milk_cow ON milk_yield_logs(cow_id);
CREATE INDEX idx_milk_date ON milk_yield_logs(date);

-- ---- Alerts ----
CREATE TABLE alerts (
    id              BIGSERIAL       PRIMARY KEY,
    type            VARCHAR(30)     NOT NULL,
    target_user_id  BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message         VARCHAR(500)    NOT NULL,
    read_status     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(target_user_id);
CREATE INDEX idx_alerts_unread ON alerts(target_user_id, read_status);
