import { useCallback, useEffect, useRef, useState } from 'react'
import { LottiePlayer } from '../components/LottiePlayer'
import { labels, slides } from '../data/onboarding'
import './Onboarding.css'

/** how far the picture has to be dragged before the deck turns */
const DRAG_TURN = 56

function Arrow() {
  return (
    <svg className="ob__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h16m0 0-6.5-6.5M20 12l-6.5 6.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  /** which way the deck last turned, so the picture enters from that side */
  const [dir, setDir] = useState(1)
  /** live finger offset while the picture is being dragged */
  const [drag, setDrag] = useState(0)
  const grabbedAt = useRef<number | null>(null)

  const last = index === slides.length - 1
  const slide = slides[index]

  const go = useCallback(
    (to: number) => {
      const target = Math.max(0, Math.min(slides.length - 1, to))
      if (target === index) return
      setDir(target > index ? 1 : -1)
      setIndex(target)
    },
    [index],
  )

  // arrow keys turn the deck, the way they do on any slideshow
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const grab = (e: React.PointerEvent<HTMLDivElement>) => {
    grabbedAt.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (grabbedAt.current === null) return
    const dx = e.clientX - grabbedAt.current
    // there is nothing past the first and last slide, so pulling that way
    // only stretches — the deck feels bounded rather than broken
    const pastEnd = (dx > 0 && index === 0) || (dx < 0 && last)
    setDrag(pastEnd ? dx * 0.22 : dx)
  }

  const release = () => {
    if (grabbedAt.current === null) return
    grabbedAt.current = null
    const dx = drag
    setDrag(0)
    if (dx <= -DRAG_TURN) go(index + 1)
    else if (dx >= DRAG_TURN) go(index - 1)
  }

  return (
    <div className={`ob ob--${slide.tone}`}>
      <header className="ob__bar">
        {/* the lockup already carries the name, so no wordmark beside it */}
        <img className="ob__brand" src="/logo-splash.png" alt="SpeakEasy" width={320} height={128} />
        <button type="button" className="ob__skip" onClick={onDone}>
          {labels.skip}
        </button>
      </header>

      <div
        className="ob__deck"
        role="group"
        aria-roledescription="carousel"
        aria-label="Introducing SpeakEasy"
      >
        <div
          className="ob__stage"
          onPointerDown={grab}
          onPointerMove={move}
          onPointerUp={release}
          onPointerCancel={release}
        >
          <span className="ob__glow" aria-hidden />
          {/* keyed, so every turn of the deck replays the entrance */}
          <div
            key={slide.key}
            className="ob__art"
            data-dir={dir}
            style={
              {
                '--ob-canvas': `${slide.canvas[0]} / ${slide.canvas[1]}`,
                '--ob-fill': slide.fill,
                ...(drag ? { transform: `translateX(${drag}px)` } : null),
              } as React.CSSProperties
            }
          >
            <LottiePlayer src={slide.lottie} poster={slide.poster} playing fit="contain" />
          </div>
        </div>

        <div className="ob__panel">
          {/* outside the keyed copy, so the pill can stretch rather than reappear */}
          <ol className="ob__steps">
            {slides.map((item, i) => (
              <li key={item.key} className={`ob__step${i === index ? ' is-on' : ''}`}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1} of ${slides.length}: ${item.title}`}
                  aria-current={i === index}
                >
                  <span className="ob__dot" />
                </button>
              </li>
            ))}
          </ol>

          {/* the live region has to outlive the slide, or the swap replaces the
              region itself and a screen reader announces nothing */}
          <div aria-live="polite">
            <div key={slide.key} className="ob__copy" data-dir={dir}>
              <h1>{slide.title}</h1>
              <p>{slide.body}</p>
            </div>
          </div>

          <div className="ob__actions">
            {index > 0 && (
              <button type="button" className="ob__back" onClick={() => go(index - 1)}>
                {labels.back}
              </button>
            )}
            <button
              type="button"
              className="btn ob__next"
              onClick={() => (last ? onDone() : go(index + 1))}
            >
              {last ? labels.start : labels.next}
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
