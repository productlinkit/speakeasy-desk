import '../pages/Quiz.css'

type ResultScreenProps = {
  title: string
  subtitle: string
  correct: number
  total: number
  seconds: number
  xp: number
  /** the lesson result says "Time Spent" / "XP Gained", the daily one "Time" / "Exp" */
  timeLabel?: string
  xpLabel?: string
  onContinue: () => void
}

export function ResultScreen({
  title,
  subtitle,
  correct,
  total,
  seconds,
  xp,
  timeLabel = 'Time Spent',
  xpLabel = 'XP Gained',
  onContinue,
}: ResultScreenProps) {
  const accuracy = total ? Math.round((correct / total) * 100) : 0
  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="done">
      <img src="/assets/mascot/6.png" alt="" className="done__mascot" />

      <h1 className="done__title">
        {title}
        <span>{subtitle}</span>
      </h1>

      <div className="done__stats">
        <div className="stat stat--accuracy">
          <p className="stat__label">
            <img src="/assets/icons/arrow-point.svg" alt="" /> Accuracy
          </p>
          <p className="stat__value">{accuracy}%</p>
        </div>
        <div className="stat stat--time">
          <p className="stat__label">
            <img src="/assets/icons/clock.svg" alt="" /> {timeLabel}
          </p>
          <p className="stat__value">
            {mm}:{ss}
          </p>
        </div>
        <div className="stat stat--xp">
          <p className="stat__label">
            <img src="/assets/icons/diamond-purple.svg" alt="" /> {xpLabel}
          </p>
          <p className="stat__value">{xp}</p>
        </div>
      </div>

      <button type="button" className="btn btn--block done__cta" onClick={onContinue}>
        Continue
      </button>
    </div>
  )
}
