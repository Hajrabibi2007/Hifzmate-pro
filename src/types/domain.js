const values = (...items) => Object.freeze(items)

export const ROLES = Object.freeze({
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ACADEMY_ADMIN: 'academy_admin',
})

export const ACADEMY_STATUS = values('active', 'suspended', 'archived')
export const MEMBERSHIP_STATUS = values('invited', 'active', 'suspended', 'ended')
export const TEACHER_LINK_STATUS = values('active', 'ended')
export const PARENT_LINK_STATUS = values('pending', 'active', 'ended')
export const CLASS_STATUS = values('active', 'archived')

export const ASSIGNMENT_TYPES = values('sabaq', 'sabqi', 'manzil')
export const ASSIGNMENT_STATUS = values('draft', 'published', 'closed', 'cancelled')
export const ASSIGNMENT_TARGET_STATUS = values('assigned', 'in_progress', 'completed', 'missed', 'excused')

export const RECITATION_TEST_TYPES = values('practice', 'exam')
export const RECITATION_TEST_STATUS = values('created', 'recorded', 'processing', 'completed', 'failed', 'cancelled')
export const TRANSCRIPT_STATUS = values('pending', 'completed', 'failed', 'incomplete')
export const ANALYSIS_STATUS = values('queued', 'processing', 'completed', 'failed', 'incomplete')

export const MISTAKE_TYPES = values('missing', 'wrong', 'extra', 'sequence')
export const POSSIBLE_MISTAKE_STATUS = values('unreviewed', 'verified', 'modified', 'dismissed')
export const VERIFICATION_DECISIONS = values('verified', 'modified', 'dismissed')

export const EXAM_STATUS = values('draft', 'published', 'open', 'closed', 'cancelled')
export const EXAM_ATTEMPT_STATUS = values('eligible', 'started', 'submitted', 'reviewed', 'released', 'withdrawn')
export const FEEDBACK_VISIBILITY = values('private', 'student', 'student_parent')

export const REVISION_PLAN_SOURCE = values('teacher', 'system', 'student')
export const REVISION_PLAN_STATUS = values('draft', 'active', 'completed', 'archived')
export const REVISION_ITEM_ACTIVITY = values('revision', 'hide_recall', 'write_memory', 'audio', 'quiz')
export const REVISION_ITEM_STATUS = values('planned', 'started', 'completed', 'skipped', 'expired')

export const REPORT_STATUS = values('draft', 'published', 'archived')
export const NOTIFICATION_TYPES = values('assignment', 'exam', 'feedback', 'result', 'reminder', 'revision', 'report')
export const NOTIFICATION_DELIVERY_STATUS = values('queued', 'sent', 'delivered', 'failed', 'cancelled')

export const STATUS_GROUPS = Object.freeze({
  academy: ACADEMY_STATUS,
  membership: MEMBERSHIP_STATUS,
  teacherLink: TEACHER_LINK_STATUS,
  parentLink: PARENT_LINK_STATUS,
  class: CLASS_STATUS,
  assignment: ASSIGNMENT_STATUS,
  assignmentTarget: ASSIGNMENT_TARGET_STATUS,
  recitationTest: RECITATION_TEST_STATUS,
  transcript: TRANSCRIPT_STATUS,
  analysis: ANALYSIS_STATUS,
  possibleMistake: POSSIBLE_MISTAKE_STATUS,
  exam: EXAM_STATUS,
  examAttempt: EXAM_ATTEMPT_STATUS,
  feedbackVisibility: FEEDBACK_VISIBILITY,
  revisionPlan: REVISION_PLAN_STATUS,
  revisionItem: REVISION_ITEM_STATUS,
  report: REPORT_STATUS,
  notificationDelivery: NOTIFICATION_DELIVERY_STATUS,
})

export const DOMAIN_CONTRACTS = Object.freeze({
  roles: Object.freeze(Object.values(ROLES)),
  assignmentTypes: ASSIGNMENT_TYPES,
  recitationTestTypes: RECITATION_TEST_TYPES,
  mistakeTypes: MISTAKE_TYPES,
  verificationDecisions: VERIFICATION_DECISIONS,
  notificationTypes: NOTIFICATION_TYPES,
})
