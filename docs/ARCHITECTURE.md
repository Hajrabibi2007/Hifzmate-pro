# HifzMate Pro Architecture Proposal

This document proposes an architecture for HifzMate Pro based only on the requirements in `docs/PRD.md`. It describes boundaries, responsibilities, and data flow. It does not implement application code, create database migrations, or select vendors that are not required by the PRD.

## 1. Frontend Architecture

### Technology

- **React** for the user interface and feature components.
- **Vite** for local development, bundling, and production builds.
- **React Router** for authenticated and role-specific navigation.
- A chart library such as **Recharts** or **Chart.js** for progress, revision, mistake, exam, and academy analytics.
- The Supabase JavaScript client for authentication, database access, Storage access, and controlled backend operations.

### Application Layers

1. **Application shell**
   - Starts the router and Supabase client.
   - Loads the authenticated session.
   - Provides global error, loading, notification, and access-denied states.

2. **Route and access layer**
   - Defines public routes, authenticated routes, and role-specific route groups.
   - Resolves the current user's profile, role, and academy relationships before protected screens render.
   - Redirects unauthenticated users to sign-in and unauthorized users to an access-denied or safe default page.

3. **Feature modules**
   - Student learning and practice.
   - Assignments and revision.
   - Recitation tests and AI-assisted results.
   - Mistakes and weak areas.
   - Exams and feedback.
   - Parent monitoring.
   - Academy administration.
   - Notifications, progress, achievements, and reports.

4. **Shared UI and domain components**
   - Mushaf and Ayah-range selectors.
   - Audio player with repeat and loop controls.
   - Recording and microphone-permission states.
   - Assignment, exam, mistake, feedback, and notification views.
   - Accessible forms, tables, status badges, empty states, and chart containers.

5. **Data access layer**
   - Centralizes Supabase queries and mutations by domain.
   - Converts database records into view models where needed.
   - Keeps role checks in the backend as the security boundary; frontend checks are for navigation and user experience only.

### State and Data Fetching

- Keep authentication session state at the application level.
- Keep server-backed domain data close to the feature that uses it.
- Use explicit loading, error, empty, and stale-data states for learning and reporting screens.
- Treat microphone permission, recording, speech recognition, and AI analysis as asynchronous states.
- Prefer server queries for authoritative records such as assignments, exam results, teacher verification, and progress.
- Keep temporary UI state local, such as selected Ayahs, audio loop state, hidden text state, and an in-progress recording.

### Routing Shape

The route structure should reflect user workflows rather than expose database tables directly:

- Public: sign-in, password recovery, and account-related screens.
- Shared authenticated: profile, notifications, and permitted account settings.
- Student: dashboard, Mushaf, practice, assignments, revision, recitation tests, mistakes, weak areas, quizzes, progress, and achievements.
- Teacher: dashboard, students, classes, assignments, exams, mistake review, feedback, and reports.
- Parent: dashboard, linked children, activity, results, feedback, weekly reports, and notifications.
- Academy admin: dashboard, teachers, students, classes, exams, reports, and analytics.

## 2. Backend/Data Architecture

### Supabase Services

- **Supabase PostgreSQL** stores users' application profiles, academy relationships, classes, assignments, practice activity, exams, results, feedback, possible mistakes, teacher verifications, recommendations, achievements, and notifications.
- **Supabase Auth** manages identity, sessions, password recovery, and authentication providers selected for the product.
- **Supabase Storage** stores protected audio recordings, generated report files if required, and other approved media assets. Quran text and public recitation assets should only be stored there if their licensing and product policy permit it.
- **Supabase Edge Functions** or another controlled server-side service handles privileged orchestration, external speech-recognition calls, AI comparison, scheduled jobs, and report generation when these operations must not run in the browser.

### Domain Data Areas

The exact schema is a later database-design task. At the architecture level, the data should be separated into these areas:

- **Identity and organization**: profiles, roles, academies, academy memberships, teacher-student relationships, parent-child links, and classes.
- **Quran reference**: Surahs, Ayahs, verified text metadata, and approved audio references.
- **Planning**: daily goals, Sabaq/Sabqi/Manzil assignments, assignment status, and revision schedule items.
- **Learning activity**: practice sessions, Hide & Recall attempts, Write from Memory attempts, audio activity, and quiz attempts.
- **Assessment**: recitation tests, digital exams, exam attempts, results, and feedback.
- **AI-assisted analysis**: recording metadata, transcripts, possible detections, analysis status, and model/service metadata where appropriate.
- **Verification and weakness**: teacher verification decisions, mistake history, weak Ayah aggregates, and revision recommendations.
- **Engagement and reporting**: achievements, notifications, weekly reports, and analytics inputs or views.

### Server-Side Boundaries

The browser may read and write records only through authenticated Supabase operations permitted by Row Level Security. Privileged operations should be isolated behind Edge Functions or server-side jobs, including:

- Calling speech-recognition or AI services.
- Writing trusted analysis results after validating the request.
- Generating cross-student, academy-wide, or scheduled reports.
- Running scheduled weekly reports and notifications.
- Accessing protected Storage objects on behalf of an authorized user.

AI output should be stored as an unverified, possible detection until a teacher resolves it. Teacher verification should be a separate auditable record or status transition, not an overwrite that removes the original AI result.

## 3. Authentication Architecture

1. Supabase Auth authenticates the user and issues a session.
2. The frontend loads the session and retrieves the user's application profile and memberships.
3. The profile identifies the user-facing role: Student, Teacher, Parent, or Academy Admin.
4. The application loads only the role's permitted route group.
5. PostgreSQL Row Level Security independently checks every database operation using the authenticated user ID and relationship data.
6. Storage policies independently protect recordings and other private files.
7. Edge Functions validate the authenticated session and the requested operation before performing privileged work.

Authentication identifies a person; profile and membership records determine what that person may access. The frontend must never be treated as the authoritative authorization layer.

## 4. Role-Based Access

Role-based access should combine role permissions with relationship and organization scope.

| Role | Primary access scope |
| --- | --- |
| Student | Own profile, assignments, practice, tests, mistakes, recommendations, progress, achievements, notifications, and released results |
| Teacher | Assigned students, authorized classes, assignments, exams, feedback, reports, and possible mistakes requiring review |
| Parent | Linked child progress, revision activity, released results, feedback, weekly reports, and notifications |
| Academy Admin | Academy teachers, students, classes, exams, reports, and analytics |

Important rules:

- A role alone is insufficient for access to another person's records.
- Teacher access must be limited to assigned students or authorized academy classes.
- Parent access must require an explicit parent-child relationship.
- Academy admin access must be scoped to the relevant academy.
- Students must not edit teacher-owned assignments, released results, or teacher verification decisions.
- A teacher's verification action must be auditable.
- Frontend route guards improve usability; PostgreSQL RLS and Storage policies enforce security.

## 5. Student Workflow

1. The student signs in through Supabase Auth.
2. The dashboard loads the Daily Hifz Goal, current Sabaq/Sabqi/Manzil assignments, revision schedule, notifications, and progress summaries.
3. The student selects a Surah and Ayah range in the Mushaf interface.
4. The student listens, repeats, loops, hides text for recall, writes from memory, or completes a quiz.
5. The frontend records the relevant practice activity and assignment status through authorized Supabase operations.
6. For a recitation test, the student grants microphone permission, records the selected passage, and submits the attempt.
7. A server-side process sends approved audio to speech recognition, compares the transcript with verified Quran text, and stores possible detections.
8. The student sees clearly labeled AI-assisted results, mistake history, weak areas, and Smart Revision recommendations.
9. The student reviews teacher feedback and released exam results.
10. Progress and achievement views summarize recorded activity without presenting AI output as confirmed judgment.

## 6. Teacher Workflow

1. The teacher signs in and loads authorized students and classes.
2. The teacher creates or updates Sabaq, Sabqi, and Manzil assignments with passage, due date, and status information.
3. Students complete work and generate activity, practice, quiz, or recitation-test records.
4. The teacher creates and conducts digital Hifz exams.
5. The teacher reviews exam attempts, results, feedback, mistake analysis, and AI-assisted possible detections.
6. For each relevant possible detection, the teacher verifies, modifies, or dismisses the finding.
7. The system retains the original AI result and the teacher's decision with timestamps and responsible-user information.
8. The teacher provides feedback and releases appropriate results to the student and parent.
9. The teacher views student and class reports to target future assignments and revision.

## 7. Parent Workflow

1. The parent signs in through Supabase Auth.
2. The system resolves the parent's explicit child links.
3. The parent selects a linked child and views progress, revision activity, assignments or activity summaries, exam results, teacher feedback, and weekly reports.
4. The parent receives permitted notifications about assignments, results, feedback, reports, and reminders.
5. The parent has read-only monitoring access and cannot change assignments, results, possible detections, or teacher verification records.

## 8. Academy Workflow

1. The academy admin signs in and is scoped to the relevant academy.
2. The admin manages academy teachers, students, classes, and authorized relationships.
3. The admin oversees digital exams and views academy reports and analytics.
4. Chart components query aggregated, permission-filtered data for participation, progress, revision, mistakes, and exam outcomes.
5. The admin does not automatically gain unrestricted access to private recordings or unrelated academy data; access should follow the academy's documented policies and Storage/RLS rules.
6. Scheduled reports and notifications may be generated by server-side jobs within the academy scope.

## 9. AI-Assisted Recitation Workflow

The AI workflow should be asynchronous and explicitly non-authoritative:

1. **Selection**: The student selects a Surah and Ayah range and starts a recitation test.
2. **Permission**: The browser requests microphone permission and explains the recording state.
3. **Capture**: The frontend records audio locally and shows recording, stop, retry, and submission states.
4. **Protected upload**: The recording is uploaded to a private Supabase Storage path associated with the authenticated student and test.
5. **Queue/orchestration**: A server-side function validates the test and starts speech recognition and comparison.
6. **Transcription**: A speech-recognition provider returns a transcript, or a clear failure status is stored when recognition is unavailable.
7. **Reference comparison**: The server compares the transcript with the verified Quran reference for the selected range.
8. **Possible detections**: The system may record supported possible missing, wrong, extra, or sequence errors, with confidence and processing metadata where provided by the service.
9. **Review state**: Results are shown as AI-assisted possible detections and remain unverified.
10. **Teacher review**: An authorized teacher verifies, edits, or dismisses findings.
11. **Follow-up**: Verified records and permitted AI evidence contribute to mistake analysis and Smart Revision.

The system must not claim complete pronunciation, Tajweed, or recitation correctness. Browser support, microphone failure, noisy recordings, unavailable providers, and uncertain transcripts require explicit error or incomplete-result states.

## 10. Mistake Analysis Workflow

1. Collect possible detections from recitation tests and relevant exam or practice records.
2. Attach each record to the student, Surah/Ayah range, source attempt, timestamp, detection type, and processing status.
3. Keep AI-assisted possible detections separate from teacher-verified mistakes.
4. Allow an authorized teacher to verify, modify, or dismiss a possible mistake.
5. Build student-level aggregates for recurring Ayahs, detection types, recent frequency, and unresolved findings.
6. Present the student with understandable history and weak-area views.
7. Present teachers with student and class analysis appropriate to their scope.
8. Use only suitable, permission-filtered data for parent summaries and academy analytics.
9. Feed verified mistakes, and clearly marked permitted possible detections, into Smart Revision.

Aggregates should be treated as learning indicators, not definitive religious or Tajweed judgments.

## 11. Smart Revision Workflow

1. Gather eligible inputs: assignments, Daily Hifz Goal, revision schedule, completed practice, quiz attempts, exams, teacher-verified mistakes, and recurring possible weak Ayahs.
2. Apply transparent product rules to rank passages for review, such as recency, repetition of a weak Ayah, overdue work, and teacher priority.
3. Generate revision items with the Surah/Ayah range, reason, recommended activity, and priority.
4. Store the recommendation with its source inputs or generation timestamp so it can be explained and refreshed.
5. Show the recommendation to the student as guidance, not an unquestionable decision.
6. Allow teachers to inspect or influence recommendations through assignments, feedback, or priority settings supported by the product.
7. Record completion and use that activity to improve the next schedule.

The MVP should favor understandable, rule-based recommendations. More advanced adaptive algorithms belong to future scope and should not obscure why a passage was recommended.

## 12. Security Boundaries

### Identity and Application Data

- Supabase Auth owns identity and session handling.
- PostgreSQL RLS is the authoritative boundary for profiles, relationships, assignments, activity, exams, feedback, mistakes, recommendations, reports, and notifications.
- Every organization-scoped record must be associated with an academy or an explicit relationship where applicable.

### Storage and Audio

- Recitation recordings should be stored in private Storage buckets or private paths.
- Storage policies must verify the user's relationship to the recording before allowing read, upload, or delete operations.
- The frontend should use short-lived signed URLs when temporary playback access is required.
- Recordings and transcripts should follow documented retention and privacy rules.

### Privileged Processing

- API keys for speech-recognition and AI services must remain server-side.
- Edge Functions must validate the caller and request scope before reading private files or writing analysis results.
- Service-role credentials must never be exposed to the browser.
- External service failures must not silently create confirmed mistakes or exam results.

### Audit and Transparency

- Preserve original AI results, processing status, and relevant metadata.
- Record teacher verification decisions with actor and timestamp.
- Keep unverified AI output visually and structurally distinct from verified results.
- Avoid exposing private student data in logs, analytics payloads, or error messages.

## 13. Recommended Project Folder Structure

This is a proposed structure for the React/Vite project. It is documentation only and does not create these files.

```text
hifzmate-pro/
  docs/
    PRD.md
    ARCHITECTURE.md
  public/
  src/
    app/
      App.jsx
      router.jsx
      providers/
      routeGuards/
    components/
      ui/
      layout/
      charts/
      forms/
      feedback/
    features/
      auth/
      student/
        dashboard/
        mushaf/
        practice/
        assignments/
        revision/
        recitationTests/
        mistakes/
        quizzes/
        progress/
      teacher/
        dashboard/
        students/
        classes/
        assignments/
        exams/
        mistakeReview/
        reports/
      parent/
        dashboard/
        children/
        reports/
        notifications/
      academy/
        dashboard/
        teachers/
        students/
        classes/
        exams/
        reports/
        analytics/
      notifications/
      achievements/
    lib/
      supabaseClient.js
      audio/
      charts/
      validation/
      dateTime/
    services/
      authService.js
      quranService.js
      assignmentService.js
      activityService.js
      examService.js
      recitationService.js
      mistakeService.js
      revisionService.js
      reportService.js
    hooks/
    types/
    styles/
    assets/
    main.jsx
  supabase/
    migrations/
    functions/
      recitation-analysis/
      scheduled-reports/
      notifications/
  index.html
  vite.config.js
  package.json
```

Recommended ownership rules:

- `features/` owns screens and feature-specific UI.
- `services/` owns data-access calls and backend-facing operations.
- `components/` contains reusable presentation components without role-specific business rules.
- `lib/` contains shared integrations and utilities.
- `supabase/` contains future migrations and Edge Functions, but no database implementation is part of this architecture document.

## 14. External Services/APIs That May Be Required

The PRD does not mandate specific providers. The following integration categories may be required:

- **Speech-recognition API**: Converts recitation audio into a transcript. It must support server-side credentials, privacy controls, failure states, and language/recitation suitability evaluation.
- **AI or comparison service**: Assists with transcript-to-verified-text comparison and possible error classification. It must return uncertain results transparently and must not be treated as a final Quran or Tajweed authority.
- **Quran text source or reference dataset**: Provides verified Quran text and stable Surah/Ayah identifiers. Licensing, provenance, versioning, and integrity must be confirmed before use.
- **Quran audio source or CDN**: Provides approved recitation audio where required. Licensing and availability must be confirmed.
- **Email, push, or messaging provider**: Optional future or MVP notification delivery beyond in-app notifications, subject to privacy and product decisions.
- **Monitoring and error tracking service**: Optional service for operational diagnostics, configured to avoid recording sensitive student audio, transcripts, or personal data.
- **Scheduled job mechanism**: Supabase scheduled functions or an equivalent service for weekly reports, reminders, notification generation, and maintenance tasks.

External services should be accessed through server-side functions when they require secrets or private student data. Provider selection, data retention, regional processing, cost, accuracy, and failure behavior should be decided before implementation.
