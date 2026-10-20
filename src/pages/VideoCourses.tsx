import { useMemo, useState } from 'react'
import { VideoPlayer } from '../components/VideoPlayer'
import { user } from '../data/home'
import { videoCourses, videoReward, type VideoCourse } from '../data/videoCourses'
import './VideoCourses.css'

export type VideoStep = 'list' | 'player' | 'reward'

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

function List({
  onOpen,
  onBack,
}: {
  onOpen: (course: VideoCourse) => void
  onBack: () => void
}) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return videoCourses
    return videoCourses.filter((course) => course.title.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="vcourses">
      <header className="vcourses__head">
        <button type="button" className="vcourses__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>Video Courses</h1>
      </header>

      <p className="vcourses__lead">Select a language to start learning with video courses</p>

      <span className="vcourses__lang">
        <img src={user.language.flag} alt="" />
        {user.language.name}
      </span>

      <div className="vsearch">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Video Course"
          aria-label="Search video course"
        />
        {query && (
          <button type="button" className="vsearch__clear" onClick={() => setQuery('')} aria-label="Clear">
            ✕
          </button>
        )}
        <span className="vsearch__icon" aria-hidden>
          <SearchIcon />
        </span>
      </div>

      <h2 className="vcourses__subtitle">Choose Video Course</h2>

      <div className="vcourse-grid">
        {results.map((course) => (
          <article key={course.id} className="vcourse">
            <img src={course.thumb} alt="" className="vcourse__thumb" loading="lazy" />
            <div className="vcourse__foot">
              <p>{course.title}</p>
              <button
                type="button"
                className="vcourse__play"
                onClick={() => onOpen(course)}
                aria-label={`Play ${course.title}`}
              >
                <PlayIcon />
              </button>
            </div>
          </article>
        ))}
        {results.length === 0 && <p className="vcourses__empty">No video course matches “{query}”.</p>}
      </div>
    </div>
  )
}

function Player({
  course,
  onFinish,
  onBack,
}: {
  course: VideoCourse
  onFinish: () => void
  onBack: () => void
}) {
  return (
    <div className="vcourses">
      <header className="vcourses__head">
        <button type="button" className="vcourses__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>{course.title}</h1>
      </header>

      <VideoPlayer src={course.hls} poster={course.thumb} title={course.title} />

      <p className="vplayer__title">{course.title}</p>

      <section className="vplayer__about">
        <h2>Description</h2>
        <p>{course.description}</p>
        <h2>Learning Objectives</h2>
        <ul>
          {course.objectives.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <button type="button" className="btn btn--block vplayer__finish" onClick={onFinish}>
        Finish
      </button>
    </div>
  )
}

function Reward({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="vreward">
      <img src={videoReward.image} alt="" className="vreward__art" />
      <h1 className="vreward__title">
        {videoReward.emoji} {videoReward.title}
        {videoReward.emoji}
      </h1>
      <p className="vreward__text">
        You just earned <strong>{videoReward.xp}XP</strong> for completing video course.
        <br />
        {videoReward.tail}
      </p>
      <button type="button" className="btn btn--block vreward__cta" onClick={onContinue}>
        Continue Learning
      </button>
    </div>
  )
}

export function VideoCourses({
  step,
  onNavigate,
}: {
  step: VideoStep
  onNavigate: (to: string) => void
}) {
  const [course, setCourse] = useState<VideoCourse>(videoCourses[0])

  if (step === 'player') {
    return (
      <Player
        course={course}
        onFinish={() => onNavigate('/video-courses/reward')}
        onBack={() => onNavigate('/video-courses')}
      />
    )
  }

  if (step === 'reward') {
    return <Reward onContinue={() => onNavigate('/video-courses')} />
  }

  return (
    <List
      onOpen={(picked) => {
        setCourse(picked)
        onNavigate('/video-courses/player')
      }}
      onBack={() => onNavigate('/')}
    />
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
