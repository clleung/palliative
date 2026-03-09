# CareCompass — Palliative & Hospice Care Management Platform

> A comprehensive care coordination tool for palliative and hospice care workers, designed with empathy, accessibility, and HIPAA compliance at its core.

**Live**: [solace-logistics-hub.lovable.app](https://solace-logistics-hub.lovable.app)

---

## Table of Contents

- [Overview](#overview)
- [Business Logic & Requirements](#business-logic--requirements)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Key Features](#key-features)
- [Testing](#testing)
- [Security & Compliance](#security--compliance)
- [Tech Stack](#tech-stack)
- [Development](#development)

---

## Overview

CareCompass is a dual-mode application (Specialist/Admin) for managing end-of-life and palliative care. Specialists (nurses, CNAs, coordinators) use it in the field to manage patient visits, document care, and track time. Admins oversee robot fleets, specialist workloads, and organizational trends.

### Core Problem

Palliative care workers manage emotionally demanding, geographically distributed patient visits with complex medical requirements. They need a tool that:
- Prioritizes patient safety and data privacy (HIPAA/GDPR)
- Surfaces urgent information immediately
- Tracks time, routes, and deliveries
- Supports worker wellbeing proactively
- Manages at-home care robots for medication delivery, vitals collection, and check-ins

---

## Business Logic & Requirements

### 1. Patient Management

| Rule | Description |
|------|-------------|
| **Priority System** | 4 levels: `critical` > `high` > `medium` > `low`. Critical patients always surface first in alerts. |
| **Status Tracking** | `stable`, `attention`, `critical`. Status drives icon color coding and alert visibility. |
| **Name Abbreviation** | HIPAA compliance: names display as `E.WRI` (first initial + 3-char last name) in list views. Full names visible only in detail panels. |
| **Insurance Tracking** | Supports Medicare, Medicaid, Private, VA, and Dual-eligible. Authorization expiry dates trigger warnings. |
| **Allocated Resources** | Equipment (hospital beds, O₂ concentrators, walkers, commodes, infusion pumps, suction machines) and robots tracked per patient with serial numbers, assignment dates, and statuses (`active`, `pending_delivery`, `maintenance`). |
| **Conditions & Disabilities** | Icon-based flags: visual, hearing, mobility, cognitive, speech disabilities. High-risk medication flags (heart meds, narcotics). |
| **Care Context** | Every patient has a `story` field — human context (hobbies, preferences, family) to support compassionate care. |

### 2. Visit & Schedule Management

| Rule | Description |
|------|-------------|
| **Visit Statuses** | `completed`, `current`, `upcoming`. Only one visit can be `current` at a time. |
| **Travel Estimates** | Each visit tracks `travelMinFromPrior` (null for first visit of the day). Used for route optimization. |
| **Location Duration** | `estimatedMinAtLocation` for scheduling accuracy. |
| **Weekly Coverage** | Visits span Mon–Fri (dayOfWeek 0–4). Each day's first visit has null travel time. |
| **Priority Flags** | `urgent` and `attention` priorities on visits surface in dashboard alerts with notes. |
| **Geographic Scope** | Portland, OR metro area. All coordinates validated within lat 45.0–46.0, lng -123.0 to -122.0. |

### 3. Robot Fleet Management

| Rule | Description |
|------|-------------|
| **Robot Statuses** | `idle`, `charging`, `in_transit`, `on_task`, `maintenance`, `offline`. Only idle/charged robots (>20% battery) are dispatchable. |
| **Task Types** | `delivery`, `check_in`, `vitals_collection`, `medication_reminder`, `emergency_response`. |
| **Task Lifecycle** | `pending` → `assigned` → `in_progress` → `completed`/`failed`/`cancelled`. |
| **Priority** | 1 (urgent) > 2 (normal) > 3 (low). Priority 1 tasks get visual `Urgent` badge. |
| **Assignment** | Unassigned pending tasks show "Assign Robot" action. Robots can have one assigned patient at a time. |
| **Location Tracking** | Live map shows all robot positions with color-coded status markers. |

### 4. Specialist Management (Admin)

| Rule | Description |
|------|-------------|
| **Roles** | `admin`, `nurse`, `cna`, `coordinator`, `supervisor`. Stored in separate `user_roles` table (not on profile). |
| **Time Tracking** | Weekly hours vs. 40h target. Overtime tracked separately. |
| **PTO Management** | PTO days and mental health days displayed. |
| **Status** | `on_shift`, `off_shift`, `on_call`, `on_leave`. |
| **Workload Metrics** | Patients assigned, visits today/completed, average visit duration. |

### 5. Worker Wellbeing

| Rule | Description |
|------|-------------|
| **Wellness Check-in** | Prompted via dialog. Three moods: "Doing well", "Managing", "Need support". |
| **PTO Encouragement** | Always visible: PTO balance (12 days) + mental health days (3). Explicit messaging that time off improves patient care quality. |
| **Escalation Resources** | For "Managing" or "Need support": Employee Assistance Program (24/7), Time Off request, Supervisor contact. |
| **Struggling Path** | Additional empathetic messaging: "You're not alone. Asking for help is a sign of strength." |
| **Confidentiality** | Notes field labeled "Your thoughts are confidential." |

### 6. Analytics & Reporting

| Rule | Description |
|------|-------------|
| **Date Range Filtering** | Users can filter trend data by custom date ranges. |
| **CSV Export** | All trend datasets exportable as CSV for external analysis. |
| **Five Trend Charts** | Visit volume, patient census, hours vs target, robot task volume, patient outcomes/satisfaction. |
| **Week-over-Week** | All metrics tracked weekly for trend visibility. |

### 7. Privacy & Compliance

| Rule | Description |
|------|-------------|
| **HIPAA Display Controls** | Abbreviated names, location masking (city/ZIP only in lists), auto-lock screen. |
| **Audit Logging** | Every SELECT, INSERT, UPDATE, DELETE on patient data logged with user_id, timestamp, table, and record_id. |
| **Session Security** | Auto-lock after 2 min inactivity. Session timeout after 30 min. |
| **RLS Policies** | Row-Level Security on all tables. Role-based access: admins > coordinators > nurses > CNAs. |
| **Data Retention** | Optional auto-archive of completed records after 90 days. |

---

## Architecture

```
src/
├── components/
│   ├── auth/           # ProtectedRoute
│   ├── dashboard/      # Stats, Schedule, Alerts, Trends, QuickActions
│   ├── layout/         # AppLayout (Specialist/Admin dual-mode)
│   ├── map/            # Leaflet route maps
│   ├── patients/       # DetailPanel, Vitals, Conditions
│   ├── robots/         # Dispatch, LocationMap
│   ├── ui/             # shadcn components
│   └── wellness/       # WellnessCheckIn
├── contexts/           # AuthContext
├── data/               # Static patient & visit data
├── hooks/              # Custom hooks
├── lib/                # Privacy utilities, helpers
├── pages/              # Route pages
└── test/               # Unit & component tests
```

### Dual-Mode Navigation

- **Specialist Mode**: Mobile-first bottom nav. Dashboard, Patients, Routes, Schedule, Hours, Deliveries, Settings.
- **Admin Mode**: Full sidebar. Adds Robot Fleet, Specialists overview. Time tracking and fleet management.

---

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete table definitions, enums, RLS policies, and ERD.

### Key Tables

| Table | Purpose |
|-------|---------|
| `patients` | Core patient records (name, DOB, status) |
| `patient_conditions` | Disabilities, high-risk meds, conditions |
| `patient_consents` | HIPAA consent tracking |
| `device_readings` | Smart device vitals (BP, SpO₂, glucose, etc.) |
| `robots` | Fleet inventory with status, battery, location |
| `robot_tasks` | Task assignments and lifecycle tracking |
| `worker_profiles` | Staff details, certifications, contact |
| `user_roles` | RBAC — separate from profiles for security |
| `audit_logs` | Compliance audit trail |

---

## Key Features

### Dashboard
- Greeting with time-of-day awareness
- 4 stat cards (visits, patients, urgent, hours)
- Priority alerts with color-coded urgency dots
- Quick actions: navigation, notes, robot dispatch, concerns
- Collapsible sections: deliveries, hours, tasks
- **Additional Details tab**: 5 week-over-week trend charts with date filtering and CSV export

### Patient Detail Panel
- Overview: status, prognosis, story, preferences
- Medications with dosage and schedule
- Care team contacts
- Insurance details with authorization warnings
- Allocated resources (equipment + robots)
- Vitals from smart devices
- Condition icons (disabilities, high-risk meds)
- Recent clinical notes

### Robot Fleet (Admin)
- Fleet stats: active, in transit, pending tasks, needs attention
- Robot cards: status, battery, location, assigned patient
- **Live map** with color-coded markers per status
- Task queue with filtering and assignment

### Specialists (Admin)
- Team stats: on shift, weekly hours, overtime, visits
- Specialist cards: hours progress, patient load, certifications, PTO
- Status filtering: on shift, on call, off shift, on leave

---

## Testing

### Test Suite (29+ tests)

```
src/test/
├── privacy.test.ts        # Name abbreviation, initials, avatar — 15 edge cases
├── patients.test.ts       # Data integrity, insurance, resources, medications — 18 tests
├── visits.test.ts         # Schedule validation, coordinates, cross-refs — 15 tests
├── DashboardStats.test.tsx # Component rendering, values, accessibility — 6 tests
├── QuickActions.test.tsx   # Button rendering, dialog interaction — 4 tests
├── WellnessCheckIn.test.tsx# Mood selection, PTO display, resource links — 10 tests
├── schema.test.ts         # DB enum validation, type shape checks — 10 tests
└── example.test.ts        # Smoke test
```

### Edge Cases Covered

- **Privacy**: Unicode names, single-word names, single-char names, extra whitespace, all-caps, short last names
- **Data**: Unique IDs, valid coordinates (Portland area), phone number format, valid enums, cross-reference patient↔visit
- **Components**: Disabled states, conditional rendering (mood-based), dialog open/close, accessibility attributes
- **Schema**: All enum completeness, table row type shapes, foreign key relationships

### Running Tests

Tests run automatically via the Lovable testing infrastructure. All tests use Vitest + React Testing Library.

---

## Security & Compliance

| Feature | Implementation |
|---------|---------------|
| Authentication | Email/password via Lovable Cloud auth |
| Authorization | Role-based (RBAC) via `user_roles` table + `has_role()` security definer function |
| RLS | All tables have Row-Level Security. Restrictive policies. Role checks bypass RLS recursion. |
| Audit Trail | Trigger-based logging on patient, robot, and task tables |
| Display Privacy | `abbreviateName()` for HIPAA-compliant name display |
| Session Security | Auto-lock, session timeout, persistent auth tokens |
| New User Flow | `handle_new_user()` trigger creates worker profile + assigns default `nurse` role |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Backend | Lovable Cloud (Supabase) |
| State | React Query (TanStack) |
| Routing | React Router v6 |
| Testing | Vitest + React Testing Library |
| Design | DM Sans + Playfair Display, Plum/Lavender theme |

---

## Development

```sh
# Clone and install
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i

# Start dev server
npm run dev

# Run tests
npx vitest run
```

### Design System

- **Primary**: Deep plum `hsl(270, 40%, 45%)`
- **Background**: Warm cream `hsl(30, 30%, 98%)`
- **Status Colors**: Emerald (stable), Amber (attention), Red (critical) — WCAG AA compliant
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Components**: shadcn/ui with custom design tokens in `index.css`

---

## Roadmap

- [ ] Connect mock data to live Lovable Cloud tables
- [ ] Real-time robot location updates via WebSocket
- [ ] Push notifications for task completion/failures
- [ ] Mobile PWA with offline support
- [ ] Smart device integration (real BLE/API connections)
- [ ] PDF report generation
- [ ] Shift scheduling with coverage gap alerts


### Initial Project Created as Part of SheBuilds 2026 on March 8, 2026
**To Do**
- add at-home robot fleet management to admin
- add tasks for delivering and checking in with records from at-home robots
- add patient data from smart watches and other health monitoring devices
- add iconography for patients with disabilities (visual, etc.) and high risk medications (heart medications, narcotics)**
- reconcile with open-source/tailwind ui and react frameworks
- accessibility checks
- smart device/monitoring updates
- mobile-first design/testing
- popup for acronym breakdowns XD
