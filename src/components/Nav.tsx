import { navItems, user, type NavKey } from '../data/home'
import './Nav.css'

type NavProps = {
  active: NavKey
  onChange: (key: NavKey) => void
}

function NavGlyph({ icon }: { icon?: string }) {
  if (!icon) {
    return <span className="nav-avatar">{user.initial}</span>
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
