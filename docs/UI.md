# HifzMate Pro UI/UX Specification

This document defines the UI/UX direction for HifzMate Pro based on `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, and `docs/SECURITY.md`. It is a design specification only. It does not implement application code, modify `src`, or create database tables.

## Product Experience Principles

- **Calm focus:** The interface should support memorization and revision without visual noise.
- **Trust and clarity:** AI-assisted findings, progress indicators, and exam states must be explicit and understandable.
- **Role relevance:** Each role sees a focused navigation model and only the data permitted by its scope.
- **Readable Quran experience:** Mushaf content and recitation controls receive priority over decorative UI.
- **Progressive disclosure:** Show the most important action first; move details into expandable panels, drawers, or detail pages.
- **Responsive by default:** Student practice must work comfortably on mobile; teacher and academy data views must remain usable on tablet and desktop.
- **Accessible by default:** Keyboard access, visible focus, readable contrast, clear labels, and non-color-only status indicators are required.
- **No AI overclaiming:** Use phrases such as "AI-assisted possible detection" and "Teacher verified". Never use language that implies guaranteed Quran or Tajweed judgment.

## 1. Design System

### Visual direction

HifzMate Pro uses a premium, modern, clean Islamic visual language:

- Dark Islamic green as the primary action and navigation color.
- Soft green for supportive states and selected surfaces.
- Warm cream for reading surfaces and gentle page atmosphere.
- White for content surfaces and strong contrast.
- Subtle gold for achievements, milestones, and restrained highlights.
- Rounded cards with controlled radius and soft shadows.
- Quiet backgrounds with subtle tonal variation rather than busy illustration.
- No large decorative gradients, visual clutter, or excessive ornament around Quran content.

### Component principles

- Use one reusable component library across roles.
- Keep cards for genuinely grouped content, not every section of a page.
- Use icons with visible labels for unfamiliar actions.
- Use tooltips for icon-only controls such as loop, mute, filter, and more actions.
- Keep controls at stable dimensions so loading text and status changes do not shift layout.
- Use a maximum content width of approximately 1440px on large screens.
- Use consistent page headers with title, short context, and one primary action where appropriate.

### Iconography

Use a consistent outline icon set such as Lucide. Icons should support comprehension, not replace essential text. Quran, audio, microphone, calendar, chart, shield, feedback, notification, and role icons should be visually distinct and accessible.

## 2. Color Palette

| Token | Suggested value | Use |
| --- | --- | --- |
| `--color-green-950` | `#0E2B24` | Deep navigation, dark headings, high-emphasis text |
| `--color-green-900` | `#123D31` | Primary brand and sidebar background |
| `--color-green-800` | `#185343` | Primary buttons and active navigation |
| `--color-green-700` | `#26705A` | Hover states and charts |
| `--color-green-100` | `#DCEEE6` | Selected surfaces and soft success backgrounds |
| `--color-green-50` | `#F0F8F4` | Soft panels and page accents |
| `--color-cream-50` | `#FCFAF4` | Mushaf and reading background |
| `--color-cream-100` | `#F5F0E4` | Warm page bands and subtle dividers |
| `--color-white` | `#FFFFFF` | Cards, forms, and clean surfaces |
| `--color-gold-500` | `#B58B3A` | Achievements, milestones, restrained highlights |
| `--color-gold-100` | `#F7EBCB` | Achievement backgrounds |
| `--color-blue-700` | `#28658A` | Informational status |
| `--color-blue-100` | `#E5F1F7` | Informational background |
| `--color-amber-700` | `#9A6817` | Review or attention status |
| `--color-amber-100` | `#FFF3D6` | Attention background |
| `--color-red-700` | `#A33A3A` | Errors and destructive actions |
| `--color-red-100` | `#FBE9E8` | Error background |
| `--color-ink` | `#1F2A26` | Primary text |
| `--color-muted` | `#66736D` | Secondary text |
| `--color-border` | `#DCE4DF` | Borders and dividers |
| `--color-surface-muted` | `#F5F7F5` | Table headers and neutral panels |

### Color rules

- Text and controls must meet accessible contrast requirements.
- Do not communicate status with color alone; pair color with text or an icon.
- Gold is an accent, not a second primary color.
- Red is reserved for errors, destructive actions, and serious warnings.
- Charts must use distinguishable colors and labels, not only shades of green.
- The cream Mushaf surface must preserve readable contrast for Arabic text.

## 3. Typography

Use a readable, distinctive font family rather than a default browser stack. Recommended pairing:

- **Interface font:** `Plus Jakarta Sans` or `Manrope` for English UI, navigation, tables, and controls.
- **Arabic/Quran font:** A properly licensed Quran-compatible Arabic font selected for legibility and script fidelity.
- **Display accent:** The interface font may use a restrained semibold display style for page titles; avoid decorative script fonts for functional content.

| Style | Size | Weight | Use |
| --- | --- | --- | --- |
| Display | 40-48px | 700 | Public landing headline only |
| Page title | 28-32px | 700 | Authenticated page heading |
| Section title | 20-24px | 700 | Major content section |
| Card title | 16-18px | 650 | Repeated content item |
| Body | 14-16px | 400 | General text |
| Small | 12-13px | 500 | Metadata and supporting labels |
| Arabic reading | 28-40px | 400-500 | Mushaf text, responsive to viewport |

- Use line height of approximately 1.5 for English body text.
- Use generous line height for Quran text and never compress Arabic reading into dense cards.
- Avoid all-caps labels for long text.
- Letter spacing remains normal; do not use compressed tracking for readability.

## 4. Spacing System

Use a 4px base scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

- Page padding: 24px desktop, 20px tablet, 16px mobile.
- Card padding: 20-24px desktop, 16-20px mobile.
- Form field gap: 16px.
- Section gap: 32-48px.
- Button gap: 8-12px.
- Sidebar-to-content gap: 24px.
- Use a minimum 44px touch target for primary interactive controls.

## 5. Buttons

### Variants

- **Primary:** Dark green filled button for the page's main action.
- **Secondary:** White or soft green outlined button for a supporting action.
- **Tertiary:** Text button for low-emphasis navigation.
- **Destructive:** Red outlined or filled action with confirmation for irreversible operations.
- **Icon button:** Square or circular stable control with tooltip and accessible label.

### Rules

- Each page should have one visually dominant primary action where a primary action exists.
- Buttons must state the action: `Start test`, `Assign revision`, `Verify detection`, `Publish results`.
- Loading buttons retain their width and show a spinner plus accessible busy state.
- Disabled buttons explain the missing requirement through nearby text or a tooltip.
- Destructive actions require confirmation and should not be placed beside the primary action without separation.

## 6. Cards

- Radius: 10-14px for standard cards; use the smallest radius consistent with the product's polished style.
- Shadow: soft, low-opacity shadow; avoid floating every element.
- Border: subtle border may be used with shadow for clear grouping.
- Cards should contain one coherent idea: a goal, assignment, chart, report, or result.
- Do not place cards inside cards unless the inner item is a genuinely repeated record.
- Cards should have a clear title, status, primary value, and action where applicable.
- Empty cards should explain what is missing and provide one relevant next action.

## 7. Forms

- Use visible labels above fields; placeholders are examples, not labels.
- Group related fields into logical sections with short descriptions.
- Mark required fields and explain constraints before submission.
- Use Surah/Ayah selectors rather than free-form passage text where Quran content is selected.
- Validate dates, passage ranges, role relationships, and file types before submission.
- Preserve user input after recoverable errors.
- Show inline errors next to the field and a summary at the top for long forms.
- Use confirmation screens for exam publication, result release, parent linking, and teacher verification.
- Use text areas for teacher feedback and parent replies with character limits and safe rendering.

## 8. Badges

Badges communicate state, not decoration:

- `Assigned`, `In progress`, `Completed`, `Missed`, `Excused`.
- `Draft`, `Published`, `Open`, `Closed`, `Released`.
- `AI-assisted`, `Possible detection`, `Teacher verified`, `Dismissed`.
- `Active`, `Pending`, `Suspended`, `Ended`.

Use icon plus text where possible. AI-assisted badges must be visually different from teacher-verified badges and must never imply certainty.

## 9. Progress Bars

- Use progress bars for Daily Hifz Goal, assignment completion, revision plan completion, and progress toward a defined milestone.
- Always show the numeric or textual value beside the bar, such as `6 of 10 Ayahs`.
- Include accessible label and current value.
- Use a neutral state when no activity exists; do not show 0% as failure.
- Do not use progress bars for uncertain AI confidence as if it were student correctness.
- Gold may mark achievements; green indicates completion; blue may indicate informational progress.

## 10. Tables

Tables are for teacher and academy scanning, not for student mobile-first workflows.

- Use a clear header row, alignment by data type, and stable column widths.
- Keep primary identity and status columns visible.
- Provide search/filter only when the page has enough records to justify it.
- Use pagination or incremental loading for large lists.
- Provide row actions through a labeled menu, not a cluster of unfamiliar icons.
- On mobile, convert rows to stacked records or allow horizontal scrolling with the primary identity column pinned.
- Do not include private fields in a table simply because admins can technically query them.
- Provide empty, loading, and error table states without collapsing the layout.

## 11. Modals

Use modals for focused confirmation or short tasks, not entire workflows:

- Confirm publish, release, verify, dismiss, delete, or unlink actions.
- Show microphone permission context before recording.
- Show a short feedback form when the underlying record remains visible.
- Use a full-screen sheet on mobile for complex modal content.
- Trap focus, support Escape to close when safe, label the dialog, and return focus to the trigger.
- Destructive confirmations must name the exact record and action.

## 12. Alerts and Notifications

### Inline alerts

- **Info:** Explain AI processing, report scope, or a pending state.
- **Success:** Confirm completion without interrupting the workflow.
- **Warning:** Explain incomplete analysis, missing microphone permission, or unverified findings.
- **Error:** Explain what failed and provide a retry or recovery action.

### Notifications

- Use an in-app notification center and role-appropriate notification indicators.
- Keep notification content minimal; sensitive detail requires authenticated navigation.
- Student notifications: assignments, exams, feedback, results, reminders, and revision prompts.
- Teacher notifications: submissions, exam activity, possible detections requiring review, and feedback events.
- Parent notifications: linked child reports, released results, teacher feedback, and permitted reminders.
- Admin notifications: operational academy events, reports, and management actions.
- Never expose raw recordings, transcripts, or unverified AI details in external notification text.

## 13. Navigation

### Public navigation

- Logo/brand.
- Features.
- How It Works.
- Pricing.
- About.
- Contact.
- Login.
- Register.

Public navigation should stay compact and use one primary call to action: `Get started` or `Sign in`.

### Authenticated navigation

Navigation is role-specific and should not expose inaccessible destinations:

- Student: Dashboard, My Hifz, Quran Library, Daily Plan, Recitation Test, Mistake History, Weak Areas, Smart Revision, Hifz Quiz, Progress, Achievements, Notifications, Settings.
- Teacher: Dashboard, Students, Classes, Assignments, Create Exam, Exam Results, Mistake Analysis, Teacher Verification, Feedback, Reports.
- Parent: Dashboard, Child Progress, Revision Activity, Exam Results, Teacher Feedback, Reports, Notifications.
- Academy Admin: Dashboard, Teachers, Students, Classes, Exams, Reports, Analytics, Settings.

Use breadcrumbs only for deep teacher/admin detail pages. Keep the primary action visible without requiring the user to open multiple menus.

## 14. Sidebar

### Desktop

- Fixed or sticky left sidebar, approximately 248-280px wide.
- Academy/role identity at the top.
- Group navigation into `Overview`, `Learning` or `Management`, and `Account` sections.
- Active item uses a soft green background and a clear left or right indicator.
- Notification count uses a small badge.
- Profile and sign-out actions remain at the bottom.

### Tablet

- Collapsible sidebar with a persistent compact icon rail or a slide-over panel.
- Keep page title and primary action in the content header.

### Mobile

- Use a top bar plus bottom navigation for the most frequent student actions, or a labeled slide-over menu for teacher/admin workflows.
- Do not place all 14 student destinations in a bottom navigation bar.
- Use five frequent destinations at most, with `More` opening the remainder.
- Preserve a visible page title and back navigation for detail pages.

## 15. Responsive Behavior

### Breakpoints

- Mobile: below 640px.
- Tablet: 640-1023px.
- Desktop: 1024px and above.
- Large desktop: 1440px and above with a constrained content width.

### General rules

- Desktop dashboards may use a two- or three-column grid; mobile collapses to one column.
- Charts must remain legible and support horizontal scrolling or simplified labels on mobile.
- Tables transform into stacked list items or a carefully designed horizontal scroll.
- Forms become one column on mobile.
- Modal dialogs become full-screen sheets on small screens.
- Quran text uses stable responsive sizing and generous line height; controls remain touch-friendly.
- Audio controls must not wrap into ambiguous or overlapping layouts.
- Do not hide essential status or AI disclaimers on mobile.

## Shared Page States

Every authenticated page must define these states:

- **Loading:** Skeleton matching the final layout, with no sudden layout shift.
- **Empty:** Plain-language explanation and one relevant next action.
- **Error:** Safe message, retry action, and support context where needed.
- **Unauthorized:** Explain that the account does not have access without revealing whether the record exists.
- **Offline or service unavailable:** Preserve local form state where possible and explain what could not be saved.
- **Success:** Confirm the saved action and update the visible state.

## Public Pages

Public pages are brand and information surfaces. They must not imply that billing or AI capabilities exceed the PRD.

### Landing Page

**Purpose:** Introduce HifzMate Pro as a Hifz learning, revision, management, and AI-assisted recitation platform.

**Layout:** A restrained first viewport with brand name, concise value statement, product visual or Quran/Mushaf-inspired interface preview, and two actions: `Get started` and `Sign in`. Follow with a compact role strip and a visible next section preview.

**Main components:** Header, hero, role benefits, product workflow preview, AI transparency note, final CTA, footer.

**Information displayed:** Student, teacher, parent, and academy value; learning/revision/exam workflow; AI-assisted limitation.

**User actions:** Navigate to Register, Login, Features, How It Works, Pricing, About, Contact.

**Empty/loading/error:** Static content should not block on data. If a visual asset fails, use a calm fallback panel rather than a broken image.

**Mobile:** Stack hero content, keep the next section partially visible, use full-width CTAs, and avoid oversized headline wrapping.

### Features

**Purpose:** Explain the PRD-defined capabilities by role.

**Layout:** Segmented role selector followed by grouped feature sections, not a dense feature wall.

**Main components:** Role tabs, feature groups, small interface previews, AI disclaimer.

**Information displayed:** Mushaf, audio, practice, goals, assignments, recitation tests, mistakes, reports, and analytics.

**User actions:** Switch role, open How It Works, Register, Login.

**Empty/loading/error:** Static page; graceful image fallback only.

**Mobile:** Role selector becomes a horizontal scroll or select control; feature groups become a single-column sequence.

### How It Works

**Purpose:** Show the connected workflow from assignment to practice, review, verification, and progress.

**Layout:** Four role lanes or a simple numbered flow, with a dedicated AI-assisted recitation flow.

**Main components:** Workflow steps, role switcher, privacy note, teacher verification callout.

**Information displayed:** Student practice, teacher review, parent monitoring, academy oversight.

**User actions:** Register, Login, explore role-specific sections.

**Empty/loading/error:** Static page with asset fallbacks.

**Mobile:** Convert lanes to vertical steps and keep each step short.

### Pricing

**Purpose:** Provide a transparent product-plan placeholder for the requested public page.

**Layout:** Informational plan comparison with a clear `Contact academy` or `Get started` action.

**Main components:** Plan/availability cards, included capabilities, academy contact CTA, scope note.

**Information displayed:** Only product access or deployment options that have been decided. Do not present actual billing unless a future product decision defines it.

**User actions:** Contact, Register, Login.

**Empty/loading/error:** Show `Plans are being finalized` if plan data is unavailable; never show invented prices.

**Mobile:** Stack plans and keep comparison labels readable.

**Scope note:** Payments, subscriptions, invoicing, and financial management are explicitly out of scope for version one in the PRD.

### About

**Purpose:** Explain the project purpose and the Hifz learning problem it addresses.

**Layout:** Short mission, project context, role impact, responsible AI statement.

**Main components:** Mission section, project principles, AI transparency note, contact CTA.

**Information displayed:** HifzMate Pro purpose and intended users; no unsupported institutional claims.

**User actions:** Navigate to Contact, Register, Login.

**Empty/loading/error:** Static content with asset fallback.

**Mobile:** Single-column sections with readable body width.

### Contact

**Purpose:** Provide a controlled contact entry point.

**Layout:** Contact form beside concise contact information or a single stacked form on mobile.

**Main components:** Name, email, message, reason selector, consent/help text, submit state.

**Information displayed:** Contact purpose and expected response context.

**User actions:** Submit message, navigate to Login/Register.

**Empty/loading/error:** Empty form is intentional; loading disables submit; error preserves fields and explains correction.

**Mobile:** One-column form with full-width submit button.

### Login

**Purpose:** Authenticate an existing user.

**Layout:** Centered authentication panel with calm cream background and clear role-neutral branding.

**Main components:** Email, password, show-password control, sign-in button, recovery link, Register link.

**Information displayed:** Safe authentication error, session status, support/contact route.

**User actions:** Sign in, recover password, register.

**Empty/loading/error:** Loading button; generic invalid-credentials message; do not reveal whether an email exists.

**Mobile:** Full-width panel with comfortable touch targets.

### Register

**Purpose:** Begin secure account registration or invitation-based onboarding.

**Layout:** Short form followed by role/academy onboarding step only where the product allows self-registration.

**Main components:** Display name, email, password, confirmation, role or invitation context, terms/privacy acknowledgment.

**Information displayed:** Verification and onboarding next steps; no role is granted merely from client selection.

**User actions:** Register, return to Login.

**Empty/loading/error:** Inline validation, password requirements, generic account-exists response, preserved form state.

**Mobile:** Single-column form and clear progress indicator if onboarding has multiple steps.

## Student Pages

Student pages prioritize action, reading, audio, and review. Data is limited to the student's own records and released teacher content.

### Student Dashboard

**Purpose:** Give the student one calm starting point for today's Hifz work.

**Layout:** Header greeting, Daily Hifz Goal as the primary visual, today's Sabaq/Sabqi/Manzil, revision queue, progress snapshot, and notifications.

**Main components:** Goal progress card, assignment list, revision list, quick actions, progress chart, recent feedback.

**Information displayed:** Due work, completion, upcoming exams, recommendations, recent verified feedback, achievements.

**User actions:** Open assignment, start practice, start recitation test, open Smart Revision, mark permitted task progress.

**Empty:** No assignment state links to Quran Library or personal practice; no notifications state stays quiet.

**Loading:** Skeleton goal, assignment rows, and chart.

**Error:** Show which panel failed and allow retry without blanking the entire dashboard.

**Mobile:** Goal and next action first; charts become compact cards; lists are one column.

### My Hifz

**Purpose:** Show the student's current memorization state by passage.

**Layout:** Summary header, Surah progress navigator, passage status list, and detail drawer/page.

**Main components:** Surah selector, status filters, progress bars, passage rows, practice action.

**Information displayed:** Not started, learning, memorized, revision status; last practice; permitted teacher verification state.

**User actions:** Open passage, practice, listen, hide text, write from memory, filter status.

**Empty:** No progress yet explains how practice creates progress.

**Loading:** Passage skeleton and chart placeholder.

**Error:** Retry passage data and preserve selected Surah.

**Mobile:** Use a Surah selector and stacked passage cards; avoid a dense matrix.

### Quran Library

**Purpose:** Browse verified Quran content and audio for practice.

**Layout:** Search or Surah selector, Mushaf reading surface, Ayah range controls, bottom audio player.

**Main components:** Surah/Ayah selector, Arabic text, audio player, repeat/loop controls, Hide & Recall, Write from Memory actions.

**Information displayed:** Verified text, selected range, audio state, current Ayah, practice mode.

**User actions:** Browse, select range, listen, repeat, loop, hide/reveal, write from memory, begin recitation test.

**Empty:** Explain when audio is unavailable or no passage is selected.

**Loading:** Text and audio placeholders that preserve reading geometry.

**Error:** Distinguish text loading, audio unavailable, and browser playback errors.

**Mobile:** Reading surface fills the viewport; controls become a sticky bottom toolbar with labeled icons and a compact range drawer.

### Daily Plan

**Purpose:** Turn goals, assignments, and revision recommendations into today's actionable plan.

**Layout:** Date header, goal summary, ordered timeline of tasks, completion controls.

**Main components:** Date navigation, goal progress, Sabaq/Sabqi/Manzil sections, revision items, completion state.

**Information displayed:** Passage, activity type, due time/date, reason, priority, completion.

**User actions:** Start task, open Mushaf, complete, skip where permitted, open recommendation reason.

**Empty:** No plan explains how to open Quran Library or wait for teacher assignment.

**Loading:** Timeline skeleton.

**Error:** Preserve selected date and allow retry.

**Mobile:** One task per row with a sticky date control and large start buttons.

### Recitation Test

**Purpose:** Record a selected passage and show an AI-assisted possible detection result for learning and teacher review.

**Layout:** Three-step flow: Select passage, Record, Review result. Keep the recording state visually dominant.

**Main components:** Passage selector, microphone permission panel, recording timer/waveform, stop/retry/submit controls, processing status, transcript/result comparison, AI disclaimer.

**Information displayed:** Selected Surah/Ayahs, microphone state, recording duration, transcript status, possible missing/wrong/extra/sequence detections, teacher verification state when available.

**User actions:** Select range, grant permission, record, stop, retry, submit, review possible detection, open revision recommendation.

**AI language:** Use `AI-assisted possible detection`, `Transcript may be incomplete`, and `Teacher verification required`. Never show `correct`, `incorrect`, `perfect`, or Tajweed certainty based only on AI.

**Empty:** No passage selected; no previous tests; no detections found must say `No possible detections were identified`, not `Perfect recitation`.

**Loading:** Recording, uploading, transcribing, and analyzing are separate statuses with progress text.

**Error:** Microphone denied, unsupported browser, upload failed, speech recognition failed, incomplete transcript, and analysis unavailable each get a specific recovery action.

**Mobile:** Use a full-screen focused recorder; keep stop/retry controls reachable; show disclaimer above results without hiding it below the fold.

### Mistake History

**Purpose:** Help the student review possible and teacher-verified mistakes over time.

**Layout:** Summary strip, filters, chronological list, detail panel.

**Main components:** Status/type filters, Ayah search, timeline rows, status badges, teacher note panel, practice action.

**Information displayed:** Date, passage, possible detection type, source test, status, teacher note if released, recurrence count.

**User actions:** Filter, open passage, practice, open test, view teacher verification state.

**Empty:** Explain that practice and recitation tests will populate history; do not imply failure.

**Loading:** Timeline skeleton with filter placeholders.

**Error:** Retry history and maintain filters.

**Mobile:** Use stacked timeline cards with status first; filters open in a bottom sheet.

### Weak Areas

**Purpose:** Surface recurring Ayahs and patterns as learning indicators.

**Layout:** Introductory explanation, ranked weak-area list, trend chart, practice actions.

**Main components:** Ayah ranking, occurrence count, recent activity, confidence label (`Possible` or `Teacher confirmed`), practice CTA.

**Information displayed:** Recurring passage, detection type, occurrence trend, last occurrence, teacher-confirmed distinction.

**User actions:** Open passage, start targeted practice, filter by type/status.

**Empty:** Explain that weak areas appear after enough recorded activity and are not a judgment of religious correctness.

**Loading:** Chart and list skeleton.

**Error:** Retry and show last-known state only if clearly marked stale.

**Mobile:** Ranked list first, chart below; preserve labels and explanation.

### Smart Revision

**Purpose:** Provide transparent, targeted revision recommendations.

**Layout:** Recommendation queue with a `Why this is recommended` detail area.

**Main components:** Recommendation cards, reason, priority, source indicator, start action, completion state.

**Information displayed:** Passage, recommended activity, reason, priority, due date, source such as assignment, verified mistake, or possible weak Ayah.

**User actions:** Start, complete, skip where permitted, open source record, give feedback through existing teacher workflow where available.

**Empty:** Explain that recommendations need activity, assignments, or mistake history; link to Daily Plan.

**Loading:** Recommendation cards with stable dimensions.

**Error:** Explain whether recommendation generation or source data failed; allow retry.

**Mobile:** One recommendation per card with reason expandable below the action.

### Hifz Quiz

**Purpose:** Provide memorization quiz practice based on available content.

**Layout:** Quiz setup, focused quiz state, result summary.

**Main components:** Passage/activity selection, prompt, answer/reveal controls, progress indicator, completion summary.

**Information displayed:** Selected range, question progress, result, related practice recommendation.

**User actions:** Start, answer, reveal where allowed, move next, finish, practice weak area.

**Empty:** No eligible quiz content explains how to select a Quran passage or complete assignments.

**Loading:** Quiz setup and question skeleton.

**Error:** Save failure preserves current question state where possible.

**Mobile:** One question at a time with large controls and no distracting side content.

### Progress

**Purpose:** Show progress toward Hifz and revision goals without overclaiming certainty.

**Layout:** Summary metrics, time-series charts, assignment/revision breakdown, recent milestones.

**Main components:** Progress chart, goal completion, activity trend, Sabaq/Sabqi/Manzil breakdown, date range selector.

**Information displayed:** Recorded practice, completed work, revision consistency, exam results where released, teacher-verified indicators.

**User actions:** Change period, open source activity, view related assignments.

**Empty:** Explain that charts populate as activity is recorded.

**Loading:** Chart frame and metric skeletons.

**Error:** Per-chart retry so one failed metric does not hide the whole page.

**Mobile:** Charts become horizontally scrollable or simplified with a data table alternative.

### Achievements

**Purpose:** Show defined learning milestones and earned achievements.

**Layout:** Earned achievements first, progress toward available milestones second.

**Main components:** Achievement cards, earned date, evidence summary, progress indicator.

**Information displayed:** Achievement title, criteria summary, date, evidence snapshot.

**User actions:** Open evidence, navigate to related progress.

**Empty:** Explain that achievements are based on defined activity milestones.

**Loading:** Card skeleton grid.

**Error:** Retry achievement catalog.

**Mobile:** One-column cards with gold used sparingly.

### Notifications

**Purpose:** Centralize student assignments, feedback, exam, result, and revision reminders.

**Layout:** Unread summary, grouped notification list, read/unread filter.

**Main components:** Notification rows, type icon, timestamp, unread state, mark-read action.

**Information displayed:** Minimal event text and authorized destination.

**User actions:** Open authorized source, mark read, filter.

**Empty:** Calm `You're up to date` state.

**Loading:** Row skeleton.

**Error:** Retry notification feed.

**Mobile:** Full-width rows with clear unread indicator.

### Settings

**Purpose:** Manage permitted profile, preferences, session, and privacy controls.

**Layout:** Grouped settings sections rather than one long form.

**Main components:** Profile fields, locale/timezone, notification preferences, session/security actions, recording/privacy information.

**Information displayed:** Current profile and preferences; no secrets.

**User actions:** Update permitted fields, sign out, start account recovery, review privacy/recording information.

**Empty/loading/error:** Skeleton fields; inline save errors; never expose passwords or keys.

**Mobile:** Stacked sections with sticky save only when needed.

## Teacher Pages

Teacher UI prioritizes scanning, authorization scope, assignment creation, assessment, verification, feedback, and reports.

### Teacher Dashboard

**Purpose:** Show urgent student and class work.

**Layout:** Metrics row, pending reviews, upcoming exams, assignment activity, class snapshot.

**Main components:** Authorized student count, pending possible detections, upcoming exam list, submissions, class progress chart.

**Information displayed:** Only authorized students/classes; AI findings clearly labeled.

**User actions:** Open review, create assignment, create exam, open report.

**Empty:** No assigned students or pending work provides onboarding guidance without exposing academy-wide data.

**Loading:** Metric and table skeletons.

**Error:** Panel-level retry.

**Mobile:** Pending actions first; dense metrics become horizontal cards.

### Students

**Purpose:** Browse and manage authorized students.

**Layout:** Search/filter header, table on desktop, stacked records on mobile, student detail route.

**Main components:** Student identity, class, status, recent progress, pending review count, actions menu.

**Information displayed:** Authorized operational data only.

**User actions:** Open student, assign work, view progress, view reports.

**Empty:** No authorized students state with class/link guidance.

**Loading:** Table skeleton.

**Error:** Retry and preserve filters.

**Mobile:** Search and filters in a sheet; cards replace table rows.

### Classes

**Purpose:** View authorized classes and memberships.

**Layout:** Class list with teacher/student counts, class detail tabs.

**Main components:** Class cards/table, roster, assignments, exams, class progress chart.

**Information displayed:** Class name, status, authorized roster, activity summary.

**User actions:** Open class, manage permitted membership, create assignment/exam, report.

**Empty:** No classes explains how academy assignment is established.

**Loading:** Class cards and roster skeleton.

**Error:** Retry class data.

**Mobile:** Class cards with detail pages rather than wide tabs.

### Assignments

**Purpose:** Create and track Sabaq, Sabqi, and Manzil work.

**Layout:** Filterable assignment list with a prominent `Create assignment` action; creation uses a focused form.

**Main components:** Type filter, passage selector, due date, class/student target selector, status, completion table.

**Information displayed:** Passage, assignment type, date, target scope, completion status, feedback state.

**User actions:** Create, publish, edit draft, close, view targets, add feedback.

**Empty:** Explain how to create the first assignment.

**Loading:** List/form skeleton.

**Error:** Validation errors preserve form values; publish failure does not create ambiguous status.

**Mobile:** Form sections stack; target roster becomes a separate step.

### Create Exam

**Purpose:** Create and publish a digital Hifz exam.

**Layout:** Stepper: Details, Passage, Eligible students/class, Review and publish.

**Main components:** Title/instructions, passage selector, class/student scope, scheduled time, publish confirmation.

**Information displayed:** Eligibility, scope, release behavior, teacher ownership.

**User actions:** Save draft, publish, cancel, return to draft.

**Empty:** No eligible students explains authorization or class membership issue without revealing unrelated users.

**Loading:** Step-level loading and publish processing.

**Error:** Invalid passage, scope mismatch, or publish failure with safe recovery.

**Mobile:** Stepper becomes a vertical sequence; review summary remains visible before publish.

### Exam Results

**Purpose:** Review attempts, record results, and release authorized outcomes.

**Layout:** Exam selector, attempt table, result detail panel.

**Main components:** Student, submission status, score field, feedback, AI-assisted status, review/release actions.

**Information displayed:** Authorized attempts, teacher-entered result, feedback, timestamps, release state.

**User actions:** Review, enter result, add feedback, release result, filter status.

**Empty:** No attempts or no exams state with clear next action.

**Loading:** Attempt table skeleton.

**Error:** Save/release failure preserves entered values and prevents duplicate submission.

**Mobile:** Attempt rows become student cards; result editing uses a full-screen sheet.

### Mistake Analysis

**Purpose:** Analyze recurring possible and verified mistakes for authorized students/classes.

**Layout:** Filter bar, trend chart, ranked Ayah list, detail drawer.

**Main components:** Detection type filters, possible/verified toggle, frequency chart, passage list, practice/verification links.

**Information displayed:** Occurrences, dates, Ayahs, test sources, review status, class aggregates where authorized.

**User actions:** Filter, open test, start verification, assign revision, export only if later permitted.

**Empty:** Explain that analysis requires recorded recitations and activity.

**Loading:** Chart and list skeleton.

**Error:** Panel-level retry; stale data clearly marked.

**Mobile:** Filters in a sheet; ranking before chart; no wide analytics table.

### Teacher Verification

**Purpose:** Make a deliberate, auditable decision on AI-assisted possible detections.

**Layout:** Queue of unreviewed detections with a focused review workspace.

**Main components:** Passage/text reference, transcript where authorized, audio playback where authorized, detection label, teacher decision controls, note field, audit context.

**Information displayed:** Possible missing/wrong/extra/sequence detection, reference Ayah, source test, processing status, previous review history.

**User actions:** Verify, modify type, dismiss, add note, open student revision context.

**Required language:** `Possible AI-assisted detection` remains visible. Decision labels must be `Teacher verified`, `Modified`, or `Dismissed`; never `AI confirmed`.

**Empty:** `No detections awaiting review` is a positive queue state.

**Loading:** Queue skeleton and separate audio/transcript processing state.

**Error:** Authorization expired, audio unavailable, or save conflict must prevent silent decision loss.

**Mobile:** One detection at a time; audio and reference text remain accessible without horizontal scrolling; confirmation uses a bottom sheet.

### Feedback

**Purpose:** Create and review teacher feedback for assignments, tests, exams, and students.

**Layout:** Context selector, feedback composer, timeline of existing feedback.

**Main components:** Student/source context, visibility selector, text area, feedback history, parent-visible indicator.

**Information displayed:** Author, date, source, visibility, body, reply state where permitted.

**User actions:** Create, edit permitted recent feedback, set visibility, read parent reply where authorized.

**Empty:** No feedback state encourages a specific context rather than generic clutter.

**Loading:** Composer and timeline skeleton.

**Error:** Save error preserves draft; unsafe content is rejected safely.

**Mobile:** Composer opens as a full-screen sheet.

### Reports

**Purpose:** Produce student and class reports from authorized source data.

**Layout:** Report type/date/student/class selectors followed by preview and generation state.

**Main components:** Filters, metric preview, report summary, teacher feedback inclusion, publish/share controls.

**Information displayed:** Progress, revision activity, assignments, exams, verified feedback, possible detection summaries where appropriate.

**User actions:** Generate, review, publish/release, open source record.

**Empty:** No data for selected period explains how to change filters.

**Loading:** Preview skeleton and report generation progress.

**Error:** Generation retry; do not publish partial reports as complete.

**Mobile:** Filter form first, report preview below, avoid dense print-like tables.

## Parent Pages

Parent pages are read-focused, linked-child scoped, and emphasize understandable summaries rather than raw academic internals.

### Parent Dashboard

**Purpose:** Show the linked child's current status at a glance.

**Layout:** Child selector if multiple links, weekly summary, progress snapshot, recent activity, results/feedback cards.

**Main components:** Child switcher, goal/progress summary, revision activity, latest released result, feedback preview, notification list.

**Information displayed:** Linked child only; published/released information and permitted summaries.

**User actions:** Switch child, open progress, read report, open feedback, view notification.

**Empty:** No active linked child explains secure linking next steps without exposing account existence.

**Loading:** Summary card skeletons.

**Error:** Per-child retry and link-state explanation.

**Mobile:** Child selector and current summary remain at top; cards stack.

### Child Progress

**Purpose:** Explain a child's memorization and revision progress.

**Layout:** Date range, progress summary, activity trend, assignment/revision breakdown.

**Main components:** Progress chart, completed activity, goal trend, teacher-released milestones.

**Information displayed:** Recorded activity and released summaries, not raw private data or unverified AI details.

**User actions:** Change period, open weekly report, view permitted feedback.

**Empty:** Explain that progress appears as the child records activity.

**Loading:** Chart and metric skeletons.

**Error:** Retry by metric.

**Mobile:** Simplified chart with a data summary below.

### Revision Activity

**Purpose:** Show what revision work the linked child has completed.

**Layout:** Date filter and timeline/list of revision sessions and completed plans.

**Main components:** Activity type, passage summary, completion status, date, teacher note if released.

**Information displayed:** Revision activity summaries only; no raw recordings.

**User actions:** Filter date/type, open released related report.

**Empty:** Explain when no activity has been recorded for the period.

**Loading:** Timeline skeleton.

**Error:** Retry with selected filters preserved.

**Mobile:** Stacked timeline cards.

### Exam Results

**Purpose:** Show released exam outcomes for linked children.

**Layout:** Results list with detail view.

**Main components:** Exam title/date, status, score where released, teacher feedback, release timestamp.

**Information displayed:** Released results only; AI status is summarized cautiously if relevant.

**User actions:** Open result, read feedback, view report.

**Empty:** No released results state.

**Loading:** Result list skeleton.

**Error:** Retry and preserve child selection.

**Mobile:** Result cards with clear released status.

### Teacher Feedback

**Purpose:** Let a parent read permitted teacher feedback and reply where the product supports it.

**Layout:** Feedback timeline grouped by child/context, reply composer for permitted items.

**Main components:** Visibility badge, source, teacher, date, body, parent reply field.

**Information displayed:** Feedback marked for student/parent visibility; no private teacher notes.

**User actions:** Read, reply, filter by child/date.

**Empty:** No released feedback state.

**Loading:** Timeline skeleton.

**Error:** Reply failure preserves text and prevents duplicate sends.

**Mobile:** One feedback thread per screen or expandable card.

### Reports

**Purpose:** View published weekly reports.

**Layout:** Report period list and readable report detail.

**Main components:** Period selector, summary, metrics, progress chart, teacher feedback, permitted reply.

**Information displayed:** Published snapshot of activity, progress, results, and feedback.

**User actions:** Open report, reply where enabled, switch child.

**Empty:** No published reports state.

**Loading:** Report skeleton.

**Error:** Retry report detail.

**Mobile:** Narrative summary first, charts below.

### Notifications

**Purpose:** Receive permitted child-related notifications.

**Layout:** Notification list with unread filter.

**Main components:** Event type, child context, timestamp, authorized link.

**Information displayed:** Minimal content with authenticated detail destination.

**User actions:** Open, mark read, filter.

**Empty:** `You're up to date`.

**Loading:** Notification row skeleton.

**Error:** Retry.

**Mobile:** Full-width list rows.

## Academy Admin Pages

Academy Admin pages are operational and data-dense but must preserve privacy boundaries around raw audio, transcripts, and private notes.

### Academy Dashboard

**Purpose:** Show academy-level operational health.

**Layout:** Metrics, class participation, exam activity, report status, and trend charts.

**Main components:** Student/teacher/class counts, assignment completion, exam status, activity trend, notifications.

**Information displayed:** Academy-scoped aggregates and operational data.

**User actions:** Open teachers, students, classes, exams, reports, analytics.

**Empty:** No academy activity state with setup guidance.

**Loading:** Metric and chart skeletons.

**Error:** Independent panel retry.

**Mobile:** Metrics become horizontal cards; charts stack.

### Teachers

**Purpose:** Manage academy teacher memberships and view operational assignments.

**Layout:** Searchable table, status filters, teacher detail page.

**Main components:** Name, membership status, classes, assigned student count, actions menu.

**Information displayed:** Academy-scoped operational data only.

**User actions:** Invite, activate, suspend, assign class, view permitted reports.

**Empty:** No teachers state with invite action.

**Loading:** Table skeleton.

**Error:** Retry and preserve filters.

**Mobile:** Stacked teacher records with action menu.

### Students

**Purpose:** Manage academy student memberships and view operational summaries.

**Layout:** Search/filter table, student detail route, class/link summary.

**Main components:** Student name, membership status, class, teacher count, parent-link status, progress summary.

**Information displayed:** Academy-scoped fields; no unrestricted raw recordings or transcripts.

**User actions:** Invite/activate/suspend, assign class, manage permitted relationships, open report.

**Empty:** No students state.

**Loading:** Table skeleton.

**Error:** Retry.

**Mobile:** Stacked records.

### Classes

**Purpose:** Manage classes and their authorized teacher/student memberships.

**Layout:** Class list, detail tabs for roster, assignments, exams, and summary.

**Main components:** Class metadata, roster management, counts, class activity chart.

**Information displayed:** Academy-scoped class data.

**User actions:** Create/archive class, add/remove members, open assignment/exam/report.

**Empty:** No classes state with create action.

**Loading:** Class cards/skeleton.

**Error:** Retry.

**Mobile:** Detail tabs become stacked sections.

### Exams

**Purpose:** Oversee academy exams and release states.

**Layout:** Filterable exam table with detail route.

**Main components:** Exam title, creator, class, schedule, status, result release state.

**Information displayed:** Academy operational exam data.

**User actions:** Open, review permitted state, manage according to admin policy.

**Empty:** No exams state.

**Loading:** Table skeleton.

**Error:** Retry.

**Mobile:** Exam cards with status and date.

### Reports

**Purpose:** View academy-scoped student/class/operational reports.

**Layout:** Report type/date/class filters, preview, publication state.

**Main components:** Scope selector, metrics, report summary, access-controlled actions.

**Information displayed:** Aggregates and permitted report content.

**User actions:** Generate, review, publish/share within academy policy.

**Empty:** No report data for selection.

**Loading:** Report generation skeleton.

**Error:** Retry; never show partial private output as final.

**Mobile:** Filters stack and preview becomes narrative-first.

### Analytics

**Purpose:** Provide academy-level trends for participation, progress, revision, mistakes, and exams.

**Layout:** Date range and class filters, chart grid, tabular summary alternative.

**Main components:** Activity trend, completion rate, exam status, weak-area aggregate, class comparison.

**Information displayed:** Aggregated academy data; raw private audio/transcripts excluded.

**User actions:** Filter period/class, inspect source report where authorized.

**Empty:** Explain that analytics require recorded academy activity.

**Loading:** Chart skeletons with stable heights.

**Error:** Per-chart retry and stale-state label.

**Mobile:** One chart per section with a compact data table alternative.

### Settings

**Purpose:** Manage academy-level permitted configuration and admin preferences.

**Layout:** Sections for academy profile, membership policy, notification preferences, reporting preferences, and security/audit access.

**Main components:** Academy fields, role/membership controls, report defaults, audit access explanation.

**Information displayed:** Current academy configuration and policy states.

**User actions:** Update permitted settings, manage membership policy, review security guidance.

**Empty/loading/error:** Skeleton fields; validation and authorization errors preserve edits.

**Mobile:** Stacked sections with explicit save actions.

## Special Interaction Specifications

### AI-assisted recitation

The test experience must make the following sequence visible:

1. Select Surah/Ayah range.
2. Confirm microphone permission and recording context.
3. Record with a clear timer and stop control.
4. Upload and process with explicit status.
5. Show transcript availability and possible detections.
6. Explain that detections may be inaccurate or incomplete.
7. Show teacher verification status when available.
8. Offer targeted practice without presenting the result as a final judgment.

Never use a green success state that says `Perfect`, `Correct Quran`, or `Tajweed passed` based only on AI output.

### Mistake history and weak areas

- Keep `Possible detection`, `Teacher verified`, `Modified`, and `Dismissed` visually distinct.
- Use filters that answer practical questions: `Needs review`, `Teacher verified`, `Recent`, `Ayah`, and `Type`.
- Show recurrence as a learning signal, not a permanent label about the student.
- Give every item a path to practice the passage.
- Parent views should show only released summaries and verified outcomes according to the security plan.

### Smart Revision

- Explain why a passage is recommended in plain language.
- Show source context such as assignment, recent practice gap, verified mistake, or possible weak Ayah.
- Allow completion tracking without forcing the student through a complex planning interface.
- Use priority sparingly and avoid presenting recommendations as authoritative.

### Progress charts

- Use charts for trends and comparisons, not decoration.
- Pair every chart with a short summary and accessible data alternative.
- Label date range, unit, and source clearly.
- Use a neutral empty state when there is insufficient data.
- Never plot AI confidence as student correctness or Tajweed accuracy.

### Teacher verification

- Put source passage, possible detection, reference text, and relevant audio/transcript in one review context where authorized.
- Require an explicit decision and preserve the original AI state.
- Make the audit consequence visible before submission.
- Prevent accidental confirmation through a default-selected action.

### Parent monitoring

- Start with a summary, then allow drill-down into released reports and feedback.
- Use plain language rather than internal status terminology.
- Avoid raw recordings, transcripts, private notes, and unreviewed detections by default.
- Make child switching explicit and persistent so data from two children cannot be confused.

## Accessibility Requirements

- All interactive controls must be keyboard reachable and have visible focus.
- Every icon-only control needs an accessible name and tooltip.
- Forms use labels, descriptions, error associations, and logical focus order.
- Modals trap focus and return it to the trigger.
- Status must be communicated through text and icon, not color alone.
- Audio recording and processing states must be announced to assistive technology.
- Charts provide summaries or tabular alternatives.
- Arabic text must remain selectable, legible, and correctly rendered.
- Avoid motion that can interfere with concentration; provide reduced-motion behavior.
- Touch targets should be at least 44px where practical.

## Review Against Source Documents

### Major feature coverage

- Quran/Mushaf, audio, repeat, loop, Hide & Recall, and Write from Memory: Quran Library.
- Daily Hifz Goal, Sabaq, Sabqi, Manzil, assignments, and revision schedule: Student Dashboard, Daily Plan, Assignments.
- Recitation Test, microphone, transcript, possible missing/wrong/extra/sequence detections: Recitation Test.
- Mistake History, Weak Areas, teacher verification, and Smart Revision: dedicated student and teacher pages.
- Hifz Quiz, Progress, Achievements, and Notifications: dedicated student pages.
- Teacher students/classes/assignments/exams/results/analysis/feedback/reports: dedicated teacher pages.
- Parent progress/activity/results/feedback/reports/notifications: dedicated parent pages.
- Academy teachers/students/classes/exams/reports/analytics/settings: dedicated admin pages.
- Responsive, accessible, mobile/tablet/desktop behavior: design system and responsive sections.
- Privacy boundaries and role-scoped content: security notes throughout page specifications.

### Missing or contradictory requirements identified

1. **Pricing page versus PRD scope:** The requested public Pricing page conflicts with the PRD's first-version exclusion of payments, subscriptions, invoicing, and financial management. This specification treats Pricing as an informational placeholder with no billing or invented prices.
2. **Public marketing pages:** Landing, Features, How It Works, Pricing, About, and Contact were requested here but are not functional requirements in the PRD. They are documented as lightweight public surfaces and do not add product workflows.
3. **Parent visibility:** The PRD requires parent progress, activity, results, feedback, reports, and notifications but does not define access to raw AI results or recordings. This specification follows `SECURITY.md`: parents receive released summaries and verified outcomes by default.
4. **Teacher/admin report scope:** The PRD requires reports and analytics but does not define export, print, or sharing behavior. This specification avoids adding export as a default feature and treats report sharing as permission-controlled.
5. **Exam retakes and detailed grading:** The PRD does not define retake rules or a grading rubric. The UI shows result and release states without inventing a grading system.
6. **Contact submission behavior:** The PRD requests a Contact page but does not define message delivery. The UI specifies form states only; provider and retention behavior remain an implementation decision.
7. **Design tokens:** The requested palette is explicit, but final contrast validation and the licensed Arabic font selection must be confirmed before implementation.

No application code, database tables, or `src` files are modified by this document.
