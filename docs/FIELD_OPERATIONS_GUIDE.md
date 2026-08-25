# Smart Dairy Field Operations & Maintenance Guide

## Overview
This runbook details field procedures for veterinary technicians, dairy cooperative managers, and system administrators operating the **Smart Dairy Breed-Matched AI & Herd Management System** in rural environments with intermittent network connectivity.

---

## 1. Offline Field Operation Protocol
- **Local Persistence**: All cattle registrations, insemination logs, and milk collections are recorded locally via `dynamicStore` when offline.
- **Auto-Sync**: When reconnecting to cellular/Wi-Fi networks, `syncEngine` automatically flushes pending offline queue events to the primary Spring Boot backend.
- **Manual Data Export**: Technicians can click **CSV Export** in the Herd or Milk Yield modules to download offline records.

---

## 2. Insemination & Genetic Guardrails
- **Inbreeding Cap**: Sire recommendations automatically block pairs resulting in >6.25% inbreeding coefficient.
- **Crossbreed Rules**: Indigenous Bos Indicus dams (Gir, Sahiwal) are paired with certified A2A2 sires to preserve genetic purity.
- **Exotic Blood Limit**: HF crossbreeding caps exotic blood at 62.5% to prevent heat-stress mortality in semi-arid zones.

---

## 3. Emergency Troubleshooting
- **Data Reset**: If local state requires factory reset, navigate to `Settings` -> `Restore Default Demo Data Engine`.
- **Backend Connectivity Check**: Verify backend status via `/actuator/health` endpoint on port `8081`.
