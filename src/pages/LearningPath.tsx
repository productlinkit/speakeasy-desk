import { useCallback, useEffect, useRef, useState } from 'react'
import { isDailyDone } from '../data/dailyChallenge'
import { learningItems, user } from '../data/home'
import {
  activeNode,
  activeUnit,
  section,
  units,
  type NodeKind,
  type NodeState,
  type PathNode,
  type Unit,
} from '../data/path'
import './LearningPath.css'

/* ---------------- icons ---------------- */

function BackArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4.5h5a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H4zm16 0h-5a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H20z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden>
      <path
        d="m12 3.2 2.7 5.48 6.05.88-4.38 4.27 1.03 6.02L12 17.01l-5.4 2.84 1.03-6.02L3.25 9.56l6.05-.88z"
        fill="currentColor"
      />
    </svg>
  )
}

function DumbbellIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 9v6M8 7.5v9M16 7.5v9M19 9v6M8 12h8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChestIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 10.5a5.5 5.5 0 0 1 5.5-5.5h6a5.5 5.5 0 0 1 5.5 5.5v8a.5.5 0 0 1-.5.5h-16a.5.5 0 0 1-.5-.5z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M3.5 11.5h17M10 11.5h4v3h-4z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10v5a5 5 0 0 1-10 0zm0 1.5H4.5V8A3.5 3.5 0 0 0 7 11.3m10-5.8h2.5V8a3.5 3.5 0 0 1-2.5 3.3M12 14v3m-3.5 3h7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 10.5h11v9h-11zM9 10.5V8a3 3 0 0 1 6 0v2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JumpIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 6l7 6-7 6zm8 0 7 6-7 6z" fill="currentColor" />
    </svg>
  )
}

function UpIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19V5m0 0 6.5 6.5M12 5 5.5 11.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const glyphs: Record<NodeKind, () => React.ReactElement> = {
  lesson: StarIcon,
  practice: DumbbellIcon,
  chest: ChestIcon,
  trophy: TrophyIcon,
}

/* ---------------- path ---------------- */

/** how far each stop leans off the centre line, so the path snakes downward */
const sway = [0, -46, -80, -46, 0, 46, 80, 46]

const bubbleFor: Record<NodeKind, string> = {
  lesson: 'START',
  practice: 'PRACTICE',
  chest: 'OPEN',
  trophy: 'START TEST',
}

function Ring({ value }: { value: number }) {
  const r = 50
  const c = 2 * Math.PI * r
  return (
    <svg className="pnode__ring" viewBox="0 0 110 110" aria-hidden>
      <circle cx="55" cy="55" r={r} className="pnode__ring-track" />
      <circle
        cx="55"
        cy="55"
        r={r}
        className="pnode__ring-fill"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  )
}

/** offsets and the single skip-ahead stop, worked out in one pass down the path */
function layout(stateOf: (node: PathNode) => NodeState) {
  let seen = 0
  let jump = true
  return units.map((unit) =>
    unit.nodes.map((node) => {
      const jumpable = stateOf(node) === 'locked' && jump
      if (jumpable) jump = false
      return { offset: sway[seen++ % sway.length], jumpable }
    }),
  )
}

type NodeProps = {
  node: PathNode
  state: NodeState
  unit: Unit
  offset: number
  /** the first locked stop may be skipped to, like a placement test */
  jumpable: boolean
  progress: number
  open: boolean
  onOpen: (id: string | null) => void
  onStart: () => void
  onCollect: () => void
}

function Node({
  node,
  state,
  unit,
  offset,
  jumpable,
  progress,
  open,
  onOpen,
  onStart,
  onCollect,
}: NodeProps) {
  const Glyph = glyphs[node.kind]
  const click = () => {
    if (state === 'active' && node.kind === 'chest') {
      onCollect()
      return
    }
    if (state === 'active') {
      onStart()
      return
    }
    onOpen(open ? null : node.id)
  }

  return (
    <div
      className={`pnode-wrap${state === 'active' ? ' pnode-wrap--bubble' : ''}${
        open ? ' pnode-wrap--open' : ''
      }`}
      style={{ '--ox': `${offset}px` } as React.CSSProperties}
    >
      {state === 'active' && (
        <span className="pnode__bubble" aria-hidden>
          {bubbleFor[node.kind]}
        </span>
      )}
      <button
        type="button"
        id={`node-${node.id}`}
        className={`pnode pnode--${state} pnode--${node.kind}`}
        onClick={click}
        aria-expanded={state === 'active' ? undefined : open}
        aria-label={`${unit.title} — ${node.label}${state === 'locked' ? ' (locked)' : ''}`}
      >
        {state === 'active' && node.kind !== 'chest' && <Ring value={progress} />}
        <Glyph />
      </button>

      {open && (
        <div className={`pop pop--${state}`} role="dialog" aria-label={node.label}>
          <p className="pop__title">{node.label}</p>
          <p className="pop__note">
            {state === 'done'
              ? 'Finished — run it again to keep it sharp.'
              : 'Finish the stops above to unlock this one.'}
          </p>
          {state === 'done' ? (
            <button type="button" className="btn pop__btn" onClick={onStart}>
              Practice again
            </button>
          ) : jumpable ? (
            <button type="button" className="btn pop__btn pop__btn--jump" onClick={onStart}>
              <JumpIcon />
              Jump here?
            </button>
          ) : (
            <span className="pop__locked">
              <LockIcon />
              Locked
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- right rail ---------------- */

function Rail({ onNavigate }: { onNavigate: (to: string) => void }) {
  const dailyDone = isDailyDone()
  const dive: { label: string; image: string; to: string }[] = [
    ...learningItems.map((item) => ({
      label: item.title,
      image: item.image,
      to: item.key === 'movies' ? '/movie-learning' : item.key === 'song' ? '/song-learning' : '/ai-tutor',
    })),
    { label: 'Video Courses', image: '/assets/mascot/video-course.webp', to: '/video-courses' },
  ]

  return (
    <aside className="rail" aria-label="Your progress">
      <div className="rail__stats">
        <button type="button" className="rail__flag" aria-label="Change language">
          <img src={user.language.flag} alt="" />
        </button>
        <span className="rail__stat" title="Day streak">
          <img src="/assets/icons/fire-grey.svg" alt="" />
          {user.streakDays}
          <span className="visually-hidden">day streak</span>
        </span>
        <span className="rail__stat" title="Gems">
          <img src="/assets/icons/diamond-purple.svg" alt="" />
          {user.gems}
          <span className="visually-hidden">gems</span>
        </span>
      </div>

      <section className="rcard">
        <div className="rcard__head">
          <h2>Unlock Leaderboard!</h2>
        </div>
        <div className="rcard__row">
          <img src="/assets/icons/medal.svg" alt="" className="rcard__art" />
          <p>Complete 2 more lessons to start competing</p>
        </div>
        <button type="button" className="btn btn--block" onClick={() => onNavigate('/leagues')}>
          See Leagues
        </button>
      </section>

      <section className="rcard">
        <div className="rcard__head">
          <h2>Daily Challenge</h2>
          <button type="button" className="rcard__link" onClick={() => onNavigate('/daily-challenge')}>
            View all
          </button>
        </div>
        <div className="rcard__row">
          <img src="/assets/icons/boost.svg" alt="" className="rcard__art" />
          <div className="rcard__goal">
            <p>Earn 50 XP</p>
            <div className="rbar">
              <div className="rbar__fill" style={{ width: dailyDone ? '100%' : '0%' }} />
              <span>{dailyDone ? '50 / 50' : '0 / 50'}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn--block"
          onClick={() => onNavigate(dailyDone ? '/daily-challenge/done' : '/daily-challenge')}
        >
          {dailyDone ? 'Completed' : 'Get XP'}
        </button>
      </section>

      <section className="rcard">
        <div className="rcard__head">
          <h2>Dive into Learning</h2>
        </div>
        <ul className="rlist">
          {dive.map((item) => (
            <li key={item.label}>
              <button type="button" className="rlist__item" onClick={() => onNavigate(item.to)}>
                <img src={item.image} alt="" loading="lazy" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

/* ---------------- page ---------------- */

export function LearningPath({ onNavigate }: { onNavigate: (to: string) => void }) {
  // a collected chest moves the path on, so the nodes keep their own state here
  const [over, setOver] = useState<Record<string, NodeState>>({})
  const [open, setOpen] = useState<string | null>(null)
  const [current, setCurrent] = useState(units[0].id)
  const [away, setAway] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(0)

  const stateOf = useCallback((node: PathNode) => over[node.id] ?? node.state, [over])

  const activeId =
    units.flatMap((unit) => unit.nodes).find((node) => stateOf(node) === 'active')?.id ?? null

  const bar = units.find((unit) => unit.id === current) ?? units[0]

  // the sticky bar names whichever unit has scrolled under it
  useEffect(() => {
    const onScroll = () => {
      let id = units[0].id
      for (const unit of units) {
        const el = document.getElementById(`unit-${unit.id}`)
        if (el && el.getBoundingClientRect().top <= 150) id = unit.id
      }
      setCurrent(id)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // open where the learner left off, the way the path in the app does
  useEffect(() => {
    const el = activeNode && document.getElementById(`node-${activeNode.id}`)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'center' }))
    // first paint only: moving later would yank the page while someone reads it
  }, [])

  // the float button only matters while the active stop is off screen
  useEffect(() => {
    const el = activeId && document.getElementById(`node-${activeId}`)
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setAway(!entry.isIntersecting), {
      rootMargin: '-80px 0px -80px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [activeId])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.pnode-wrap')) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const collect = (unit: Unit, index: number) => {
    const node = unit.nodes[index]
    const next = unit.nodes[index + 1]
    setOver((prev) => ({ ...prev, [node.id]: 'done', ...(next ? { [next.id]: 'active' } : {}) }))
    setToast('Chest opened — +15 gems!')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2400)
  }

  const jumpToCurrent = () => {
    const el = activeId && document.getElementById(`node-${activeId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const spots = layout(stateOf)

  return (
    <div className="path">
      <div className="path__main">
        <div className="unitbar-wrap">
          <header className={`unitbar u--${bar.tone}`}>
            <button
              type="button"
              className="unitbar__back"
              onClick={() => onNavigate('/home')}
              aria-label="Back to home"
            >
              <BackArrow />
            </button>
            <div className="unitbar__text">
              <p className="unitbar__eyebrow">
                {section}, Unit {bar.index}
              </p>
              <h1>{bar.title}</h1>
            </div>
            <button type="button" className="unitbar__guide" onClick={() => onNavigate('/learning')}>
              <BookIcon />
              <span>All Courses</span>
            </button>
          </header>
        </div>

        {units.map((unit, u) => (
          <section
            key={unit.id}
            id={`unit-${unit.id}`}
            className={`unit u--${unit.tone}`}
            aria-labelledby={`unit-title-${unit.id}`}
          >
            <div className="unit__divider">
              <span id={`unit-title-${unit.id}`}>{unit.title}</span>
            </div>

            <div className="unit__path">
              {unit.nodes.map((node, n) => {
                const spot = spots[u][n]
                return (
                  <Node
                    key={node.id}
                    node={node}
                    state={stateOf(node)}
                    unit={unit}
                    offset={spot.offset}
                    jumpable={spot.jumpable}
                    progress={unit.progress}
                    open={open === node.id}
                    onOpen={setOpen}
                    onStart={() => onNavigate('/lesson-quiz')}
                    onCollect={() => collect(unit, n)}
                  />
                )
              })}
              {unit.id === activeUnit?.id && (
                <img className="unit__mascot unit__mascot--left" src="/assets/mascot/12.png" alt="" />
              )}
              {u === units.length - 1 && (
                <img className="unit__mascot unit__mascot--right" src="/assets/mascot/19.png" alt="" />
              )}
            </div>
          </section>
        ))}

        {away && (
          <button
            type="button"
            className="path__jump"
            onClick={jumpToCurrent}
            aria-label="Back to my lesson"
          >
            <UpIcon />
          </button>
        )}
      </div>

      <Rail onNavigate={onNavigate} />

      {toast && (
        <p className="path__toast" role="status">
          {toast}
        </p>
      )}
    </div>
  )
}
