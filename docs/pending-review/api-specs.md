# CareCompass API — Schemas

Bare minimum fields for every endpoint.

- **required** — must be present
- **auto** — server-generated, returned in response
- **optional** — omit to use defaults

---

## Auth

### `POST /auth/v1/token?grant_type=password` — Sign in

**Request**

| Field | Type | |
|-------|------|--|
| `email` | string | required |
| `password` | string | required |

**Response**

| Field | Type | |
|-------|------|--|
| `access_token` | string | auto |
| `refresh_token` | string | auto |
| `expires_in` | number | auto |

---

### `POST /auth/v1/token?grant_type=refresh_token` — Refresh session

**Request**

| Field | Type | |
|-------|------|--|
| `refresh_token` | string | required |

**Response**

| Field | Type | |
|-------|------|--|
| `access_token` | string | auto |
| `refresh_token` | string | auto |

---

## Patients

### `GET /rest/v1/patients` — List active patients

**Response (array)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `first_name` | string | auto |
| `last_name` | string | auto |
| `status` | enum: `stable \| attention \| critical` | auto |
| `priority` | enum: `low \| medium \| high \| critical` | auto |
| `city` | string | auto |
| `assigned_worker_id` | uuid | auto |

---

### `GET /rest/v1/patients?id=eq.{id}` — Get patient detail

**Path param**

| Field | Type | |
|-------|------|--|
| `id` | uuid | required |

**Response includes**

| Field | Type | |
|-------|------|--|
| `patient_conditions` | array | auto |
| `patient_medications` | array | auto |
| `device_readings` | array (last 10) | auto |
| `care_notes` | array (last 5) | auto |

---

### `POST /rest/v1/patients` — Create patient *(coordinator+)*

**Request**

| Field | Type | |
|-------|------|--|
| `first_name` | string | required |
| `last_name` | string | required |
| `date_of_birth` | date | required |
| `status` | enum | required |
| `priority` | enum | required |
| `insurance_type` | string | required |
| `street_address` | string | required |
| `city` | string | required |
| `state` | string | required |
| `zip` | string | required |
| `latitude` | number | required |
| `longitude` | number | required |
| `assigned_worker_id` | uuid | optional |
| `story` | string | optional |

> Coordinates validated by DB `CHECK` constraint: lat `45.0–46.0`, lng `−123.0 to −122.0`.

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `created_at` | timestamp | auto |

---

### `PATCH /rest/v1/patients?id=eq.{id}` — Update status / priority *(nurse+)*

**Request** (at least one field required)

| Field | Type | |
|-------|------|--|
| `status` | enum | optional |
| `priority` | enum | optional |

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `status` | enum | auto |
| `priority` | enum | auto |

---

## Visits

### `GET /rest/v1/visits` — Today's schedule

**Query params**

| Field | Type | |
|-------|------|--|
| `worker_id` | uuid | required |
| `scheduled_window_start` | timestamp range | required |

**Response (array)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `status` | enum: `upcoming \| current \| completed` | auto |
| `scheduled_window_start` | timestamp | auto |
| `travel_min_from_prior` | number \| null | auto |
| `patients.*` | object | auto |

---

### `PATCH /rest/v1/visits?id=eq.{visit_id}` — Check in

**Request (check in)**

| Field | Type | |
|-------|------|--|
| `status` | `"current"` | required |
| `actual_arrived_at` | iso timestamp | required |

**Request (complete)**

| Field | Type | |
|-------|------|--|
| `status` | `"completed"` | required |
| `actual_departed_at` | iso timestamp | required |

> After completing a visit, insert a `time_entries` row with the computed `hours_worked`.

---

## Device Readings

### `GET /rest/v1/device_readings` — Get vitals for a patient

**Query params**

| Field | Type | |
|-------|------|--|
| `patient_id` | uuid | required |

**Response (array)**

| Field | Type | |
|-------|------|--|
| `reading_type` | string | auto |
| `value_numeric` | number \| null | auto |
| `value_systolic` | number \| null | auto |
| `value_diastolic` | number \| null | auto |
| `recorded_at` | timestamp | auto |

---

### `POST /rest/v1/device_readings` — Record manual vitals

**Request**

| Field | Type | |
|-------|------|--|
| `patient_id` | uuid | required |
| `reading_type` | string | required |
| `unit` | string | required |
| `recorded_at` | iso timestamp | required |
| `recorded_by` | uuid | required |
| `value_numeric` | number | optional |
| `value_systolic` | number | optional |
| `value_diastolic` | number | optional |

> For `blood_pressure`: provide `value_systolic` + `value_diastolic`. For all other types: provide `value_numeric`.

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `recorded_at` | timestamp | auto |

---

## Robots

### `GET /rest/v1/robots` — Fleet list

**Response (array)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `name` | string | auto |
| `status` | enum: `idle \| in_transit \| on_task \| maintenance \| offline` | auto |
| `battery_pct` | number | auto |
| `latitude` | number | auto |
| `longitude` | number | auto |
| `patients.*` | object \| null | auto |

---

### `POST /rest/v1/robot_tasks` — Create task *(nurse+)*

**Request**

| Field | Type | |
|-------|------|--|
| `patient_id` | uuid | required |
| `task_type` | string | required |
| `priority` | number (1 = urgent) | required |
| `notes` | string | optional |

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `status` | `"pending"` | auto |
| `created_at` | timestamp | auto |

---

### `PATCH /rest/v1/robot_tasks?id=eq.{task_id}` — Assign robot *(coordinator+)*

**Request**

| Field | Type | |
|-------|------|--|
| `robot_id` | uuid | required |
| `status` | `"assigned"` | required |
| `assigned_at` | iso timestamp | required |
| `assigned_by` | uuid | required |

**Also update `robots` table**

| Field | Type | |
|-------|------|--|
| `assigned_patient_id` | uuid | required |
| `status` | `"in_transit"` | required |

> Two writes required: `PATCH /robot_tasks` + `PATCH /robots?id=eq.{robot_id}`.

---

### `PATCH /rest/v1/robot_tasks?id=eq.{task_id}` — Advance task lifecycle

**Request (in progress)**

| Field | Type | |
|-------|------|--|
| `status` | `"in_progress"` | required |
| `started_at` | iso timestamp | required |

**Request (completed / failed)**

| Field | Type | |
|-------|------|--|
| `status` | `"completed" \| "failed"` | required |
| `completed_at` | iso timestamp | required |
| `failure_reason` | string | optional |

---

## Workers

### `GET /rest/v1/worker_profiles` — Team overview *(admin)*

**Response (array)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `first_name` | string | auto |
| `last_name` | string | auto |
| `status` | enum | auto |
| `current_week_hours` | number | auto |
| `weekly_hours_target` | number | auto |
| `visits_today_total` | number | auto |
| `visits_today_completed` | number | auto |
| `user_roles.*` | object | auto |

---

### `PATCH /rest/v1/worker_profiles?id=eq.{id}` — Update status *(admin)*

**Request**

| Field | Type | |
|-------|------|--|
| `status` | enum: `on_shift \| on_call \| off` | required |

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `status` | enum | auto |

---

## Wellness

### `POST /rest/v1/wellness_checkins` — Submit check-in

**Request**

| Field | Type | |
|-------|------|--|
| `worker_id` | uuid | required |
| `mood` | enum | required |
| `notes` | string | optional |

> `notes` is confidential — never returned in admin queries.

**Response**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `created_at` | timestamp | auto |

---

### `GET /rest/v1/wellness_checkins` — Own check-in history

**Query params**

| Field | Type | |
|-------|------|--|
| `worker_id` | uuid | required |

**Response (array, last 30)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `mood` | enum | auto |
| `created_at` | timestamp | auto |

---

## Analytics

### `GET /rest/v1/v_weekly_visit_volume` — Visit trend

**Query params**

| Field | Type | |
|-------|------|--|
| `week_start` (gte + lte) | date range | optional |

**Response (array)**

| Field | Type | |
|-------|------|--|
| `week_start` | date | auto |
| `total_visits` | number | auto |
| `completed_visits` | number | auto |
| `urgent_visits` | number | auto |

---

### `GET /rest/v1/v_weekly_hours` — Hours vs. target

**Response (array)**

| Field | Type | |
|-------|------|--|
| `worker_id` | uuid | auto |
| `worker_name` | string | auto |
| `week_start` | date | auto |
| `total_hours` | number | auto |
| `target_hours` | number | auto |
| `variance` | number | auto |
| `overtime_hours` | number | auto |

---

### `GET /rest/v1/v_weekly_robot_tasks` — Robot task trend

**Response (array)**

| Field | Type | |
|-------|------|--|
| `week_start` | date | auto |
| `task_type` | string | auto |
| `total` | number | auto |
| `completed` | number | auto |
| `failed` | number | auto |
| `urgent` | number | auto |

---

## Audit Logs

### `GET /rest/v1/audit_logs` — *(admin + supervisor only)*

**Query params**

| Field | Type | |
|-------|------|--|
| `table_name` | string | optional |
| `action` | enum: `INSERT \| UPDATE \| DELETE` | optional |
| `user_id` | uuid | optional |

**Response (array, max 100)**

| Field | Type | |
|-------|------|--|
| `id` | uuid | auto |
| `table_name` | string | auto |
| `action` | enum | auto |
| `user_id` | uuid | auto |
| `created_at` | timestamp | auto |