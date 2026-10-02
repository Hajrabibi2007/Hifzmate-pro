# HifzMate Pro Development Task Plan

This task plan is based on `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, and `docs/UI.md`. It is implementation planning only. It does not implement application code, create database tables, or modify `src`.

## Planning Rules

- **MVP:** Required for the first working final-year project product.
- **Optional:** Useful if time remains and the MVP is stable.
- **Future:** Deliberately deferred from the first version.
- **Critical:** Blocks core product safety or the main demonstration path.
- Each task should be completed as a small pull request or reviewable change where practical.
- A task is not complete until its acceptance criteria and testing requirements pass.
- Do not begin a dependent task with mock permissions that could later bypass RLS.
- The primary demo path is: authenticated student dashboard -> assignment -> Quran practice -> recitation test -> possible detection -> teacher verification -> Smart Revision -> parent released summary.

## Recommended Two-Person Working Model

- **Developer A:** frontend shell, design system, student workflows, responsive UI.
- **Developer B:** Supabase schema/migrations, Auth/RLS, teacher/parent/admin workflows, Edge Functions.
- Pair on cross-cutting contracts: data types, RLS policies, recitation result shape, and release/verification states.
- Work may be parallelized only after the prerequisite contract is agreed and documented.

## Dependency Order At A Glance

```text
Foundation
  -> database/schema/reference data
  -> Auth/profiles/memberships/RLS
  -> reusable UI/layout
  -> student core learning
  -> activity/progress
  -> recitation pipeline
  -> mistakes/weak areas/Smart Revision
  -> teacher verification/exams/feedback
  -> parent releases/reports
  -> academy analytics
  -> security/testing/deployment
```

# PHASE 1 - Project Foundation

## TASK-001 - Confirm MVP Acceptance Contract

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Convert the PRD's MVP scope into a short demonstrable checklist, including the primary student-teacher-parent flow and explicit AI limitations.
- **Prerequisites/dependencies:** None.
- **Files or modules likely affected:** `docs/PRD.md`, `docs/TASKS.md`, project issue tracker or checklist.
- **Acceptance criteria:** MVP features, deferred features, demo users, and success states are listed; pricing/billing and unsupported Tajweed claims are excluded.
- **Testing requirements:** Review checklist against PRD sections 9 and 11; peer approval from both developers.
- **Priority:** Critical

## TASK-002 - Configure React/Vite Development Baseline

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Verify the existing React/Vite project, scripts, linting, formatting expectations, and environment loading approach.
- **Prerequisites/dependencies:** TASK-001.
- **Files or modules likely affected:** `package.json`, `vite.config.js`, `eslint.config.js`, `.env.example`, `README.md`.
- **Acceptance criteria:** Development, production build, and lint commands are documented and pass; no secrets are committed.
- **Testing requirements:** Run install validation, lint, and production build on a clean checkout.
- **Priority:** Critical

## TASK-003 - Establish Recommended Folder Structure

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Create the frontend, services, feature, shared component, Supabase function, and test ownership structure described in ARCHITECTURE.md.
- **Prerequisites/dependencies:** TASK-002.
- **Files or modules likely affected:** `src/app`, `src/components`, `src/features`, `src/services`, `src/lib`, `src/hooks`, `src/types`, `supabase/functions`, test folders.
- **Acceptance criteria:** Folder ownership is clear; imports do not cross feature boundaries unnecessarily; no database implementation is added by this task.
- **Testing requirements:** Build and lint; verify a sample import from each agreed layer.
- **Priority:** High

## TASK-004 - Define Domain Contracts and Status Vocabulary

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Define shared TypeScript or documented JavaScript contracts for roles, memberships, assignments, tests, possible detections, verification states, reports, and notification states.
- **Prerequisites/dependencies:** TASK-001, TASK-003.
- **Files or modules likely affected:** `src/types`, `src/lib/constants`, `docs/DATABASE.md`, `docs/SECURITY.md`.
- **Acceptance criteria:** Status values match DATABASE.md; AI statuses remain distinct from teacher verification; release states are unambiguous.
- **Testing requirements:** Contract review against database columns and UI badges; invalid status values are rejected by validation helpers.
- **Priority:** Critical

## TASK-005 - Implement Design Tokens and Global Styles

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Establish the dark Islamic green, soft green, cream, white, gold, semantic colors, typography, spacing, radius, shadow, focus, and reduced-motion tokens from UI.md.
- **Prerequisites/dependencies:** TASK-002.
- **Files or modules likely affected:** `src/index.css`, `src/App.css`, font loading configuration, public font assets if licensed.
- **Acceptance criteria:** Tokens are centralized; contrast is checked; responsive spacing and focus styles exist; no purple/default template styling remains.
- **Testing requirements:** Visual review at mobile/tablet/desktop widths; automated lint/build; contrast check for primary controls and status text.
- **Priority:** High

## TASK-006 - Build Reusable UI Primitives

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Create reusable buttons, cards, form fields, badges, progress bars, tables, alerts, skeletons, empty states, error states, modals, and chart containers.
- **Prerequisites/dependencies:** TASK-005.
- **Files or modules likely affected:** `src/components/ui`, `src/components/forms`, `src/components/feedback`, `src/components/charts`.
- **Acceptance criteria:** Components support keyboard focus, loading/disabled states, accessible labels, and stable dimensions; no feature-specific data logic is embedded.
- **Testing requirements:** Component-level interaction tests for focus, disabled, loading, error, modal focus trap, and responsive table behavior.
- **Priority:** High

## TASK-007 - Build Public Layout and Landing Page

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Build the public header, footer, landing page, responsive hero, role summary, workflow preview, and responsible AI statement.
- **Prerequisites/dependencies:** TASK-005, TASK-006.
- **Files or modules likely affected:** `src/features/public`, `src/components/layout`, public assets, router entry.
- **Acceptance criteria:** Landing page has clear Register/Login actions, shows all four target roles, communicates AI limitations, and remains uncluttered on mobile.
- **Testing requirements:** Navigation tests; responsive visual review; keyboard and accessibility review.
- **Priority:** High

## TASK-008 - Add Informational Public Pages

- **Phase:** Phase 1 - Project Foundation
- **Scope:** MVP
- **Description:** Add Features, How It Works, About, Contact, and a non-billing Pricing placeholder using the UI specification.
- **Prerequisites/dependencies:** TASK-007.
- **Files or modules likely affected:** `src/features/public`, route configuration, contact form validation.
- **Acceptance criteria:** Pages describe only PRD-defined capabilities; Pricing contains no invented billing; Contact has loading/error/success states without implementing an unapproved external service.
- **Testing requirements:** Route and form validation tests; verify no payments/subscriptions are implied.
- **Priority:** Medium

# PHASE 2 - Authentication & Roles

## TASK-009 - Establish Supabase Client and Environment Contract

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Configure the public Supabase URL/anonymous key contract and server-side secret locations without exposing service-role or provider keys.
- **Prerequisites/dependencies:** TASK-002, TASK-004.
- **Files or modules likely affected:** `src/lib/supabaseClient`, `.env.example`, deployment secret configuration, Supabase project settings.
- **Acceptance criteria:** Frontend uses only client-safe values; missing configuration fails clearly; service-role keys are absent from bundles and repository.
- **Testing requirements:** Production bundle secret scan; run with missing and valid configuration.
- **Priority:** Critical

## TASK-010 - Create Profiles, Membership, and Relationship Schema

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Implement the approved physical schema for profiles, academies, academy memberships, teacher-student links, parent-student links, classes, and class memberships.
- **Prerequisites/dependencies:** TASK-004, TASK-009; resolve DATABASE.md decisions before implementation.
- **Files or modules likely affected:** `supabase/migrations`, generated types, `docs/DATABASE.md` decision notes.
- **Acceptance criteria:** Foreign keys, active-status constraints, academy consistency, and uniqueness rules are implemented; class assignment materialization decision is recorded.
- **Testing requirements:** Migration test on empty database; constraint tests for cross-academy and wrong-role relationships.
- **Priority:** Critical

## TASK-011 - Implement Login, Register, Recovery, and Logout

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Build Supabase Auth flows with safe errors, loading states, password recovery, session refresh, and logout.
- **Prerequisites/dependencies:** TASK-009, TASK-006.
- **Files or modules likely affected:** `src/features/auth`, `src/services/authService`, route configuration.
- **Acceptance criteria:** Users can sign in/out and recover accounts; generic authentication errors do not enumerate accounts; protected routes wait for session resolution.
- **Testing requirements:** Auth integration tests for success, invalid credentials, recovery, expired session, logout, and duplicate registration.
- **Priority:** Critical

## TASK-012 - Implement Profile and Membership Onboarding

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Create profile completion and invitation/membership activation flows without allowing client-selected roles to grant access.
- **Prerequisites/dependencies:** TASK-010, TASK-011.
- **Files or modules likely affected:** `src/features/auth`, profile service, membership RPC/Edge Function, audit events.
- **Acceptance criteria:** Profile fields save; pending memberships do not grant protected access; activation is authorized and audited.
- **Testing requirements:** Test pending, active, suspended, ended, wrong-academy, and self-role-escalation cases.
- **Priority:** Critical

## TASK-013 - Implement Router, Session Provider, and Route Guards

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Create React Router public/authenticated/role route groups and safe unauthorized/not-found states.
- **Prerequisites/dependencies:** TASK-011, TASK-012.
- **Files or modules likely affected:** `src/app/router`, providers, route guards, layout components.
- **Acceptance criteria:** Users reach only their permitted role shell; route guards never replace backend authorization; unauthorized pages reveal no record existence.
- **Testing requirements:** Route matrix for unauthenticated, each role, multi-academy role, suspended membership, and unauthorized route.
- **Priority:** Critical

## TASK-014 - Implement Role Shells and Navigation

- **Phase:** Phase 2 - Authentication & Roles
- **Scope:** MVP
- **Description:** Build role-specific sidebars, mobile navigation, page headers, notifications entry, profile menu, and sign-out action.
- **Prerequisites/dependencies:** TASK-005, TASK-006, TASK-013.
- **Files or modules likely affected:** `src/components/layout`, role layouts, navigation constants.
- **Acceptance criteria:** Navigation matches UI.md; inaccessible destinations are not exposed; mobile uses compact navigation and preserves page context.
- **Testing requirements:** Keyboard navigation, responsive review, route visibility tests for all roles.
- **Priority:** High

# PHASE 3 - Student Hifz Management

## TASK-015 - Load and Validate Quran Reference Data

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Establish the approved, licensed Quran Surah/Ayah reference version and validation utilities for passage ranges.
- **Prerequisites/dependencies:** TASK-004, TASK-010; confirm source licensing and reference version.
- **Files or modules likely affected:** `supabase/migrations`, seed/import tooling, `src/services/quranService`, validation utilities.
- **Acceptance criteria:** Surahs/Ayahs have stable identifiers and text hashes; invalid ranges are rejected; reference content is immutable after publication.
- **Testing requirements:** Seed integrity checks, Surah/Ayah boundary tests, cross-Surah range tests, and text version checks.
- **Priority:** Critical

## TASK-016 - Build Quran Library and Mushaf Reader

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Build Surah/Ayah selection, verified Arabic text display, passage navigation, and readable Mushaf layout.
- **Prerequisites/dependencies:** TASK-005, TASK-006, TASK-015.
- **Files or modules likely affected:** `src/features/student/mushaf`, Quran service, Arabic font assets.
- **Acceptance criteria:** Student can select and read a valid range; text remains legible and stable on mobile/tablet/desktop; no user-authored Quran text is displayed as reference.
- **Testing requirements:** Range selection tests, Arabic rendering review, keyboard navigation, responsive visual checks.
- **Priority:** Critical

## TASK-017 - Implement Daily Hifz Goals

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Allow the student or authorized teacher workflow to view and manage a daily target using the approved goal rules.
- **Prerequisites/dependencies:** TASK-010, TASK-013, TASK-016.
- **Files or modules likely affected:** `daily_hifz_goals` migration/service, student dashboard, goal components.
- **Acceptance criteria:** One goal per student/academy/date; target count/minutes validate; progress display does not treat no activity as failure.
- **Testing requirements:** RLS ownership tests, duplicate-goal constraint test, timezone/date tests, progress component tests.
- **Priority:** High

## TASK-018 - Implement Teacher Assignments: Sabaq, Sabqi, Manzil

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Enable authorized teachers to create, publish, and close assignment definitions and materialized student targets.
- **Prerequisites/dependencies:** TASK-010, TASK-015, TASK-013.
- **Files or modules likely affected:** assignment migrations/services, teacher assignment forms, assignment target workflow.
- **Acceptance criteria:** Assignment type, valid passage, due dates, class/student scope, and status transitions are enforced; students see only their targets.
- **Testing requirements:** Teacher authorization, cross-academy, wrong-class, duplicate-target, publish, close, and student-read tests.
- **Priority:** Critical

## TASK-019 - Build Student Dashboard and Daily Plan

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Build the dashboard and date-based plan combining goals, assignment targets, revision items, progress snapshot, and permitted notifications.
- **Prerequisites/dependencies:** TASK-017, TASK-018, TASK-014, TASK-006.
- **Files or modules likely affected:** `src/features/student/dashboard`, `dailyPlan`, dashboard services.
- **Acceptance criteria:** Student sees today's actionable work, assignment statuses, goal progress, and safe empty/loading/error states.
- **Testing requirements:** Data aggregation tests, empty/loading/error tests, student-only access tests, mobile layout review.
- **Priority:** Critical

## TASK-020 - Build My Hifz Progress View

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Display passage-level memorization status, last practice, and permitted verification indicators.
- **Prerequisites/dependencies:** TASK-015, TASK-019, progress schema from DATABASE.md.
- **Files or modules likely affected:** `student_hifz_progress` service, `src/features/student/myHifz`.
- **Acceptance criteria:** Student can filter by Surah/status and open a passage practice action; uncertain AI confidence is not shown as correctness.
- **Testing requirements:** Status filter tests, RLS tests, empty/loading/error tests, responsive review.
- **Priority:** High

## TASK-021 - Implement Revision Schedule Foundation

- **Phase:** Phase 3 - Student Hifz Management
- **Scope:** MVP
- **Description:** Create revision plans and dated items for teacher-created or basic system-generated schedules.
- **Prerequisites/dependencies:** TASK-018, TASK-020, TASK-004.
- **Files or modules likely affected:** `revision_plans`, `revision_plan_items`, revision service, Daily Plan UI.
- **Acceptance criteria:** Items have valid passages, activities, dates, priorities, status transitions, and student ownership; source context is retained.
- **Testing requirements:** Passage/date validation, source-student consistency, completion transition, RLS tests.
- **Priority:** High

# PHASE 4 - Learning & Practice

## TASK-022 - Add Approved Quran Audio Playback

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Integrate approved Quran audio metadata and playback with unavailable-audio states.
- **Prerequisites/dependencies:** TASK-015, TASK-016; confirm audio provider/licensing.
- **Files or modules likely affected:** `quran_audio` data/import, audio library, Mushaf components.
- **Acceptance criteria:** Student can play approved audio for the selected range; no public private recording URLs are used; failures are explicit.
- **Testing requirements:** Playback, unavailable asset, browser support, keyboard media control, and mobile tests.
- **Priority:** High

## TASK-023 - Implement Repeat and Loop Controls

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Add repeat-count and loop controls for selected Quran content with stable, accessible audio controls.
- **Prerequisites/dependencies:** TASK-022.
- **Files or modules likely affected:** shared audio player, Mushaf page, learning activity service.
- **Acceptance criteria:** Repeat/loop behavior is predictable, labeled, keyboard accessible, and records permitted listening activity without duplicate spam.
- **Testing requirements:** Unit tests for repeat counts/loop transitions; browser audio tests; screen-reader label review.
- **Priority:** High

## TASK-024 - Implement Hide & Recall Practice

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Add hide/reveal state for selected text and record a practice activity after a meaningful attempt.
- **Prerequisites/dependencies:** TASK-016, TASK-021.
- **Files or modules likely affected:** Mushaf/practice feature, learning activity service.
- **Acceptance criteria:** Text can be hidden and revealed without changing the reference; the student can exit safely; activity is linked to the student and passage.
- **Testing requirements:** State transition tests, activity ownership tests, keyboard and mobile tests.
- **Priority:** High

## TASK-025 - Implement Write from Memory Practice

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Provide a writing surface for recall practice and store the attempt/result summary without replacing verified Quran reference content.
- **Prerequisites/dependencies:** TASK-016, TASK-021.
- **Files or modules likely affected:** practice feature, activity service, validation utilities.
- **Acceptance criteria:** Student can submit a writing attempt; the reference remains authoritative; errors and unsaved input are handled clearly.
- **Testing requirements:** Submission, retry, accessibility, activity ownership, and mobile input tests.
- **Priority:** High

## TASK-026 - Implement Hifz Quiz MVP

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Build a focused quiz flow using selected eligible memorization content, with progress and completion summary.
- **Prerequisites/dependencies:** TASK-016, TASK-020, TASK-025.
- **Files or modules likely affected:** quiz feature, activity service, quiz validation.
- **Acceptance criteria:** Quiz can start, advance, complete, and record activity; no unsupported grading claims are shown.
- **Testing requirements:** Question flow, reload/retry, empty content, completion persistence, and student-only access tests.
- **Priority:** Medium

## TASK-027 - Implement Progress Tracking and Charts

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Build student progress summaries and accessible charts from recorded activity, assignments, goals, revision, and released results.
- **Prerequisites/dependencies:** TASK-017, TASK-018, TASK-021, TASK-023, TASK-024, TASK-025.
- **Files or modules likely affected:** progress service, chart components, student Progress page, dashboard.
- **Acceptance criteria:** Date ranges, units, summaries, chart empty states, and table alternatives are present; AI confidence is not plotted as correctness.
- **Testing requirements:** Aggregation tests, chart accessibility tests, date boundary tests, mobile chart review.
- **Priority:** High

## TASK-028 - Implement Achievements MVP

- **Phase:** Phase 4 - Learning & Practice
- **Scope:** MVP
- **Description:** Define a small versioned achievement catalog and award milestones from valid activity evidence.
- **Prerequisites/dependencies:** TASK-027, TASK-004.
- **Files or modules likely affected:** achievement schema/service, student Achievements page, notification integration if used.
- **Acceptance criteria:** Achievement criteria are explicit and repeat awards are prevented unless intentionally supported; evidence is retained.
- **Testing requirements:** Criteria tests, duplicate award tests, RLS tests, and accessibility review.
- **Priority:** Medium

# PHASE 5 - AI-Assisted Recitation

## TASK-029 - Finalize Recitation Provider and Data-Processing Decision

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP blocker
- **Description:** Select or approve speech-recognition/comparison provider categories, privacy terms, retention, region, cost, supported language, and failure behavior.
- **Prerequisites/dependencies:** TASK-015, TASK-009, security review.
- **Files or modules likely affected:** `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, provider configuration, DPIA/privacy notes.
- **Acceptance criteria:** Provider decision documents what is sent, how long it is retained, how deletion works, and that results are possible detections only.
- **Testing requirements:** Provider sandbox test with non-sensitive sample audio; failure and timeout behavior documented.
- **Priority:** Critical

## TASK-030 - Create Recitation Test Data Flow

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Implement recitation test lifecycle, private recording metadata, transcript status, and analysis run status according to DATABASE.md.
- **Prerequisites/dependencies:** TASK-010, TASK-015, TASK-029.
- **Files or modules likely affected:** recitation migrations/services, generated types, Edge Function contract.
- **Acceptance criteria:** Tests transition through created/recorded/processing/completed/failed states; recording/test/student relationships cannot mismatch.
- **Testing requirements:** State machine, duplicate submission, ownership, cross-academy, and failed-processing tests.
- **Priority:** Critical

## TASK-031 - Build Recitation Test UI and Microphone Access

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Build the three-step Select, Record, Review interface with microphone permission, timer, retry, submit, and accessible status messaging.
- **Prerequisites/dependencies:** TASK-016, TASK-030, TASK-006.
- **Files or modules likely affected:** `src/features/student/recitationTests`, recording components, browser media utilities.
- **Acceptance criteria:** Permission denial, unsupported browser, recording, retry, and upload states are explicit; AI disclaimer is visible before and after recording.
- **Testing requirements:** Browser microphone tests, permission denial tests, keyboard/screen-reader review, mobile viewport test.
- **Priority:** Critical

## TASK-032 - Secure Recording Upload and Storage Policies

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Upload recordings to private Supabase Storage paths bound to the authenticated student's test, with size/type/duration checks.
- **Prerequisites/dependencies:** TASK-030, TASK-031, TASK-029.
- **Files or modules likely affected:** Storage bucket policies, recording service, Edge Function upload validation.
- **Acceptance criteria:** Students upload only their own test recordings; parents/admins cannot read raw audio by default; URLs are short-lived and private.
- **Testing requirements:** Storage policy matrix, guessed-path access test, wrong-student upload test, size/type rejection, signed URL expiry test.
- **Priority:** Critical

## TASK-033 - Integrate Speech Recognition

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Add a server-side speech-recognition job that processes authorized recordings and stores transcript status and minimal metadata.
- **Prerequisites/dependencies:** TASK-029, TASK-030, TASK-032.
- **Files or modules likely affected:** `supabase/functions/recitation-analysis`, transcript service, provider adapter.
- **Acceptance criteria:** API keys remain server-side; completed, incomplete, failed, timeout, and retry states are stored; raw provider data is minimized.
- **Testing requirements:** Mock provider tests, timeout/retry/idempotency tests, webhook signature tests if applicable, secret scan.
- **Priority:** Critical

## TASK-034 - Implement Verified Quran Text Comparison

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Compare a transcript to the selected reference range and return structured possible detections with reference/model metadata.
- **Prerequisites/dependencies:** TASK-015, TASK-033.
- **Files or modules likely affected:** comparison service, analysis Edge Function, possible mistake validation.
- **Acceptance criteria:** Comparison output is never called definitive; selected range and reference version are preserved; malformed provider output is rejected.
- **Testing requirements:** Fixture tests for exact, incomplete, mismatched, reordered, and malformed transcripts.
- **Priority:** Critical

## TASK-035 - Implement Possible Error Classifiers

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Support possible missing-word, wrong-word, extra-word, and sequence issue classifications using transparent output labels.
- **Prerequisites/dependencies:** TASK-034.
- **Files or modules likely affected:** comparison classifier, shared status constants, result UI.
- **Acceptance criteria:** Each classifier emits only a possible detection with source Ayah and status; unsupported cases become incomplete/uncertain rather than forced into a type.
- **Testing requirements:** Fixture tests per error type, false-positive/uncertain cases, UI label tests.
- **Priority:** High

## TASK-036 - Save Possible Mistakes and Build Mistake History

- **Phase:** Phase 5 - AI-Assisted Recitation
- **Scope:** MVP
- **Description:** Persist possible mistakes linked to analysis run/test/student/Ayah and build the student Mistake History page.
- **Prerequisites/dependencies:** TASK-030, TASK-035, TASK-013.
- **Files or modules likely affected:** `possible_mistakes` service, mistake history feature, RLS policies.
- **Acceptance criteria:** Student sees own records with possible/verified/dismissed distinction; source test and passage are available; no AI-only record is shown as confirmed.
- **Testing requirements:** Ownership/RLS tests, filter tests, duplicate analysis handling, empty/loading/error states.
- **Priority:** Critical

# PHASE 6 - Weakness & Smart Revision

## TASK-037 - Build Weak Area Aggregation

- **Phase:** Phase 6 - Weakness & Smart Revision
- **Scope:** MVP
- **Description:** Calculate refreshable weak-area aggregates from possible mistakes and teacher decisions, distinguishing possible from teacher-confirmed signals.
- **Prerequisites/dependencies:** TASK-036, TASK-004.
- **Files or modules likely affected:** weak-area view/function, Weak Areas page, aggregation job.
- **Acceptance criteria:** Recurrence counts are recomputable; no weak area implies religious/Tajweed certainty; student scope and academy scope are enforced.
- **Testing requirements:** Aggregation fixtures, teacher-confirmed versus possible tests, stale/recalculation tests, RLS tests.
- **Priority:** High

## TASK-038 - Implement Transparent Smart Revision Rules

- **Phase:** Phase 6 - Weakness & Smart Revision
- **Scope:** MVP
- **Description:** Generate rule-based revision items from assignments, activity gaps, goals, verified mistakes, and possible weak Ayahs.
- **Prerequisites/dependencies:** TASK-021, TASK-027, TASK-037.
- **Files or modules likely affected:** revision service/job, revision plan items, Smart Revision page.
- **Acceptance criteria:** Every recommendation has a passage, activity, priority, and human-readable reason; source data and student scope are retained.
- **Testing requirements:** Rule fixtures, duplicate recommendation tests, permission tests, explanation rendering tests.
- **Priority:** Critical

## TASK-039 - Add Targeted Revision and Recovery Plan

- **Phase:** Phase 6 - Weakness & Smart Revision
- **Scope:** MVP
- **Description:** Let students start targeted practice from a weakness/mistake and let authorized teachers create recovery plans.
- **Prerequisites/dependencies:** TASK-024, TASK-025, TASK-036, TASK-038.
- **Files or modules likely affected:** practice routes, revision plan service, teacher assignment/revision UI.
- **Acceptance criteria:** A recommendation or mistake opens the correct passage/activity; completion records activity and updates the plan; recovery remains guidance rather than a grade.
- **Testing requirements:** End-to-end targeted-practice test, source linkage, RLS, mobile flow.
- **Priority:** High

## TASK-040 - Implement Re-Test Workflow

- **Phase:** Phase 6 - Weakness & Smart Revision
- **Scope:** Optional for MVP / High if demonstration requires it
- **Description:** Allow a student to retest a targeted passage and compare the new possible detection history without overwriting prior records.
- **Prerequisites/dependencies:** TASK-031, TASK-036, TASK-039.
- **Files or modules likely affected:** recitation test routes, test history, revision item state.
- **Acceptance criteria:** New test is distinct, linked to the revision source, and previous results remain immutable; UI avoids claiming improvement from AI alone.
- **Testing requirements:** Retest identity, history, duplicate submission, privacy, and failure tests.
- **Priority:** Medium

# PHASE 7 - Teacher System

## TASK-041 - Build Teacher Dashboard and Authorized Student Views

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Build teacher dashboard, Students, Classes, and authorized detail views around pending work and assigned scope.
- **Prerequisites/dependencies:** TASK-013, TASK-018, TASK-036, TASK-006.
- **Files or modules likely affected:** `src/features/teacher/dashboard`, `students`, `classes`, services, RLS policies.
- **Acceptance criteria:** Teacher sees only authorized students/classes; pending detections, assignments, and exams are actionable; empty states do not leak academy data.
- **Testing requirements:** Teacher scope matrix, responsive table/card tests, RLS negative tests.
- **Priority:** Critical

## TASK-042 - Complete Teacher Assignment Management

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Complete teacher create/publish/update/close assignment flows and target completion views.
- **Prerequisites/dependencies:** TASK-018, TASK-041.
- **Files or modules likely affected:** assignment forms, target table, feedback entry points.
- **Acceptance criteria:** Sabaq/Sabqi/Manzil workflows are distinct; target materialization is stable; status changes are authorized and audited.
- **Testing requirements:** Form validation, assignment state transitions, class/student scope, audit events.
- **Priority:** High

## TASK-043 - Build Create Exam Flow

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Create the exam stepper for passage, class/student eligibility, schedule, draft, publish, and result release policy.
- **Prerequisites/dependencies:** TASK-015, TASK-041, TASK-004.
- **Files or modules likely affected:** exam schema/service, Create Exam page, eligibility validation.
- **Acceptance criteria:** Teacher can save draft and publish only valid authorized exams; class scope cannot include unauthorized students; release state is explicit.
- **Testing requirements:** Eligibility, cross-academy, passage, publish, cancel, and RLS tests.
- **Priority:** High

## TASK-044 - Build Exam Results and Feedback Flow

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Review attempts, enter teacher result, add feedback, and release outcomes to authorized students/parents.
- **Prerequisites/dependencies:** TASK-043, TASK-041; decide whether general `feedback` owns exam comments.
- **Files or modules likely affected:** exam attempts, feedback service, Exam Results page, release notifications.
- **Acceptance criteria:** Scores/release state cannot be client-forged; students/parents see only released results; feedback visibility is explicit.
- **Testing requirements:** Result tampering, release transition, parent visibility, duplicate submission, audit tests.
- **Priority:** Critical

## TASK-045 - Build Teacher Mistake Analysis

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Provide authorized student/class analysis with possible versus teacher-confirmed filters and passage actions.
- **Prerequisites/dependencies:** TASK-037, TASK-041.
- **Files or modules likely affected:** teacher analysis page, weak-area service, chart/table components.
- **Acceptance criteria:** Teacher can inspect only authorized scope; charts include accessible summaries; raw audio/transcripts are not automatically exposed.
- **Testing requirements:** Scope/RLS tests, aggregate fixture tests, chart accessibility, empty/error states.
- **Priority:** High

## TASK-046 - Build Teacher Verification Workspace

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Build the focused verify/modify/dismiss workflow with audio/transcript access only where authorized, immutable original AI result, and audit event.
- **Prerequisites/dependencies:** TASK-032, TASK-033, TASK-036, TASK-045.
- **Files or modules likely affected:** verification service/RPC, Teacher Verification page, audit logging, Storage access.
- **Acceptance criteria:** Only authorized teachers can decide; decision is explicit and append-only; status labels remain possible/teacher verified/dismissed; duplicate/replay is blocked.
- **Testing requirements:** Positive and negative permission tests, concurrency/conflict test, audit test, Storage access test, UI confirmation test.
- **Priority:** Critical

## TASK-047 - Build Teacher Feedback and Reports

- **Phase:** Phase 7 - Teacher System
- **Scope:** MVP
- **Description:** Build feedback composer, visibility controls, student/class report preview, and publication/release states.
- **Prerequisites/dependencies:** TASK-044, TASK-045, TASK-046; resolve feedback duplication.
- **Files or modules likely affected:** feedback/report services, Teacher Feedback and Reports pages, report generation job.
- **Acceptance criteria:** Feedback visibility is respected; reports identify scope/period; partial reports cannot be published as complete.
- **Testing requirements:** Visibility matrix, report scope, sanitization, publication, and parent-release tests.
- **Priority:** High

# PHASE 8 - Parent System

## TASK-048 - Implement Secure Child-Linking Workflow

- **Phase:** Phase 8 - Parent System
- **Scope:** MVP
- **Description:** Build pending parent-child link request, approval, consent, activation, suspension, and unlink flows.
- **Prerequisites/dependencies:** TASK-010, TASK-012, TASK-013.
- **Files or modules likely affected:** parent-link service/RPC, parent pages, academy membership workflow, audit logs.
- **Acceptance criteria:** Parent cannot self-link arbitrary child; link requires permitted approval/consent; ended links immediately fail protected reads.
- **Testing requirements:** Link abuse, wrong academy, sibling isolation, consent withdrawal, stale notification, and audit tests.
- **Priority:** Critical

## TASK-049 - Build Parent Dashboard and Child Progress

- **Phase:** Phase 8 - Parent System
- **Scope:** MVP
- **Description:** Build parent dashboard and progress pages using released summaries and linked-child scope.
- **Prerequisites/dependencies:** TASK-048, TASK-027, TASK-044, TASK-047.
- **Files or modules likely affected:** `src/features/parent/dashboard`, `children`, progress/report services.
- **Acceptance criteria:** Parent can switch only between linked children; no raw recordings, transcripts, private notes, or unreviewed AI details appear by default.
- **Testing requirements:** Parent-child RLS tests, multi-child confusion tests, released/unreleased result tests, responsive review.
- **Priority:** High

## TASK-050 - Build Parent Revision Activity, Results, Feedback, and Replies

- **Phase:** Phase 8 - Parent System
- **Scope:** MVP
- **Description:** Display permitted revision summaries, released exam results, visible feedback, and parent replies with source validation.
- **Prerequisites/dependencies:** TASK-048, TASK-044, TASK-047.
- **Files or modules likely affected:** parent activity/results/feedback pages, `parent_replies` service.
- **Acceptance criteria:** Parent can read only linked-child permitted records; replies match source visibility and child; duplicate/unauthorized replies are rejected.
- **Testing requirements:** Visibility matrix, parent reply validation, content sanitization, duplicate submission, mobile tests.
- **Priority:** High

## TASK-051 - Build Weekly Reports and Parent Notifications

- **Phase:** Phase 8 - Parent System
- **Scope:** MVP
- **Description:** Generate/publish weekly reports and show parent notifications for released reports, results, and feedback.
- **Prerequisites/dependencies:** TASK-047, TASK-049, TASK-050, TASK-054.
- **Files or modules likely affected:** weekly report job/service, parent Reports/Notifications pages, notification service.
- **Acceptance criteria:** Reports have a fixed period and publication state; parent receives only linked-child permitted events; queued notifications are safe after unlinking.
- **Testing requirements:** Period generation, publication, link removal, notification recipient, idempotency, and privacy tests.
- **Priority:** Medium

# PHASE 9 - Academy System

## TASK-052 - Build Academy Dashboard and Operational Metrics

- **Phase:** Phase 9 - Academy System
- **Scope:** MVP
- **Description:** Build academy dashboard with academy-scoped counts, class participation, assignment completion, exam status, and operational notifications.
- **Prerequisites/dependencies:** TASK-010, TASK-018, TASK-027, TASK-043, TASK-013.
- **Files or modules likely affected:** academy dashboard, aggregate queries/views, chart components.
- **Acceptance criteria:** Metrics are academy-scoped; raw recordings/transcripts are excluded; empty and insufficient-data states are clear.
- **Testing requirements:** Multi-academy isolation, aggregate correctness, RLS tests, chart accessibility.
- **Priority:** High

## TASK-053 - Build Academy Teacher, Student, and Class Management

- **Phase:** Phase 9 - Academy System
- **Scope:** MVP
- **Description:** Provide authorized membership and class management using audited workflows and no self-escalation.
- **Prerequisites/dependencies:** TASK-010, TASK-012, TASK-048.
- **Files or modules likely affected:** academy teachers/students/classes pages, membership/class services, audit logs.
- **Acceptance criteria:** Admin can manage only own academy; role changes and class membership changes are audited; relationship consistency is preserved.
- **Testing requirements:** Cross-academy, wrong-role, suspension, active relationship, and audit tests.
- **Priority:** High

## TASK-054 - Build Academy Exams, Reports, Analytics, and Settings

- **Phase:** Phase 9 - Academy System
- **Scope:** MVP for basic views; advanced analytics optional
- **Description:** Add academy exam oversight, basic reports, analytics charts, and permitted settings without exposing private audio or raw AI data.
- **Prerequisites/dependencies:** TASK-043, TASK-047, TASK-052, TASK-053.
- **Files or modules likely affected:** academy exams/reports/analytics/settings pages, aggregate services, chart components.
- **Acceptance criteria:** Basic academy metrics and reports work; filters preserve academy scope; settings cannot grant privileges or expose secrets.
- **Testing requirements:** RLS tests, aggregate cross-checks, settings authorization tests, mobile/tablet chart tests.
- **Priority:** Medium

# PHASE 10 - Notifications & Supporting Features

## TASK-055 - Implement In-App Notifications

- **Phase:** Phase 10 - Notifications & Supporting Features
- **Scope:** MVP
- **Description:** Implement recipient-scoped notifications, read state, source navigation, minimal content, and role-specific event creation.
- **Prerequisites/dependencies:** TASK-013, TASK-044, TASK-046, TASK-047.
- **Files or modules likely affected:** notification service, shared notification center, notification table/RLS.
- **Acceptance criteria:** Users read only their own permitted notifications; source navigation re-checks authorization; raw audio/transcript/secret content is never included.
- **Testing requirements:** Recipient isolation, role event, read state, stale link, duplicate event, and mobile tests.
- **Priority:** High

## TASK-056 - Add Search and Filters to High-Value Lists

- **Phase:** Phase 10 - Notifications & Supporting Features
- **Scope:** MVP for Students/Assignments/Exams/Mistakes; optional elsewhere
- **Description:** Add scoped search and filters to student, assignment, exam, mistake, notification, and report lists.
- **Prerequisites/dependencies:** Relevant list pages and RLS policies.
- **Files or modules likely affected:** list features, query services, filter components, database indexes.
- **Acceptance criteria:** Search never crosses authorization scope; filter state is stable on mobile; no enumeration of unauthorized records.
- **Testing requirements:** Query scope, filter combinations, pagination/incremental loading, empty state, performance checks.
- **Priority:** Medium

## TASK-057 - Complete Shared Loading, Empty, Error, and Unauthorized States

- **Phase:** Phase 10 - Notifications & Supporting Features
- **Scope:** MVP
- **Description:** Apply the UI.md state contract consistently across public, student, teacher, parent, and admin pages.
- **Prerequisites/dependencies:** All page tasks as each page lands.
- **Files or modules likely affected:** shared feedback components and all feature pages.
- **Acceptance criteria:** No page shows blank failures; errors preserve recoverable input; unauthorized states do not reveal record existence; stale data is labeled.
- **Testing requirements:** Forced API failure, slow network, empty fixtures, expired session, and unauthorized route tests.
- **Priority:** High

# PHASE 11 - Security & Testing

## TASK-058 - Implement and Review Supabase RLS Policies

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Implement deny-by-default RLS for private tables and relationship-aware policies for all four roles.
- **Prerequisites/dependencies:** TASK-010, TASK-012, all tables used by MVP workflows.
- **Files or modules likely affected:** Supabase migrations/policies, helper functions, generated types, security tests.
- **Acceptance criteria:** Student own-data, parent linked-child, teacher authorized-scope, and admin own-academy rules are enforced for select/insert/update/delete.
- **Testing requirements:** Automated negative tests for ID substitution, cross-academy access, role escalation, ended links, class changes, and released/unreleased data.
- **Priority:** Critical

## TASK-059 - Secure Storage and Edge Function Policies

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Review private audio bucket policies, signed URL behavior, server-side provider calls, webhook validation, and service-role isolation.
- **Prerequisites/dependencies:** TASK-032, TASK-033, TASK-058.
- **Files or modules likely affected:** Storage policies, Edge Functions, deployment secrets, provider adapters.
- **Acceptance criteria:** No service-role/provider key appears in frontend; unauthorized users cannot upload/read/delete audio; callbacks are authenticated and idempotent.
- **Testing requirements:** Bundle secret scan, guessed path tests, signed URL expiry, provider failure, webhook replay, and rate-limit tests.
- **Priority:** Critical

## TASK-060 - Test Authentication and Authorization End to End

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Build a role matrix test suite covering authentication lifecycle and all documented permission boundaries.
- **Prerequisites/dependencies:** TASK-011, TASK-013, TASK-048, TASK-058.
- **Files or modules likely affected:** integration/e2e tests, test fixtures, seed/demo data.
- **Acceptance criteria:** Every role has positive and negative tests; suspended/ended membership and parent/teacher unlink cases deny access immediately.
- **Testing requirements:** Login/register/logout/recovery, multi-academy, parent linking, teacher scope, result release, and unauthorized navigation tests.
- **Priority:** Critical

## TASK-061 - Validate Forms, State Transitions, and Data Integrity

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Test passage ranges, dates, statuses, scores, file metadata, feedback visibility, assignment targets, exam release, and verification transitions.
- **Prerequisites/dependencies:** TASK-004, TASK-010, feature forms.
- **Acceptance criteria:** Invalid input is rejected before write; server/database validation remains authoritative; duplicate submissions are safe.
- **Testing requirements:** Unit, integration, transaction, idempotency, and concurrency tests.
- **Priority:** High

## TASK-062 - Test AI Result and Teacher Verification Flow

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Verify the full pipeline from recording through possible detection, student display, teacher decision, derived weak area, and revision recommendation.
- **Prerequisites/dependencies:** TASK-036, TASK-037, TASK-038, TASK-046.
- **Acceptance criteria:** AI-only records stay possible; teacher decision is append-only/audited; parent view follows release rules; no result says 100% accurate or guaranteed.
- **Testing requirements:** Fixture/provider mocks for all detection types, incomplete/failed analysis, unauthorized teacher, replay, concurrent review, parent privacy, and recalculation.
- **Priority:** Critical

## TASK-063 - Run Responsive and Accessibility Testing

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Test public, student, teacher, parent, and admin flows across mobile, tablet, and desktop with keyboard and assistive technology checks.
- **Prerequisites/dependencies:** TASK-006, TASK-014, page tasks.
- **Acceptance criteria:** No overlap or unreadable text; touch targets are usable; tables/charts transform; focus and status announcements work.
- **Testing requirements:** Browser viewport matrix, keyboard-only pass, screen-reader spot checks, contrast checks, reduced-motion check.
- **Priority:** High

## TASK-064 - Run Browser, Performance, and Error Regression Tests

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Test supported browsers, slow network, failed audio/provider states, chart rendering, route transitions, and production build behavior.
- **Prerequisites/dependencies:** TASK-057, TASK-059, TASK-063.
- **Acceptance criteria:** Critical user journeys work in supported browsers; errors are recoverable; no console errors or broken loading states remain in the demo path.
- **Testing requirements:** Browser matrix, throttled-network tests, production build smoke test, error monitoring review, performance spot checks.
- **Priority:** High

## TASK-065 - Fix and Triage Defects Before Release

- **Phase:** Phase 11 - Security & Testing
- **Scope:** MVP
- **Description:** Classify defects by security, data integrity, core workflow, accessibility, visual, and optional scope; fix blockers first.
- **Prerequisites/dependencies:** TASK-058 through TASK-064.
- **Files or modules likely affected:** Defect-specific modules only.
- **Acceptance criteria:** No open Critical security/data-loss defects; core demo path passes; deferred issues are documented rather than silently ignored.
- **Testing requirements:** Re-run the failing regression test for every fix and the full MVP smoke suite before closure.
- **Priority:** Critical

# PHASE 12 - Deployment & Presentation

## TASK-066 - Prepare Production Build and Environment Configuration

- **Phase:** Phase 12 - Deployment & Presentation
- **Scope:** MVP
- **Description:** Configure production build, client-safe variables, server-side secrets, Supabase project settings, redirect URLs, and database backup expectations.
- **Prerequisites/dependencies:** TASK-002, TASK-009, TASK-059, TASK-065.
- **Files or modules likely affected:** deployment config, `.env.example`, Supabase settings, CI configuration, README.
- **Acceptance criteria:** Production build succeeds; secrets are managed outside the bundle; Auth redirects and Storage policies use production domains.
- **Testing requirements:** Clean production build, secret scan, deployment smoke test, Auth redirect test, RLS smoke test.
- **Priority:** Critical

## TASK-067 - Deploy MVP to a Staging/Presentation Environment

- **Phase:** Phase 12 - Deployment & Presentation
- **Scope:** MVP
- **Description:** Deploy the frontend, Supabase project/functions, reference data, migrations, and safe configuration to a controlled environment.
- **Prerequisites/dependencies:** TASK-066.
- **Files or modules likely affected:** hosting configuration, Supabase deployment, CI/CD workflow.
- **Acceptance criteria:** Public pages load; each demo role can sign in; core student-teacher-parent flow works with private data boundaries.
- **Testing requirements:** Remote smoke tests for all roles, audio upload, analysis mock/approved provider, RLS, and result release.
- **Priority:** Critical

## TASK-068 - Create Sanitized Demo Data

- **Phase:** Phase 12 - Deployment & Presentation
- **Scope:** MVP
- **Description:** Create fictional demo academy, users, classes, assignments, progress, tests, possible detections, teacher verification, reports, and notifications.
- **Prerequisites/dependencies:** TASK-010, TASK-018, TASK-044, TASK-046, TASK-048, TASK-067.
- **Files or modules likely affected:** seed/demo scripts, deployment documentation, test fixtures.
- **Acceptance criteria:** Demo data is fictional, reproducible, minimum necessary, and demonstrates all four roles without real student recordings or personal data.
- **Testing requirements:** Verify demo login, role scope, no cross-account leakage, reset/reseed behavior, and representative empty states.
- **Priority:** High

## TASK-069 - Run Final MVP Acceptance Test

- **Phase:** Phase 12 - Deployment & Presentation
- **Scope:** MVP
- **Description:** Execute the end-to-end final-year project acceptance script from public landing through role workflows and security checks.
- **Prerequisites/dependencies:** TASK-067, TASK-068.
- **Acceptance criteria:** Every MVP item in TASK-001 has evidence; critical states and AI disclaimers are visible; known limitations are documented.
- **Testing requirements:** Two-person walkthrough, browser matrix smoke test, permission negative test, and final build verification.
- **Priority:** Critical

## TASK-070 - Prepare Final Presentation and Technical Evidence

- **Phase:** Phase 12 - Deployment & Presentation
- **Scope:** MVP
- **Description:** Prepare a concise presentation showing problem, solution, architecture, database, security, UI, demo flow, AI limitations, testing evidence, and future scope.
- **Prerequisites/dependencies:** TASK-069.
- **Files or modules likely affected:** presentation materials, README, demo script, architecture screenshots.
- **Acceptance criteria:** Presentation includes the primary demo path, explicit possible-detection language, RLS/security evidence, and no unsupported claims.
- **Testing requirements:** Full timed rehearsal with fallback screenshots/video or seeded offline states.
- **Priority:** High

# Optional and Future Backlog

These tasks should not delay the MVP:

- **TASK-071 - Optional External Notification Delivery:** Add email/push delivery and `notification_deliveries` with provider privacy review. Depends on TASK-055. **Priority: Low.**
- **TASK-072 - Optional Advanced Academy Analytics:** Add richer cohort trends and configurable dashboards after basic analytics are stable. Depends on TASK-054. **Priority: Low.**
- **TASK-073 - Future Adaptive Revision Algorithm:** Replace or augment transparent MVP rules with evaluated adaptive recommendations. Requires measurable data and teacher review. Depends on TASK-038. **Priority: Low.**
- **TASK-074 - Future Offline/Low-Connectivity Support:** Design synchronization and conflict handling; explicitly outside MVP. Depends on stable online workflows. **Priority: Low.**
- **TASK-075 - Future Advanced Tajweed Assistance:** Only pursue after qualified review, validation, privacy review, and explicit product approval; never present as guaranteed judgment. Depends on TASK-029 and independent evaluation. **Priority: Low.**
- **TASK-076 - Future Native Mobile Applications:** Defer until responsive web workflows are stable. **Priority: Low.**

# Plan Review

## 1. Missing Tasks

The plan includes the major implementation tasks implied by all five documents. The following decisions remain prerequisites rather than omitted work:

- Confirm the licensed Quran text/audio source and reference version before seeding data.
- Decide exam retake behavior before finalizing exam attempt uniqueness.
- Decide whether `feedback` or `exam_attempts.teacher_feedback` owns exam comments.
- Define recording/transcript retention, consent withdrawal, deletion, and third-party processing region before real audio use.
- Define the exact parent visibility policy for possible detections versus teacher-released summaries.
- Confirm whether Contact messages require an external delivery provider; the current plan keeps it unimplemented.

## 2. Dependency Problems Checked

- Authentication now follows client configuration and identity schema, and role pages follow session/route guards.
- Student feature work follows Quran reference data and assignment/progress contracts.
- AI work follows private Storage, recitation data lifecycle, and provider/privacy decisions.
- Weak Areas and Smart Revision follow persisted mistakes and activity rather than mock AI data.
- Teacher verification follows AI result persistence and authorization.
- Parent reporting follows result release, feedback visibility, and secure child linking.
- Academy analytics follows academy-scoped source data and RLS.
- Final deployment follows security and regression testing.

Potential dependency risks to resolve before implementation:

- Do not implement teacher/admin pages against unrestricted mock data while RLS is unfinished.
- Do not display AI results before the possible-detection status contract is finalized.
- Do not build parent pages before released-result and parent-link policies are tested.
- Do not use real audio before provider retention and Storage policies are approved.

## 3. Security-Related Tasks Checked

Security work is explicitly represented in TASK-009, TASK-010, TASK-012, TASK-013, TASK-030, TASK-032, TASK-033, TASK-044, TASK-046, TASK-048, TASK-058, TASK-059, TASK-060, TASK-061, TASK-062, TASK-066, and TASK-069.

The plan covers:

- Supabase Auth and session lifecycle.
- Role and academy isolation.
- Student, teacher, parent, and admin negative permissions.
- Parent-child linking and consent.
- Teacher-student/class authorization.
- RLS and Storage policy testing.
- Service-role and provider secret isolation.
- Signed URLs and private audio.
- AI possible-detection labeling and teacher verification.
- Audit events, idempotency, rate limits, input validation, and safe notifications.

## 4. Tasks That May Be Too Large

The following are intentionally bounded, but should be split further if the team cannot review them in one change:

- **TASK-010:** Split into identity/academy schema and class/relationship schema.
- **TASK-018:** Split assignment definition/publishing from assignment target completion.
- **TASK-019:** Split dashboard aggregation from Daily Plan interaction.
- **TASK-030:** Split database lifecycle from server-side processing contract.
- **TASK-046:** Split verification UI from verification RPC/audit implementation.
- **TASK-054:** Split academy exams/reports from analytics/settings.
- **TASK-058:** Split RLS helper functions, role policies, and data-domain policies.
- **TASK-064:** Split browser compatibility from performance/error regression if the test matrix becomes large.
- **TASK-069:** Split acceptance walkthrough from defect triage if the demo reveals new blockers.

## 5. Contradictions

1. **Pricing:** UI.md requests a Pricing page, while PRD.md excludes payments, subscriptions, invoicing, and financial management from version one. TASK-008 therefore specifies an informational placeholder only.
2. **Parent AI visibility:** The PRD requires parent progress/results/feedback but does not require raw AI visibility. SECURITY.md and UI.md restrict parents to released summaries and verified outcomes by default.
3. **Academy admin raw data:** Architecture/DATABASE allow academy analytics but SECURITY restricts unrestricted recordings, transcripts, and provider payloads. TASK-052 and TASK-054 preserve aggregate-only admin views.
4. **Feedback ownership:** DATABASE.md identifies a duplicate between `exam_attempts.teacher_feedback` and `feedback`. TASK-044/TASK-047 require a decision before implementation.
5. **Assignment class targeting:** DATABASE.md leaves dynamic versus materialized class targets open. TASK-018 requires a decision; materialization at publication is recommended for stable history and authorization.
6. **Exam retakes:** DATABASE.md allows the possibility of future retakes but currently favors one attempt. TASK-043/TASK-044 must finalize this before migrations.
7. **Advanced features:** Future scope includes offline support, advanced Tajweed assistance, native apps, richer analytics, and external delivery. They are explicitly separated from the MVP backlog.

No application code, database tables, SQL, migrations, or `src` files were created or modified by this task plan.
