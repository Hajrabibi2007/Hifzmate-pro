# HifzMate Pro Development Instructions

These instructions apply to development work in the HifzMate Pro project. They are permanent project guidance and must be followed together with the current documentation in `docs/`.

## 1. Project Context

HifzMate Pro is a final-year BSCS web application for Hifz management, learning, revision, and AI-assisted recitation examination.

The product serves four roles:

- Student
- Teacher
- Parent
- Academy Admin

The first version must remain realistic for a two-person final-year BSCS team. The core product is learning, revision, assessment, teacher verification, parent monitoring, and academy-scoped management. AI recitation is assistive and never authoritative.

## 2. Documentation First

Before implementing any feature:

- Read `docs/PRD.md` for product requirements.
- Read `docs/ARCHITECTURE.md` for architecture decisions.
- Read `docs/DATABASE.md` before database-related changes.
- Read `docs/SECURITY.md` before authentication, authorization, or data-access changes.
- Read `docs/UI.md` before major UI changes.
- Read `docs/TASKS.md` before starting a development task.

Use the documentation as the controlling source for scope, roles, data boundaries, UI behavior, and AI language. If the documents leave a decision open, pause and identify the decision before implementation.

## 3. Task Discipline

- Implement only the requested `TASK-###`.
- Do not implement future tasks automatically.
- Do not expand the scope without approval.
- If a task is too large, explain why and propose smaller tasks.
- Do not silently change requirements.
- Follow task prerequisites and do not bypass unfinished security or data contracts with unrestricted mock behavior.
- Complete the task's acceptance criteria and testing requirements before considering it done.

## 4. Code Quality

- Use the React + Vite architecture defined by the project documentation.
- Use reusable components.
- Keep components modular and focused.
- Avoid unnecessary duplicate code.
- Use clear and consistent naming.
- Keep business logic separate from UI where appropriate.
- Follow the existing project structure and local conventions.
- Prefer existing project utilities and patterns over new abstractions.
- Keep changes minimal and directly related to the current task.
- Do not add comments that merely narrate obvious code; add only short comments that clarify non-obvious logic.

## 5. UI Rules

- Follow `docs/UI.md`.
- Maintain the HifzMate Pro design system.
- Keep the interface responsive across mobile, tablet, and desktop.
- Keep the UI clean, calm, readable, and professional.
- Use the documented dark Islamic green, soft green, cream, white, and restrained gold palette.
- Do not introduce random colors, layouts, typography, or design systems.
- Use reusable buttons, cards, forms, badges, progress indicators, tables, alerts, modals, loading states, empty states, and error states.
- Maintain keyboard access, visible focus, readable contrast, clear labels, accessible status messages, and reduced-motion behavior.
- Keep Quran/Mushaf text legible and visually prioritized.
- Do not use color alone to communicate status.
- Do not present AI confidence as student correctness or Tajweed accuracy.

## 6. Database Rules

- Follow `docs/DATABASE.md`.
- Do not change database structure without reviewing the documented schema and its open decisions.
- Use proper relationships and foreign keys.
- Avoid duplicate data and preserve the documented distinction between source records and derived summaries.
- Use appropriate indexes and constraints.
- Preserve academy scope on organization-owned records.
- Validate cross-table relationships such as student/academy, teacher/class, parent/child, Ayah/Surah, and test/recording/transcript.
- Keep teacher verification history and audit records append-only where documented.
- Do not create database tables, migrations, or schema changes unless the requested task explicitly authorizes them.

## 7. Security Rules

- Follow `docs/SECURITY.md`.
- Never expose passwords, API keys, database credentials, Supabase service-role keys, or provider secrets in frontend code, public assets, browser storage, logs, or client bundles.
- Use environment variables and the deployment secret manager for secrets.
- Treat public Supabase client configuration as non-privileged and keep Row Level Security enabled.
- Respect role-based permissions.
- Respect Supabase Row Level Security and private Storage policies.
- Students must access only their own authorized data.
- Parents must access only data for their actively linked child and permitted released content.
- Teachers must access only authorized students and classes in the relevant academy.
- Academy Admins must access only data belonging to their academy and documented administrative scope.
- Frontend route guards improve navigation but never replace backend authorization.
- Re-check authorization at the time of every sensitive read or write.
- Do not expose raw recordings, transcripts, provider payloads, private teacher notes, or audit logs unless the documented policy explicitly permits it.
- Audit security-sensitive changes, relationship changes, result release, private-file access, and teacher verification.

## 8. AI Recitation Rules

- AI recitation is AI-assisted.
- Never claim 100% accuracy.
- Never claim perfect Tajweed detection.
- Treat detected mistakes as possible detections.
- Use explicit labels such as `AI-assisted possible detection`, `Transcript may be incomplete`, and `Teacher verification required`.
- Store AI results separately from teacher verification.
- Preserve the original AI result and its provider/reference metadata.
- Allow authorized teachers to confirm, reject, modify, or comment on AI-detected possible mistakes through an audited workflow.
- Do not allow AI-only output to become a guaranteed grade, religious judgment, or final Tajweed decision.
- Do not expose unsupported or uncertain provider output as a definitive result.
- Handle microphone denial, upload failure, provider failure, incomplete transcripts, and uncertain comparisons explicitly.

## 9. Privacy

- Protect student, parent, teacher, and academy information.
- Do not expose private user information unnecessarily.
- Follow the documented access rules in `docs/SECURITY.md`.
- Minimize collection, storage, logging, and external sharing of personal data, audio, transcripts, and provider metadata.
- Do not place sensitive academic details in external notification text.
- Keep parent views limited to linked-child, released, and permitted summaries.
- Use fictional or sanitized data for development and presentations.
- Follow documented retention, deletion, consent, and third-party processing decisions before using real student recordings.

## 10. Testing

After completing a task:

- Run the appropriate development and build checks.
- Check for compile errors.
- Check for runtime errors.
- Check browser console errors where applicable.
- Test the feature related to the current task.
- Test loading, empty, error, unauthorized, and success states where relevant.
- Test responsive behavior for UI changes.
- Test permission boundaries for authentication, authorization, data access, or Storage changes.
- Fix only issues related to the current task.
- Re-run the focused failing check after each related fix.
- Do not dismiss a security or data-integrity failure as a UI issue.

## 11. Change Control

Before major changes:

- Explain the implementation plan.
- List files or modules that will be changed.
- Mention important risks and affected contracts.
- Ask for approval if the change affects architecture, database structure, security boundaries, RLS, Storage, external providers, or the documented MVP scope.
- Update the relevant documentation only when the task or approval includes that documentation change.
- Never silently rewrite architecture, schema, permission, or AI behavior.

## 12. No Unauthorized Changes

- Do not delete working features without approval.
- Do not replace existing architecture without approval.
- Do not install unnecessary packages.
- Do not modify unrelated files.
- Do not reformat unrelated code.
- Do not revert user changes.
- Do not create commits or branches unless explicitly requested.
- Do not add billing, subscriptions, live video, social features, native apps, offline synchronization, advanced Tajweed judgment, or other out-of-scope functionality without explicit approval.

## 13. Development Workflow

Follow this workflow:

1. Read the relevant documentation.
2. Understand the current task and its prerequisites.
3. Inspect the owning code path and nearby tests.
4. State one local implementation hypothesis and the cheapest focused validation.
5. Explain the implementation plan when the change is substantial.
6. Get approval when required by the change-control rules.
7. Implement one task only.
8. Run the narrowest useful test or build check immediately after the first substantive edit.
9. Fix only related errors and rerun the focused check.
10. Verify the task's acceptance criteria.
11. Run at least one post-edit executable validation when available.
12. Stop and wait for the next task.

## 14. Project Scope

Keep the first version realistic for a two-person final-year BSCS project.

Prioritize the core working product:

- Authentication and role access.
- Student Quran/Mushaf learning and practice.
- Daily goals, Sabaq, Sabqi, Manzil, and revision.
- AI-assisted recitation with possible detections.
- Teacher verification, exams, feedback, and reports.
- Parent released progress and results.
- Academy-scoped management and basic analytics.
- Security, testing, deployment, and presentation evidence.

Do not add unnecessary features simply because they are technically possible. Optional and future work must remain clearly separated from MVP work in `docs/TASKS.md`.

## Open Decisions To Preserve

The current documentation identifies these decisions that require explicit resolution before affected implementation:

- Pricing is informational only while payments and subscriptions remain out of scope.
- Parent visibility of raw AI detections, transcripts, and recordings is restricted by default.
- Academy Admin access to raw recordings and provider payloads requires a separate approved break-glass workflow.
- Class assignment targets should use a deliberate materialized-versus-dynamic policy; materialization is recommended for stable history.
- Feedback ownership between `exam_attempts.teacher_feedback` and the general feedback model must be resolved before schema implementation.
- Exam retake behavior must be resolved before finalizing attempt uniqueness.
- Recording/transcript retention, consent withdrawal, deletion, and provider processing region must be resolved before real audio is used.

## Confirmation Gate

Do not start `TASK-001` or implement any project task until the user confirms that the task plan and project instructions are approved.
