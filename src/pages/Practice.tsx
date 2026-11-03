import { LottiePlayer } from '../components/LottiePlayer'
import { TopBar } from '../components/TopBar'
import { dailyQuestions, dailyResult, isDailyDone } from '../data/dailyChallenge'
import { user } from '../data/home'
import { badge, leaderboard, promotionRank, standing, tier, you } from '../data/leagues'
import { activeUnit, section } from '../data/path'
import { hero, languageRow, skills, type Skill } from '../data/practice'
import './Practice.css'

type Nav = (to: string) => void

/* ---------------- the highlight: a call with Renald ---------------- */

function Hero({ onNavigate }: { onNavigate: Nav }) {
  return (
    <section className="hero2" aria-labelledby="hero-title">
      {/* the banner's backdrop. It loops on its own — the one piece of motion
          on the page — and the player sits still for prefers-reduced-motion */}
      <LottiePlayer
        className="hero2__scene"
        src={hero.scene}
        playing
        fit="contain"
      />
      <div className="hero2__body">
        {/* the language this account is studying — a label, not a control */}
        <span className="hero2__chip">
          <img src={user.language.flag} alt="" />
          Learning {user.language.name}
        </span>
        <h2 id="hero-title">{hero.title}</h2>
        <p>{hero.lead}</p>
        <button type="button" className="btn" onClick={() => onNavigate(hero.to)}>
          {hero.cta}
        </button>
      </div>
    </section>
  )
}

/* ---------------- the course you are part-way through ---------------- */

function ContinueCard({ onNavigate }: { onNavigate: Nav }) {
  const unit = activeUnit
  if (!unit) return null

  return (
    <button type="button" className="contcard" onClick={() => onNavigate('/path')}>
      <img src={unit.image} alt="" className="contcard__art" loading="lazy" />
      <span className="contcard__body">
        <span className="contcard__title">{unit.title}</span>
        <span className="contcard__note">
          Unit {unit.index} of {section}
        </span>
        <span className="contcard__meter">
          <span className="contcard__bar">
            <span className="contcard__fill" style={{ width: `${unit.progress}%` }} />
          </span>
          <span className="contcard__pct">{unit.progress}%</span>
        </span>
      </span>
      <span className="btn">Open the map</span>
    </button>
  )
}

/* ---------------- the other ways to practise ---------------- */

function SkillTile({ item, onNavigate }: { item: Skill; onNavigate: Nav }) {
  return (
    <button
      type="button"
      className={`stile stile--${item.key} u--${item.tone}`}
      onClick={() => onNavigate(item.to)}
    >
      <span className="stile__art">
        <LottiePlayer src={item.lottie} poster={item.art} playing fit="contain" />
      </span>
      <span className="stile__body">
        <span className="stile__title">{item.title}</span>
        <span className="stile__meta">{item.meta}</span>
      </span>
    </button>
  )
}

/* ---------------- today ---------------- */

function Ring({ done, total }: { done: number; total: number }) {
  const r = 34
  const circumference = 2 * Math.PI * r
  const filled = total ? done / total : 0

  return (
    <svg className="goal__ring" width="88" height="88" viewBox="0 0 88 88" aria-hidden>
      <circle className="goal__track" cx="44" cy="44" r={r} />
      <circle
        className="goal__arc"
        cx="44"
        cy="44"
        r={r}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - filled)}
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path
        d="m2.5 6.3 2.4 2.4L9.6 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function DailyGoal({ onNavigate }: { onNavigate: Nav }) {
  const done = isDailyDone()
  const total = dailyQuestions.length
  // Monday-first index of today, so the strip lines up with the labels
  const today = (new Date().getDay() + 6) % 7
  // a streak counts back from the day before today; today only counts once the
  // challenge is actually finished, so the strip can never contradict the ring
  const lit = (i: number) => (i === today ? done : i < today && today - i <= user.streakDays)

  return (
    <section className="rcard2 goal" aria-labelledby="goal-title">
      <header className="goal__head">
        <h2 id="goal-title">Daily Challenge</h2>
        {done && (
          <span className="goal__done">
            <CheckIcon />
            Done
          </span>
        )}
      </header>

      <div className="goal__row">
        <span className="goal__dial">
          <Ring done={done ? total : 0} total={total} />
          <span className="goal__count">
            <strong>{done ? total : 0}</strong>/{total}
          </span>
        </span>
        <span className="goal__say">
          <strong>{done ? 'Done for today' : `${total} questions`}</strong>
          {done
            ? `${dailyResult.xp} XP collected. A new one lands tomorrow.`
            : `Finish them for ${dailyResult.xp} XP.`}
        </span>
      </div>

      <ol className="goal__week">
        {weekdays.map((day, i) => (
          <li key={day} className={`goal__day${lit(i) ? ' is-lit' : ''}${i === today ? ' is-today' : ''}`}>
            <span className="goal__dot" aria-hidden>
              {lit(i) && <CheckIcon />}
            </span>
            <span className="goal__name">{day}</span>
            <span className="visually-hidden">
              {lit(i) ? 'done' : i === today ? 'today, not done yet' : 'not done'}
            </span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="btn"
        onClick={() => onNavigate(done ? '/daily-challenge/done' : '/daily-challenge')}
      >
        {done ? 'See result' : 'Start'}
      </button>
    </section>
  )
}

/* ---------------- this week's board ---------------- */

function Board({ onNavigate }: { onNavigate: Nav }) {
  const top = leaderboard.slice(0, 5)

  return (
    <section className="rcard2 wboard" aria-labelledby="wboard-title">
      <header className="wboard__head">
        <h2 id="wboard-title">Leaderboard</h2>
        <span className="wboard__when">This week</span>
      </header>
      {/* the league you are in right now — the board below is its board */}
      <p className="wboard__tier">
        <img className="wboard__badge" src={badge(tier)} alt="" />
        {tier.name}
      </p>

      <ol className="wboard__list">
        {top.map((racer) => (
          <li key={racer.rank} className="wboard__row">
            <span className="wboard__rank">
              {racer.rank <= 3 ? (
                <img src={`/assets/leagues/trophy${racer.rank}.svg`} alt={`Rank ${racer.rank}`} />
              ) : (
                racer.rank
              )}
            </span>
            <span className="wboard__name">{racer.name}</span>
            <span className="wboard__xp">{racer.xp} XP</span>
          </li>
        ))}

        {/* you are outside the top five, so your own row is pinned under them */}
        <li className="wboard__gap" aria-hidden />
        <li className="wboard__row wboard__row--you">
          <span className="wboard__rank">{you.rank}</span>
          <span className="wboard__name">{you.name}</span>
          <span className="wboard__xp">{you.xp} XP</span>
        </li>
      </ol>

      <p className="wboard__note">
        {standing.weeklyRank - promotionRank} places to climb for a promotion.
      </p>

      <button type="button" className="btn" onClick={() => onNavigate('/leagues')}>
        See Leagues
      </button>
    </section>
  )
}

/* ---------------- placement test ---------------- */

function LevelCard({ onNavigate }: { onNavigate: Nav }) {
  return (
    <section className="rcard2 levelcard" aria-labelledby="level-title">
      <span className="levelcard__art">
        <LottiePlayer
          src="/assets/lottie/speakeasy-find-your-level-fox.json"
          poster="/assets/mascot/5.png"
          playing
          fit="contain"
        />
      </span>
      <h2 id="level-title">Find your level</h2>
      <p>A short test that tunes every lesson after it.</p>
      <button type="button" className="btn" onClick={() => onNavigate('/find-level')}>
        Find level
      </button>
    </section>
  )
}

/* ---------------- page ---------------- */

export function Practice({ onNavigate }: { onNavigate: Nav }) {
  return (
    <div className="prac">
      <TopBar />

      <div className="prac__grid">
        <div className="prac__col">
          <Hero onNavigate={onNavigate} />

          <section className="prac__block" aria-labelledby="prac-course">
            <header className="prac__head">
              <h2 id="prac-course">Continue learning</h2>
              <button type="button" className="prac__link" onClick={() => onNavigate('/learning')}>
                All courses
              </button>
            </header>
            <ContinueCard onNavigate={onNavigate} />
          </section>

          <section className="prac__block" aria-labelledby="prac-skills">
            <header className="prac__head">
              <h2 id="prac-skills">Build your skills</h2>
            </header>
            <div className="prac__tiles">
              {skills.map((item) => (
                <SkillTile key={item.key} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          <section className="prac__block" aria-labelledby="prac-langs">
            <header className="prac__head">
              <h2 id="prac-langs">Your languages</h2>
              <button
                type="button"
                className="prac__link"
                onClick={() => onNavigate('/add-language')}
              >
                Add a language
              </button>
            </header>
            <div className="prac__langs">
              {languageRow.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className="langpill"
                  onClick={() => onNavigate('/add-language')}
                >
                  <img src={lang.flag} alt="" />
                  <span className="langpill__body">
                    <span className="langpill__name">{lang.name}</span>
                    <span className="langpill__state">{lang.locked ? 'Added' : 'Add'}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="prac__rail">
          <DailyGoal onNavigate={onNavigate} />
          <Board onNavigate={onNavigate} />
          <LevelCard onNavigate={onNavigate} />
        </aside>
      </div>
    </div>
  )
}
