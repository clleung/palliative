# CareCompass API Reference

All endpoints require `Authorization: Bearer <supabase_jwt>`. RLS enforces role-based access automatically. Base URL: `https://<project>.supabase.co`

Sessions auto-lock after **2 min** inactivity and expire after **30 min**, enforced client-side via `AuthContext`.

---

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/v1/token?grant_type=password` | Email + password sign-in |
| `POST` | `/auth/v1/token?grant_type=refresh_token` | Refresh session |
| `POST` | `/auth/v1/logout` | Invalidate session |

---

## Endpoints by Role

All endpoints below require a valid JWT. RLS further restricts access based on the authenticated user's role.

---

### Patients

List view abbreviates names as `E.WRI` via `abbreviateName()`. Full names are visible only in detail panels. Priority order: `critical → high → medium → low`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/patients` | List active patients, ordered by priority and status |
| `GET` | `/rest/v1/patients?id=eq.{id}` | Get patient detail including conditions, medications, equipment, consents, recent device readings, and care notes |
| `POST` | `/rest/v1/patients` | Create patient *(coordinator+)* |
| `PATCH` | `/rest/v1/patients?id=eq.{id}` | Update patient status or priority *(nurse+)* |

---

### Visits

Status colors: `completed` = emerald, `current` = amber, `upcoming` = slate. Only one active visit is permitted per worker at a time.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/visits` | Get today's schedule for the current worker |
| `GET` | `/rest/v1/visits?day_of_week=in.(...)` | Get weekly schedule (Mon–Fri) |
| `GET` | `/rest/v1/visits?priority=in.(urgent,attention)` | Get priority alerts for urgent and attention visits |
| `PATCH` | `/rest/v1/visits?id=eq.{visit_id}` | Check in (mark current) or complete a visit |

---

### Device Readings (Vitals)

Blood pressure readings use `value_systolic` / `value_diastolic`. All other reading types use `value_numeric`. Supports real-time subscription via Supabase Realtime.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/device_readings` | Get latest vitals per type for a patient (returns up to 50 records ordered by `recorded_at` desc) |
| `POST` | `/rest/v1/device_readings` | Record manual vitals for a patient |

---

### Robots

Dispatchable robots must have `status = idle` and `battery_pct > 20%`. Tasks with `priority = 1` receive an Urgent badge. Supports real-time location and status updates.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/robots` | Get fleet list with live status and assigned patient |
| `GET` | `/rest/v1/robots?status=eq.idle` | List dispatchable robots |
| `GET` | `/rest/v1/robot_tasks` | Get robot task queue (pending, assigned, in-progress) |
| `GET` | `/rest/v1/robot_tasks?status=eq.pending&robot_id=is.null` | Get unassigned pending tasks |
| `POST` | `/rest/v1/robot_tasks` | Create a robot task *(nurse+)* |
| `PATCH` | `/rest/v1/robot_tasks?id=eq.{task_id}` | Assign robot to task, or advance task lifecycle *(coordinator+ to assign)* |

---

### Workers *(admin only)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/worker_profiles` | Get team overview including hours, PTO balance, visit stats, and roles |
| `GET` | `/rest/v1/worker_profiles?status=eq.{status}` | Filter workers by status (e.g. `on_shift`, `on_call`) |
| `PATCH` | `/rest/v1/worker_profiles?id=eq.{id}` | Update worker status |

---

### Wellness

Check-in notes are confidential and never included in admin queries. Workers can only access their own records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/rest/v1/wellness_checkins` | Submit a wellness check-in (own record only) |
| `GET` | `/rest/v1/wellness_checkins` | Get own check-in history (last 30 records) |

---

### Analytics *(admin only)*

All views support date-range filtering via `week_start=gte.{date}&week_start=lte.{date}` and CSV export via `Accept: text/csv`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/v_weekly_visit_volume` | Visit volume trend by week |
| `GET` | `/rest/v1/v_weekly_patient_census` | Patient census trend by week |
| `GET` | `/rest/v1/v_weekly_hours` | Worker hours vs. target trend by week |
| `GET` | `/rest/v1/v_weekly_robot_tasks` | Robot task volume trend by week |

---

### Audit Logs *(admin + supervisor only)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rest/v1/audit_logs` | Get audit log entries, filterable by table, action, and user (100 records per page) |

---

### Real-Time Subscriptions *(Supabase Realtime)*

Subscribe to live updates via Supabase Realtime channels using `postgres_changes`.

| Channel | Table | Description |
|---------|-------|-------------|
| `robots` | `robots` | Robot location and status changes (all events) |
| `alerts` | `visits` | Priority alert updates for urgent and attention visits (UPDATE events) |
| `readings` | `device_readings` | Live vitals for a specific patient (INSERT events) |