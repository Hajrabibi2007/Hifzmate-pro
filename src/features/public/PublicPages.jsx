import Alert from '../../components/ui/Alert.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import SectionHeader from '../../components/ui/SectionHeader.jsx'
import './PublicPages.css'

const publicPageContent = {
  features: {
    eyebrow: 'A connected learning system',
    title: 'Everything around the next Ayah.',
    description: 'Purposeful tools for memorization, revision, assessment, and the people who support the Hifz journey.',
  },
  'how-it-works': {
    eyebrow: 'A clear daily rhythm',
    title: 'From assignment to confident revision.',
    description: 'HifzMate Pro keeps each step visible while leaving space for focused practice and teacher guidance.',
  },
  pricing: {
    eyebrow: 'Simple and transparent',
    title: 'A plan that starts with your academy.',
    description: 'Access options are being finalized. Contact an academy to learn how HifzMate Pro can fit your programme.',
  },
  about: {
    eyebrow: 'Why HifzMate Pro',
    title: 'Technology that respects the work of Hifz.',
    description: 'A calm, role-aware workspace for students, teachers, parents, and academies.',
  },
  contact: {
    eyebrow: 'We are here to help',
    title: 'Bring your questions to the right place.',
    description: 'Tell us what you are exploring and we will help you find the clearest next step.',
  },
}

const featureGroups = [
  ['Student practice', 'Mushaf reading, approved audio, repetition, Hide & Recall, Write from Memory, quizzes, and daily goals.'],
  ['Teacher guidance', 'Assignments, digital exams, possible-detection review, verification, feedback, and reports.'],
  ['Parent visibility', 'Linked-child progress, revision activity, released results, teacher feedback, and notifications.'],
  ['Academy oversight', 'Role-scoped classes, users, exams, reports, and operational analytics.'],
]

const workflowSteps = [
  ['01', 'Plan', 'Set a daily goal and organize Sabaq, Sabqi, Manzil, or revision work.'],
  ['02', 'Practice', 'Read, listen, repeat, recall, write, or quiz in one focused workspace.'],
  ['03', 'Review', 'Use AI-assisted support as a possible signal, then bring the work back to teacher review.'],
  ['04', 'Progress', 'Turn recorded activity and feedback into a clearer revision rhythm.'],
]

function PublicPageHero({ page }) {
  const content = publicPageContent[page]
  return (
    <section className="public-page-hero">
      <Badge tone="success">{content.eyebrow}</Badge>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
    </section>
  )
}

function FeaturesPage() {
  return (
    <>
      <PublicPageHero page="features" />
      <section className="public-content-section" aria-labelledby="feature-groups-title">
        <SectionHeader title="Built around the people doing the work" description="Each role gets focused tools without exposing unrelated destinations or private records." />
        <div className="public-feature-grid" id="feature-groups-title">
          {featureGroups.map(([title, description], index) => (
            <Card key={title} className="public-feature-card">
              <span className="public-card-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="public-callout">
        <div>
          <Badge tone="warning">Responsible AI assistance</Badge>
          <h2>Possible detections, never automatic judgment.</h2>
          <p>Recitation analysis may be incomplete. HifzMate Pro keeps teacher verification at the center of academic decisions.</p>
        </div>
        <a className="ui-button ui-button--primary" href="#/register">Get started</a>
      </section>
    </>
  )
}

function HowItWorksPage() {
  return (
    <>
      <PublicPageHero page="how-it-works" />
      <section className="public-content-section">
        <SectionHeader title="A connected workflow" description="The product helps each person see the next useful action while preserving clear ownership." />
        <div className="public-workflow-grid">
          {workflowSteps.map(([number, title, description]) => (
            <article className="public-workflow-step" key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="public-split-section">
        <div>
          <Badge tone="neutral">Four perspectives</Badge>
          <h2>One shared rhythm, role-relevant views.</h2>
        </div>
        <p>Students practice, teachers guide, parents monitor released information, and academy admins coordinate the wider programme.</p>
      </section>
    </>
  )
}

function PricingPage() {
  return (
    <>
      <PublicPageHero page="pricing" />
      <section className="public-content-section">
        <div className="public-plan-grid">
          <Card className="public-plan-card public-plan-card--featured">
            <Badge tone="success">Current direction</Badge>
            <h2>Academy access</h2>
            <p className="public-plan-card__price">Plans are being finalized</p>
            <p>Speak with your academy about access to student learning, teacher workflows, parent visibility, and academy operations.</p>
            <a className="ui-button ui-button--primary" href="#/contact">Contact academy</a>
          </Card>
          <Card className="public-plan-note">
            <h2>Scope note</h2>
            <p>Payments, subscriptions, invoicing, and financial management are outside the current product scope.</p>
            <a className="ui-button ui-button--secondary" href="#/register">Get started</a>
          </Card>
        </div>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PublicPageHero page="about" />
      <section className="public-content-section public-about-grid">
        <Card><h2>Calm focus</h2><p>Learning views keep the next useful action clear and give Quran content room to breathe.</p></Card>
        <Card><h2>Trust and clarity</h2><p>AI output stays labeled as possible detection, with teacher verification distinct and visible.</p></Card>
        <Card><h2>Role relevance</h2><p>Every role sees a focused navigation model and only the context needed for its work.</p></Card>
      </section>
      <section className="public-callout public-callout--light">
        <div><Badge tone="neutral">Built for the Hifz journey</Badge><h2>Less noise around meaningful work.</h2><p>HifzMate Pro brings planning, practice, review, and communication into one thoughtful workspace.</p></div>
        <a className="ui-button ui-button--primary" href="#/contact">Contact us</a>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <PublicPageHero page="contact" />
      <section className="public-contact-grid">
        <form className="public-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your name" />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@example.com" />
          <label htmlFor="contact-reason">Reason</label>
          <select id="contact-reason" name="reason" defaultValue="general"><option value="general">General question</option><option value="academy">Academy access</option><option value="support">Product support</option></select>
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="How can we help?" />
          <p className="public-form__hint">Please do not include private student records or recordings.</p>
          <Button type="submit">Send message</Button>
        </form>
        <Card className="public-contact-note"><Badge tone="success">A considered response</Badge><h2>Tell us what you need.</h2><p>We can help with academy access, product questions, or understanding the HifzMate Pro workflow.</p><Alert tone="info" title="Privacy first">Sensitive academic information belongs inside the authenticated product, not in this form.</Alert></Card>
      </section>
    </>
  )
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  return (
    <section className="public-auth-page">
      <div className="public-auth-panel">
        <Badge tone="success">HifzMate Pro</Badge>
        <h1>{isLogin ? 'Welcome back.' : 'Begin with a clear next step.'}</h1>
        <p>{isLogin ? 'Sign in to continue your Hifz journey.' : 'Create your account and continue to the appropriate onboarding path.'}</p>
        <form className="public-form" onSubmit={(event) => event.preventDefault()}>
          {!isLogin && <><label htmlFor="register-name">Display name</label><input id="register-name" name="name" type="text" placeholder="Your name" /></>}
          <label htmlFor="auth-email">Email</label>
          <input id="auth-email" name="email" type="email" placeholder="you@example.com" />
          <label htmlFor="auth-password">Password</label>
          <input id="auth-password" name="password" type="password" placeholder="Enter your password" />
          {!isLogin && <><label htmlFor="register-confirm">Confirm password</label><input id="register-confirm" name="confirm" type="password" placeholder="Repeat your password" /></>}
          <Button type="submit">{isLogin ? 'Sign in' : 'Create account'}</Button>
        </form>
        {isLogin ? <a className="public-form__link" href="#/register">Need an account? Register</a> : <a className="public-form__link" href="#/login">Already registered? Sign in</a>}
      </div>
    </section>
  )
}

function PublicPages({ page }) {
  if (page === 'features') return <FeaturesPage />
  if (page === 'how-it-works') return <HowItWorksPage />
  if (page === 'pricing') return <PricingPage />
  if (page === 'about') return <AboutPage />
  if (page === 'contact') return <ContactPage />
  if (page === 'login' || page === 'register') return <AuthPage mode={page} />
  return null
}

export default PublicPages
