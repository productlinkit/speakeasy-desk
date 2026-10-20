import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  fallbackReply,
  greeting,
  renald,
  replies,
  type ChatMessage,
} from '../data/tutor'
import './VideoCourses.css'
import './AiTutor.css'

export type TutorStep = 'hub' | 'chat' | 'call'

/* ----------------------------------------------------------------- hub ---- */

function Hub({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="tutor">
      <header className="vcourses__head">
        <button type="button" className="vcourses__back" onClick={() => onNavigate('/')} aria-label="Back">
          <BackArrow />
        </button>
        <h1>AI Tutor</h1>
      </header>

      <section className="hero">
        <p className="hero__title">Ask Anything, Learn Without the Confusion</p>
        {/* inert in the app too — it is a badge, not a button */}
        <span className="hero__badge">BOOST</span>
        <img src={renald.avatar} alt="" className="hero__avatar" />
      </section>

      <p className="tutor__name">{renald.name}</p>
      <span className="tutor__status">
        <i aria-hidden /> {renald.status}
      </span>

      <h2 className="vcourses__subtitle">Conversation</h2>

      <div className="tutor-cards">
        <article className="tcard tcard--chat">
          <div className="tcard__body">
            <h3>Boost Your Skills Through Fun Conversations</h3>
            <button type="button" className="btn" onClick={() => onNavigate('/ai-tutor/chat')}>
              Chat with Renald
            </button>
          </div>
          <img src="/assets/tutor/chat-fox.png" alt="" className="tcard__art" />
        </article>

        <article className="tcard tcard--call">
          <div className="tcard__body">
            <h3>1-on-1 Video Session with AI Tutor</h3>
            <button type="button" className="btn" onClick={() => onNavigate('/ai-tutor/call')}>
              Video Call
            </button>
          </div>
          <img src="/assets/tutor/call-fox.png" alt="" className="tcard__art" />
        </article>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- chat ---- */

function pickReply(text: string) {
  return replies.find((r) => r.match.test(text))?.text ?? fallbackReply
}

function Chat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'renald', text: greeting },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const nextId = useRef(2)
  const timer = useRef<number | undefined>(undefined)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || typing) return

    const mine: ChatMessage = { id: nextId.current++, from: 'me', text, today: true }
    setMessages((list) => [...list, mine])
    setDraft('')
    setTyping(true)

    timer.current = window.setTimeout(() => {
      setMessages((list) => [
        ...list,
        { id: nextId.current++, from: 'renald', text: pickReply(text), today: true },
      ])
      setTyping(false)
    }, 1400)
  }

  const firstToday = messages.find((m) => m.today)?.id

  return (
    <div className="chat">
      <header className="chat__head">
        <button type="button" className="chat__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <img src={renald.avatar} alt="" className="chat__avatar" />
        <div>
          <p className="chat__name">{renald.name}</p>
          <span className="tutor__status tutor__status--sm">
            <i aria-hidden /> {renald.status}
          </span>
        </div>
      </header>

      <div className="chat__scroll" ref={scroller}>
        {messages.map((m) => (
          <div key={m.id}>
            {m.id === firstToday && (
              <p className="chat__day">
                <span>Today</span>
              </p>
            )}
            <div className={`bubble bubble--${m.from}`}>
              {m.from === 'renald' ? <Markdown text={m.text} /> : m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="bubble bubble--renald bubble--typing" aria-label="Renald is typing">
            <i /> <i /> <i />
          </div>
        )}
      </div>

      <form className="chat__bar" onSubmit={send}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={typing ? 'Renald is typing...' : 'Type a Message...'}
          aria-label="Message"
          disabled={typing}
        />
        <button type="submit" className="chat__send" disabled={typing || !draft.trim()} aria-label="Send">
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

/* ---------------------------------------------------------------- call ---- */

type CallState = 'calling' | 'live' | 'failed'
type Mood = 'idle' | 'listening' | 'talking'

const clips: Record<Mood, string> = {
  idle: '/assets/tutor/idle.mp4',
  listening: '/assets/tutor/listening.mp4',
  talking: '/assets/tutor/talking.mp4',
}

function Call({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<CallState>('calling')
  const [mood, setMood] = useState<Mood>('idle')
  const [mic, setMic] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const connect = useRef<number | undefined>(undefined)
  const reply = useRef<number | undefined>(undefined)

  const ring = () => {
    setState('calling')
    setSeconds(0)
    setMic(false)
    setMood('idle')
    window.clearTimeout(connect.current)
    connect.current = window.setTimeout(() => setState('live'), 3200)
  }

  useEffect(() => {
    ring()
    return () => {
      window.clearTimeout(connect.current)
      window.clearTimeout(reply.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== 'live') return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [state])

  // the mic drives what Renald does: listening while you speak, then a reply
  const toggleMic = () => {
    window.clearTimeout(reply.current)
    if (mic) {
      setMic(false)
      setMood('talking')
      reply.current = window.setTimeout(() => setMood('idle'), 6000)
    } else {
      setMic(true)
      setMood('listening')
    }
  }

  return (
    <div className={`call call--${state}`}>
      {state === 'live' ? (
        <video
          key={mood}
          className="call__video"
          src={clips[mood]}
          poster="/assets/tutor/poster.webp"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setState('failed')}
        />
      ) : (
        <img src={renald.avatar} alt="" className={`call__avatar${state === 'calling' ? ' is-ringing' : ''}`} />
      )}

      <div className="call__hud">
        <div className="call__meta">
          <p className="call__name">{renald.name}</p>
          {state === 'calling' && (
            <p className="call__line">
              Calling<span className="call__dots" aria-hidden><i /><i /><i /></span>
            </p>
          )}
          {state === 'failed' && (
            <p className="call__line">Can&apos;t answer right now. Tap the phone to try again.</p>
          )}
          {state === 'live' && <p className="call__timer">{clock(seconds)}</p>}
        </div>

        <div className="call__controls">
          {state === 'failed' && (
            <span className="call__slot">
              <button type="button" className="call__btn call__btn--accept" onClick={ring} aria-label="Call again">
                <PhoneIcon />
              </button>
              <em>Call again</em>
            </span>
          )}

          {state === 'live' && (
            <span className="call__slot">
              <button
                type="button"
                className={`call__btn call__btn--mic${mic ? ' is-on' : ''}`}
                onClick={toggleMic}
                aria-pressed={mic}
                aria-label={mic ? 'Stop speaking' : 'Speak'}
              >
                <MicIcon off={!mic} />
              </button>
              <em>{mic ? 'Listening' : 'Speak'}</em>
            </span>
          )}

          <span className="call__slot">
            <button type="button" className="call__btn call__btn--end" onClick={onBack} aria-label="Hang up">
              <PhoneIcon down />
            </button>
            {state !== 'calling' && <em>End</em>}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */

export function AiTutor({
  step,
  onNavigate,
}: {
  step: TutorStep
  onNavigate: (to: string) => void
}) {
  if (step === 'chat') return <Chat onBack={() => onNavigate('/ai-tutor')} />
  if (step === 'call') return <Call onBack={() => onNavigate('/ai-tutor')} />
  return <Hub onNavigate={onNavigate} />
}

/* ------------------------------------------------------------ markdown ---- */

/** just enough markdown for Renald's replies: headings, bullets, quotes, bold */
function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.split('\n')
  let bullets: string[] = []
  let paragraph: string[] = []
  let quote: string[] = []

  const flushBullets = () => {
    if (!bullets.length) return
    blocks.push(
      <ul key={`u${blocks.length}`}>
        {bullets.map((b, i) => (
          <li key={i}>
            <Inline text={b} />
          </li>
        ))}
      </ul>,
    )
    bullets = []
  }
  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push(
      <p key={`p${blocks.length}`}>
        <Inline text={paragraph.join(' ')} />
      </p>,
    )
    paragraph = []
  }
  const flushQuote = () => {
    if (!quote.length) return
    blocks.push(
      <blockquote key={`q${blocks.length}`}>
        {quote.map((q, i) => (
          <span key={i}>
            <Inline text={q} />
          </span>
        ))}
      </blockquote>,
    )
    quote = []
  }
  const flush = () => {
    flushBullets()
    flushParagraph()
    flushQuote()
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flush()
    } else if (line === '---') {
      flush()
      blocks.push(<hr key={`h${blocks.length}`} />)
    } else if (line.startsWith('### ')) {
      flush()
      blocks.push(
        <h4 key={`t${blocks.length}`}>
          <Inline text={line.slice(4)} />
        </h4>,
      )
    } else if (line.startsWith('> ')) {
      flushParagraph()
      flushBullets()
      quote.push(line.slice(2))
    } else if (/^[-*]\s/.test(line)) {
      flushParagraph()
      flushQuote()
      bullets.push(line.replace(/^[-*]\s/, ''))
    } else if (/^\d+\.\s/.test(line)) {
      flushParagraph()
      flushQuote()
      bullets.push(line.replace(/^\d+\.\s/, ''))
    } else {
      flushBullets()
      flushQuote()
      paragraph.push(line)
    }
  }
  flush()

  return <>{blocks}</>
}

/** `**bold**` and `*italic*` only — everything else stays plain text */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

/* --------------------------------------------------------------- bits ---- */

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

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

function SendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.4 20.4 21 12 3.4 3.6 3.39 10.1 15.5 12 3.39 13.9z" />
    </svg>
  )
}

function PhoneIcon({ down = false }: { down?: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={down ? { transform: 'rotate(135deg)' } : undefined}
    >
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1z" />
    </svg>
  )
}

function MicIcon({ off }: { off: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
      <path d="M17.3 11a.9.9 0 0 0-1.8 0 3.5 3.5 0 0 1-7 0 .9.9 0 0 0-1.8 0 5.3 5.3 0 0 0 4.4 5.2V19h-2a.9.9 0 0 0 0 1.8h5.8a.9.9 0 0 0 0-1.8h-2v-2.8a5.3 5.3 0 0 0 4.4-5.2z" />
      {off && <path d="M4 3.6 20.4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  )
}
