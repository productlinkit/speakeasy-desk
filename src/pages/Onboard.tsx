import { useCallback, useEffect, useState } from 'react'
import { LottiePlayer } from '../components/LottiePlayer'
import { languageQuestion, languages, steps, totalSteps } from '../data/addLanguage'
import { useSession } from '../session'
import {
  benefits,
  benefitsScreen,
  compareRows,
  compareScreen,
  paymentResults,
  paymentScreen,
  receipt,
  priceLists,
  priceSwitch,
  plansScreen,
  type Plan,
  type PaymentState,
  type PriceList,
} from '../data/boost'
import './Onboard.css'

export type OnboardStep = 'questions' | 'boost' | 'compare' | 'plans' | 'payment'

type Nav = (to: string) => void

function Tick({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function BackArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function Brand({ onNavigate }: { onNavigate: Nav }) {
  return (
    <a
      className="fl__brand"
      href="/splash"
      onClick={(e) => {
        e.preventDefault()
        onNavigate('/splash')
      }}
    >
      <img src="/logo-splash.png" alt="SpeakEasy" width={320} height={128} />
    </a>
  )
}

/* ---------------------------------------------------------------- questions */

function Questions({ onNavigate }: { onNavigate: Nav }) {
  const { saveProfile } = useSession()
  const [step, setStep] = useState(1)
  /** which way the deck last turned, so the question enters from that side */
  const [dir, setDir] = useState(1)
  const [language, setLanguage] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>(() => steps.map(() => null))

  const data = step > 1 ? steps[step - 2] : null
  const answered = step === 1 ? language !== null : answers[step - 2] !== null
  const options = data ? data.options : []

  const go = useCallback((to: number) => {
    setDir(to > 0 ? 1 : -1)
    setStep((s) => {
      const next = s + to
      return next < 1 ? 1 : next > totalSteps ? totalSteps : next
    })
  }, [])

  const next = () => {
    if (step < totalSteps) return go(1)
    // the wizard used to drop the answer on the floor; the language it was
    // opened to change is the one thing it has to keep
    if (language) saveProfile({ language })
    onNavigate('/boost')
  }
  const back = () => (step === 1 ? onNavigate('/') : go(-1))

  const pick = (option: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === step - 2 ? option : a)))

  // the number keys pick an answer, the way they do in a quiz
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (step > 1 && n >= 1 && n <= options.length) pick(options[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, options.length])

  return (
    <div className="fl">
      <header className="fl__bar">
        <Brand onNavigate={onNavigate} />
        <button type="button" className="fl__skip" onClick={() => onNavigate('/')}>
          Skip for now
        </button>
      </header>

      <div className="fl__deck">
        {/* this scene is painted on its own backdrop, so it fills the stage
            rather than sitting on one — a plate on a plate reads as a seam */}
        <div className="fl__stage fl__stage--plan" aria-hidden>
          <div className="fl__art fl__art--plan">
            <LottiePlayer
              src="/assets/lottie/speakeasy-fox-study-plan.json"
              poster="/assets/mascot/5.png"
              playing
              fit="cover"
            />
          </div>
        </div>

        <div className="fl__panel">
          <p className="flq__step">
            <strong>Step {step}</strong> of {totalSteps}
          </p>
          <div className="flq__track">
            <div className="flq__fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>

          {/* keyed, so each turn replays the entrance */}
          <div key={step} className="flq__body" data-dir={dir}>
            {data?.banner && <p className="flq__banner">{data.banner}</p>}
            <h1 className="flq__question">{data ? data.question : languageQuestion}</h1>

            {step === 1 ? (
              <ul className="flq__langs">
                  {languages.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        className={`flang${language === item.code ? ' is-on' : ''}`}
                        onClick={() => setLanguage(item.code)}
                        aria-pressed={language === item.code}
                        aria-label={item.code}
                      >
                        <img src={item.flag} alt="" className="flang__flag" />
                        {/* the one tick on the page means "this is the one you
                            picked" — nothing is ticked before you pick */}
                        {language === item.code && (
                          <span className="flang__tick" aria-hidden>
                            <Tick />
                          </span>
                        )}
                        <span className="flang__code">{item.code}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            ) : (
              <ul className="flq__choices">
                {options.map((option, i) => (
                  <li key={option}>
                    <button
                      type="button"
                      className={`flopt${answers[step - 2] === option ? ' is-on' : ''}`}
                      onClick={() => pick(option)}
                      aria-pressed={answers[step - 2] === option}
                    >
                      <span className="flopt__key" aria-hidden>
                        {i + 1}
                      </span>
                      {option}
                      <span className="flopt__tick" aria-hidden>
                        <Tick />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="fl__actions">
            <button type="button" className="fl__back" onClick={back}>
              Back
            </button>
            <button type="button" className="btn fl__next" onClick={next} disabled={!answered}>
              {step === totalSteps ? 'Finish' : 'Next'}
            </button>
            {data?.skippable && (
              <button type="button" className="flq__skipq" onClick={() => go(1)}>
                Skip this question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- boost */

function Boost({ onNavigate }: { onNavigate: Nav }) {
  return (
    <div className="fl">
      <header className="fl__bar">
        <Brand onNavigate={onNavigate} />
        <span className="flb__badge">BOOST</span>
      </header>

      <div className="fl__deck">
        <div className="fl__stage fl__stage--gift" aria-hidden>
          <span className="fl__glow" />
          <img className="flb__art" src={benefitsScreen.art} alt="" />
        </div>

        <div className="fl__panel">
          <h1 className="flb__lead">
            <span className="flb__mark">{benefitsScreen.leadHead}</span>
            {benefitsScreen.leadTail}
          </h1>

          <ul className="flb__list">
            {benefits.map((item) => (
              <li key={item.label}>
                <img src={item.icon} alt="" />
                {item.label}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flb__compare"
            onClick={() => onNavigate('/boost/compare')}
          >
            {benefitsScreen.compare}
          </button>

          <div className="fl__actions fl__actions--stack">
            <button
              type="button"
              className="btn btn--block"
              onClick={() => onNavigate('/boost/plans')}
            >
              {benefitsScreen.upgrade}
            </button>
            <button type="button" className="fl__stay" onClick={() => onNavigate('/')}>
              {benefitsScreen.stay}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ compare */

function Compare({ onNavigate }: { onNavigate: Nav }) {
  return (
    <div className="fl">
      <header className="fl__bar">
        <button
          type="button"
          className="fl__arrow"
          onClick={() => onNavigate('/boost')}
          aria-label="Back to BOOST"
        >
          <BackArrow />
        </button>
        <Brand onNavigate={onNavigate} />
        <span className="flb__badge">BOOST</span>
      </header>

      <div className="fl__column">
        <h1 className="flc__title">
          {compareScreen.titleHead}
          <span className="flb__mark">{compareScreen.titleMark}</span>
        </h1>

        <table className="flc__table">
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Feature</span>
              </th>
              <th scope="col">{compareScreen.free}</th>
              <th scope="col">
                <span className="flc__paid">{compareScreen.paid}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>
                  {row.free ? (
                    <span className="flc__yes">
                      <Tick />
                      <span className="visually-hidden">Included</span>
                    </span>
                  ) : (
                    <span className="flc__no" aria-label="Not included" />
                  )}
                </td>
                <td>
                  <span className="flc__yes">
                    <Tick />
                    <span className="visually-hidden">Included</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fl__actions fl__actions--stack">
          <button
            type="button"
            className="btn btn--block"
            onClick={() => onNavigate('/boost/plans')}
          >
            {benefitsScreen.upgrade}
          </button>
          <button type="button" className="fl__stay" onClick={() => onNavigate('/')}>
            {benefitsScreen.stay}
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- plans */

function Plans({ onNavigate }: { onNavigate: Nav }) {
  const [list, setList] = useState<PriceList>(priceLists[0])
  const [chosen, setChosen] = useState<string | null>(null)

  // a plan with nothing to pay has nothing to pay for
  const pick = (plan: Plan) => {
    setChosen(plan.type)
    if (plan.type !== 'free_plan') onNavigate(`/boost/payment?list=${list.key}&plan=${plan.type}`)
  }

  return (
    <div className="fl">
      <header className="fl__bar">
        <button
          type="button"
          className="fl__arrow"
          onClick={() => onNavigate('/boost')}
          aria-label="Back to BOOST"
        >
          <BackArrow />
        </button>
        <Brand onNavigate={onNavigate} />
        <span className="flb__badge">BOOST</span>
      </header>

      <div className="fl__column">
        <h1 className="flc__title">
          {plansScreen.titleHead}
          <span className="flb__mark">{plansScreen.titleMark}</span>
          {plansScreen.titleTail}
        </h1>

        {/* the app has no such control — it serves one list per portal — so the
            switch says which portal each list belongs to rather than pretending
            to convert between them */}
        <div className="flp__cur">
          <span className="flp__curLabel" id="cur-label">
            {priceSwitch.label}
          </span>
          <div className="flp__seg" role="group" aria-labelledby="cur-label">
            {priceLists.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`flp__segBtn${item.key === list.key ? ' is-on' : ''}`}
                onClick={() => {
                  setList(item)
                  setChosen(null)
                }}
                aria-pressed={item.key === list.key}
              >
                {item.label}
                <span className="flp__segPortal">{item.portal}</span>
              </button>
            ))}
          </div>
        </div>

        <ul className="flp__grid">
          {list.plans.map((plan) => (
            <li key={plan.type}>
              <button
                type="button"
                className={`flp__card${chosen === plan.type ? ' is-on' : ''}`}
                onClick={() => pick(plan)}
              >
                <span className="flp__head">
                  {/* served in Hindi by the India portal, so it is marked as
                      Hindi and a screen reader switches voice for it */}
                  <span className="flp__name" lang={list.key === 'inr' ? 'hi' : undefined}>
                    {plan.name}
                  </span>
                  <span className="flp__rate">{plan.rate}</span>
                </span>
                <span className="flp__foot">
                  <span className="flp__cycle">{plan.cycle}</span>
                  <span className="flp__total">{plan.total}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="flp__note" role="status">
          {chosen === 'free_plan'
            ? 'Free Plan selected. There is nothing to pay.'
            : priceSwitch.note}
        </p>

        <div className="fl__actions fl__actions--stack">
          <button type="button" className="btn btn--block" onClick={() => onNavigate('/boost')}>
            {plansScreen.back}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ payment */

function Payment({ search, onNavigate }: { search: string; onNavigate: Nav }) {
  const params0 = new URLSearchParams(search)
  const list = priceLists.find((l) => l.key === params0.get('list')) ?? priceLists[0]
  const plan = list.plans.find((p) => p.type === params0.get('plan'))
  /** the plan travels with the visitor, through the result screens too */
  const params = `?list=${list.key}&plan=${params0.get('plan') ?? ''}`

  if (!plan) {
    return (
      <div className="fl">
        <header className="fl__bar">
          <Brand onNavigate={onNavigate} />
        </header>
        <div className="fl__column">
          <h1 className="flc__title">No plan chosen yet</h1>
          <div className="fl__actions fl__actions--stack">
            <button
              type="button"
              className="btn btn--block"
              onClick={() => onNavigate('/boost/plans')}
            >
              Choose a plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fl">
      <header className="fl__bar">
        <button
          type="button"
          className="fl__arrow"
          onClick={() => onNavigate('/boost/plans')}
          aria-label="Back to the plans"
        >
          <BackArrow />
        </button>
        <Brand onNavigate={onNavigate} />
        <span className="flb__badge">{paymentScreen.badge}</span>
      </header>

      {/* No card is asked for here — Stripe asks. What is left is the one thing
          this screen can answer: what is being bought, and for how much. */}
      <div className="flpay__deck">
        <h1 className="flpay__title">{paymentScreen.bar}</h1>
        <p className="flpay__lead">{paymentScreen.lead}</p>

        <dl className="flrec">
          <div>
            <dt>{receipt.plan}</dt>
            <dd lang={list.key === 'inr' ? 'hi' : undefined}>{plan.name}</dd>
          </div>
          <div>
            <dt>{receipt.cycle}</dt>
            <dd>{plan.cycle}</dd>
          </div>
          <div className="flrec__sum">
            <dt>{paymentScreen.total}</dt>
            <dd>{plan.total}</dd>
          </div>
        </dl>

        <p className="flpay__handover">{paymentScreen.handover}</p>

        <button
          type="button"
          className="btn btn--block"
          onClick={() => onNavigate(`/boost/payment/success${params}`)}
        >
          {paymentScreen.submit}
        </button>

        {/* The real hand-off answers minutes later, and not always the same
            way. Nothing here can wait for a bank, so the other two answers are
            reachable on their own — said out loud rather than hidden. */}
        <p className="flpay__slice">
          {paymentScreen.slice}{' '}
          <button type="button" onClick={() => onNavigate(`/boost/payment/pending${params}`)}>
            pending
          </button>
          {' · '}
          <button type="button" onClick={() => onNavigate(`/boost/payment/failed${params}`)}>
            failed
          </button>
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------- how the payment landed */

function StateGlyph({ state }: { state: PaymentState }) {
  if (state === 'success') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m4.5 12.5 5 5 10-11"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (state === 'pending') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M12 7.4V12l3.2 2.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m7.5 7.5 9 9m0-9-9 9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * A reference the same shape as the app's own — eighteen digits — made up on
 * the spot. There is no payment behind it, and a real one would come back from
 * the gateway.
 */
function makeReference() {
  let out = '8'
  for (let i = 0; i < 17; i++) out += Math.floor(Math.random() * 10)
  return out
}

function Result({
  state,
  search,
  onNavigate,
}: {
  state: PaymentState
  search: string
  onNavigate: Nav
}) {
  const params = new URLSearchParams(search)
  const list = priceLists.find((l) => l.key === params.get('list')) ?? priceLists[0]
  const plan = list.plans.find((p) => p.type === params.get('plan'))
  const copy = paymentResults[state]

  // settled once, or every render would hand out a different number
  const [ref] = useState(makeReference)
  const [checked, setChecked] = useState(false)

  const back = `?list=${list.key}&plan=${params.get('plan') ?? ''}`

  const primary = () => {
    if (state === 'success') onNavigate('/')
    else if (state === 'pending') setChecked(true)
    else onNavigate(`/boost/payment${back}`)
  }
  const secondary = () => {
    if (state === 'success') onNavigate('/boost')
    else if (state === 'pending') onNavigate('/')
    else onNavigate('/boost/plans')
  }

  return (
    <div className={`fl flres flres--${state}`}>
      <header className="fl__bar">
        <Brand onNavigate={onNavigate} />
        <span className="flb__badge">{paymentScreen.badge}</span>
      </header>

      <div className="flres__deck">
        <div className="flres__stage" aria-hidden>
          {state === 'success' && <img className="flres__fox" src="/assets/mascot/1.png" alt="" />}
          <span className="flres__glyph">
            <StateGlyph state={state} />
          </span>
        </div>

        <div className="flres__panel">
          <h1 className="flres__title">{copy.title}</h1>
          <p className="flres__lead">{copy.lead}</p>

          {plan && (
            <dl className="flrec">
              <div>
                <dt>{receipt.plan}</dt>
                <dd lang={list.key === 'inr' ? 'hi' : undefined}>{plan.name}</dd>
              </div>
              <div>
                <dt>{receipt.cycle}</dt>
                <dd>{plan.cycle}</dd>
              </div>
              <div className="flrec__sum">
                <dt>{receipt.total}</dt>
                <dd>{plan.total}</dd>
              </div>
              {copy.reference && (
                <div>
                  <dt>{receipt.reference}</dt>
                  <dd className="flrec__ref">{ref}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="fl__actions fl__actions--stack">
            <button type="button" className="btn btn--block" onClick={primary}>
              {copy.primary}
            </button>
            <button type="button" className="flres__second" onClick={secondary}>
              {copy.secondary}
            </button>
          </div>

          <p className="flres__note" role="status">
            {checked ? receipt.stillWaiting : ' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Onboard({
  step,
  path,
  search,
  onNavigate,
}: {
  step: OnboardStep
  path: string
  search: string
  onNavigate: Nav
}) {
  if (step === 'boost') return <Boost onNavigate={onNavigate} />
  if (step === 'compare') return <Compare onNavigate={onNavigate} />
  if (step === 'plans') return <Plans onNavigate={onNavigate} />
  if (step === 'payment') {
    // the last segment says how it landed; without one, nothing has happened yet
    const state = (['success', 'pending', 'failed'] as const).find((k) => path.endsWith(`/${k}`))
    return state ? (
      <Result state={state} search={search} onNavigate={onNavigate} />
    ) : (
      <Payment search={search} onNavigate={onNavigate} />
    )
  }
  return <Questions onNavigate={onNavigate} />
}
