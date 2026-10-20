import { useState } from 'react'
import { doneCourses, level, ongoingCourses, type Course } from '../data/learning'
import './Learning.css'

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

function CourseRing({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="course-ring" role="img" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} className="course-ring__track" />
        <circle
          cx="30"
          cy="30"
          r={r}
          className="course-ring__fill"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span>{value}%</span>
    </div>
  )
}

function CourseCard({ course, onStart }: { course: Course; onStart: () => void }) {
  return (
    <article className="course-card">
      <CourseRing value={course.progress} />
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button type="button" className="btn" onClick={onStart}>
        Continue Lesson
      </button>
      <img src={course.image} alt="" className="course-card__img" loading="lazy" />
    </article>
  )
}

export function Learning({ onStartQuiz, onBack }: { onStartQuiz: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing')
  const courses = tab === 'ongoing' ? ongoingCourses : doneCourses

  return (
    <div className="learning">
      <header className="learning__head">
        <button type="button" className="learning__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>My Learning</h1>
      </header>

      <div className="learning__top">
        <section className="level">
          <h2>{level.name}</h2>
          <div className="level__bar">
            <div className="level__track">
              <div className="level__fill" style={{ width: `${level.progress}%` }} />
            </div>
            <span className="level__pct">{level.progress}%</span>
          </div>
          <p className="level__note">{level.note}</p>
        </section>

        <section className="goals">
          <div className="goals__art">
            <img src="/assets/mascot/4.png" alt="" />
          </div>
          <div className="goals__body">
            <p>
              {level.name}:<strong>Learning Goals</strong>
            </p>
            <button type="button" className="btn">
              See Plans
            </button>
          </div>
        </section>
      </div>

      <section className="lessons" aria-labelledby="lessons-title">
        <h2 id="lessons-title" className="lessons__title">
          Curated Lessons, Just For You
        </h2>

        <div className="tabs" role="tablist" aria-label="Lesson status">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'ongoing'}
            className={`tabs__btn${tab === 'ongoing' ? ' is-active' : ''}`}
            onClick={() => setTab('ongoing')}
          >
            On Going
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'done'}
            className={`tabs__btn${tab === 'done' ? ' is-active' : ''}`}
            onClick={() => setTab('done')}
          >
            Done
          </button>
        </div>

        <h3 className="lessons__subtitle">Courses</h3>

        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} onStart={onStartQuiz} />
          ))}
        </div>
      </section>
    </div>
  )
}
