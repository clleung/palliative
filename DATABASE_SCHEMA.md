# CareCompass Database Schema

This document provides a comprehensive reference for the Supabase database schema used in the CareCompass palliative care management application.

---

## Table of Contents

- [Enums](#enums)
- [Tables](#tables)
  - [patients](#patients)
  - [patient_consents](#patient_consents)
  - [patient_conditions](#patient_conditions)
  - [device_readings](#device_readings)
  - [robots](#robots)
  - [robot_tasks](#robot_tasks)
  - [worker_profiles](#worker_profiles)
  - [user_roles](#user_roles)
  - [audit_logs](#audit_logs)
- [Functions](#functions)
- [Row-Level Security Policies](#row-level-security-policies)

---

## Enums

### `app_role`
User roles within the application.

| Value | Description |
|-------|-------------|
| `admin` | Full system access |
| `nurse` | Registered nurse |
| `cna` | Certified nursing assistant |
| `coordinator` | Care coordinator |
| `supervisor` | Team supervisor |

### `audit_action`
Actions tracked in audit logs.

| Value |
|-------|
| `SELECT` |
| `INSERT` |
| `UPDATE` |
| `DELETE` |

### `robot_status`
Status of at-home care robots.

| Value | Description |
|-------|-------------|
| `idle` | Available for tasks |
| `charging` | Battery charging |
| `in_transit` | Traveling to destination |
| `on_task` | Performing assigned task |
| `maintenance` | Under maintenance |
| `offline` | Not connected |

### `robot_task_type`
Types of tasks robots can perform.

| Value | Description |
|-------|-------------|
| `delivery` | Deliver supplies/medication |
| `check_in` | Welfare check on patient |
| `vitals_collection` | Collect vital signs |
| `medication_reminder` | Remind patient to take medication |
| `emergency_response` | Respond to emergency alert |

### `robot_task_status`
Status of robot tasks.

| Value |
|-------|
| `pending` |
| `assigned` |
| `in_progress` |
| `completed` |
| `failed` |
| `cancelled` |

### `device_type`
Types of health monitoring devices.

| Value |
|-------|
| `smartwatch` |
| `blood_pressure` |
| `pulse_oximeter` |
| `glucose_monitor` |
| `weight_scale` |
| `thermometer` |
| `ecg_monitor` |

### `disability_type`
Types of patient disabilities for accessibility accommodations.

| Value | Description |
|-------|-------------|
| `visual` | Visual impairment |
| `hearing` | Hearing impairment |
| `mobility` | Mobility impairment |
| `cognitive` | Cognitive impairment |
| `speech` | Speech impairment |

---

## Tables

### `patients`

Core patient information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `first_name` | `text` | No | - | Patient's first name |
| `last_name` | `text` | No | - | Patient's last name |
| `dob` | `date` | No | - | Date of birth |
| `status` | `text` | Yes | `'active'` | Patient status |
| `created_at` | `timestamptz` | Yes | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | Yes | `now()` | Last update timestamp |

---

### `patient_consents`

Tracks patient consent records for various care activities.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `patient_id` | `uuid` | Yes | - | FK → `patients.id` |
| `consent_type` | `text` | No | - | Type of consent |
| `granted` | `boolean` | Yes | `false` | Whether consent was granted |
| `granted_at` | `timestamptz` | Yes | - | When consent was granted |
| `revoked_at` | `timestamptz` | Yes | - | When consent was revoked |
| `recorded_by` | `uuid` | Yes | - | Worker who recorded consent |

---

### `patient_conditions`

Patient disabilities and high-risk medication indicators.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `patient_id` | `uuid` | No | - | FK → `patients.id` (CASCADE) |
| `condition_type` | `text` | No | - | Type of condition |
| `disability_type` | `disability_type` | Yes | - | Disability category |
| `is_high_risk_medication` | `boolean` | Yes | `false` | High-risk medication flag |
| `medication_category` | `text` | Yes | - | e.g., cardiac, narcotic |
| `notes` | `text` | Yes | - | Additional notes |
| `created_at` | `timestamptz` | Yes | `now()` | Record creation timestamp |

---

### `device_readings`

Health data from connected patient devices (smartwatches, monitors, etc.).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `patient_id` | `uuid` | No | - | FK → `patients.id` (CASCADE) |
| `device_type` | `device_type` | No | - | Type of monitoring device |
| `reading_type` | `text` | No | - | e.g., heart_rate, spo2, glucose |
| `value` | `numeric` | No | - | Reading value |
| `unit` | `text` | No | - | Unit of measurement |
| `is_abnormal` | `boolean` | Yes | `false` | Flag for abnormal readings |
| `recorded_at` | `timestamptz` | Yes | `now()` | When reading was taken |
| `synced_at` | `timestamptz` | Yes | `now()` | When data synced to system |
| `device_serial` | `text` | Yes | - | Device serial number |
| `metadata` | `jsonb` | Yes | `'{}'` | Additional device metadata |

**Realtime enabled** ✓

---

### `robots`

At-home care robot fleet.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `robot_id` | `text` | No | - | Unique robot identifier (e.g., HB-001) |
| `name` | `text` | No | - | Robot's friendly name |
| `model` | `text` | Yes | `'HomeBot X1'` | Robot model |
| `status` | `robot_status` | Yes | `'idle'` | Current status |
| `battery_level` | `integer` | Yes | `100` | Battery % (0-100) |
| `current_location` | `text` | Yes | - | Current location description |
| `assigned_patient_id` | `uuid` | Yes | - | FK → `patients.id` |
| `last_maintenance_at` | `timestamptz` | Yes | - | Last maintenance date |
| `last_seen_at` | `timestamptz` | Yes | `now()` | Last communication time |
| `created_at` | `timestamptz` | Yes | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | Yes | `now()` | Last update timestamp |

**Constraints:**
- `battery_level` must be between 0 and 100
- `robot_id` must be unique

---

### `robot_tasks`

Tasks assigned to robots for patient care.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `robot_id` | `uuid` | Yes | - | FK → `robots.id` |
| `patient_id` | `uuid` | No | - | FK → `patients.id` (CASCADE) |
| `task_type` | `robot_task_type` | No | - | Type of task |
| `status` | `robot_task_status` | Yes | `'pending'` | Current status |
| `priority` | `integer` | Yes | `2` | Priority level (1=urgent, 4=low) |
| `description` | `text` | Yes | - | Task description |
| `scheduled_at` | `timestamptz` | Yes | - | Scheduled execution time |
| `started_at` | `timestamptz` | Yes | - | Actual start time |
| `completed_at` | `timestamptz` | Yes | - | Completion time |
| `notes` | `text` | Yes | - | Task notes/results |
| `created_by` | `uuid` | Yes | - | Worker who created task |
| `created_at` | `timestamptz` | Yes | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | Yes | `now()` | Last update timestamp |

**Constraints:**
- `priority` must be between 1 and 4

**Realtime enabled** ✓

---

### `worker_profiles`

Care worker profile information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | No | - | FK → `auth.users.id` |
| `worker_id` | `text` | No | - | Worker identifier (e.g., CW-12345) |
| `display_name` | `text` | No | - | Display name |
| `job_title` | `text` | Yes | `'Care Worker'` | Job title |
| `department` | `text` | Yes | `'Palliative Care'` | Department |
| `phone` | `text` | Yes | - | Phone number |
| `avatar_url` | `text` | Yes | - | Profile picture URL |
| `certifications` | `text[]` | Yes | `'{}'` | Array of certifications |
| `mfa_enrolled` | `boolean` | Yes | `false` | MFA enrollment status |
| `biometric_enrolled` | `boolean` | Yes | `false` | Biometric auth status |
| `last_login_at` | `timestamptz` | Yes | - | Last login timestamp |
| `created_at` | `timestamptz` | No | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | No | `now()` | Last update timestamp |

---

### `user_roles`

Maps users to their application roles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | No | - | User identifier |
| `role` | `app_role` | No | - | Assigned role |

**Constraints:**
- Unique combination of `user_id` and `role`

---

### `audit_logs`

HIPAA-compliant audit trail for data access.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | Yes | - | User who performed action |
| `action` | `audit_action` | No | - | Type of action |
| `table_name` | `text` | No | - | Affected table |
| `record_id` | `uuid` | Yes | - | Affected record ID |
| `timestamp` | `timestamptz` | Yes | `now()` | When action occurred |
| `user_agent` | `text` | Yes | - | Browser/client info |
| `ip_address` | `text` | Yes | - | Client IP address |

---

## Functions

### `has_role(_user_id uuid, _role app_role) → boolean`

Security definer function to check if a user has a specific role. Used in RLS policies to prevent infinite recursion.

```sql
SELECT has_role(auth.uid(), 'admin');
```

### `handle_new_user() → trigger`

Automatically creates a worker profile and assigns default role when a new user signs up.

### `update_updated_at_column() → trigger`

Updates the `updated_at` timestamp on record modification.

### `log_audit_event() → trigger`

Logs INSERT, UPDATE, DELETE operations to the audit_logs table.

---

## Row-Level Security Policies

All tables have RLS enabled. Key policies:

| Table | Policy | Access |
|-------|--------|--------|
| `patients` | Workers can view active patients | SELECT for nurse, cna, coordinator, admin |
| `patient_consents` | Workers can view consents | SELECT for nurse, cna, coordinator, admin |
| `patient_conditions` | Workers can view/manage | SELECT all workers; ALL for nurse+ |
| `device_readings` | Workers can view/insert | SELECT/INSERT for all workers |
| `robots` | Admin/coordinator access | SELECT for admin, coordinator; ALL for admin |
| `robot_tasks` | Worker view, coordinator manage | SELECT all workers; ALL for coordinator, admin |
| `worker_profiles` | Self-service + view all | SELECT all; INSERT/UPDATE own profile |
| `user_roles` | Read-only for authenticated | SELECT only |
| `audit_logs` | Admin view only | SELECT for admin only |

---

## Entity Relationship Diagram

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│     patients    │     │   patient_conditions │     │  device_readings│
├─────────────────┤     ├──────────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ patient_id (FK)      │     │ id (PK)         │
│ first_name      │     │ disability_type      │     │ patient_id (FK) │◄─┐
│ last_name       │     │ medication_category  │     │ device_type     │  │
│ dob             │     └──────────────────────┘     │ value, unit     │  │
│ status          │                                  └─────────────────┘  │
└────────┬────────┘                                                       │
         │                                                                │
         │         ┌─────────────────┐     ┌─────────────────┐           │
         │         │     robots      │     │   robot_tasks   │           │
         │         ├─────────────────┤     ├─────────────────┤           │
         └────────►│ assigned_patient│     │ robot_id (FK)   │◄──────────┤
                   │ id (PK)         │◄────│ patient_id (FK) │───────────┘
                   │ status          │     │ task_type       │
                   │ battery_level   │     │ status          │
                   └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│ worker_profiles │     │   user_roles    │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ user_id (FK)    │     │ user_id         │
│ display_name    │     │ role            │
│ certifications  │     └─────────────────┘
└─────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-09 | Initial schema with patients, workers, roles, audit |
| 1.1 | 2026-03-09 | Added robots, robot_tasks, device_readings, patient_conditions |

---

*Generated for CareCompass Palliative Care Management System*
