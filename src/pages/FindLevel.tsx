import { useState } from 'react'
import { QuizRunner, type QuizResult } from '../components/QuizRunner'
import { intro, levelFor, placementQuestions, result as resultCopy } from '../data/findLevel'
import './FindLevel.css'

export type FindLevelStep = 'intro' | 'quiz' | 'result'

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

function Intro({ onStart, onLater }: { onStart: () => void; onLater: () => void }) {
  return (
    <div className="flevel">
      <header className="flevel__head">
        <button type="button" className="flevel__back" onClick={onLater} aria-label="Back">
          <BackArrow />
        </button>
      </header>

      <div className="flevel__body">
        <img src={intro.image} alt="" className="flevel__art" />
        <h1 className="flevel__title">{intro.title}</h1>
        <p className="flevel__text">{intro.body}</p>
      </div>

      <div className="flevel__foot">
        <button type="button" className="btn btn--block flevel__cta" onClick={onStart}>
          Start the Test
        </button>
        <button type="button" className="flevel__link" onClick={onLater}>
          Maybe later
        </button>
      </div>
    </div>
  )
}

function Result({
  score,
  onStartLearning,
  onRetake,
}: {
  score: QuizResult | null
  onStartLearning: () => void
  onRetake: () => void
}) {
  const level = levelFor(score?.correct ?? 0, score?.total ?? placementQuestions.length)

  return (
    <div className="flevel">
      <div className="flevel__body">
        <img src={resultCopy.image} alt="" className="flevel__art flevel__art--result" />
        <h1 className="flevel__title">
          <span className="flevel__emoji" aria-hidden>
            {resultCopy.emoji}
          </span>
          {resultCopy.title}
        </h1>
        <p className="flevel__text">{resultCopy.lead}</p>
        <p className="flevel__level">{level}</p>
        <p className="flevel__text">{resultCopy.tail}</p>
      </div>

      <div className="flevel__foot">
        <button type="button" className="btn btn--block flevel__cta" onClick={onStartLearning}>
          Start Learning Now
        </button>
        <button type="button" className="flevel__link" onClick={onRetake}>
          Retake Test
        </button>
      </div>
    </div>
  )
}

export function FindLevel({
  step,
  onNavigate,
}: {
  step: FindLevelStep
  onNavigate: (to: string) => void
}) {
  const [score, setScore] = useState<QuizResult | null>(null)

  if (step === 'quiz') {
    return (
      <QuizRunner
        title="Find level"
        questions={placementQuestions}
        checkLabel="Check Answer"
        onExit={() => onNavigate('/find-level')}
        onFinish={(r) => {
          setScore(r)
          onNavigate('/find-level/result')
        }}
      />
    )
  }

  if (step === 'result') {
    return (
      <Result
        score={score}
        onStartLearning={() => onNavigate('/learning')}
        onRetake={() => {
          setScore(null)
          onNavigate('/find-level/quiz')
        }}
      />
    )
  }

  return <Intro onStart={() => onNavigate('/find-level/quiz')} onLater={() => onNavigate('/')} />
}
