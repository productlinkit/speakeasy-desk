import { navItems, type NavKey } from '../data/home'
import { useSession } from '../session'
import './Nav.css'

type NavProps = {
  active: NavKey
  onChange: (key: NavKey) => void
}

function NavGlyph({ icon }: { icon?: string }) {
  const { member, profile } = useSession()
  if (!icon) {
    // a guest has no initial to show, and somebody else's would be a lie
    if (!member)
      return (
        <span className="nav-avatar nav-avatar--guest" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8.2" r="3.6" stroke="currentColor" strokeWidth="1.9" />
            <path
              d="M4.9 19.4a7.3 7.3 0 0 1 14.2 0"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )
    return <span className="nav-avatar">{profile.name.trim().charAt(0).toUpperCase() || 'S'}</span>
  }
  // Mask the SVG so the glyph follows `currentColor` (white / active blue)
  return (
    <span
      className="nav-glyph"
      style={{ maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})` }}
      aria-hidden
    />
  )
}

export function Sidebar({ active, onChange }: NavProps) {
  return (
    <aside className="sidebar">
      <a href="/" className="sidebar__logo" aria-label="SpeakEasy home">
        <img src="/logo-splash.png" alt="SpeakEasy" className="sidebar__logo-full" />
        <img src="/assets/logo.png" alt="" className="sidebar__logo-mark" />
      </a>

      <nav className="sidebar__nav" aria-label="Main">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar__item${active === item.key ? ' is-active' : ''}`}
            aria-current={active === item.key ? 'page' : undefined}
            onClick={() => onChange(item.key)}
            title={item.label}
          >
            <NavGlyph icon={item.icon} />
            <span className="sidebar__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export function BottomNav({ active, onChange }: NavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-nav__item${active === item.key ? ' is-active' : ''}`}
          aria-current={active === item.key ? 'page' : undefined}
          onClick={() => onChange(item.key)}
        >
          <NavGlyph icon={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
