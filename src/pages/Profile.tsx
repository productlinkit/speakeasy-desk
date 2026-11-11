import { languageOf } from '../data/addLanguage'
import { guestProfile, goals, profileScreen, stats } from '../data/profile'
import { useSession } from '../session'
import './Profile.css'

type Nav = (to: string) => void

/** paints a flat icon in the current text colour, the way the nav does */
function Glyph({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={className ? `prglyph ${className}` : 'prglyph'}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
      aria-hidden
    />
  )
}

function Gear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1h-.2a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** the app's clock is a filled yellow disc; on the amber card it is an outline */
function Clock() {
  return (
    <svg className="prstat__icon" width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />
      <path d="M12 6.8V12l3.4 2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BackArrow() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The profile with nobody behind it.
 *
 * The live app paints this screen blank for a signed-out visitor, which is a
 * gap rather than a design. The guest gate sends every other click to the login
 * form, so the one page that is *about* the account says so itself, and carries
 * the two ways in.
 */
export function SignedOut({ onNavigate }: { onNavigate: Nav }) {
  return (
    // the gate lets these two through: they are the way forward, not the app
    <div className="prout" data-guest-ok>
      <img className="prout__fox" src="/assets/mascot/splash1.webp" alt="" />
      <h1 className="prout__head">{guestProfile.head}</h1>
      <p className="prout__lead">{guestProfile.lead}</p>
      <div className="prout__acts">
        <button type="button" className="btn" onClick={() => onNavigate('/login')}>
          {guestProfile.login}
        </button>
        <button type="button" className="prout__second" onClick={() => onNavigate('/signup')}>
          {guestProfile.signup}
        </button>
      </div>
      <ul className="prout__list">
        {guestProfile.waiting.map((item) => (
          <li key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Hero({ onNavigate }: { onNavigate: Nav }) {
  const { profile, boost } = useSession()
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'S'

  return (
    // cover, name and the two ways into the account are one card, so the name
    // is part of something rather than loose text under a picture
    <header className="prhero">
      <div className="prhero__cover">
        <img src="/assets/profile/bg.png" alt="" />
        <span className="prhero__chip">{boost ? profileScreen.chip : profileScreen.freeChip}</span>
        <button
          type="button"
          className="prhero__gear"
          onClick={() => onNavigate('/profile/settings')}
          aria-label={profileScreen.settings}
        >
          <Gear />
        </button>
      </div>
      <div className="prhero__who">
        <span className="prhero__avatar" aria-hidden>
          {initial}
        </span>
        <div className="prhero__name">
          <h1>{profile.name}</h1>
          {/* an empty bio would leave the name hanging on its own, so the
              address the account is kept under stands in for it */}
          <p>{profile.bio || profile.email}</p>
        </div>
        <button
          type="button"
          className="btn prhero__edit"
          onClick={() => onNavigate('/profile/settings/edit-profile')}
        >
          {profileScreen.edit}
        </button>
      </div>
    </header>
  )
}

export function ProfileHome({ onNavigate }: { onNavigate: Nav }) {
  const streak = stats.streakDays

  return (
    <div className="pr">
      <Hero onNavigate={onNavigate} />

      <h2 className="pr__head">{profileScreen.streakHead}</h2>
      {/* the count, the week and the way to the goals read as one line, which
          leaves the figures below a row of their own */}
      <section className="prstreak">
        <Glyph src="/assets/icons/fire-grey.svg" className="prstreak__fire" />
        <div className="prstreak__count">
          <strong>
            {streak} {profileScreen.streakUnit}
          </strong>
          <p>{streak > 0 ? profileScreen.streakLead : profileScreen.streakStart}</p>
        </div>
        <ol className="prweek">
          {profileScreen.week.map((letter, i) => (
            <li key={i} className={stats.weekDone[i] ? 'is-done' : undefined}>
              <span className="prweek__letter">{letter}</span>
              <span className="prweek__dot">{stats.weekDone[i] ? <Tick /> : null}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="btn prstreak__plans"
          onClick={() => onNavigate('/profile/learning-goals')}
        >
          {profileScreen.seePlans}
        </button>
      </section>

      <div className="pr__grid">
        <section className="prstat prstat--goal">
          <span className="prstat__ring">
            <Ring percent={goals.percent} />
            <em>{goals.percent}%</em>
          </span>
          <strong>{goals.level}</strong>
          <p>{goals.tileHead}</p>
        </section>

        <section className="prstat prstat--time">
          <Clock />
          <strong>
            {stats.hours} H {stats.minutes} Mins
          </strong>
          <p>{profileScreen.timeHead}</p>
        </section>

        <section className="prstat prstat--xp">
          <img className="prstat__gem" src="/assets/icons/diamond-purple.svg" alt="" />
          <strong>{stats.xp} XP</strong>
          <p>{profileScreen.xpHead}</p>
          <button type="button" className="btn" onClick={() => onNavigate('/learning')}>
            {profileScreen.earn}
          </button>
        </section>
      </div>
    </div>
  )
}

/** the ring behind the percentage on the goals summary */
function Ring({ percent }: { percent: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg className="prgoals__ring" viewBox="0 0 128 128" aria-hidden>
      <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="15" opacity="0.35" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray={`${(c * percent) / 100} ${c}`}
        transform="rotate(-90 64 64)"
      />
    </svg>
  )
}

export function LearningGoals({ onNavigate }: { onNavigate: Nav }) {
  const { profile } = useSession()
  const { flag, name } = languageOf(profile.language)

  return (
    <div className="prgoals">
      <header className="prsub__bar">
        <button type="button" className="prsub__back" onClick={() => onNavigate('/profile')} aria-label="Back">
          <BackArrow />
        </button>
        <h1>
          {profile.name} {goals.title}
        </h1>
      </header>

      <h2 className="pr__head">{goals.langHead}</h2>
      <p className="prgoals__lang">
        <img src={flag} alt="" />
        {name}
      </p>

      <h2 className="pr__head">{goals.summaryHead}</h2>
      <section className="prsum">
        <div className="prsum__facts">
          <strong className="prsum__level">{goals.level}</strong>
          <dl>
            <div>
              <dt>{goals.startLabel}</dt>
              <dd>{goals.start}</dd>
            </div>
            <div>
              <dt>{goals.endLabel}</dt>
              <dd>{goals.end}</dd>
            </div>
            <div>
              <dt>{goals.remainLabel}</dt>
              <dd>{daysTo(goals.end)}</dd>
            </div>
          </dl>
        </div>
        <div className="prsum__ring">
          <Ring percent={goals.percent} />
          <span>{goals.percent}%</span>
        </div>
      </section>

      <h2 className="pr__head">{goals.planHead}</h2>
      <div className="prplan">
        {goals.cards.map((card) => (
          <article key={card.key} className={`prplan__card prplan__card--${card.tone}`}>
            <h3>{card.head}</h3>
            <span className="prplan__icon" aria-hidden>
              {card.icon}
            </span>
            <p>{card.value}</p>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="btn btn--block prgoals__change"
        onClick={() => onNavigate('/add-language')}
      >
        {goals.change}
      </button>
    </div>
  )
}

/** "Jun 24 2027" is in the copy; how far off it is has to be worked out */
function daysTo(when: string) {
  const end = new Date(when)
  const left = Math.round((end.getTime() - Date.now()) / 86400000)
  if (Number.isNaN(left) || left <= 0) return '0 Days'
  return `${left} Days`
}
