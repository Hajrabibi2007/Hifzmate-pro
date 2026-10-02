import { useState } from 'react'
import Alert from '../../components/ui/Alert.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import SectionHeader from '../../components/ui/SectionHeader.jsx'
import './RoleWorkspace.css'

const roleConfig = {
  student: {
    label: 'Student workspace',
    title: 'Good morning, Amina.',
    description: 'Your next useful step is ready for today.',
    nav: ['Dashboard', 'My Hifz', 'Quran Library', 'Daily Plan', 'Recitation Test', 'Mistake History', 'Smart Revision', 'Progress', 'Notifications', 'Settings'],
    primary: 'Open today\'s plan',
  },
  teacher: {
    label: 'Teacher workspace',
    title: 'Your review queue is ready.',
    description: 'Keep student progress visible and feedback timely.',
    nav: ['Dashboard', 'Students', 'Classes', 'Assignments', 'Create Exam', 'Exam Results', 'Mistake Review', 'Feedback', 'Reports'],
    primary: 'Create assignment',
  },
  parent: {
    label: 'Parent workspace',
    title: 'A clear view of Noor\'s progress.',
    description: 'See released activity, results, and teacher feedback in one place.',
    nav: ['Dashboard', 'Child Progress', 'Revision Activity', 'Exam Results', 'Teacher Feedback', 'Reports', 'Notifications'],
    primary: 'View child progress',
  },
  academy: {
    label: 'Academy workspace',
    title: 'The academy at a glance.',
    description: 'Coordinate people, classes, exams, and reports with confidence.',
    nav: ['Dashboard', 'Teachers', 'Students', 'Classes', 'Exams', 'Reports', 'Analytics', 'Settings'],
    primary: 'View academy report',
  },
}

const roleStats = {
  student: [['Memorization', '72%', 'On track'], ['Revision', '81%', 'Today'], ['Accuracy', '89%', 'Teacher shared'], ['Consistency', '12 days', 'Streak']],
  teacher: [['Pending reviews', '8 possible detections', 'Needs attention'], ['Upcoming exams', '3 this week', 'Scheduled'], ['Active students', '42 learners', 'Across 4 classes']],
  parent: [['Weekly progress', '78%', 'Released'], ['Revision activity', '5 sessions', 'This week'], ['Teacher feedback', '2 notes', 'New']],
  academy: [['Active students', '128 learners', 'Across 8 classes'], ['Open exams', '14 attempts', 'In progress'], ['Review queue', '21 items', 'This week']],
}

const tasks = {
  student: ['Sabaq: Surah Al-Mulk, Ayahs 1-10', 'Sabqi: Surah Al-Qalam, Ayahs 1-8', 'Manzil: Juz Amma review'],
  teacher: ['Review possible detections from today', 'Publish the Class 3 revision assignment', 'Prepare Thursday\'s recitation exam'],
  parent: ['Read this week\'s released report', 'Review teacher feedback from Tuesday', 'Check Noor\'s revision activity'],
  academy: ['Review class participation report', 'Confirm upcoming exam schedule', 'Open academy analytics'],
}

function RoleWorkspace({ role = 'student' }) {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const config = roleConfig[role] || roleConfig.student
  const stats = roleStats[role] || roleStats.student
  const currentTasks = tasks[role] || tasks.student
  const dashboardRoute = `#/${role}/dashboard`

  return (
    <div className="workspace-layout">
      <aside className={`workspace-sidebar ${navigationOpen ? 'workspace-sidebar--open' : ''}`} aria-label={`${config.label} navigation`}>
        <a className="workspace-brand" href={dashboardRoute} aria-label="HifzMate Pro home">
          <span className="workspace-brand__mark">H</span>
          <span><strong>HifzMate</strong><small>Pro</small></span>
        </a>
        <button className="workspace-sidebar__close" type="button" onClick={() => setNavigationOpen(false)}>Close navigation</button>
        <div className="workspace-role"><span>Current view</span><strong>{config.label}</strong></div>
        <nav className="workspace-nav" aria-label="Workspace sections">
          <p>Overview</p>
          {config.nav.slice(0, 1).map((item) => <a className="workspace-nav__item workspace-nav__item--active" href={dashboardRoute} key={item}><span aria-hidden="true">▦</span>{item}</a>)}
          <p>{role === 'student' ? 'Learning' : role === 'academy' ? 'Management' : 'Work'}</p>
          {config.nav.slice(1, -2).map((item, index) => <a className="workspace-nav__item" href={dashboardRoute} key={item}><span aria-hidden="true">{['◈', '⌁', '◌', '◍', '◫', '◇', '◒', '▤'][index % 8]}</span>{item}</a>)}
          <p>Account</p>
          {config.nav.slice(-2).map((item, index) => <a className="workspace-nav__item" href={dashboardRoute} key={item}><span aria-hidden="true">{index === 0 ? '◉' : '⚙'}</span>{item}</a>)}
        </nav>
        <div className="workspace-sidebar__footer"><a className="workspace-user" href={dashboardRoute}><span className="workspace-avatar">AM</span><span><strong>Amina Malik</strong><small>View profile</small></span></a></div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <button className="workspace-menu-button" type="button" aria-label="Open navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen((isOpen) => !isOpen)}>Menu</button>
          <div className="workspace-breadcrumb"><span>HifzMate Pro</span><span>/</span><strong>{config.nav[0]}</strong></div>
          <div className="workspace-topbar__actions"><a href={dashboardRoute} aria-label="Notifications">Notifications <span className="workspace-notification-count">3</span></a><a className="workspace-topbar__avatar" href={dashboardRoute} aria-label="Open profile">AM</a></div>
        </header>
        <div className="workspace-content">
          <header className="workspace-page-header"><div><Badge tone="success">{config.label}</Badge><h1>{config.title}</h1><p>{config.description}</p></div><Button>{config.primary}</Button></header>
          <section className="workspace-stats" aria-label="Summary">
            {stats.map(([label, value, status]) => <Card key={label}><span className="workspace-stat-label">{label}</span><strong>{value}</strong><Badge tone={status === 'Needs attention' ? 'warning' : 'neutral'}>{status}</Badge></Card>)}
          </section>
          <section className="workspace-grid workspace-grid--main">
            <Card className="workspace-goal-card"><SectionHeader title={role === 'student' ? 'Today\'s Hifz goal' : role === 'teacher' ? 'Review priorities' : 'This week at a glance'} description={role === 'student' ? 'Small, consistent progress is the work.' : 'The most important work is gathered here.'} /><div className="workspace-goal-value"><strong>{role === 'student' ? '60%' : role === 'teacher' ? '8' : role === 'parent' ? '78%' : '86%'}</strong><span>{role === 'student' ? 'complete' : role === 'teacher' ? 'items to review' : 'of planned activity'}</span></div><ProgressBar value={role === 'student' ? 60 : role === 'academy' ? 86 : 78} label="Progress" /></Card>
            <Card className="workspace-action-card"><SectionHeader title="Quick actions" description="Start where your attention is needed." /><div className="workspace-action-list">{currentTasks.map((task, index) => <a href={dashboardRoute} key={task}><span>0{index + 1}</span><strong>{task}</strong><span aria-hidden="true">&gt;</span></a>)}</div></Card>
          </section>
          <section className="workspace-grid workspace-grid--secondary">
            <Card><SectionHeader title={role === 'student' ? 'Revision rhythm' : 'Recent activity'} description="A quiet view of what is moving." /><div className="workspace-bars" aria-label="Activity over the last seven days"><span style={{ height: '36%' }} /><span style={{ height: '56%' }} /><span style={{ height: '44%' }} /><span style={{ height: '72%' }} /><span style={{ height: '66%' }} /><span style={{ height: '84%' }} /><span style={{ height: '58%' }} /></div><div className="workspace-chart-labels"><span>Mon</span><span>Sun</span></div></Card>
            <Card><SectionHeader title="Needs your attention" description="Clear labels keep status understandable." /><Alert tone="info" title="AI-assisted possible detection">Teacher verification is required before this becomes an academic decision.</Alert><a className="workspace-text-link" href={dashboardRoute}>Open review queue &gt;</a></Card>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RoleWorkspace
