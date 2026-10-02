# HifzMate Pro Product Requirements Document

## 1. Product Overview

HifzMate Pro is a web-based Hifz management, learning, revision, and AI-assisted recitation examination platform for Quran memorization programs. It connects students, teachers, parents, and academy administrators through a shared system for planning memorization, tracking revision, conducting examinations, identifying learning weaknesses, and communicating progress.

The platform combines a Quran/Mushaf learning experience with structured Hifz workflows including Sabaq, Sabqi, Manzil, revision schedules, digital exams, progress reporting, and teacher feedback.

AI-assisted recitation is a support feature. AI output must always be presented as possible detections or recommendations, not as perfect, guaranteed, or authoritative Quran or Tajweed judgment. Teacher verification remains important for academic decisions.

## 2. Problem Statement

Hifz programs often rely on disconnected tools, paper records, messaging applications, and manual tracking. This can make it difficult to:

- Maintain a consistent record of Sabaq, Sabqi, and Manzil assignments.
- Help students follow an effective daily and long-term revision routine.
- Identify recurring weak Ayahs and patterns in mistakes.
- Conduct and record digital recitation examinations efficiently.
- Give parents a clear view of their child's learning activity and progress.
- Provide teachers and academy administrators with reliable reports and analytics.
- Turn recitation practice and exam results into targeted revision actions.

Students also need a focused learning interface that supports listening, repetition, recall practice, writing from memory, and examination preparation in one place.

## 3. Solution

HifzMate Pro will provide a role-based web platform with:

- A Quran/Mushaf interface for reading, listening, repetition, and memorization practice.
- Structured Sabaq, Sabqi, Manzil, and revision schedule management.
- Student tools such as Hide & Recall, Write from Memory, daily goals, quizzes, progress, and achievements.
- AI-assisted recitation that transcribes microphone input, compares it with verified Quran text, and flags supported possible errors for review.
- Teacher workflows for assignments, digital exams, mistake verification, feedback, and reports.
- Parent views for child progress, activity, results, feedback, and notifications.
- Academy administration for managing users, classes, exams, reports, and analytics.

## 4. Target Users

1. **Student** - Memorizes Quran, practices recitation, completes assignments, and reviews progress.
2. **Teacher** - Manages students and classes, assigns memorization and revision work, conducts exams, verifies mistakes, and provides feedback.
3. **Parent** - Monitors a child's progress, revision activity, exam results, teacher feedback, and notifications.
4. **Academy Admin** - Manages the academy's teachers, students, classes, exams, reports, and analytics.

## 5. Goals

### Product Goals

- Centralize Hifz learning, revision, assessment, and communication in one platform.
- Make daily memorization and revision activities clear and actionable for students.
- Reduce manual effort in assignment tracking, exam recording, and reporting.
- Help teachers identify weak areas and recurring mistakes more efficiently.
- Give parents timely, understandable visibility into their child's progress.
- Provide academy administrators with operational oversight and useful analytics.
- Use AI responsibly as an assistive tool while preserving teacher authority and human review.

### Success Indicators

- Students can view and complete assigned Sabaq, Sabqi, and Manzil work.
- Teachers can assign, assess, verify, and report on student work digitally.
- Students receive revision recommendations based on recorded activity and possible mistakes.
- Parents can access current progress, activity, results, and feedback.
- Academy admins can manage core users, classes, exams, and reports.
- AI-assisted recitation results are clearly labeled as possible detections and can be verified by a teacher.

## 6. User Roles

### Student

- Access assigned Quran memorization and revision tasks.
- Read and listen to Quran passages using the Mushaf interface.
- Practice with repetition, looping, Hide & Recall, and Write from Memory.
- Set or follow a daily Hifz goal.
- Submit recitations for practice or examination.
- Review mistakes, weak areas, recommendations, progress, achievements, and notifications.

### Teacher

- Manage assigned students and classes.
- Create Sabaq, Sabqi, and Manzil assignments.
- Schedule and conduct digital Hifz exams.
- Review exam results and possible AI-detected mistakes.
- Verify, correct, or dismiss possible mistakes.
- Provide feedback and generate student or class reports.

### Parent

- View linked child profiles.
- Monitor memorization progress and revision activity.
- Review exam results and teacher feedback.
- Receive weekly reports and relevant notifications.

### Academy Admin

- Manage teachers, students, classes, and academy access.
- Oversee exams and reporting.
- View academy-level analytics and operational summaries.

## 7. Functional Requirements

### 7.1 Authentication and Role Access

- The system shall support secure sign-in for students, teachers, parents, and academy admins.
- The system shall enforce role-based access to features and data.
- Parents shall only access children linked to their account.
- Teachers shall only manage students and classes within their authorized scope.
- Academy admins shall manage academy-level users, classes, exams, reports, and analytics.

### 7.2 Quran/Mushaf and Audio

- Students shall be able to browse and open Quran content by Surah and Ayah.
- The system shall display verified Quran text in the Mushaf interface.
- Students shall be able to listen to available recitation audio.
- Students shall be able to repeat and loop selected content.
- Students shall be able to use Hide & Recall to practice without continuously viewing the text.
- Students shall be able to use Write from Memory for memorization practice.

### 7.3 Hifz Planning and Revision

- Students shall be able to view their daily Hifz goal.
- Teachers shall be able to create and assign Sabaq, Sabqi, and Manzil tasks.
- Students shall be able to view assignment details, due dates, and completion status.
- The system shall provide a revision schedule for assigned and recommended work.
- The system shall record relevant completion and practice activity.
- The system shall support Smart Revision recommendations using available activity, mistake, and weakness data.

### 7.4 Recitation Tests and AI Assistance

- A student shall be able to select a Surah and Ayah range for a recitation test.
- The student shall be able to record recitation through a microphone where supported.
- Speech recognition shall produce a transcript from the recorded recitation when available.
- The system shall compare the recognized transcript with verified Quran text.
- The system may identify supported possible missing-word, wrong-word, extra-word, and sequence errors.
- The system shall save possible mistakes with enough context for later review.
- The system shall identify recurring possible weak Ayahs from available records.
- The system shall generate targeted revision recommendations from available evidence.
- AI findings shall be explicitly labeled as AI-assisted or possible detections.
- AI findings shall not be presented as perfect or guaranteed Quran or Tajweed judgments.
- Teachers shall be able to review, verify, modify, or dismiss AI-detected possible mistakes.
- Teacher-verified results shall be distinguishable from unverified AI output.

### 7.5 Mistakes, Weak Areas, and Learning Feedback

- Students shall be able to view their mistake history.
- Students shall be able to view weak areas and recurring weak Ayahs.
- The system shall associate relevant possible or verified mistakes with practice and exam records.
- Students shall be able to review teacher feedback.
- Teachers shall be able to add feedback to assignments, recitation tests, and exams.
- The system shall distinguish between AI-assisted possible detections and teacher-verified mistakes.

### 7.6 Quizzes, Progress, and Engagement

- Students shall be able to take Hifz quizzes based on available memorization content.
- The system shall show student progress over time.
- The system shall support achievements based on defined learning or activity milestones.
- The system shall provide relevant notifications for assignments, exams, feedback, and reports.

### 7.7 Teacher Management

- Teachers shall be able to view their students and classes.
- Teachers shall be able to assign and manage Sabaq, Sabqi, and Manzil work.
- Teachers shall be able to create and conduct digital Hifz exams.
- Teachers shall be able to view exam results and mistake analysis.
- Teachers shall be able to verify AI-assisted possible mistakes.
- Teachers shall be able to provide feedback and generate reports.

### 7.8 Parent Monitoring

- Parents shall be able to view child progress.
- Parents shall be able to view revision activity.
- Parents shall be able to view exam results and teacher feedback.
- Parents shall be able to receive weekly reports and notifications.

### 7.9 Academy Administration

- Academy admins shall be able to manage teachers.
- Academy admins shall be able to manage students and classes.
- Academy admins shall be able to oversee exams.
- Academy admins shall be able to access reports and academy analytics.
- The system shall maintain appropriate access boundaries between academy records and roles.

## 8. Non-Functional Requirements

### Usability

- The interface shall be clear and usable for students, teachers, parents, and admins with different workflows.
- Core student actions shall be accessible with minimal navigation.
- Quran text and relevant recitation controls shall remain readable and usable on supported desktop and mobile browsers.

### Performance

- Common pages and student learning views should load promptly under normal network conditions.
- Audio playback and recording controls should provide clear status feedback.
- Long-running speech recognition or analysis should show progress and failure states.

### Reliability and Data Integrity

- Assignment, exam, feedback, and verification records shall be stored consistently.
- The system shall prevent accidental loss of submitted exam or verification data.
- The system shall handle unavailable audio, microphone, or speech-recognition services gracefully.

### Security and Privacy

- Authentication and authorization shall protect role-specific data.
- Student, parent, teacher, and academy information shall be handled as private user data.
- Microphone access shall require appropriate user permission.
- Recitation recordings and transcripts shall only be retained and accessed according to defined product policies.
- Administrative actions and teacher verification changes should be auditable.

### Accessibility

- The platform should support keyboard navigation and readable contrast.
- Controls should have clear labels and status feedback.
- The Quran/Mushaf interface should support legible text sizing and responsive layouts.

### AI Transparency

- AI-assisted output shall clearly state that it may be inaccurate or incomplete.
- The system shall not claim that AI provides definitive Tajweed rulings or flawless Quran recitation judgment.
- Users shall be able to tell whether a result is unverified AI output or teacher-verified.

## 9. MVP Scope

The first version should include:

- Role-based authentication and basic profiles for all four user roles.
- Student Quran/Mushaf interface with verified text, audio listening, repeat, and loop controls.
- Student Hide & Recall and Write from Memory practice modes.
- Daily Hifz Goal and basic progress tracking.
- Teacher-created Sabaq, Sabqi, and Manzil assignments.
- Student assignment viewing and completion tracking.
- Basic revision schedule and Smart Revision recommendations based on recorded activity and mistakes.
- Student recitation test flow for a selected Surah/Ayah range.
- Microphone recording and speech-to-text integration where supported.
- AI-assisted comparison that flags supported possible missing, wrong, extra, and sequence errors.
- Mistake history and weak-area views.
- Teacher review and verification of possible AI-detected mistakes.
- Digital Hifz exam records, results, and teacher feedback.
- Parent access to child progress, revision activity, exam results, and feedback.
- Academy admin management of core teachers, students, classes, and exams.
- Basic notifications and reports.

MVP AI output must remain assistive and clearly labeled as possible detection. Teacher verification is required for authoritative academic interpretation.

## 10. Future Scope

Potential future enhancements include:

- More advanced Tajweed guidance with carefully defined limitations and qualified review.
- Improved speech recognition for different accents, recitation styles, and environmental conditions.
- Offline or low-connectivity learning support.
- Native mobile applications.
- Parent and teacher communication tools beyond notifications and feedback.
- Advanced academy dashboards, trends, exports, and configurable analytics.
- Personalized learning plans and adaptive revision calendars.
- Additional quiz types and gamified class challenges.
- Integration with external identity, calendar, communication, or learning systems.
- Multi-language interface support.
- Configurable academy policies, grading schemes, and approval workflows.

## 11. Features Explicitly Out of Scope for the First Version

The following are excluded from the first version:

- Fully autonomous or guaranteed Quran recitation judgment.
- AI-only final grading or certification of a student's Hifz or Tajweed.
- Claims that speech recognition can detect every pronunciation, Tajweed, or recitation issue.
- Automatic replacement of teacher review or qualified human assessment.
- Live video classes or video conferencing.
- Payments, subscriptions, invoicing, or financial management.
- Public social feeds, direct messaging, or open student communities.
- Native iOS or Android applications.
- Offline-first functionality and complete offline Quran/audio synchronization.
- Full academy accounting, HR, attendance, or payroll management.
- Integration with external LMS, school, or identity systems.
- Advanced predictive analytics requiring large historical datasets.
- Custom Quran text, translation, or recitation content authoring by end users.
- Medical, biometric, or unrelated voice profiling.
