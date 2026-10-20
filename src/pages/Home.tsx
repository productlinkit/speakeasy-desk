import { useState } from 'react'
import { LottiePlayer } from '../components/LottiePlayer'
import { TopBar } from '../components/TopBar'
import { isDailyDone } from '../data/dailyChallenge'
import { learningItems, user, type LearningItem } from '../data/home'
import './Home.css'

function ArrowRight() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProgressRing({ value }: { value: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="ring" role="img" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} className="ring__track" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="ring__fill"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="ring__value">{value}%</span>
    </div>
  )
}

function ProgressCard({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <section className="card progress-card">
      <div className="progress-card__body">
        <div className="progress-card__info">
          <span className="lang-pill">
            <img src={user.language.flag} alt="" />
            {user.language.name}
          </span>
          <p className="progress-card__days">
            <img src="/assets/icons/fire-grey.svg" alt="" />
            {user.streakDays} Days
          </p>
          <p className="progress-card__hint">Keep going, you can do it!</p>
        </div>
        <ProgressRing value={user.progress} />
        <button
          type="button"
          className="btn btn--block progress-card__cta"
          onClick={onStartLearning}
        >
          Start learning
        </button>
      </div>
    </section>
  )
}

function ExploreCard({ onExplore }: { onExplore: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      className="card explore-card"
      onClick={onExplore}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && setHovered(true)}
    >
      <div className="explore-card__inner">
        <LottiePlayer
          src="/assets/lottie/speakeasy-fox-wave2.json"
          poster="/assets/mascot/4.png"
          playing={hovered}
          className="explore-card__mascot"
        />
        <div className="explore-card__text">
          <h2>Speak More, Explore More!</h2>
          <p>Try a new language and level up your skills!</p>
        </div>
        <span className="explore-card__arrow">
          <ArrowRight />
        </span>
      </div>
    </button>
  )
}

function FindLevelCard({ onFindLevel }: { onFindLevel: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <section
      className="card find-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // touch screens have no hover, so a tap on the card plays it too
      onPointerDown={(e) => e.pointerType !== 'mouse' && setHovered(true)}
    >
      <LottiePlayer
        src="/assets/lottie/speakeasy-find-your-level-fox.json"
        poster="/assets/mascot/5.png"
        playing={hovered}
        className="find-card__mascot"
      />
      <div className="find-card__content">
        <h2>Find your level to enhance your study plan!</h2>
        <button type="button" className="btn" onClick={onFindLevel}>
          Find level
        </button>
      </div>
    </section>
  )
}

type FeatureProps = {
  variant: 'daily' | 'video'
  title: string
  description?: string
  cta: string
  image: string
  /** when set, the still image becomes the poster for this animation */
  lottie?: string
  /** shows the check badge and mutes the button, like the app does */
  done?: boolean
  onAction?: () => void
}

function FeatureCard({
  variant,
  title,
  description,
  cta,
  image,
  lottie,
  done,
  onAction,
}: FeatureProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <section
      className={`feature-card feature-card--${variant}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && setHovered(true)}
    >
      <div className="feature-card__inner">
        {lottie ? (
          <LottiePlayer
            src={lottie}
            poster={image}
            playing={hovered}
            fit="cover"
            className="feature-card__img"
          />
        ) : (
          <img src={image} alt="" className="feature-card__img" loading="lazy" />
        )}
        {done && (
          <span className="feature-card__badge" aria-hidden>
            <CheckMark />
          </span>
        )}
        <div className="feature-card__content">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
          <button type="button" className="btn" onClick={onAction}>
            {done && <CheckMark />}
            {cta}
          </button>
        </div>
      </div>
    </section>
  )
}

function DiveCard({ item, onOpen }: { item: LearningItem; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      className="dive-card"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && setHovered(true)}
    >
      {item.lottie ? (
        <LottiePlayer src={item.lottie} poster={item.image} playing={hovered} fit="cover" />
      ) : (
        <img src={item.image} alt="" loading="lazy" />
      )}
      <span className="dive-card__title">{item.title}</span>
    </button>
  )
}

function DiveIntoLearning({ onDive }: { onDive: (key: LearningItem['key']) => void }) {
  return (
    <section className="dive" aria-labelledby="dive-title">
      <h2 id="dive-title" className="section-title">
        Dive into Learning
      </h2>
      <div className="dive__list">
        {learningItems.map((item) => (
          <DiveCard key={item.title} item={item} onOpen={() => onDive(item.key)} />
        ))}
      </div>
    </section>
  )
}

export function Home({
  onStartLearning,
  onFindLevel,
  onExplore,
  onDailyChallenge,
  onVideoCourses,
  onDive,
}: {
  onStartLearning: () => void
  onFindLevel: () => void
  onExplore: () => void
  onDailyChallenge: (done: boolean) => void
  onVideoCourses: () => void
  onDive: (key: LearningItem['key']) => void
}) {
  const dailyDone = isDailyDone()

  return (
    <div className="home">
      <TopBar />

      <div className="home-grid">
        <ProgressCard onStartLearning={onStartLearning} />
        <ExploreCard onExplore={onExplore} />
        <FindLevelCard onFindLevel={onFindLevel} />
        <FeatureCard
          variant="daily"
          title="Daily Challenge"
          description={
            dailyDone
              ? 'Done for today — come back tomorrow!'
              : 'Get 50xp and more vocabulary to learn'
          }
          cta={dailyDone ? 'Completed' : 'Get XP'}
          done={dailyDone}
          onAction={() => onDailyChallenge(dailyDone)}
          image="/assets/mascot/daily-challenge.webp"
          lottie="/assets/lottie/speakeasy-fox-study-plan.json"
        />
        <FeatureCard
          variant="video"
          title="Video Courses"
          cta="See Video"
          onAction={onVideoCourses}
          image="/assets/mascot/video-course.webp"
          lottie="/assets/lottie/speakeasy-fox-video-course.json"
        />
      </div>

      <DiveIntoLearning onDive={onDive} />
    </div>
  )
}
