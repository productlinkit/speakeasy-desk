import { useState } from 'react'
import { QuizRunner, type QuizResult } from '../components/QuizRunner'
import { ResultScreen } from '../components/ResultScreen'
import {
  dailyDone,
  dailyIntro,
  dailyQuestions,
  dailyResult,
  markDailyDone,
} from '../data/dailyChallenge'
import './FindLevel.css'

export type DailyStep = 'intro' | 'quiz' | 'completion' | 'done'

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

function Intro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="flevel">
      <header className="flevel__head">
        <button type="button" className="flevel__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
      </header>

      <div className="flevel__body">
        <img src={dailyIntro.image} alt="" className="flevel__art" />
        <h1 className="flevel__title">{dailyIntro.title}</h1>
      </div>

      <div className="flevel__foot">
        <button type="button" className="btn btn--block flevel__cta" onClick={onStart}>
          Start Daily Challenge
        </button>
      </div>
    </div>
  )
}

function Done({ onHome }: { onHome: () => void }) {
  return (
    <div className="flevel">
      <div className="flevel__body">
        <img src={dailyDone.image} alt="" className="flevel__art flevel__art--result" />
        <h1 className="flevel__title">{dailyDone.title}</h1>
        <p className="flevel__text">
          <strong>{dailyDone.lead}</strong> {dailyDone.tail}
        </p>
      </div>

      <div className="flevel__foot">
        <button type="button" className="btn btn--block flevel__cta" onClick={onHome}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export function DailyChallenge({
  step,
  onNavigate,
}: {
  step: DailyStep
  onNavigate: (to: string) => void
}) {
  const [score, setScore] = useState<QuizResult | null>(null)

  if (step === 'quiz') {
    return (
      <QuizRunner
        title="Daily Challenge"
        questions={dailyQuestions}
        checkLabel="Check Answer"
        onExit={() => onNavigate('/daily-challenge')}
        onFinish={(result) => {
          setScore(result)
          markDailyDone()
          onNavigate('/daily-challenge/completion')
        }}
      />
    )
  }

  if (step === 'completion') {
    return (
      <ResultScreen
        title={dailyResult.title}
        subtitle={dailyResult.subtitle}
        correct={score?.correct ?? 0}
        total={score?.total ?? dailyQuestions.length}
        seconds={score?.seconds ?? 0}
        xp={dailyResult.xp}
        timeLabel="Time"
        xpLabel="Exp"
        onContinue={() => onNavigate('/')}
      />
    )
  }

  if (step === 'done') {
    return <Done onHome={() => onNavigate('/')} />
  }

  return <Intro onStart={() => onNavigate('/daily-challenge/quiz')} onBack={() => onNavigate('/')} />
}
