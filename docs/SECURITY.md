# HifzMate Pro Security Plan

This security plan is based on `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `docs/DATABASE.md`. It defines security responsibilities and boundaries for HifzMate Pro. It does not implement application code, database tables, migrations, RLS policies, or external integrations.

## Security Principles

- **Least privilege:** Every user, service, and function receives only the access required for its task.
- **Defense in depth:** Frontend route guards, Supabase Auth, PostgreSQL RLS, Storage policies, server-side validation, and audit logs protect the same data through different controls.
- **Academy isolation:** Academy-owned records are tenant-scoped and never accessed by academy membership alone without the correct role and relationship.
- **Privacy by default:** Student profiles, progress, activity, recordings, transcripts, mistakes, and reports are private unless explicitly released to an authorized recipient.
- **Human review:** AI output is an unverified possible detection. It is never a guaranteed Quran, Tajweed, grading, or religious judgment.
- **Traceability:** Security-sensitive actions and teacher decisions are auditable without storing unnecessary sensitive data in logs.

## 1. Authentication

Supabase Auth is the identity provider for HifzMate Pro.

### Authentication requirements

- Users authenticate through Supabase Auth using an approved sign-in method.
- The application uses the authenticated Supabase user ID as the identity key.
- The `profiles` record extends Auth identity with display and application data; it does not replace Auth.
- Sessions must use secure, HTTP-only handling where applicable and follow Supabase's supported session model.
- Password recovery, email verification, session refresh, sign-out, and account disablement must use Supabase Auth flows.
- The frontend must show loading and error states while a session is being resolved.
- All protected data requests must require a valid authenticated session.
- A user whose Auth account is disabled, expired, or revoked must lose access to protected application data.

### Authentication does not grant authorization

A valid login only proves identity. Access still depends on:

1. Active `academy_memberships`.
2. The membership role.
3. Teacher/class or teacher/student relationships.
4. Parent/child links and consent where required.
5. Record status, such as whether an exam result has been released.
6. PostgreSQL RLS and Storage policy evaluation.

### Account lifecycle

- Invitations should create pending membership records without granting active access.
- Membership activation must be auditable.
- Suspended or ended memberships must fail authorization checks.
- Deactivating a user must not erase records needed for audit or academic history.
- Account deletion and audio/data retention rules must be defined before implementation.
- Passwords must never be stored in application tables or logs.

## 2. Authorization

Authorization must be enforced on the backend. React route guards are only a usability layer and must not be treated as a security control.

Every read, insert, update, and delete operation must be evaluated against:

- Authenticated user ID.
- Active role membership.
- Academy scope.
- Direct relationship to the student or class.
- Record ownership or authorship.
- Publication/release state.
- Data sensitivity, especially recordings, transcripts, raw AI metadata, and audit logs.

### Authorization rules

- A user cannot select a different `user_id`, `student_id`, `academy_id`, `teacher_id`, or `parent_id` in a request to bypass access controls.
- Server-side functions must derive sensitive actor and academy values from the authenticated session and validated relationships where possible.
- Client-provided role, academy, verification status, score, or release status must be treated as untrusted input.
- Authorization checks must apply to both direct table access and RPC/Edge Function calls.
- Authorization must be checked at the time of the action, not only when a page was opened.
- Changes to relationships must invalidate or re-evaluate access in subsequent requests.

## 3. Role-Based Access Control

Roles are academy-scoped records in `academy_memberships`. A user may have different roles in different academies, and role membership must not be inferred from a frontend route or client payload.

| Role | Allowed scope | Main restrictions |
| --- | --- | --- |
| Student | Own profile and own learning, assignment, test, mistake, progress, recommendation, achievement, notification, and released-result records | Cannot access another student's private data or change teacher-owned records |
| Teacher | Authorized students, classes, assignments, exams, feedback, reports, and possible mistakes | Cannot access students/classes outside the authorized academy scope or relationships |
| Parent | Linked child's permitted progress, activity, released results, feedback, weekly reports, and notifications | Cannot access unrelated students, raw private data, or alter academic records |
| Academy Admin | Records belonging to the admin's academy, within documented administrative scope | Must not automatically receive unrestricted audio, transcripts, or cross-academy data |

### Role management

- Only an authorized academy admin or controlled server-side enrollment process may create or change academy memberships.
- Role changes must be recorded in `audit_logs`.
- A user may not grant themselves a role by inserting or updating their own membership.
- A teacher or parent relationship must be validated against the corresponding role membership.
- RLS helper functions must avoid trusting user-editable profile fields for role decisions.

## 4. Student Permissions

### Allowed

Students may:

- Read and update their own permitted profile fields.
- Read their own active assignments, assignment status, daily goals, revision plans, learning activity, progress, quizzes, achievements, and notifications.
- Create or submit their own practice activity and recitation tests.
- Upload their own recordings through an authorized Storage path.
- Read their own recordings, transcripts, possible mistakes, weak areas, and Smart Revision recommendations according to product visibility rules.
- Read teacher feedback addressed to them.
- Read released exam results and feedback.
- Mark their own notifications as read.
- Update student-owned notes or completion state where the workflow permits it.

### Restricted

Students may not:

- Read another student's data, even if both students share a class or teacher.
- Read private teacher notes, internal audit logs, raw provider payloads, or other users' recordings.
- Change an assignment's passage, author, due date, or teacher ownership.
- Create or change teacher verification decisions.
- Release exam results or alter scores.
- Change their own academy role, academy membership, teacher links, or parent links.
- Insert activity on behalf of another student.
- Convert an AI possible detection into a confirmed mistake.
- Access a recording through a guessed or altered Storage path.

## 5. Teacher Permissions

### Allowed

Teachers may, within their active academy authorization and student/class scope:

- Read assigned students and authorized classes.
- Create and manage Sabaq, Sabqi, and Manzil assignments.
- Read assignment targets and update permitted assignment status.
- Create and manage digital Hifz exams for authorized students/classes.
- Read exam attempts and review results within scope.
- Read mistake analysis and possible AI detections for authorized students.
- Verify, modify, or dismiss possible AI-detected mistakes.
- Add feedback to assignments, recitation tests, exams, and students.
- Generate permitted student and class reports.
- Create or influence revision plans where the product supports it.
- Receive notifications relevant to assigned students and classes.

### Restricted

Teachers may not:

- Read students outside their authorized academy/class/teacher-student scope.
- Access another academy's data.
- Change academy memberships unless separately granted an admin role.
- Change a student's parent links.
- Read or export unrelated student recordings and transcripts.
- Treat AI output as a definitive judgment or bypass teacher-review labeling.
- Delete or rewrite original AI findings or verification history.
- Release or alter results outside their authorization.
- Use a service-role credential from the browser.

Teacher verification is a privileged business action and must be authorized, validated, and recorded in `audit_logs`.

## 6. Parent Permissions

### Allowed

A parent may read data only for a child with an active `parent_student_links` record and required consent:

- Child progress summaries.
- Revision activity summaries.
- Released exam results.
- Teacher feedback whose visibility includes the parent.
- Published weekly reports.
- Parent-addressed notifications.
- Permitted parent replies and their own reply history.

### Restricted

Parents may not:

- Search for or enumerate unrelated students.
- Read a child's raw microphone recording, transcript, provider metadata, or unverified AI details by default.
- Read private teacher notes or internal audit logs.
- Change assignments, scores, teacher verification decisions, progress states, or revision source data.
- Create a parent link by changing a foreign key or submitting an arbitrary child ID.
- Access a child after the link is ended or consent is withdrawn.
- Access all children in an academy merely because they are a parent member.

The MVP should expose teacher-released summaries and verified academic results to parents, not raw recordings, raw transcripts, or unreviewed possible detections unless a later product decision explicitly allows them.

## 7. Academy Admin Permissions

Academy admins may manage and review data within their own academy:

- Teachers, students, parent links, and academy memberships according to academy policy.
- Classes and class memberships.
- Academy-scoped assignments, exams, reports, and analytics.
- Operational notifications and scheduled reporting.
- Audit logs for their academy, subject to log sensitivity rules.

Academy admins may not:

- Access another academy's records.
- Use an academy role to access Supabase Auth passwords, service-role keys, provider API keys, or raw secrets.
- Automatically access unrestricted student recordings, transcripts, raw AI payloads, or private teacher notes.
- Change or delete audit history through normal application operations.
- Override a teacher verification without an explicit, audited administrative workflow.
- Grant themselves access to another academy by changing a client payload.

If administrative access to recordings or raw AI data is required for support, it must be a separate break-glass capability with approval, expiry, reason capture, audit logging, and minimal disclosure.

## 8. Student-Parent Account Linking

Parent access depends on `parent_student_links`, not on matching names, email addresses, or manually supplied student IDs.

### Secure linking flow

1. A parent authenticates through Supabase Auth.
2. The system creates a pending link request tied to the parent, intended academy, and intended student.
3. The request is approved through an authorized academy workflow or a product-defined student/guardian confirmation process.
4. The system verifies that both accounts have the expected academy-scoped roles.
5. The link becomes active only after required consent is recorded.
6. The activation is written to `audit_logs`.
7. Parent reads are allowed only while the link is active and consent remains valid.
8. Ending or suspending the link immediately removes future parent access.

### Protections

- Do not use predictable child IDs as proof of relationship.
- Do not allow a parent to approve their own arbitrary link without the required independent confirmation.
- Do not expose a child search endpoint that reveals whether an account exists without authorization.
- Do not copy child private data into the parent profile.
- Review parent notifications and weekly reports after unlinking to prevent stale access through cached or queued content.
- Parent replies must validate both the active link and the source visibility on every write.

## 9. Teacher-Student Access Restrictions

Teacher access requires both role and relationship scope:

- The teacher must have an active teacher membership in the relevant academy.
- The student must have an active student membership in the same academy.
- The teacher must be linked through `teacher_student_links` or an active class relationship.
- The relationship must be active at the time of the read or write.
- A former teacher may retain access only to records the product explicitly permits for historical reporting; new management and verification actions must be denied.
- A teacher may not infer access to every student in an academy from one class or one student relationship.
- Class membership changes must be audited and reflected in RLS decisions immediately.
- Teacher verification must record the teacher and the authorization context at action time.

## 10. Academy Data Isolation

HifzMate Pro is academy-scoped even when a user belongs to multiple academies.

### Isolation requirements

- Every organization-owned table must contain `academy_id` or inherit an unambiguous academy scope from a parent table.
- Queries must never filter only by `student_id`, `teacher_id`, or `class_id` when a cross-academy identity is possible.
- Foreign keys and server-side validation must ensure related records belong to the same academy.
- RLS policies must compare the row's academy to an active membership for `auth.uid()`.
- Analytics, reports, notifications, and background jobs must include academy scope in their input and query logic.
- Storage paths must include an opaque academy and record scope, but path naming is not a substitute for Storage policies.
- Cross-academy exports and bulk operations are forbidden unless a separately approved platform-level role exists; that role is outside the current PRD.

## 11. Supabase Row Level Security (RLS)

RLS is the authoritative database access boundary for application roles.

### General RLS rules

- Enable RLS on every private application table.
- Start with deny-by-default policies and add narrowly scoped `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies.
- Use `auth.uid()` and trusted membership/relationship helper functions.
- Do not use frontend-provided role or academy values as policy inputs.
- Keep helper functions secure and prevent recursive policy evaluation where possible.
- Separate read policies from write policies.
- Restrict columns through views or controlled RPCs when a table contains sensitive fields that some role must not see.
- Use server-side functions for workflows requiring multiple related writes or privileged validation.

### Policy matrix

| Data area | Student | Teacher | Parent | Academy Admin |
| --- | --- | --- | --- | --- |
| Own profile | Read/update permitted fields | Read own; limited relationship data | Read own; limited relationship data | Academy-scoped profile fields only |
| Other profiles | No | Authorized students/teachers only | Linked child summary only | Academy-scoped operational fields |
| Assignments | Read own targets; update permitted status | Manage authorized scope | Read permitted child summaries | Manage academy scope |
| Learning activity | Insert/read own | Read authorized students | Aggregated linked-child read | Academy analytics/read scope |
| Recordings/transcripts | Own, according to retention policy | Authorized review only if required | Denied by default | Denied by default; break-glass only if later approved |
| Possible mistakes | Own | Authorized students | Verified/released summaries only | Academy analytics, not unrestricted raw details |
| Verifications | Read outcome | Create/read own authorized decisions | Read released outcome only | Read/audit; override only through audited workflow |
| Exams/results | Own released results | Manage authorized exams | Released linked-child results | Academy scope |
| Feedback | Read addressed feedback | Create/read authorized feedback | Read `student_parent` feedback; reply | Academy scope, subject to privacy |
| Notifications | Own recipient rows | Own relevant rows | Own relevant rows | Own/admin operational rows |
| Audit logs | Denied | Denied except narrow self-action result if required | Denied | Academy-scoped read; append through trusted server path |

### RLS edge cases

- A row with a valid `academy_id` but no active membership must be inaccessible.
- A parent who is linked to one child must not read a sibling's record without a separate active link.
- A teacher who changes class membership must not gain historical access merely by adding themselves after the fact unless policy explicitly allows it.
- Students must not insert rows with another student's ID, even if they can see the table schema.
- `notifications.entity_id` and `entity_type` must not be used to bypass RLS on the referenced entity.
- RLS must not expose whether a hidden row exists through different error behavior or unauthorized foreign-key lookups.

## 12. Database Security

### PostgreSQL controls

- Use least-privilege database roles for migrations, application access, background jobs, and administrative operations.
- Keep Supabase service-role credentials only in trusted server-side environments.
- Restrict schema, function, and extension privileges.
- Revoke public execute access from privileged functions unless explicitly required.
- Validate all function inputs and avoid dynamic SQL where possible.
- Use parameterized queries and Supabase query builders; never concatenate user input into SQL.
- Define foreign keys, unique constraints, check constraints, and cross-table validations described in `DATABASE.md`.
- Protect append-only audit logs from normal update/delete operations.
- Use transaction boundaries for membership changes, teacher verification, exam release, and multi-table workflows.
- Backups, point-in-time recovery, and restoration tests must be configured according to the deployment environment.

### Data minimization

- Store only the provider metadata required for analysis, support, and audit.
- Do not store passwords, access tokens, provider secrets, or unnecessary personal data in PostgreSQL.
- Avoid putting private audio or full transcripts into audit snapshots.
- Use retention and deletion schedules for recordings, transcripts, and raw provider payloads.

### Integrity concerns

- Validate that denormalized `student_id` and `academy_id` values match their parent records.
- Ensure Ayah IDs belong to the stated Surah.
- Ensure parent replies match both their parent-child link and the source student's ID.
- Ensure teacher verification decisions are linked to a possible mistake and an authorized teacher.
- Preserve original AI findings instead of replacing them with teacher decisions.

## 13. File and Audio Storage Security

Recitation recordings are sensitive student data and must use private Supabase Storage buckets or private paths.

### Upload controls

- Require an authenticated user and an authorized student/test relationship.
- Generate or validate the Storage path server-side; do not trust arbitrary client paths.
- Allow only approved audio MIME types and enforce maximum file size and duration.
- Bind the uploaded object to exactly one `recitation_test` and student.
- Require recording consent state where the product policy requires it.
- Reject path traversal, unexpected extensions, duplicate object binding, and untrusted metadata.
- Consider malware/content validation for files that can be downloaded or processed externally.

### Read controls

- Students may read only their own permitted recordings.
- Teachers may read recordings only for authorized students and only where review requires it.
- Parents are denied raw recordings by default.
- Academy admins are denied raw recordings by default.
- Use short-lived signed URLs instead of public URLs.
- Do not place tokens or permanent signed URLs in notifications, logs, analytics, or public HTML.

### Processing and retention

- Edge Functions should access private files using controlled server credentials and a validated test ID.
- External AI providers should receive the minimum audio and metadata needed for the requested analysis.
- Record processing status and provider request identifiers without exposing secrets.
- Define retention, deletion, legal hold, and failed-processing cleanup rules before implementation.
- When a recording is deleted or redacted, remove or protect derived transcripts and provider payloads according to the retention policy.

## 14. Environment Variables and Secrets

### Never expose

The following must never be placed in React source, `VITE_*` variables, browser storage, public assets, client bundles, or error messages:

- Supabase service-role key.
- Database passwords or direct database connection secrets.
- Speech-recognition API keys.
- AI/comparison provider API keys.
- Email, push, storage-admin, monitoring, or webhook signing secrets.
- Session signing keys or encryption keys.

### Client-safe configuration

Only deliberately public configuration may be exposed to the Vite frontend, such as the Supabase project URL and the public anonymous key. Public configuration is still subject to RLS and must not be treated as privileged.

### Secret management

- Store secrets in the deployment platform's encrypted secret manager.
- Use separate credentials for development, staging, and production.
- Rotate keys after suspected exposure and on a defined schedule.
- Do not commit `.env` files containing secrets.
- Use secret scanning in source control and CI.
- Avoid logging environment variables or provider request headers.
- Use narrowly scoped keys where a provider supports scopes and expiration.

## 15. API Security

This includes Supabase queries, RPCs, Edge Functions, and external-provider integrations.

- Require a valid Supabase session for protected endpoints.
- Validate JWT/session claims server-side and do not trust decoded client claims without verification.
- Validate input types, ranges, enum values, IDs, date ranges, file metadata, and payload size.
- Enforce academy and relationship authorization before any data access or mutation.
- Use idempotency keys for recording submission, exam submission, verification, notifications, and external-provider callbacks where retries are possible.
- Rate-limit sign-in, password recovery, recording submission, analysis requests, report generation, and notification actions.
- Prevent replay of expired analysis or verification requests.
- Apply request timeouts, provider timeouts, bounded retries, and circuit-breaking for external services.
- Verify webhook signatures and bind callbacks to expected provider requests and tests.
- Return generic errors to clients and keep detailed diagnostics in access-controlled logs.
- Protect against enumeration through uniform responses for account, parent-link, and student-search operations.
- Add CSRF protections appropriate to the session transport and deployment model.
- Use HTTPS in all non-local environments and secure browser headers such as a strict Content Security Policy where compatible with Supabase.

## 16. AI Recitation Result Security

AI-assisted recitation involves private audio, transcripts, verified Quran reference text, and potentially sensitive learning indicators.

### Data flow controls

1. Student authorization is checked before recording submission.
2. The recording is stored privately and associated with one test/student.
3. A trusted server-side process retrieves the file and calls the speech-recognition provider.
4. The transcript is stored with provider, language, status, and minimal metadata.
5. A trusted analysis process compares the transcript with the controlled Quran reference version.
6. Possible detections are stored as unverified records.
7. Only permitted users see the output, and visibility is filtered by role and relationship.

### Result rules

- Every result must be labeled as AI-assisted, possible, incomplete, or failed as appropriate.
- Confidence scores, if supplied, describe provider output and must not be presented as certainty.
- AI results must not automatically become final exam grades, confirmed mistakes, Tajweed rulings, or religious judgments.
- AI output must not be used to make unrelated high-impact decisions.
- Preserve model/provider/reference versions for reproducibility and review.
- Prevent students or clients from submitting arbitrary AI result payloads directly to the database.
- Provider raw responses must be minimized, access-controlled, and excluded from normal parent/admin views.
- Failed or uncertain analysis must not silently produce a clean result or a confirmed error.

## 17. Teacher Verification of AI-Detected Mistakes

Teacher verification is the human review boundary for possible detections.

### Verification process

1. A teacher opens a possible detection for an authorized student.
2. The system checks current teacher authorization and the original test/student/academy relationships.
3. The teacher can verify, modify, or dismiss the possible detection.
4. The system requires an explicit decision and may require a note for modified or dismissed findings.
5. The original AI record remains unchanged.
6. The decision is appended to `mistake_verifications` and recorded in `audit_logs`.
7. Derived weak areas and revision recommendations are recalculated using the new status.
8. Student and parent visibility follows release and privacy rules.

### Security requirements

- A student cannot verify their own possible mistake as a teacher.
- A parent cannot verify, modify, or dismiss a mistake.
- A teacher cannot review outside their authorized scope.
- A verification request must be protected against replay and duplicate submission.
- Removing a teacher relationship must not erase historical decisions.
- The UI and stored statuses must distinguish `unreviewed`, `verified`, `modified`, and `dismissed`.
- No interface or report may call an AI-only record a confirmed mistake.

## 18. Notifications Security

Notifications can expose private academic information, so they must be recipient-scoped and content-minimized.

- Each notification belongs to one recipient and is readable only by that recipient, subject to admin operational rules.
- Notification creation must verify the recipient's relationship to the source entity.
- A parent notification must not reveal data about a child to an unlinked parent.
- Notifications should use generic text when delivered through email, push, or messaging channels; sensitive details should require authenticated in-app access.
- Do not include recordings, transcripts, raw AI output, private notes, access tokens, or full student identifiers in notification text.
- Notification links must re-check authorization after navigation; possession of a link is not access.
- Queue and delivery workers must use least-privilege credentials.
- Delivery retries must not create duplicate notifications or leak content through provider logs.
- Unlinking a parent should stop future child notifications and handle queued deliveries according to policy.
- Store read status and delivery status separately from source academic records.

## 19. Audit Logging

`audit_logs` must be append-only for normal application roles and should capture security-sensitive actions without copying sensitive content unnecessarily.

### Events to audit

- Sign-in failures, account recovery, session/security changes, and account disablement where available.
- Academy membership creation, activation, suspension, role changes, and termination.
- Parent-child link requests, approvals, consent changes, and unlinking.
- Teacher-student and class membership changes.
- Assignment creation, publication, cancellation, and reassignment.
- Exam creation, attempt submission, result review, and result release.
- Recording upload, processing request, access by a privileged workflow, and deletion/redaction.
- Transcript and AI analysis status changes.
- Teacher verification, modification, and dismissal of possible mistakes.
- Feedback visibility changes, parent replies, report publication, and notification creation.
- Administrative exports, break-glass access, and changes to security configuration.

### Audit data rules

- Record actor, academy, action, entity type/ID, timestamp, request correlation ID, and a redacted before/after snapshot where useful.
- Do not log passwords, tokens, service-role keys, raw audio, complete transcripts, or unnecessary personal data.
- Use immutable or append-only storage and restrict audit reads to authorized admins/security operators.
- Audit records must survive ordinary profile or relationship deletion where legally and operationally required.
- Use monitoring to detect unusual access volume, cross-academy authorization failures, repeated failed analysis requests, or bulk downloads.

## 20. Common Security Risks and Prevention

| Risk | Prevention |
| --- | --- |
| Broken object-level authorization | Enforce RLS and relationship checks using authenticated identity, academy, and record ownership; never trust IDs from the client |
| Cross-academy data leakage | Require academy scope in queries, foreign-key consistency, RLS, Storage policies, and background jobs |
| Student viewing another student's data | Student policies permit only `auth.uid()` ownership; never authorize by shared class alone |
| Parent viewing an unrelated child | Require an active `parent_student_links` row and consent; check it on every request |
| Teacher accessing unauthorized students | Require active teacher membership plus class or teacher-student relationship at action time |
| Privilege escalation | Prevent self-service role/membership changes; manage them through audited admin/server workflows |
| Service-role key exposure | Keep service-role keys and provider secrets server-side; use secret managers and secret scanning |
| Public audio exposure | Use private Storage, strict object policies, short-lived signed URLs, and no public bucket access |
| Audio upload abuse | Enforce authenticated ownership, MIME/size/duration limits, path validation, and processing quotas |
| Transcript/privacy leakage | Minimize provider payloads, restrict transcript reads, redact logs, and define retention rules |
| AI false certainty | Use possible-detection labels, preserve uncertainty, prohibit automatic authoritative grading, and require teacher verification |
| Forged teacher verification | Check teacher authorization server-side, append verification records, prevent client-set status, and audit actions |
| Exam result tampering | Restrict scores/release state, use controlled transitions, audit changes, and separate student read access from teacher writes |
| Parent reply abuse | Validate active parent-child link, source visibility, matching student ID, content limits, and rate limits |
| Notification leakage | Recipient-scoped RLS, generic external messages, authorization re-checks, and safe queued delivery |
| SQL injection | Use parameterized queries, typed Supabase operations, validated RPC arguments, and no dynamic SQL from user input |
| XSS/content injection | Sanitize or safely render feedback, notes, report text, and provider output; use a restrictive CSP |
| CSRF/session theft | Use secure session transport, HTTPS, appropriate CSRF protection, secure cookies, and reauthentication for sensitive actions |
| Account enumeration | Use uniform responses and rate limits for sign-in, recovery, linking, and student lookup flows |
| Replay and duplicate requests | Use idempotency keys and state transitions for uploads, analysis, verification, exam submission, and notifications |
| Denial of service/cost abuse | Rate-limit recording, AI analysis, report generation, and notifications; cap file sizes and provider retries |
| Unsafe third-party provider | Review privacy, retention, region, security, licensing, and deletion behavior before sending audio or transcripts |
| Sensitive logs | Redact secrets, audio, transcripts, and unnecessary personal data; restrict log access and retention |
| Audit log tampering | Append-only policies, restricted service path, database permissions, monitoring, and backups |
| Stale parent/teacher access | Re-check active relationships on every request and revoke or expire sessions/links according to policy |
| Overexposed admin access | Scope admins to their academy and use separate break-glass approval for raw recordings or sensitive AI data |
| Insecure backups/exports | Encrypt backups, restrict export permissions, audit downloads, define retention, and test restoration securely |
| Misconfigured RLS | Use deny-by-default policies, automated policy tests, negative authorization tests, and review policies after schema changes |

## Review After Creating This Plan

### 1. Missing permissions reviewed

The plan explicitly covers:

- Student self-access and ownership restrictions.
- Teacher access through academy and class/teacher-student authorization.
- Parent access through active child links and consent.
- Academy admin academy-only access.
- Teacher verification as a separate privileged action.
- Parent replies, notifications, audit logs, recordings, transcripts, and reports.
- Background jobs and Edge Functions as server-side principals.
- Break-glass access as a future controlled capability rather than an implicit admin privilege.

### 2. Privacy problems reviewed

The main privacy risks are addressed as follows:

- Raw recordings, transcripts, provider payloads, and private teacher notes are denied to parents and admins by default.
- External notifications use minimized content and require authenticated access for details.
- AI findings and weak-area data are treated as sensitive learning data and are not exposed as authoritative judgments.
- Audit logs exclude passwords, secrets, raw audio, and unnecessary transcript content.
- Retention, deletion, consent, and provider-processing rules are identified as decisions required before implementation.

### 3. Consistency with PRD, ARCHITECTURE, and DATABASE

The security plan matches the existing documents on these points:

- Supabase Auth is the identity system.
- PostgreSQL RLS and Storage policies are the authoritative access controls.
- React route guards are not treated as security boundaries.
- Student, teacher, parent, and academy roles are academy-scoped.
- Parent access requires explicit parent-child links.
- Teacher access requires authorized student/class relationships.
- AI results are possible detections, not guaranteed Quran or Tajweed judgments.
- Teacher verification is supported and auditable.
- Audio is stored privately and processed through server-side services.
- Audit logs record relationship, verification, result-release, and sensitive access events.

### 4. Contradictions and unresolved design decisions

No direct security contradiction was found between the three source documents, but these decisions must be resolved before implementation:

1. **Parent visibility of AI data:** `DATABASE.md` permits possible detections in the data model, while the PRD only requires parent progress, results, and feedback. This plan recommends parents see teacher-released summaries and verified results, not raw transcripts or unreviewed detections.
2. **Academy admin access to recordings:** `ARCHITECTURE.md` says admins do not automatically receive unrestricted recordings, while broad academy analytics are allowed. This plan preserves that boundary and requires break-glass approval for exceptional access.
3. **Class assignment targeting:** `DATABASE.md` leaves materialized versus dynamic class targets open. This affects authorization and history. Materializing `assignment_targets` at publication is recommended for stable access decisions.
4. **Exam feedback duplication:** `DATABASE.md` contains `exam_attempts.teacher_feedback` and a general `feedback` table. This is a data-model duplication risk, not a runtime security contradiction. Prefer one feedback authority before implementation.
5. **Admin override of teacher verification:** The PRD requires teacher verification but does not define administrative overrides. This plan does not grant silent overrides; any override needs a separate, audited workflow.
6. **Retention and consent:** The PRD and architecture require privacy controls but do not define retention periods, deletion behavior, consent withdrawal behavior, or third-party processing regions. These must be specified before using real student recordings.
7. **Exam retakes:** `DATABASE.md` currently favors one attempt per student/exam but leaves retakes open. The result and authorization rules must be finalized before schema implementation.

No application code, database tables, SQL, migrations, or `src` files were modified by this document.
