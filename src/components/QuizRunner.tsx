import { useEffect, useRef, useState } from 'react'
import { ClipPlayer } from './ClipPlayer'
import type { Question } from '../data/quiz'
import '../pages/Quiz.css'

export type QuizResult = { correct: number; total: number; seconds: number }

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

function FlagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 21V4m0 0h10.5l-1.5 3.5L15.5 11H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Face({ happy }: { happy: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" />
      <circle cx="15" cy="10" r="1.1" fill="currentColor" />
      <path
        d={happy ? 'M8.5 14.5a4 4 0 0 0 7 0' : 'M15.5 16a4 4 0 0 0-7 0'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Explanation({
  text,
  prompt,
  onClose,
}: {
  text: string
  prompt: string
  onClose: () => void
}) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Explanation">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__sheet">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal__title">{prompt.length > 48 ? `${prompt.slice(0, 48)}…` : prompt}</h2>
        <p className="modal__label">
          <span className="modal__check" aria-hidden>
            ✓
          </span>
          Why it&apos;s correct:
        </p>
        <p className="modal__text">{text}</p>
        <p className="modal__ask">Is this explanation helpful?</p>
        <div className="modal__actions">
          <button type="button" className="modal__btn" onClick={onClose}>
            <Face happy={false} /> No
          </button>
          <button type="button" className="modal__btn modal__btn--primary" onClick={onClose}>
            <Face happy /> Yes
          </button>
        </div>
      </div>
    </div>
  )
}

type QuizRunnerProps = {
  title: string
  questions: Question[]
  /** the lesson quiz says "Check Answers", the placement test "Check Answer" */
  checkLabel: string
  /** used when a question carries no image of its own */
  fallbackImage?: string
  onExit: () => void
  onFinish: (result: QuizResult) => void
}

export function QuizRunner({
  title,
  questions,
  checkLabel,
  fallbackImage,
  onExit,
  onFinish,
}: QuizRunnerProps) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  const startedAt = useRef(0)
  const seconds = useRef(0)
  useEffect(() => {
    if (!startedAt.current) startedAt.current = Date.now()
    const id = setInterval(() => {
      seconds.current = Math.floor((Date.now() - startedAt.current) / 1000)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const question = questions[index]
  const isCorrect = checked && picked === question.answer
  const isLast = index === questions.length - 1

  const check = () => {
    if (picked === null) return
    setChecked(true)
    if (picked === question.answer) setCorrectCount((n) => n + 1)
  }

  const advance = () => {
    if (isLast) {
      onFinish({
        correct: correctCount,
        total: questions.length,
        seconds: Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000)),
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  const optionState = (i: number) => {
    if (!checked) return picked === i ? ' is-picked' : ''
    if (i === question.answer) return ' is-correct'
    if (i === picked) return ' is-wrong'
    return ''
  }

  return (
    <div className="quiz">
      <header className="quiz__head">
        <button type="button" className="quiz__icon" onClick={onExit} aria-label="Back">
          <BackArrow />
        </button>
        <h1>{title}</h1>
        <button type="button" className="quiz__icon quiz__icon--flag" aria-label="Report this question">
          <FlagIcon />
        </button>
      </header>

      <div className="quiz__body">
        <figure className="quiz__art">
          {question.video ? (
            <ClipPlayer src={question.video} poster={question.image ?? fallbackImage} />
          ) : (
            <img src={question.image ?? fallbackImage} alt="" />
          )}
        </figure>

        <div className="quiz__main">
          <p className="quiz__prompt">{question.prompt}</p>

          <ul className="options">
            {question.options.map((option, i) => (
              <li key={option}>
                <button
                  type="button"
                  className={`option${optionState(i)}`}
                  onClick={() => !checked && setPicked(i)}
                  disabled={checked}
                  aria-pressed={picked === i}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="quiz__foot">
        <div className="quiz__cta">
          {checked ? (
            <>
              <p className={`verdict${isCorrect ? '' : ' verdict--wrong'}`}>
                {isCorrect ? 'Correct! 🎉' : 'Incorrect ✗'}
              </p>
              <button type="button" className="btn btn--block" onClick={() => setShowExplanation(true)}>
                Read Explanations
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--block" onClick={check} disabled={picked === null}>
              {checkLabel}
            </button>
          )}
        </div>

        <div className="quiz__nav">
          <span className="quiz__count">
            {index + 1}/{questions.length}
          </span>
          {checked ? (
            <button type="button" className="btn quiz__next" onClick={advance}>
              {isLast ? 'Finish' : 'Next'}
            </button>
          ) : (
            <button type="button" className="quiz__skip" onClick={advance}>
              Skip
            </button>
          )}
        </div>
      </div>

      {showExplanation && (
        <Explanation
          text={question.explanation}
          prompt={question.prompt}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </div>
  )
}
