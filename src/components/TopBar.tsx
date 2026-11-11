import { languageOf } from '../data/addLanguage'
import { guest } from '../data/auth'
import { user } from '../data/home'
import { useSession } from '../session'
import './TopBar.css'

export function TopBar({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { member, profile } = useSession()
  const lang = languageOf(profile.language)

  return (
    <header className="topbar">
      <h1 className="topbar__welcome">
        {member ? (
          <>
            <strong>Welcome Back,</strong> {profile.name}!
          </>
        ) : (
          // nobody is back yet, and greeting a stranger by someone else's name
          // is the one thing the guest page must not do
          <strong>{guest.greeting}</strong>
        )}
      </h1>

      <div className="topbar__actions">
        <button
          type="button"
          className="topbar__flag"
          aria-label={`${lang.name} — change language`}
          onClick={() => onNavigate('/profile/settings/language')}
        >
          <img src={lang.flag} alt="" />
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
