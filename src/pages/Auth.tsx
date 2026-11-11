import { useState } from 'react'
import { LottiePlayer } from '../components/LottiePlayer'
import { dialCodes, forgotLink, google, orLabel, screens, type AuthStep } from '../data/auth'
import './Auth.css'

type Values = {
  name: string
  email: string
  dob: string
  dial: string
  phone: string
  password: string
}

const blank: Values = { name: '', email: '', dob: '', dial: '+62', phone: '', password: '' }

/** deliberately loose: enough to catch a typo, not to argue about RFC 5322 */
const emailLooksRight = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

type Errors = Partial<Record<keyof Values, string>>

function check(step: AuthStep, v: Values): Errors {
  const e: Errors = {}
  if (!v.email.trim()) e.email = 'Enter your email'
  else if (!emailLooksRight(v.email)) e.email = 'That does not look like an email address'
  if (step === 'forgot') return e

  if (!v.password) e.password = step === 'signup' ? 'Create a password' : 'Enter your password'
  else if (step === 'signup' && v.password.length < 8) e.password = 'Use at least 8 characters'
  if (step === 'login') return e

  if (!v.name.trim()) e.name = 'Enter your full name'
  if (!v.dob) e.dob = 'Select your date of birth'
  else if (new Date(v.dob) >= new Date()) e.dob = 'Pick a date in the past'
  if (!v.phone.trim()) e.phone = 'Enter your phone number'
  else if (!/^[\d\s-]{6,}$/.test(v.phone.trim())) e.phone = 'Use digits only, at least 6 of them'
  return e
}

/** the order the fields appear in, so a failed submit lands on the first one */
const order: Record<AuthStep, (keyof Values)[]> = {
  login: ['email', 'password'],
  signup: ['name', 'email', 'dob', 'phone', 'password'],
  forgot: ['email'],
}

function Eye({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      {off && <path d="m4 20 16-16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.6 5-4.5 7l6.9 5.3C42.5 36.3 45 30.7 45 24Z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.4-5.2l-6.9-5.3c-1.8 1.3-4.3 2.2-7.5 2.2-5.8 0-10.7-3.8-12.4-9l-7.1 5.5C8 41.3 15.4 46 24 46Z" />
      <path fill="#FBBC05" d="M11.6 28.7a13.4 13.4 0 0 1 0-9.4l-7.1-5.5a22 22 0 0 0 0 20.4l7.1-5.5Z" />
      <path fill="#EA4335" d="M24 10.7c3.2 0 6 1.1 8.2 3.2l6.1-6.1C34.9 4.4 29.9 2 24 2 15.4 2 8 6.7 4.5 13.8l7.1 5.5c1.7-5.2 6.6-9 12.4-9.6Z" />
    </svg>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="au__field">
      <label className="au__label" htmlFor={id}>
        {label}
      </label>
      <div className={`au__box${error ? ' is-bad' : ''}`}>{children}</div>
      {error && (
        <p className="au__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export function Auth({
  step,
  onNavigate,
  onSignedIn,
}: {
  step: AuthStep
  onNavigate: (to: string) => void
  /** lifts the guest gate over the rest of the app */
  onSignedIn: () => void
}) {
  const [values, setValues] = useState<Values>(blank)
  const [errors, setErrors] = useState<Errors>({})
  /** nothing is marked wrong until the form has been sent once */
  const [tried, setTried] = useState(false)
  const [show, setShow] = useState(false)
  const [sent, setSent] = useState(false)
  const [was, setWas] = useState(step)

  // moving between login and sign up keeps what has been typed, but drops the
  // complaints about it — they belong to the form that was submitted
  if (was !== step) {
    setWas(step)
    setErrors({})
    setTried(false)
    setSent(false)
  }

  const copy = screens[step]

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...values, [key]: e.target.value }
    setValues(next)
    if (tried) setErrors(check(step, next))
  }

  const bind = (key: keyof Values) => ({
    id: key,
    value: values[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = check(step, values)
    setErrors(found)
    setTried(true)
    if (Object.keys(found).length > 0) {
      const first = order[step].find((k) => found[k])
      if (first) document.getElementById(first)?.focus()
      return
    }
    // a reset link is not a way in, so the gate stays where it is
    if (step === 'forgot') {
      setSent(true)
      return
    }
    onSignedIn()
    // a new account goes on to the questions; a returning one straight home
    onNavigate(step === 'signup' ? '/add-language' : '/')
  }

  return (
    <div className="au">
      <header className="au__bar">
        <a
          className="au__brand"
          href="/splash"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('/splash')
          }}
        >
          <img src="/logo-splash.png" alt="SpeakEasy" width={320} height={128} />
        </a>
      </header>

      <div className="au__deck">
        {/* the same tinted stage the intro carousel uses, so the two screens
            read as one flow rather than two unrelated pages */}
        <div className="au__stage" aria-hidden>
          <span className="au__glow" />
          <div className="au__art">
            <LottiePlayer
              src="/assets/lottie/speakeasy-fox-wave2.json"
              poster="/assets/mascot/splash1.webp"
              playing
              fit="contain"
            />
          </div>
        </div>

        <div className="au__panel">
          <h1 className="au__title">{copy.title}</h1>
          <p className="au__lead">{copy.lead}</p>

          {sent ? (
            <div className="au__sent" role="status">
              <p className="au__sentHead">Check your inbox</p>
              <p>
                If an account uses <strong>{values.email.trim()}</strong>, the reset link is on its
                way.
              </p>
              <button type="button" className="btn btn--block" onClick={() => onNavigate('/login')}>
                Back to login
              </button>
            </div>
          ) : (
            <form className="au__form" onSubmit={submit} noValidate>
              {step === 'signup' && (
                <Field id="name" label="Full Name" error={tried ? errors.name : undefined}>
                  <input
                    {...bind('name')}
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                  />
                </Field>
              )}

              <Field id="email" label="Email" error={tried ? errors.email : undefined}>
                <input
                  {...bind('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </Field>

              {step === 'signup' && (
                <>
                  <Field id="dob" label="Date of Birth" error={tried ? errors.dob : undefined}>
                    <input {...bind('dob')} type="date" autoComplete="bday" />
                  </Field>

                  <Field id="phone" label="Phone Number" error={tried ? errors.phone : undefined}>
                    <select
                      className="au__dial"
                      value={values.dial}
                      onChange={set('dial')}
                      aria-label="Country dialling code"
                    >
                      {dialCodes.map((c) => (
                        // the country's name would not fit the closed control,
                        // and a native select cannot show a shorter label there
                        <option key={c.code} value={c.dial} title={c.name}>
                          {c.dial} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      {...bind('phone')}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="812 3456 7890"
                    />
                  </Field>
                </>
              )}

              {step !== 'forgot' && (
                <Field id="password" label="Password" error={tried ? errors.password : undefined}>
                  <input
                    {...bind('password')}
                    type={show ? 'text' : 'password'}
                    autoComplete={step === 'signup' ? 'new-password' : 'current-password'}
                    placeholder={step === 'signup' ? 'Create a password' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    className="au__eye"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    aria-pressed={show}
                  >
                    <Eye off={show} />
                  </button>
                </Field>
              )}

              {step === 'login' && (
                <button
                  type="button"
                  className="au__forgot"
                  onClick={() => onNavigate('/forgot-password')}
                >
                  {forgotLink}
                </button>
              )}

              <button type="submit" className="btn btn--block au__submit">
                {copy.submit}
              </button>

              {step !== 'forgot' && (
                <>
                  <p className="au__or">
                    <span>{orLabel}</span>
                  </p>
                  {/* there is no Google to ask, so it lands where the form
                      lands — a dead button would be the bigger lie */}
                  <button
                    type="button"
                    className="au__google"
                    onClick={() => {
                      onSignedIn()
                      onNavigate(step === 'signup' ? '/add-language' : '/')
                    }}
                  >
                    <GoogleMark />
                    {google}
                  </button>
                </>
              )}
            </form>
          )}

          {!sent && (
            <p className="au__foot">
              {copy.foot}{' '}
              <button
                type="button"
                onClick={() => onNavigate(step === 'login' ? '/signup' : '/login')}
              >
                {copy.footLink}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
