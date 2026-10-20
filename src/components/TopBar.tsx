import { user } from '../data/home'
import './TopBar.css'

export function TopBar() {
  return (
    <header className="topbar">
      <h1 className="topbar__welcome">
        <strong>Welcome Back,</strong> {user.name}!
      </h1>

      <div className="topbar__actions">
        <button type="button" className="topbar__flag" aria-label="Change language">
          <img src="/assets/country/uk.svg" alt="" />
        </button>

        <div className="topbar__stats">
          <span className="topbar__stat" title="Day streak">
            <img src="/assets/icons/fire-grey.svg" alt="" />
            {user.streakDays}
            <span className="visually-hidden">day streak</span>
          </span>
          <span className="topbar__stat" title="Gems">
            <img src="/assets/icons/diamond-purple.svg" alt="" />
            {user.gems}
            <span className="visually-hidden">gems</span>
          </span>
        </div>

        <button type="button" className="topbar__bell" aria-label="Notifications">
          <img src="/assets/icons/bell.svg" alt="" />
        </button>
      </div>
    </header>
  )
}
