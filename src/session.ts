import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * Who is looking at the slice.
 *
 * A visitor arrives as a guest: the intro plays, then the home page, and the
 * first thing they try to use sends them to the account screens. Signing in or
 * registering makes them a member, and from then on the app answers normally.
 *
 * It is kept in sessionStorage rather than localStorage on purpose. This is a
 * slice to be demonstrated, and an intro that plays once per machine looks
 * broken the second time — a new tab starts the whole flow from the top, while
 * a reload keeps you where you were.
 */

/** everything Edit Profile can change about the person signed in */
export type Profile = {
  name: string
  bio: string
  /** yyyy-mm-dd, which is the only format <input type="date"> speaks */
  birthday: string
  dial: string
  phone: string
  gender: '' | 'male' | 'female' | 'other'
  /** the language being learnt, by the code in data/addLanguage */
  language: string
  email: string
}

export type Session = {
  /** the intro carousel has been seen, so the home page is the landing screen */
  seenIntro: boolean
  /** signed in or registered — the gate is off */
  member: boolean
  profile: Profile
  /** on a paid plan, which is what the BOOST chip and Manage Subscription report */
  boost: boolean
  /** a cancelled plan is still a plan: it runs to its expiry and stops renewing */
  renews: boolean
}

export type Store = Session & {
  seeIntro: () => void
  signIn: () => void
  signOut: () => void
  saveProfile: (part: Partial<Profile>) => void
  setPlan: (part: Partial<Pick<Session, 'boost' | 'renews'>>) => void
}

const KEY = 'speakeasy.session'

const blank: Profile = {
  name: 'hana',
  bio: '',
  birthday: '2000-01-01',
  dial: '+62',
  phone: '815 233 164',
  gender: '',
  language: 'ENG',
  email: 'hana@speakeasy.mobi',
}

const fresh: Session = {
  seenIntro: false,
  member: false,
  profile: blank,
  boost: true,
  renews: true,
}

function read(): Session {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return fresh
    const saved = JSON.parse(raw) as Partial<Session>
    // the profile is nested, so it needs its own merge or an older stored
    // session would arrive missing whichever field was added since
    return { ...fresh, ...saved, profile: { ...blank, ...(saved.profile ?? {}) } }
  } catch {
    // a private window can refuse storage; the flow still works, it just
    // starts over on reload
    return fresh
  }
}

function write(next: Session) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* see read() */
  }
}

export const SessionContext = createContext<Store>({
  ...fresh,
  seeIntro: () => {},
  signIn: () => {},
  signOut: () => {},
  saveProfile: () => {},
  setPlan: () => {},
})

/** the live store, built once at the root and handed to the context */
export function useSessionStore(): Store {
  const [session, setSession] = useState(read)

  const patch = useCallback((part: Partial<Session>) => {
    setSession((s) => {
      const next = { ...s, ...part }
      write(next)
      return next
    })
  }, [])

  return useMemo(
    () => ({
      ...session,
      seeIntro: () => patch({ seenIntro: true }),
      // registering counts as signing in: the questions that follow are asked
      // of an account that now exists
      signIn: () => patch({ seenIntro: true, member: true }),
      // logging out empties the account, not the visit: replaying the intro
      // carousel at somebody who has just used the app would read as a crash
      signOut: () => patch({ ...fresh, seenIntro: true }),
      saveProfile: (part: Partial<Profile>) =>
        patch({ profile: { ...session.profile, ...part } }),
      setPlan: (part) => patch(part),
    }),
    [session, patch],
  )
}

export function useSession() {
  return useContext(SessionContext)
}
