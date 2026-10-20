import { useState } from 'react'
import { languageQuestion, languages, steps, totalSteps } from '../data/addLanguage'
import './AddLanguage.css'

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

function Check({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="m5 12.5 4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function AddLanguage({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>(() => steps.map(() => null))

  const stepData = step > 1 ? steps[step - 2] : null
  const answered = step === 1 ? language !== null : answers[step - 2] !== null

  const back = () => (step === 1 ? onExit() : setStep((s) => s - 1))

  const next = () => {
    if (step === totalSteps) {
      onExit()
      return
    }
    setStep((s) => s + 1)
  }

  const pick = (option: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === step - 2 ? option : a)))
  }

  return (
    <div className="addlang">
      <header className="addlang__head">
        <button type="button" className="addlang__back" onClick={back} aria-label="Back">
          <BackArrow />
        </button>
      </header>

      <p className="addlang__step">
        <strong>Step {step}</strong> of {totalSteps}
      </p>
      <div className="addlang__track">
        <div className="addlang__fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      {stepData?.banner && <p className="addlang__banner">{stepData.banner}</p>}

      <h1 className="addlang__question">{stepData ? stepData.question : languageQuestion}</h1>

      {step === 1 ? (
        <ul className="langs">
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                className={`lang${item.locked ? ' is-locked' : ''}${
                  language === item.code ? ' is-selected' : ''
                }`}
                onClick={() => !item.locked && setLanguage(item.code)}
                disabled={item.locked}
                aria-pressed={language === item.code}
              >
                <img src={item.flag} alt="" className="lang__flag" />
                {item.locked && <Check className="lang__owned" />}
                {language === item.code && <Check className="lang__tick" />}
                <span className="lang__code">{item.code}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="choices">
          {stepData?.options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`choice${answers[step - 2] === option ? ' is-selected' : ''}`}
                onClick={() => pick(option)}
                aria-pressed={answers[step - 2] === option}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="addlang__foot">
        <button type="button" className="btn btn--block addlang__next" onClick={next} disabled={!answered}>
          Next
        </button>
        {stepData?.skippable && (
          <button type="button" className="addlang__skip" onClick={next}>
            Skip this question
          </button>
        )}
      </div>
    </div>
  )
}
