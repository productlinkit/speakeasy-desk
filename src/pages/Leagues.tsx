import { Fragment } from 'react'
import { TopBar } from '../components/TopBar'
import {
  badge,
  emblem,
  howItWorks,
  leaderboard,
  nextTier,
  promotionRank,
  standing,
  tier,
  tiers,
  you,
  type Racer,
} from '../data/leagues'
import './Leagues.css'

export type LeaguesStep = 'board' | 'how'

function BackArrow() {
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

function ZoneArrow({ up }: { up: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d={up ? 'M12 17V8m0 0-3.6 3.6M12 8l3.6 3.6' : 'M12 7v9m0 0 3.6-3.6M12 16l-3.6-3.6'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** paints a flat icon in the current text colour, the way the nav does */
function Glyph({ src }: { src: string }) {
  return (
    <span
      className="lgglyph"
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
      aria-hidden
    />
  )
}

function Row({ racer }: { racer: Racer }) {
  const { rank } = racer
  const tone = racer.you
    ? 'you'
    : rank === 1
      ? 'gold'
      : rank === 2
        ? 'silver'
        : rank === 3
          ? 'bronze'
          : rank <= promotionRank
            ? 'promo'
            : 'plain'

  return (
    <li className={`row row--${tone}`}>
      <span className="row__rank">
        {rank <= 3 && !racer.you ? (
          <img src={`/assets/leagues/trophy${rank}.svg`} alt={`Rank ${rank}`} />
        ) : (
          rank
        )}
      </span>
      <span className="row__name">{racer.name}</span>
      <span className="row__stats">
        <span>
          <img src="/assets/icons/diamond-purple.svg" alt="" />
          {racer.xp}
          <span className="visually-hidden">XP this week</span>
        </span>
        <span>
          <img src="/assets/icons/fire.svg" alt="" />
          {racer.streak}
          <span className="visually-hidden">day streak</span>
        </span>
      </span>
    </li>
  )
}

function Divider({ up, children }: { up: boolean; children: React.ReactNode }) {
  return (
    <li className={`zone zone--${up ? 'up' : 'down'}`} aria-hidden={false}>
      <ZoneArrow up={up} />
      {children}
    </li>
  )
}

function daysLeft() {
  const end = new Date(`${standing.weekEnd}T23:59:59`)
  const left = Math.ceil((end.getTime() - Date.now()) / 86400000)
  return Math.max(0, left)
}

function Board({ onNavigate }: { onNavigate: (to: string) => void }) {
  const left = daysLeft()

  return (
    <div className="lg">
      <div className="lg__main">
        <TopBar />
        <section className="lghero">
          <img className="lghero__badge" src={badge(tier)} alt="" />
          <h1>{tier.name}</h1>
          <p>Welcome to the League</p>
        </section>

        {/* the app prints this as a label above the board, not as a control */}
        <p className="lg__chip">Your Rank</p>

        <ol className="board">
          {leaderboard.map((racer) => (
            <Fragment key={racer.rank}>
              <Row racer={racer} />
              {/* the line sits right under the last learner who gets promoted */}
              {racer.rank === promotionRank && (
                <Divider up>
                  <strong>TOP {promotionRank}</strong> • Promotion Zone
                </Divider>
              )}
            </Fragment>
          ))}
          <Divider up={false}>Demotion Zone</Divider>
          <Row racer={you} />
        </ol>
      </div>

      <aside className="lgrail">
        <section className="lgcard lg__week">
          <div className="lgcard__head">
            <h2>Your week</h2>
            <span className={`zone-pill zone-pill--${standing.zone}`}>{standing.zone}</span>
          </div>
          <dl className="week">
            <div>
              <dt>Rank</dt>
              <dd>#{standing.weeklyRank}</dd>
            </div>
            <div>
              <dt>XP this week</dt>
              <dd>{standing.weeklyXp}</dd>
            </div>
            <div>
              <dt>Days left</dt>
              <dd>{left}</dd>
            </div>
          </dl>
          <p className="week__note">
            {nextTier
              ? `Finish in the top ${promotionRank} to move up to ${nextTier.name}.`
              : `Stay in the top ${promotionRank} to hold the highest league.`}
          </p>
        </section>

        <section className="hlw-card">
          <h2>How leagues work</h2>
          <p>Learn every day, earn more XP and climb the leaderboard to win</p>
          <button type="button" className="hlw-card__more" onClick={() => onNavigate('/leagues/how-it-works')}>
            Read more
          </button>
        </section>
      </aside>
    </div>
  )
}

function How({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="how">
      <header className="how__head">
        <button type="button" className="how__back" onClick={() => onNavigate('/leagues')} aria-label="Back">
          <BackArrow />
        </button>
        <h1>How Leagues Work</h1>
      </header>

      <section className="how__intro">
        <img src="/assets/leagues/hlw.png" alt="" />
        <h2>Compete on weekly leaderboard</h2>
        <p>Learn the language and see where you stand with other learners.</p>
      </section>

      <ul className="how__points">
        {howItWorks.map((point) => (
          <li key={point.text} className={`point point--${point.tone}`}>
            {point.mask ? <Glyph src={point.icon} /> : <img src={point.icon} alt="" />}
            {point.text}
          </li>
        ))}
      </ul>

      <h2 className="how__title">
        <Glyph src="/assets/icons/menu-leagues.svg" />
        Leagues On SpeakEasy
        <Glyph src="/assets/icons/menu-leagues.svg" />
      </h2>

      <ul className="ladder">
        {[...tiers].reverse().map((t) => (
          <li key={t.order} className={`ladder__item${t.order === tier.order ? ' is-mine' : ''}`}>
            <div>
              <h3>{t.label}</h3>
              <p>{t.tagline}</p>
            </div>
            <img src={emblem(t)} alt="" loading="lazy" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Leagues({ step, onNavigate }: { step: LeaguesStep; onNavigate: (to: string) => void }) {
  return step === 'how' ? <How onNavigate={onNavigate} /> : <Board onNavigate={onNavigate} />
}
