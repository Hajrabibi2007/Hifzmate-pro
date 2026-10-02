import { useEffect, useState } from 'react'
import '../App.css'
import './AppShell.css'
import LandingPage from '../features/public/LandingPage.jsx'
import PublicPages from '../features/public/PublicPages.jsx'
import RoleWorkspace from '../features/workspace/RoleWorkspace.jsx'

const publicNavigation = [
  ['Features', '#/features'],
  ['How it works', '#/how-it-works'],
  ['Pricing', '#/pricing'],
  ['About', '#/about'],
  ['Contact', '#/contact'],
]

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '') || 'home'
}

function AppShell() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const workspaceRole = ['student', 'teacher', 'parent', 'academy'].find((role) => route.startsWith(`${role}/`))
  if (workspaceRole) return <RoleWorkspace role={workspaceRole} />
  if (route === 'home') return <LandingPage />

  return (
    <div className="site-shell">
      <header className="site-shell__header">
        <div className="site-shell__header-inner">
          <a className="site-shell__brand" href="#/" aria-label="HifzMate Pro home">
            <span className="site-shell__mark">H</span>
            <span><strong>HifzMate</strong><small>Pro</small></span>
          </a>
          <nav className="site-shell__nav" aria-label="Public navigation">
            {publicNavigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          </nav>
          <div className="site-shell__actions">
            <a href="#/login">Sign in</a>
            <a className="ui-button ui-button--primary" href="#/register">Get started</a>
          </div>
        </div>
      </header>
      <main className="site-shell__content"><PublicPages page={route} /></main>
      <footer className="site-shell__footer">
        <div><strong>HifzMate Pro</strong><p>Learning, revision, and guidance for the Hifz journey.</p></div>
        <div className="site-shell__footer-links">{publicNavigation.slice(0, 3).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
      </footer>
    </div>
  )
}

export default AppShell
