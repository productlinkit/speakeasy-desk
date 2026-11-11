import { guest } from '../data/auth'
import './GuestBar.css'

/**
 * Why nothing on the page responds. Its own buttons carry `data-guest-ok` so
 * the gate in App lets them through — they are the one way forward.
 */
export function GuestBar({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <aside className="guestbar" data-guest-ok>
      {/* the same waving fox the intro opens on, so the strip reads as the end
          of that greeting rather than a warning bolted onto the page */}
      <img className="guestbar__mascot" src="/assets/mascot/splash1.webp" alt="" />

      <div className="guestbar__body">
        <p className="guestbar__head">{guest.head}</p>
        <p className="guestbar__lead">{guest.lead}</p>
      </div>

      <div className="guestbar__actions">
        <button type="button" className="btn" onClick={() => onNavigate('/login')}>
          {guest.login}
        </button>
        <button type="button" className="guestbar__signup" onClick={() => onNavigate('/signup')}>
          {guest.signup}
        </button>
      </div>
    </aside>
  )
}
