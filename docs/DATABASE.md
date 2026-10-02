# HifzMate Pro Database Design

This document proposes a PostgreSQL/Supabase database design based on `docs/PRD.md` and `docs/ARCHITECTURE.md`. It is a logical schema only. It contains no SQL, migrations, or application code.

## Design Conventions

- Use PostgreSQL `uuid` primary keys with `gen_random_uuid()` as the database default when implemented.
- Use `timestamptz` for timestamps and store them in UTC.
- Use `date` for calendar dates such as due dates and report periods.
- Use `jsonb` only for provider payloads, flexible metadata, and immutable snapshots; core relationships remain typed columns.
- Use controlled PostgreSQL enums or `text` plus `CHECK` constraints for statuses and types. The final implementation should choose one convention consistently.
- Every user-facing table containing private data must be protected by Supabase Row Level Security (RLS).
- `auth.users.id` is the identity source. Application profile data belongs in `profiles`.
- Soft deletion is preferable for organizational records that must remain auditable. Use `deleted_at` where stated rather than physically deleting history.

## Relationship Overview

```text
auth.users 1--1 profiles
profiles M--M academies through academy_memberships
profiles M--M profiles through teacher_student_links and parent_student_links
academies 1--M classes
classes M--M profiles through class_teachers and class_students
students 1--M assignments, practice, tests, exams, mistakes, progress
assignments 1--M assignment_targets
recitation_tests 1--1 recordings 1--1 transcripts 1--M ai_analysis_runs 1--M possible_mistakes
possible_mistakes 1--M mistake_verifications
exams 1--M exam_attempts
students 1--M revision_plans 1--M revision_plan_items
```

## 1. Identity, Academy, and Relationships

### 1.1 `profiles`

Application profile for a Supabase Auth user.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key; FK to `auth.users.id`; `ON DELETE CASCADE` |
| `display_name` | `text` | Required |
| `email` | `text` | Optional display copy; Auth remains authoritative |
| `avatar_path` | `text` | Nullable Storage path |
| `locale` | `text` | Required; default product locale |
| `timezone` | `text` | Required; default UTC |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |
| `deleted_at` | `timestamptz` | Nullable |

**Relationships:** One-to-one with `auth.users`; one-to-many to memberships and user-authored records.

**Indexes:** Primary key; index on `lower(email)` only if application-level lookup is needed; index on `deleted_at` if active-profile filtering is frequent.

**Constraints:** `display_name` non-empty; `locale` and `timezone` non-empty; profile deletion must not remove auditable authored records.

### 1.2 `academies`

Academy or organization boundary for tenant-scoped data.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `name` | `text` | Required |
| `slug` | `citext` | Required; unique |
| `status` | `text` | Required; `active`, `suspended`, or `archived` |
| `created_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |
| `deleted_at` | `timestamptz` | Nullable |

**Relationships:** One academy has many memberships, classes, assignments, exams, reports, and audit records.

**Indexes:** Unique index on `slug`; index on `(status, deleted_at)`.

**Constraints:** `name` and `slug` non-empty; archived academies cannot receive new active memberships through application rules/RLS.

### 1.3 `academy_memberships`

Associates a user with an academy and grants an academy-scoped role.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `user_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `role` | `text` | Required; `student`, `teacher`, `parent`, or `academy_admin` |
| `status` | `text` | Required; `invited`, `active`, `suspended`, or `ended` |
| `joined_at` | `timestamptz` | Nullable until accepted |
| `ended_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** Many-to-many between profiles and academies; referenced by role-scoped RLS checks.

**Indexes:** Unique `(academy_id, user_id, role)`; index `(user_id, status)`; index `(academy_id, role, status)`.

**Constraints:** `ended_at` must be after `joined_at`; only one active membership for the same academy, user, and role; role is controlled.

### 1.4 `teacher_student_links`

Explicit teacher-to-student relationship independent of class membership.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `teacher_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `status` | `text` | Required; `active` or `ended` |
| `started_at` | `timestamptz` | Required |
| `ended_at` | `timestamptz` | Nullable |
| `created_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |

**Relationships:** Many-to-many teacher/student relationship within an academy.

**Indexes:** Unique active relationship on `(academy_id, teacher_id, student_id)`; indexes on `(teacher_id, status)` and `(student_id, status)`.

**Constraints:** Teacher and student must be different users; memberships for the corresponding roles must exist in the same academy; `ended_at > started_at`.

### 1.5 `parent_student_links`

Explicit parent-to-child relationship used for all parent access.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `parent_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `relationship_label` | `text` | Nullable, such as parent or guardian |
| `status` | `text` | Required; `pending`, `active`, or `ended` |
| `consent_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |
| `ended_at` | `timestamptz` | Nullable |

**Relationships:** Many-to-many parent/student relationship within an academy.

**Indexes:** Unique active `(academy_id, parent_id, student_id)`; indexes on `(parent_id, status)` and `(student_id, status)`.

**Constraints:** Parent and student must be different users; role memberships must exist in the same academy; active access requires `consent_at` where academy policy requires it; `ended_at > created_at`.

### 1.6 `classes`

A named academy class or group.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `name` | `text` | Required |
| `description` | `text` | Nullable |
| `status` | `text` | Required; `active` or `archived` |
| `created_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |

**Relationships:** Academy owns classes; classes have many teachers and students.

**Indexes:** `(academy_id, status)`; unique active class name per academy if the product requires it.

**Constraints:** Class and creator must belong to the academy; archived classes cannot receive new assignments.

### 1.7 `class_teachers`

Teacher membership in a class.

| Column | Type | Details |
| --- | --- | --- |
| `class_id` | `uuid` | Composite primary key; FK to `classes.id`; `ON DELETE CASCADE` |
| `teacher_id` | `uuid` | Composite primary key; FK to `profiles.id`; `ON DELETE RESTRICT` |
| `added_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |
| `ended_at` | `timestamptz` | Nullable |

**Relationships:** Many-to-many between classes and teacher profiles.

**Indexes:** `(teacher_id, ended_at)`; `(class_id, ended_at)`.

**Constraints:** Teacher must have an active teacher membership in the class's academy; one active row per class/teacher.

### 1.8 `class_students`

Student membership in a class.

| Column | Type | Details |
| --- | --- | --- |
| `class_id` | `uuid` | Composite primary key; FK to `classes.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | Composite primary key; FK to `profiles.id`; `ON DELETE RESTRICT` |
| `added_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |
| `ended_at` | `timestamptz` | Nullable |

**Relationships:** Many-to-many between classes and student profiles.

**Indexes:** `(student_id, ended_at)`; `(class_id, ended_at)`.

**Constraints:** Student must have an active student membership in the class's academy; one active row per class/student.

## 2. Quran Reference and Media

### 2.1 `quran_surahs`

Stable verified Surah reference data.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `smallint` | Primary key; canonical Surah number |
| `name_arabic` | `text` | Required |
| `name_transliteration` | `text` | Required |
| `ayah_count` | `smallint` | Required |
| `reference_version` | `text` | Required |
| `created_at` | `timestamptz` | Required |

**Relationships:** One Surah has many Ayahs and audio references.

**Indexes:** Unique `(reference_version, id)`; unique transliteration if product policy permits.

**Constraints:** `id` between 1 and 114; `ayah_count > 0`; reference data is immutable after publication.

### 2.2 `quran_ayahs`

Verified text for one Ayah.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `surah_id` | `smallint` | FK to `quran_surahs.id`; `ON DELETE RESTRICT` |
| `ayah_number` | `smallint` | Required |
| `text_arabic` | `text` | Required |
| `reference_version` | `text` | Required |
| `text_hash` | `text` | Required integrity hash |
| `created_at` | `timestamptz` | Required |

**Relationships:** Many Ayahs belong to one Surah; referenced by passage-range tables.

**Indexes:** Unique `(reference_version, surah_id, ayah_number)`; index `(surah_id, ayah_number)`.

**Constraints:** `ayah_number > 0`; text non-empty; version must match a valid reference release; published text is immutable.

### 2.3 `quran_audio`

Approved audio asset metadata for a Surah/Ayah or provider reference.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `surah_id` | `smallint` | FK to `quran_surahs.id`; `ON DELETE RESTRICT` |
| `ayah_id` | `uuid` | Nullable FK to `quran_ayahs.id`; `ON DELETE RESTRICT` |
| `reciter_name` | `text` | Required |
| `provider` | `text` | Required |
| `storage_path` | `text` | Nullable when external URL is used |
| `external_url` | `text` | Nullable |
| `duration_ms` | `integer` | Nullable |
| `reference_version` | `text` | Required |
| `status` | `text` | Required; `active` or `retired` |
| `created_at` | `timestamptz` | Required |

**Relationships:** Belongs to a Surah and optionally an Ayah; not student-owned.

**Indexes:** `(surah_id, ayah_id, status)`; `(provider, reciter_name)`.

**Constraints:** Exactly one of `storage_path` and `external_url`; `duration_ms > 0` when present; Ayah must belong to `surah_id`.

## 3. Hifz Planning, Progress, and Activity

### 3.1 `daily_hifz_goals`

A student's goal for a calendar day.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `goal_date` | `date` | Required |
| `target_ayah_count` | `smallint` | Nullable |
| `target_minutes` | `integer` | Nullable |
| `target_description` | `text` | Nullable |
| `created_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |

**Relationships:** One student may have one goal per academy and date.

**Indexes:** Unique `(academy_id, student_id, goal_date)`; `(student_id, goal_date DESC)`.

**Constraints:** At least one target is supplied; counts/minutes are non-negative; student and creator are academy members.

### 3.2 `hifz_assignments`

Teacher-created Sabaq, Sabqi, or Manzil assignment definition.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `class_id` | `uuid` | Nullable FK to `classes.id`; `ON DELETE SET NULL` |
| `created_by` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `assignment_type` | `text` | Required; `sabaq`, `sabqi`, or `manzil` |
| `title` | `text` | Required |
| `instructions` | `text` | Nullable |
| `surah_start` | `smallint` | Required |
| `ayah_start` | `smallint` | Required |
| `surah_end` | `smallint` | Required |
| `ayah_end` | `smallint` | Required |
| `assigned_date` | `date` | Required |
| `due_date` | `date` | Required |
| `status` | `text` | Required; `draft`, `published`, `closed`, or `cancelled` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |

**Relationships:** One assignment targets many students through `assignment_targets`; optionally originates from a class.

**Indexes:** `(academy_id, status, due_date)`; `(created_by, status)`; `(class_id, due_date)`; passage lookup on `(surah_start, ayah_start, surah_end, ayah_end)` if needed.

**Constraints:** Valid Quran range; `due_date >= assigned_date`; creator is an authorized teacher/admin; class belongs to same academy; class assignment and target students must be academy-consistent.

### 3.3 `assignment_targets`

Student-specific assignment status, allowing one assignment to target a class and/or individual students without duplicating assignment content.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `assignment_id` | `uuid` | FK to `hifz_assignments.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `status` | `text` | Required; `assigned`, `in_progress`, `completed`, `missed`, or `excused` |
| `started_at` | `timestamptz` | Nullable |
| `completed_at` | `timestamptz` | Nullable |
| `student_note` | `text` | Nullable |
| `updated_at` | `timestamptz` | Required |

**Relationships:** Many-to-many assignment/student resolved by this table.

**Indexes:** Unique `(assignment_id, student_id)`; `(student_id, status, completed_at)`; `(assignment_id, status)`.

**Constraints:** Target student belongs to assignment academy; completion timestamp required for `completed`; status transitions must be controlled; no duplicate target.

### 3.4 `student_hifz_progress`

Current passage-level memorization state, separate from raw activity history.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `surah_id` | `smallint` | FK to `quran_surahs.id`; `ON DELETE RESTRICT` |
| `ayah_id` | `uuid` | FK to `quran_ayahs.id`; `ON DELETE RESTRICT` |
| `status` | `text` | Required; `not_started`, `learning`, `memorized`, or `revision` |
| `confidence_score` | `numeric(5,2)` | Nullable; internal progress indicator, not religious judgment |
| `last_practiced_at` | `timestamptz` | Nullable |
| `last_verified_at` | `timestamptz` | Nullable |
| `last_verified_by` | `uuid` | Nullable FK to `profiles.id` |
| `updated_at` | `timestamptz` | Required |

**Relationships:** One row per student, academy, and Ayah; updated from activity and teacher verification.

**Indexes:** Unique `(academy_id, student_id, ayah_id)`; `(student_id, status)`; `(student_id, last_practiced_at DESC)`.

**Constraints:** Ayah belongs to `surah_id`; score between 0 and 100; verifier must be an authorized teacher/admin; student must be in academy.

### 3.5 `learning_activity`

Append-only record of student practice and learning events.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `activity_type` | `text` | Required; `audio_listen`, `hide_recall`, `write_memory`, `revision`, `quiz`, `assignment`, or `recitation_test` |
| `surah_start` | `smallint` | Nullable |
| `ayah_start` | `smallint` | Nullable |
| `surah_end` | `smallint` | Nullable |
| `ayah_end` | `smallint` | Nullable |
| `assignment_id` | `uuid` | Nullable FK to `hifz_assignments.id` |
| `recitation_test_id` | `uuid` | Nullable FK to `recitation_tests.id` |
| `duration_seconds` | `integer` | Nullable |
| `result_summary` | `jsonb` | Nullable structured activity result |
| `occurred_at` | `timestamptz` | Required |
| `created_at` | `timestamptz` | Required |

**Relationships:** Belongs to a student; optionally links to an assignment or recitation test.

**Indexes:** `(student_id, occurred_at DESC)`; `(student_id, activity_type, occurred_at DESC)`; `(academy_id, occurred_at DESC)`; partial indexes for linked assignment/test IDs.

**Constraints:** At least one source context or passage is supplied; non-negative duration; referenced assignment/test belongs to same student and academy; immutable after creation except privacy redaction policy.

### 3.6 `revision_plans`

A named revision plan for a student, created by a teacher or generated by the system.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `created_by` | `uuid` | Nullable FK to `profiles.id` |
| `source` | `text` | Required; `teacher`, `system`, or `student` |
| `title` | `text` | Required |
| `start_date` | `date` | Required |
| `end_date` | `date` | Nullable |
| `status` | `text` | Required; `draft`, `active`, `completed`, or `archived` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |

**Relationships:** One plan has many revision items.

**Indexes:** `(student_id, status, start_date)`; `(academy_id, status)`.

**Constraints:** End date cannot precede start date; creator is authorized for the student when present; source is controlled.

### 3.7 `revision_plan_items`

One scheduled passage/activity inside a revision plan.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `revision_plan_id` | `uuid` | FK to `revision_plans.id`; `ON DELETE CASCADE` |
| `scheduled_date` | `date` | Required |
| `surah_start` | `smallint` | Required |
| `ayah_start` | `smallint` | Required |
| `surah_end` | `smallint` | Required |
| `ayah_end` | `smallint` | Required |
| `recommended_activity` | `text` | Required; `revision`, `hide_recall`, `write_memory`, `audio`, or `quiz` |
| `reason` | `text` | Nullable explanation |
| `priority` | `smallint` | Required; bounded priority |
| `status` | `text` | Required; `planned`, `started`, `completed`, `skipped`, or `expired` |
| `completed_at` | `timestamptz` | Nullable |
| `source_mistake_id` | `uuid` | Nullable FK to `possible_mistakes.id` |
| `created_at` | `timestamptz` | Required |

**Relationships:** Belongs to one plan; optionally references the mistake that caused a recommendation.

**Indexes:** `(revision_plan_id, scheduled_date)`; `(revision_plan_id, status)`; `(source_mistake_id)`; `(scheduled_date, status)`.

**Constraints:** Valid Quran range; priority bounded; completed status requires `completed_at`; source mistake must belong to the same student as the plan; no duplicate same plan/date/passage/activity unless intentional revisions are supported.

## 4. Recitation, Exams, and Feedback

### 4.1 `recitation_tests`

A student practice or examination recitation session.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `created_by` | `uuid` | FK to `profiles.id`; normally the student or authorized teacher |
| `test_type` | `text` | Required; `practice` or `exam` |
| `surah_start` | `smallint` | Required |
| `ayah_start` | `smallint` | Required |
| `surah_end` | `smallint` | Required |
| `ayah_end` | `smallint` | Required |
| `status` | `text` | Required; `created`, `recorded`, `processing`, `completed`, `failed`, or `cancelled` |
| `started_at` | `timestamptz` | Nullable |
| `submitted_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** One test may have one recording, transcript, many analysis runs, and many possible mistakes.

**Indexes:** `(student_id, created_at DESC)`; `(academy_id, status, created_at DESC)`; `(test_type, status)`.

**Constraints:** Valid Quran range; student belongs to academy; creator is student or authorized teacher/admin; status timestamps must be coherent.

### 4.2 `recitation_recordings`

Private Storage metadata for a recording.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `recitation_test_id` | `uuid` | Unique FK to `recitation_tests.id`; `ON DELETE CASCADE` |
| `storage_bucket` | `text` | Required |
| `storage_path` | `text` | Required; unique |
| `mime_type` | `text` | Required |
| `duration_ms` | `integer` | Nullable |
| `size_bytes` | `bigint` | Nullable |
| `checksum` | `text` | Nullable |
| `consent_confirmed_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |
| `deleted_at` | `timestamptz` | Nullable |

**Relationships:** One-to-one with recitation test; file is in Supabase Storage.

**Indexes:** Unique `storage_path`; `(recitation_test_id)`.

**Constraints:** Positive size/duration when present; approved MIME types; private bucket/path policy; recording cannot be processed without the required consent state.

### 4.3 `recitation_transcripts`

Speech-recognition output for a recording.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `recitation_test_id` | `uuid` | Unique FK to `recitation_tests.id`; `ON DELETE CASCADE` |
| `provider` | `text` | Required |
| `provider_request_id` | `text` | Nullable |
| `transcript_text` | `text` | Nullable on failed recognition |
| `language_code` | `text` | Required |
| `confidence_score` | `numeric(5,2)` | Nullable provider score |
| `status` | `text` | Required; `pending`, `completed`, `failed`, or `incomplete` |
| `raw_metadata` | `jsonb` | Nullable; minimized provider payload |
| `created_at` | `timestamptz` | Required |

**Relationships:** One-to-one with recitation test; one transcript can feed analysis runs.

**Indexes:** Unique `(provider, provider_request_id)` where request ID is present; `(recitation_test_id, status)`.

**Constraints:** Score between 0 and 100 when present; transcript required for completed status; raw metadata must not contain unnecessary personal data.

### 4.4 `ai_analysis_runs`

A server-side comparison attempt against verified Quran text.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `recitation_test_id` | `uuid` | FK to `recitation_tests.id`; `ON DELETE CASCADE` |
| `transcript_id` | `uuid` | FK to `recitation_transcripts.id`; `ON DELETE RESTRICT` |
| `provider` | `text` | Required |
| `model_version` | `text` | Nullable |
| `reference_version` | `text` | Required |
| `status` | `text` | Required; `queued`, `processing`, `completed`, `failed`, or `incomplete` |
| `started_at` | `timestamptz` | Nullable |
| `completed_at` | `timestamptz` | Nullable |
| `raw_metadata` | `jsonb` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** One test can have multiple runs; one run produces possible mistakes.

**Indexes:** `(recitation_test_id, created_at DESC)`; `(status, created_at)`; `(provider, model_version)`.

**Constraints:** Transcript and test must match; completed status requires completion time; this table cannot represent a verified religious judgment.

### 4.5 `possible_mistakes`

An AI-assisted possible detection associated with a test and passage.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `analysis_run_id` | `uuid` | FK to `ai_analysis_runs.id`; `ON DELETE RESTRICT` |
| `recitation_test_id` | `uuid` | FK to `recitation_tests.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `surah_id` | `smallint` | FK to `quran_surahs.id`; `ON DELETE RESTRICT` |
| `ayah_id` | `uuid` | FK to `quran_ayahs.id`; `ON DELETE RESTRICT` |
| `mistake_type` | `text` | Required; `missing`, `wrong`, `extra`, or `sequence` |
| `recognized_text` | `text` | Nullable |
| `expected_text` | `text` | Nullable snapshot/reference text |
| `confidence_score` | `numeric(5,2)` | Nullable |
| `status` | `text` | Required; `unreviewed`, `verified`, `modified`, or `dismissed` |
| `created_at` | `timestamptz` | Required |

**Relationships:** Belongs to one analysis run/test/student/Ayah; may have many verification decisions over time.

**Indexes:** `(student_id, status, created_at DESC)`; `(student_id, ayah_id, created_at DESC)`; `(recitation_test_id)`; `(analysis_run_id)`; `(mistake_type, status)`.

**Constraints:** Test student must equal `student_id`; Ayah must belong to `surah_id`; this record is always a possible detection; status cannot imply certainty without a verification row.

### 4.6 `mistake_verifications`

Immutable or append-only teacher review decision for a possible mistake.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `possible_mistake_id` | `uuid` | FK to `possible_mistakes.id`; `ON DELETE RESTRICT` |
| `teacher_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `decision` | `text` | Required; `verified`, `modified`, or `dismissed` |
| `corrected_type` | `text` | Nullable controlled mistake type |
| `teacher_note` | `text` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** One possible mistake can have a review history; latest valid decision determines current review state.

**Indexes:** `(possible_mistake_id, created_at DESC)`; `(teacher_id, created_at DESC)`; partial index on `decision`.

**Constraints:** Teacher must be authorized for the student at decision time; corrected type required for `modified`; decisions are append-only to preserve audit history.

### 4.7 `exams`

Teacher-created digital Hifz examination.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `class_id` | `uuid` | Nullable FK to `classes.id`; `ON DELETE SET NULL` |
| `created_by` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `title` | `text` | Required |
| `instructions` | `text` | Nullable |
| `surah_start` | `smallint` | Required |
| `ayah_start` | `smallint` | Required |
| `surah_end` | `smallint` | Required |
| `ayah_end` | `smallint` | Required |
| `scheduled_at` | `timestamptz` | Nullable |
| `status` | `text` | Required; `draft`, `published`, `open`, `closed`, or `cancelled` |
| `results_released_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |

**Relationships:** One exam has many attempts; optional class scope.

**Indexes:** `(academy_id, status, scheduled_at)`; `(created_by, status)`; `(class_id, scheduled_at)`.

**Constraints:** Valid passage; creator authorized; class belongs to academy; release time cannot precede exam completion; class-scoped exam targets only class students.

### 4.8 `exam_attempts`

One student's attempt/result for an exam.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `exam_id` | `uuid` | FK to `exams.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `recitation_test_id` | `uuid` | Nullable unique FK to `recitation_tests.id`; `ON DELETE SET NULL` |
| `status` | `text` | Required; `eligible`, `started`, `submitted`, `reviewed`, `released`, or `withdrawn` |
| `score` | `numeric(5,2)` | Nullable; product-defined score, not AI certainty |
| `teacher_feedback` | `text` | Nullable |
| `reviewed_by` | `uuid` | Nullable FK to `profiles.id` |
| `submitted_at` | `timestamptz` | Nullable |
| `reviewed_at` | `timestamptz` | Nullable |
| `released_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** Many attempts belong to one exam; one attempt may link to one recitation test.

**Indexes:** Unique `(exam_id, student_id)` for one official attempt unless retakes are explicitly supported; `(student_id, created_at DESC)`; `(exam_id, status)`.

**Constraints:** Student belongs to exam academy and is eligible for exam; score bounded; reviewed/released statuses require corresponding actor/timestamps; release controlled by teacher/admin.

### 4.9 `feedback`

Teacher feedback attached to an assignment, test, exam attempt, or student.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `author_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `assignment_id` | `uuid` | Nullable FK to `hifz_assignments.id` |
| `recitation_test_id` | `uuid` | Nullable FK to `recitation_tests.id` |
| `exam_attempt_id` | `uuid` | Nullable FK to `exam_attempts.id` |
| `body` | `text` | Required |
| `visibility` | `text` | Required; `private`, `student`, or `student_parent` |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |
| `deleted_at` | `timestamptz` | Nullable |

**Relationships:** One feedback item has one author and one student; it may attach to one source context.

**Indexes:** `(student_id, created_at DESC)`; `(author_id, created_at DESC)`; indexes on each nullable source FK.

**Constraints:** Exactly one source context is required unless explicitly allowing general student feedback; author must be authorized teacher/admin; source and student/academy must agree; body non-empty.

### 4.10 `parent_replies`

Parent response to permitted feedback or report, added because parent replies are a specified database concern.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `feedback_id` | `uuid` | Nullable FK to `feedback.id`; `ON DELETE CASCADE` |
| `weekly_report_id` | `uuid` | Nullable FK to `weekly_reports.id`; `ON DELETE CASCADE` |
| `parent_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `body` | `text` | Required |
| `created_at` | `timestamptz` | Required |
| `updated_at` | `timestamptz` | Required |
| `deleted_at` | `timestamptz` | Nullable |

**Relationships:** Parent replies to either feedback or a weekly report for a linked child.

**Indexes:** `(parent_id, created_at DESC)`; `(student_id, created_at DESC)`; indexes on source FKs.

**Constraints:** Exactly one of `feedback_id` and `weekly_report_id`; parent-child link must be active; source must be visible to that parent; source's student must equal `student_id`; body non-empty.

## 5. Weak Areas, Reports, Achievements, and Notifications

### 5.1 `weak_areas`

Student-level aggregate of a recurring weakness. This is a derived, refreshable record, not the source of truth for mistakes.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `surah_id` | `smallint` | FK to `quran_surahs.id`; `ON DELETE RESTRICT` |
| `ayah_id` | `uuid` | FK to `quran_ayahs.id`; `ON DELETE RESTRICT` |
| `mistake_type` | `text` | Nullable controlled type |
| `occurrence_count` | `integer` | Required |
| `last_occurrence_at` | `timestamptz` | Required |
| `confidence_level` | `text` | Required; `possible` or `teacher_confirmed` |
| `status` | `text` | Required; `active` or `resolved` |
| `calculated_at` | `timestamptz` | Required |

**Relationships:** Derived from possible mistakes and verifications; one row per student/Ayah/type/academy.

**Indexes:** Unique `(academy_id, student_id, ayah_id, mistake_type)` using a normalized null strategy; `(student_id, status, occurrence_count DESC)`; `(ayah_id, status)`.

**Constraints:** Ayah belongs to Surah; occurrence count positive; `teacher_confirmed` requires supporting verified mistakes; aggregates must be recomputable.

### 5.2 `weekly_reports`

A generated parent/teacher progress report for a student and period.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `period_start` | `date` | Required |
| `period_end` | `date` | Required |
| `generated_by` | `uuid` | Nullable FK to `profiles.id` |
| `summary` | `text` | Required |
| `metrics` | `jsonb` | Required report snapshot |
| `status` | `text` | Required; `draft`, `published`, or `archived` |
| `published_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** Belongs to one student and academy; can receive parent replies.

**Indexes:** Unique `(academy_id, student_id, period_start, period_end)`; `(student_id, period_end DESC)`; `(academy_id, status, period_end DESC)`.

**Constraints:** End date is not before start date; period length is bounded by product policy; metrics are a snapshot and must not replace normalized source data; published reports require published timestamp.

### 5.3 `achievement_definitions`

Catalog of achievement rules.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `code` | `text` | Required; unique |
| `name` | `text` | Required |
| `description` | `text` | Required |
| `criteria` | `jsonb` | Required versioned rule configuration |
| `active` | `boolean` | Required |
| `created_at` | `timestamptz` | Required |

**Relationships:** One definition grants many student achievements.

**Indexes:** Unique `code`; partial index on active definitions.

**Constraints:** Code/name non-empty; criteria must include a rule version; definitions are not deleted when already awarded.

### 5.4 `student_achievements`

Achievement awarded to a student.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | FK to `academies.id`; `ON DELETE CASCADE` |
| `student_id` | `uuid` | FK to `profiles.id`; `ON DELETE RESTRICT` |
| `achievement_definition_id` | `uuid` | FK to `achievement_definitions.id`; `ON DELETE RESTRICT` |
| `awarded_at` | `timestamptz` | Required |
| `evidence` | `jsonb` | Required snapshot of qualifying activity |

**Relationships:** Many achievements per student; one catalog definition can apply to many students.

**Indexes:** Unique `(academy_id, student_id, achievement_definition_id)` unless repeatable achievements are introduced; `(student_id, awarded_at DESC)`.

**Constraints:** Student belongs to academy; evidence includes criteria version; achievement is not based solely on unverified AI judgment.

### 5.5 `notifications`

In-app notification addressed to one user.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `academy_id` | `uuid` | Nullable FK to `academies.id`; `ON DELETE CASCADE` |
| `recipient_id` | `uuid` | FK to `profiles.id`; `ON DELETE CASCADE` |
| `notification_type` | `text` | Required; controlled event type |
| `title` | `text` | Required |
| `body` | `text` | Required |
| `entity_type` | `text` | Nullable source entity name |
| `entity_id` | `uuid` | Nullable source entity ID |
| `read_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Required |
| `expires_at` | `timestamptz` | Nullable |

**Relationships:** One recipient receives many notifications; source is polymorphic metadata and must not replace typed source FKs where integrity is required.

**Indexes:** `(recipient_id, read_at, created_at DESC)`; `(academy_id, created_at DESC)`; `(notification_type, created_at DESC)`.

**Constraints:** Title/body non-empty; academy must match recipient's relevant membership when present; entity type must be allow-listed; notification creation must not expose unauthorized source data.

## 6. Audit and Operations

### 6.1 `audit_logs`

Append-only record of security-sensitive and business-critical changes.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `bigint` | Primary key, identity-generated |
| `academy_id` | `uuid` | Nullable FK to `academies.id`; `ON DELETE SET NULL` |
| `actor_id` | `uuid` | Nullable FK to `profiles.id`; `ON DELETE SET NULL` |
| `action` | `text` | Required, such as `create`, `update`, `verify`, `dismiss`, `release`, or `delete` |
| `entity_type` | `text` | Required allow-listed entity name |
| `entity_id` | `uuid` | Required |
| `old_values` | `jsonb` | Nullable redacted snapshot |
| `new_values` | `jsonb` | Nullable redacted snapshot |
| `request_id` | `text` | Nullable correlation ID |
| `ip_hash` | `text` | Nullable privacy-preserving request fingerprint |
| `created_at` | `timestamptz` | Required |

**Relationships:** Optionally belongs to an academy and actor; references changed entities logically because a polymorphic FK cannot enforce multiple entity tables.

**Indexes:** `(academy_id, created_at DESC)`; `(actor_id, created_at DESC)`; `(entity_type, entity_id, created_at DESC)`; `(action, created_at DESC)`.

**Constraints:** Append-only; no update/delete for normal application roles; snapshots must be redacted; entity types and actions must be allow-listed; audit events for teacher verification, result release, membership changes, and private-file access are mandatory.

### 6.2 `notification_deliveries` (optional when external delivery is enabled)

Tracks delivery attempts without duplicating the notification itself.

| Column | Type | Details |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `notification_id` | `uuid` | FK to `notifications.id`; `ON DELETE CASCADE` |
| `channel` | `text` | Required; `email`, `push`, or other approved channel |
| `provider_message_id` | `text` | Nullable |
| `status` | `text` | Required; `queued`, `sent`, `delivered`, `failed`, or `cancelled` |
| `attempted_at` | `timestamptz` | Nullable |
| `error_code` | `text` | Nullable |
| `created_at` | `timestamptz` | Required |

**Relationships:** One notification can have delivery attempts on multiple channels.

**Indexes:** Unique `(notification_id, channel)` for one current delivery record, or `(notification_id, channel, attempted_at)` if retries are retained; `(status, created_at)`.

**Constraints:** Channel is allow-listed; delivery status transitions are controlled; provider IDs are not trusted as user-visible content.

## 7. Cross-Table Constraints and RLS Requirements

Some integrity rules span multiple rows and cannot be expressed by a simple column `CHECK`. They should be enforced through database functions/triggers, carefully controlled RPCs, or server-side Edge Functions in addition to RLS:

- A referenced user must hold the required role membership in the same academy. For example, an assignment creator must be an authorized teacher/admin, and a parent reply author must be an active parent linked to the student.
- A class, assignment, exam, feedback item, report, and student target must all belong to the same academy.
- A class teacher/student membership must agree with the corresponding `academy_memberships` role.
- A teacher verification must be authorized for the student through `teacher_student_links` or an active class relationship at the time of the action.
- A parent may read only records for students in `parent_student_links` with active status and required consent.
- Students may read only their own private recordings, transcripts, tests, mistakes, plans, and progress; parents receive only permitted summaries and released results.
- Academy admins may access academy-scoped records but should not automatically receive unrestricted private recordings or raw provider payloads.
- Service-role processes may bypass RLS only inside narrowly scoped server-side functions, with audit logging and explicit input validation.

## 8. Schema Review and Proposed Corrections

### Normalization Review

- **Source activity versus summaries:** `learning_activity`, `possible_mistakes`, and `mistake_verifications` remain the sources of truth. `student_hifz_progress`, `weak_areas`, `weekly_reports`, and chart aggregates are current states or snapshots and must be recomputable.
- **Assignments versus targets:** Assignment content is stored once in `hifz_assignments`; student-specific status belongs in `assignment_targets`. This avoids copying passage and instruction data for every student.
- **Classes versus relationships:** `class_teachers`, `class_students`, `teacher_student_links`, and `parent_student_links` resolve many-to-many relationships instead of storing arrays of IDs.
- **Notifications versus deliveries:** Notification content is separated from channel-specific delivery attempts.
- **AI versus verification:** Possible AI detections are not overwritten by teacher decisions. `mistake_verifications` preserves review history.

### Missing Foreign Keys Addressed

- Identity records reference `auth.users` through `profiles`.
- Every organization-owned operational table carries an `academy_id` or reaches one through a required parent table.
- Student, teacher, and parent relationships use explicit foreign keys to profiles.
- Passage records use Surah and Ayah foreign keys, with constraints ensuring that an Ayah belongs to the stated Surah.
- Tests, recordings, transcripts, analysis runs, mistakes, verifications, exams, and attempts are linked end to end.
- Parent replies explicitly reference either feedback or weekly reports and the linked child.
- Audit logs retain actor and academy references while avoiding an invalid polymorphic foreign key.

### Duplicate Data Risks and Corrections

- `student_id` appears on some child tables even when it can be reached through a parent record, such as `possible_mistakes` and `learning_activity`. This intentional denormalization improves RLS and indexes, but cross-table checks must ensure it matches the parent test/analysis record.
- Passage start/end fields are repeated on assignments, tests, exams, activity, and revision items. This is intentional because each is a historical or planned snapshot. The final implementation should validate ranges centrally and should not copy full Quran text into these records.
- `expected_text` in `possible_mistakes` is a snapshot for reproducibility, not a second authoritative Quran source. `quran_ayahs` remains canonical.
- `feedback.teacher_feedback` on `exam_attempts` duplicates the general `feedback` table if both are implemented. Recommended correction: choose one approach. Prefer storing reusable and threaded feedback in `feedback`, and remove `teacher_feedback` from `exam_attempts` in the physical schema, or document it as a short immutable exam-result summary.
- `profiles.email` duplicates Supabase Auth email. Recommended correction: treat it as a nullable cached display field or omit it and query Auth only through trusted server-side flows; do not use it as the identity key.
- `weak_areas` and `weekly_reports.metrics` are derived data. Rebuild or version them when source rules change.

### Relationship Problems and Corrections

- A class assignment can target a class and individual students. Recommended correction: define a single target resolution rule before implementation: either materialize all class students into `assignment_targets` at publication, or resolve class membership dynamically. Materialization preserves assignment history; dynamic resolution reflects current membership. For Hifz records, materialization is preferable.
- Teacher authorization can change after a verification or feedback action. Store the action timestamp and audit event, and validate authorization at action time rather than relying only on current membership.
- A student may belong to multiple academies. Every student-owned row therefore needs an academy scope, and RLS must not infer academy from a profile alone.
- Parent replies should not be modeled as unrestricted comments. The source visibility and active parent-child link must be checked on every read/write.
- `exam_attempts` currently permits one attempt per exam/student. If retakes are needed, replace the unique constraint with `(exam_id, student_id, attempt_number)` and add an official-attempt marker; do not silently permit duplicates.
- Parent access to unverified AI details should be decided explicitly. Recommended MVP correction: expose teacher-released summaries and verified results, not raw transcripts or possible detections by default.

### Indexing Requirements

- Add composite indexes matching RLS predicates: academy plus role/status, teacher/student plus active status, and parent/student plus active status.
- Index every high-volume timeline by owner and descending timestamp: activity, tests, mistakes, notifications, feedback, audit logs, and reports.
- Index passage analysis by `(student_id, ayah_id)` to support weak-area calculations and Smart Revision.
- Index processing queues by `(status, created_at)` for transcripts and AI runs.
- Use partial unique indexes for active relationships, active memberships, and non-null provider IDs.
- Use foreign-key indexes on all child-table foreign keys, especially assignment targets, class memberships, test pipeline tables, and parent replies.
- Avoid indexing every JSONB field. Add GIN indexes only for demonstrated query requirements on provider metadata or report criteria.

### Final Recommendations Before SQL

1. Decide whether controlled values will use PostgreSQL enums or text/check constraints.
2. Decide whether `feedback` owns all teacher comments and remove or constrain the exam-attempt summary field.
3. Decide the class-assignment materialization rule.
4. Define the physical passage-range validation strategy, preferably a shared database function or trusted server-side validator.
5. Define retention/deletion rules for recordings, transcripts, raw provider metadata, and audit logs.
6. Define which reports and mistake summaries parents can see before writing RLS policies.
7. Confirm whether exam retakes are required before finalizing the attempt uniqueness constraint.
