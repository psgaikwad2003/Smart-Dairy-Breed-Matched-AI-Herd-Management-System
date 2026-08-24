# Smart Dairy 🐄 — Breed-Matched AI & Herd Management System

> A real-time Cattle Breeding & Artificial Insemination Management System for dairy farmers, AI technicians, and veterinarians.

[![CI/CD](https://github.com/yourorg/smart-dairy/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourorg/smart-dairy/actions)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Problem Statement

Dairy farmers in India use artificial insemination (AI) with bull semen straws to breed cows. Manual, paper-based record-keeping causes **wrong-breed semen straws** to be used, leading to low-yield crossbred calves and significant financial loss. Smart Dairy digitizes breed matching, semen inventory, and breeding records — catching mismatches **before** insemination is confirmed.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧬 **Breed Compatibility Engine** | Validates cow breed vs semen straw breed before insemination; blocks mismatches with override audit trail |
| 📦 **Real-Time Semen Inventory** | Stock levels update instantly across all users/devices via WebSocket + Redis pub/sub |
| 🔔 **Smart Alerts** | Low-stock warnings, mismatch blocks, calving reminders — real-time + SMS fallback |
| 📊 **Analytics Dashboard** | Milk yield trends, breed distribution, bull performance comparison |
| 🌐 **Multilingual & Offline-Ready** | i18n-ready (English + Hindi), offline form queuing for rural connectivity |
| 📱 **Mobile-First UI** | Large touch targets, icon-driven navigation, works on low-end Android phones |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite + Tailwind)       │
│               Mobile-First · Offline-Tolerant · i18n      │
└──────────────────────┬──────────────────────────────────┘
                       │ REST + WebSocket (STOMP/SockJS)
┌──────────────────────▼──────────────────────────────────┐
│              Spring Boot 3.3 (Java 21)                    │
│  ┌──────────┬──────────┬───────────┬──────────────────┐  │
│  │ Farmer   │ Cattle   │ Breeding  │ Notification     │  │
│  │ Module   │ Module   │ Module    │ Module           │  │
│  │          │ (Cow,    │ (Engine,  │ (Alerts,         │  │
│  │          │  Bull,   │  Records) │  SMS stub)       │  │
│  │          │  Semen)  │           │                  │  │
│  └──────────┴──────────┴───────────┴──────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Analytics Module (MilkYield, Reports, Correlations)  │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────┬──────────┬───────────┐                     │
│  │ Security │ WebSocket│ Actuator  │                     │
│  │ (JWT)    │ (STOMP)  │ (Metrics) │                     │
│  └──────────┴──────────┴───────────┘                     │
└───────┬──────────────────────────┬───────────────────────┘
        │                          │
┌───────▼───────┐          ┌───────▼───────┐
│  PostgreSQL   │          │    Redis      │
│  (Primary DB) │          │  (Cache +     │
│               │          │   Pub/Sub)    │
└───────────────┘          └───────────────┘
```

### Maven Multi-Module Structure

```
backend/
├── pom.xml                          # Parent POM
├── Dockerfile                       # Multi-stage build
├── smart-dairy-common/              # Shared: DTOs, exceptions, enums
├── smart-dairy-core/                # Domain: entities, repos, services
└── smart-dairy-app/                 # Web: controllers, security, config
    └── src/main/resources/
        ├── application.yml          # Base config
        ├── application-dev.yml      # Local development
        ├── application-staging.yml  # Staging environment
        ├── application-prod.yml     # Production
        └── db/migration/            # Flyway SQL migrations
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Docker & Docker Compose
- Node.js 18+ (for frontend)
- Maven 3.9+

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repo
git clone https://github.com/yourorg/smart-dairy.git
cd smart-dairy

# Start everything (Postgres, Redis, Backend, pgAdmin, Prometheus, Grafana)
docker-compose up -d

# Access points:
# Backend API:    http://localhost:8080
# Swagger UI:     http://localhost:8080/swagger-ui.html
# pgAdmin:        http://localhost:5050  (admin@smartdairy.com / admin)
# Prometheus:     http://localhost:9090
# Grafana:        http://localhost:3001  (admin / admin)
```

### Option 2: Local Development

```bash
# 1. Start infrastructure only
docker-compose up -d postgres redis

# 2. Run backend
cd backend
mvn clean install
mvn spring-boot:run -pl smart-dairy-app -Dspring-boot.run.profiles=dev

# 3. Run frontend (in separate terminal)
cd frontend
npm install
npm run dev
```

## 🔑 API Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login (returns JWT) | Public |
| CRUD | `/api/farmers` | Farmer management | ADMIN, VET |
| CRUD | `/api/cows` | Cow management | FARMER, TECH |
| CRUD | `/api/bulls` | Bull catalog | ADMIN |
| CRUD | `/api/semen-straws` | Semen inventory | ADMIN, TECH |
| POST | `/api/breeding/validate` | Check breed compatibility | TECH |
| POST | `/api/breeding/confirm` | Confirm insemination | TECH |
| POST | `/api/milk-yield` | Log milk yield | FARMER |
| GET | `/api/alerts/user/{id}` | User alerts | ALL |
| WS | `/ws` | WebSocket (STOMP) | ALL |

Full API documentation available at `/swagger-ui.html` when running.

## 🧪 Testing

```bash
cd backend
mvn clean test              # Unit tests
mvn clean verify             # Unit + integration tests
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.3.2 |
| Security | Spring Security + JWT |
| Database | PostgreSQL 16 |
| Cache/Pub-Sub | Redis 7 |
| Real-Time | WebSocket (STOMP over SockJS) |
| Migrations | Flyway |
| API Docs | springdoc-openapi (Swagger) |
| Frontend | React (Vite) + Tailwind CSS |
| Containers | Docker (multi-stage builds) |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes |
| Monitoring | Prometheus + Grafana |
| Metrics | Micrometer |

## 📄 License

This project is licensed under the MIT License.
