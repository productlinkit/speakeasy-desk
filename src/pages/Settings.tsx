import { useEffect, useState } from 'react'
import { languages } from '../data/addLanguage'
import {
  accountSetting,
  appLanguage,
  dialCodes,
  editProfile,
  faqs,
  genders,
  helpCentre,
  languageNames,
  logout,
  panelOf,
  privacy,
  settingGroups,
  settingRoute,
  statusLabels,
  subscription,
  transactions,
  txRows,
  type SettingKey,
  type TxStatus,
} from '../data/profile'
import { useSession } from '../session'
import { BackArrow } from './Profile'
import './Settings.css'

type Nav = (to: string) => void

function Chevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** the app asks before anything it cannot take back */
function Confirm({
  title,
  body,
  confirm,
  cancel,
  danger,
  onConfirm,
  onCancel,
}: {
  title: string
  body: string
  confirm: string
  cancel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onCancel])

  return (
    <div className="pconf" role="dialog" aria-modal="true" aria-label={title}>
      <div className="pconf__veil" onClick={onCancel} />
      <div className="pconf__box">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="pconf__acts">
          <button type="button" className="btn" onClick={onCancel}>
            {cancel}
          </button>
          <button
            type="button"
            className={danger ? 'pconf__danger' : 'pconf__plain'}
            onClick={onConfirm}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Whether the rail and the panel can share the window.
 *
 * On a wide one they sit side by side, so the index has a panel to show: the
 * app's own first row. A phone has room for one, and which one it is decides
 * what is in the page at all — a rail row cannot be the current page while the
 * panel it points at is not on screen.
 */
function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 901px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/** the one line every form answers with, so a Save is never silent */
function Note({ text, bad }: { text: string; bad?: boolean }) {
  if (!text) return null
  return (
    <p className={bad ? 'pset__note pset__note--bad' : 'pset__note'} role="status">
      {text}
    </p>
  )
}

// ------------------------------------------------------------ edit profile

function EditProfile() {
  const { profile, saveProfile } = useSession()
  const [form, setForm] = useState(profile)
  const [note, setNote] = useState('')
  const [bad, setBad] = useState(false)
  const set = (part: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...part }))
    setNote('')
  }

  const save = () => {
    if (!form.name.trim()) {
      setBad(true)
      setNote(editProfile.needName)
      return
    }
    saveProfile(form)
    setBad(false)
    setNote(editProfile.saved)
  }

  return (
    <div className="pedit">
      <div className="pedit__cover">
        <img src="/assets/profile/bg.png" alt="" />
        <span className="pedit__avatar" aria-hidden>
          {form.name.trim().charAt(0).toUpperCase() || 'S'}
        </span>
      </div>
      <p className="pedit__photo">{editProfile.photoNote}</p>

      <label className="pfield">
        <span>{editProfile.name}</span>
        <input value={form.name} onChange={(e) => set({ name: e.target.value })} />
      </label>

      <label className="pfield">
        <span>{editProfile.bio}</span>
        <input
          value={form.bio}
          placeholder={editProfile.bioHint}
          onChange={(e) => set({ bio: e.target.value })}
        />
      </label>

      <label className="pfield">
        <span>{editProfile.birthday}</span>
        <input type="date" value={form.birthday} onChange={(e) => set({ birthday: e.target.value })} />
      </label>

      <div className="pfield">
        <span>{editProfile.phone}</span>
        <div className="pfield__pair">
          <select
            className="pfield__dial"
            value={form.dial}
            aria-label={editProfile.phone}
            onChange={(e) => set({ dial: e.target.value })}
          >
            {dialCodes.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
        </div>
      </div>

      <label className="pfield">
        <span>{editProfile.gender}</span>
        <select
          value={form.gender}
          onChange={(e) => set({ gender: e.target.value as typeof form.gender })}
        >
          <option value="">{editProfile.genderHint}</option>
          {genders.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

      <Note text={note} bad={bad} />
      <button type="button" className="btn btn--block pset__save" onClick={save}>
        {editProfile.save}
      </button>
    </div>
  )
}

// --------------------------------------------------------- account setting

function AccountSetting() {
  const { profile, saveProfile } = useSession()
  const [email, setEmail] = useState(profile.email)
  const [old, setOld] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [note, setNote] = useState('')
  const [bad, setBad] = useState(false)

  const fail = (why: string) => {
    setBad(true)
    setNote(why)
  }

  const save = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(accountSetting.needEmail)
    // the password half is optional: somebody may be here only for the email
    if (next || again || old) {
      if (!old) return fail(accountSetting.needOld)
      if (next.length < 8) return fail(accountSetting.tooShort)
      if (next !== again) return fail(accountSetting.mismatch)
    }
    saveProfile({ email })
    setOld('')
    setNext('')
    setAgain('')
    setBad(false)
    setNote(accountSetting.saved)
  }

  const field = (label: string, value: string, onChange: (v: string) => void, type = 'password') => (
    <label className="pfield">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setNote('')
        }}
      />
    </label>
  )

  return (
    <div className="pacct">
      {field(accountSetting.email, email, setEmail, 'email')}
      {field(accountSetting.oldPassword, old, setOld)}
      {field(accountSetting.newPassword, next, setNext)}
      {field(accountSetting.confirmPassword, again, setAgain)}
      <Note text={note} bad={bad} />
      <button type="button" className="btn btn--block pset__save" onClick={save}>
        {accountSetting.save}
      </button>
    </div>
  )
}

// ------------------------------------------------------------ subscription

function longDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Subscription({ onNavigate }: { onNavigate: Nav }) {
  const { boost, renews, setPlan } = useSession()
  const [asking, setAsking] = useState(false)
  const [note, setNote] = useState('')

  return (
    <div className="psub">
      <section className={boost ? 'psub__plan' : 'psub__plan psub__plan--free'}>
        <p className="psub__lead">{boost ? subscription.memberLead : subscription.freeLead}</p>
        <strong className="psub__name">{boost ? subscription.plan : subscription.freePlan}</strong>
        {boost ? (
          <>
            <p className="psub__expLabel">
              {renews ? subscription.expLabel : subscription.cancelled}
            </p>
            <p className="psub__exp">{longDate(subscription.expiry)}</p>
          </>
        ) : (
          <p className="psub__exp">{subscription.freeNote}</p>
        )}
      </section>

      <section className="psub__change">
        <p>{subscription.changeLead}</p>
        <button type="button" className="btn btn--block" onClick={() => onNavigate('/boost/plans')}>
          {subscription.explore}
        </button>
      </section>

      <Note text={note} />

      {boost && renews ? (
        <button type="button" className="psub__cancel" onClick={() => setAsking(true)}>
          {subscription.cancel}
        </button>
      ) : boost ? (
        <button
          type="button"
          className="psub__resume"
          onClick={() => {
            setPlan({ renews: true })
            setNote(subscription.resumed)
          }}
        >
          {subscription.resume}
        </button>
      ) : null}

      {asking ? (
        <Confirm
          title={subscription.cancelTitle}
          body={`${subscription.cancelBody} ${longDate(subscription.expiry)}.`}
          confirm={subscription.cancelConfirm}
          cancel={subscription.cancelKeep}
          danger
          onConfirm={() => {
            setPlan({ renews: false })
            setAsking(false)
            setNote('')
          }}
          onCancel={() => setAsking(false)}
        />
      ) : null}
    </div>
  )
}

// ------------------------------------------------------ transaction history

function Transactions() {
  const [filter, setFilter] = useState<'all' | TxStatus>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const rows = txRows.filter((t) => {
    // "Fail" is the app's label; a cancelled charge belongs with it, since
    // neither one took the money
    const matches =
      filter === 'all' ||
      t.status === filter ||
      (filter === 'failed' && t.status === 'cancelled')
    return matches && (!from || t.date >= from) && (!to || t.date <= to)
  })

  const months: { head: string; rows: typeof rows }[] = []
  for (const row of rows) {
    const head = new Date(row.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    const last = months[months.length - 1]
    if (last && last.head === head) last.rows.push(row)
    else months.push({ head, rows: [row] })
  }

  return (
    <div className="ptx">
      <div className="ptx__range">
        <span className="ptx__rangeHead">{transactions.range}</span>
        <div className="ptx__dates">
          <label className="pfield">
            <span>{transactions.from}</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="pfield">
            <span>{transactions.to}</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          {from || to ? (
            <button
              type="button"
              className="ptx__clear"
              onClick={() => {
                setFrom('')
                setTo('')
              }}
            >
              {transactions.clear}
            </button>
          ) : null}
        </div>
      </div>

      <div className="ptx__chips" role="tablist" aria-label={transactions.title}>
        {transactions.filters.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            className={filter === f.key ? 'ptx__chip is-on' : 'ptx__chip'}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {months.map((month) => (
        <section key={month.head} className="ptx__month">
          <h3>{month.head}</h3>
          {month.rows.map((row) => (
            <article key={row.id} className="ptx__row">
              <div>
                <strong>{row.plan}</strong>
                <span className="ptx__date">
                  {new Date(row.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="ptx__right">
                <strong>{row.amount}</strong>
                <span className={`ptx__pill ptx__pill--${row.status}`}>{statusLabels[row.status]}</span>
              </div>
            </article>
          ))}
        </section>
      ))}

      <p className="ptx__end">{rows.length ? transactions.end : transactions.empty}</p>
    </div>
  )
}

// ------------------------------------------------------------ app language

function AppLanguage() {
  const { profile, saveProfile } = useSession()
  const [picked, setPicked] = useState(profile.language)
  const [note, setNote] = useState('')

  return (
    <div className="plang">
      <h2 className="plang__head">{appLanguage.head}</h2>
      <p className="plang__lead">{appLanguage.lead}</p>
      <ul className="plang__list">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              type="button"
              className={picked === lang.code ? 'plang__row is-on' : 'plang__row'}
              aria-pressed={picked === lang.code}
              onClick={() => {
                setPicked(lang.code)
                setNote('')
              }}
            >
              <img src={lang.flag} alt="" />
              {languageNames[lang.code] ?? lang.code}
              <span className="plang__mark" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <Note text={note} />
      <button
        type="button"
        className="btn btn--block pset__save"
        onClick={() => {
          saveProfile({ language: picked })
          setNote(appLanguage.saved)
        }}
      >
        {appLanguage.save}
      </button>
    </div>
  )
}

// ------------------------------------------------------------- help centre

function Help() {
  const [tab, setTab] = useState(helpCentre.tabs[0])
  const [open, setOpen] = useState<string | null>(faqs[0].q)
  const shown = faqs.filter((f) => f.tab === tab)

  return (
    <div className="phelp">
      <div className="phelp__tabs" role="tablist" aria-label={helpCentre.title}>
        {helpCentre.tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'phelp__tab is-on' : 'phelp__tab'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <h2 className="phelp__head">{helpCentre.head}</h2>
      <ul className="phelp__list">
        {shown.map((item) => (
          <li key={item.q}>
            <button
              type="button"
              className="phelp__q"
              aria-expanded={open === item.q}
              onClick={() => setOpen(open === item.q ? null : item.q)}
            >
              {item.q}
              <span className={open === item.q ? 'phelp__sign is-open' : 'phelp__sign'} aria-hidden />
            </button>
            {open === item.q ? <p className="phelp__a">{item.a}</p> : null}
          </li>
        ))}
      </ul>
      <p className="phelp__foot">{helpCentre.contact}</p>
    </div>
  )
}

// ---------------------------------------------------------- privacy policy

function Privacy() {
  return (
    <div className="ppriv">
      <p className="ppriv__updated">{privacy.updated}</p>
      <p className="ppriv__lead">{privacy.lead}</p>
      {privacy.sections.map((section) => (
        <section key={section.head}>
          <h2>{section.head}</h2>
          {section.blocks.map((block, i) => (
            <div key={i}>
              {block.lead ? <h3>{block.lead}</h3> : null}
              <p>{block.body}</p>
              {block.list.length ? (
                <ul>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------ shell

const titles: Record<SettingKey, string> = {
  'edit-profile': editProfile.title,
  account: accountSetting.title,
  subscription: subscription.title,
  transactions: transactions.title,
  language: appLanguage.title,
  help: helpCentre.title,
  privacy: privacy.title,
}

export function Settings({ path, onNavigate }: { path: string; onNavigate: Nav }) {
  const { signOut } = useSession()
  const [asking, setAsking] = useState(false)
  const open = panelOf(path)
  const wide = useWide()
  const shown = open ?? (wide ? 'edit-profile' : null)

  const panel = !shown ? null : shown === 'edit-profile' ? (
      <EditProfile />
    ) : shown === 'account' ? (
      <AccountSetting />
    ) : shown === 'subscription' ? (
      <Subscription onNavigate={onNavigate} />
    ) : shown === 'transactions' ? (
      <Transactions />
    ) : shown === 'language' ? (
      <AppLanguage />
    ) : shown === 'help' ? (
      <Help />
    ) : (
      <Privacy />
    )

  return (
    <div className={`pset${open ? ' pset--open' : ' pset--index'}`}>
      {wide || !open ? (
      <div className="pset__rail">
        <header className="prsub__bar">
          <button
            type="button"
            className="prsub__back"
            onClick={() => onNavigate('/profile')}
            aria-label="Back"
          >
            <BackArrow />
          </button>
          <h1>Settings</h1>
        </header>

        {settingGroups.map((group) => (
          <section key={group.head} className="pset__group">
            <h2>{group.head}</h2>
            <div className="pset__card">
              {group.rows.map((row) => (
                <button
                  key={row.key}
                  type="button"
                  className={shown === row.key ? 'pset__row is-on' : 'pset__row'}
                  aria-current={shown === row.key ? 'page' : undefined}
                  onClick={() => onNavigate(settingRoute[row.key])}
                >
                  {row.label}
                  <Chevron />
                </button>
              ))}
            </div>
          </section>
        ))}

        <button type="button" className="pset__logout" onClick={() => setAsking(true)}>
          {logout.label}
        </button>
      </div>
      ) : null}

      {shown ? (
        <div className="pset__panel">
          <header className="prsub__bar">
            <button
              type="button"
              className="prsub__back"
              onClick={() => onNavigate('/profile/settings')}
              aria-label="Back"
            >
              <BackArrow />
            </button>
            <h1>{titles[shown]}</h1>
          </header>
          {panel}
        </div>
      ) : null}

      {asking ? (
        <Confirm
          title={logout.title}
          body={logout.body}
          confirm={logout.confirm}
          cancel={logout.cancel}
          danger
          onConfirm={() => {
            signOut()
            onNavigate('/')
          }}
          onCancel={() => setAsking(false)}
        />
      ) : null}
    </div>
  )
}
