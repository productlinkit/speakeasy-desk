import { useEffect, useMemo, useRef, useState } from 'react'
import { ResultScreen } from '../components/ResultScreen'
import { user } from '../data/home'
import { songGenres, songs, type Song } from '../data/songs'
import './Quiz.css'
import './VideoCourses.css'
import './SongLearning.css'

export type SongStep = 'list' | 'quiz' | 'completion'

type Score = { correct: number; total: number; seconds: number }

/* ---------------------------------------------------------------- list ---- */

function List({ onOpen, onBack }: { onOpen: (song: Song) => void; onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState(songGenres[0])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return songs
    return songs.filter((song) => song.title.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="vcourses">
      <header className="vcourses__head">
        <button type="button" className="vcourses__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>Song Learning</h1>
      </header>

      <p className="vcourses__lead">Select a language to start learning with songs</p>

      <span className="vcourses__lang">
        <img src={user.language.flag} alt="" />
        {user.language.name}
      </span>

      <div className="vsearch">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a Song"
          aria-label="Search for a song"
        />
        {query && (
          <button type="button" className="vsearch__clear" onClick={() => setQuery('')} aria-label="Clear">
            ✕
          </button>
        )}
        <span className="vsearch__icon" aria-hidden>
          <SearchIcon />
        </span>
      </div>

      <div className="vgenre">
        <select value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre">
          {songGenres.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="vgenre__caret" aria-hidden>
          <CaretIcon />
        </span>
      </div>

      <h2 className="vcourses__subtitle">Choose a song</h2>

      <div className="song-list">
        {results.map((song) => (
          <article key={song.id} className="song-row">
            <img src={song.thumb} alt="" className="song-row__art" loading="lazy" />
            <p className="song-row__title">{song.title}</p>
            <button
              type="button"
              className="vcourse__play"
              onClick={() => onOpen(song)}
              aria-label={`Start ${song.title}`}
            >
              <PlayIcon />
            </button>
          </article>
        ))}
        {results.length === 0 && <p className="vcourses__empty">No song matches “{query}”.</p>}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- quiz ---- */

function SongQuiz({
  song,
  onExit,
  onFinish,
}: {
  song: Song
  onExit: () => void
  onFinish: (score: Score) => void
}) {
  const audio = useRef<HTMLAudioElement>(null)
  const startedAt = useRef(0)

  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [asking, setAsking] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [modal, setModal] = useState(false)

  const question = song.questions[index]
  const isLast = index === song.questions.length - 1
  const isCorrect = checked && picked === question.answer

  // the app starts the track by itself; browsers may refuse, then the bar just waits
  useEffect(() => {
    startedAt.current = Date.now()
    audio.current?.play().catch(() => {})
  }, [])

  // stop the music and ask as soon as the question's timestamp goes by
  const handleTime = () => {
    const el = audio.current
    if (!el) return
    setTime(el.currentTime)
    if (!asking && el.currentTime >= question.at) {
      el.pause()
      setAsking(true)
    }
  }

  const toggle = () => {
    const el = audio.current
    if (!el || asking) return
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }

  const check = () => {
    if (picked === null) return
    setChecked(true)
    if (picked === question.answer) setCorrect((n) => n + 1)
  }

  const advance = () => {
    if (isLast) {
      audio.current?.pause()
      onFinish({
        correct,
        total: song.questions.length,
        seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
    setAsking(false)
    audio.current?.play().catch(() => {})
  }

  // while a question is up the app highlights the line it was taken from
  const lineIndex = useMemo(() => {
    if (asking) {
      const match = song.lyrics.findIndex((l) => l.text === question.prompt)
      if (match >= 0) return match
    }
    let i = 0
    for (let k = 0; k < song.lyrics.length; k += 1) if (song.lyrics[k].at <= time) i = k
    return i
  }, [asking, question, song, time])

  const lines = song.lyrics.slice(lineIndex, lineIndex + 3)
  const sung = asking || time >= song.lyrics[lineIndex].at

  const optionState = (i: number) => {
    if (!checked) return picked === i ? ' is-picked' : ''
    if (i === question.answer) return ' is-correct'
    if (i === picked) return ' is-wrong'
    return ''
  }

  return (
    <div className="sq">
      <audio
        ref={audio}
        src={song.audio}
        onTimeUpdate={handleTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <header className="sq__head">
        <button type="button" className="quiz__icon" onClick={onExit} aria-label="Back">
          <BackArrow />
        </button>
        <h1>{song.title}</h1>
        {asking && (
          <button type="button" className="quiz__icon quiz__icon--flag" aria-label="Report this question">
            <FlagIcon />
          </button>
        )}
      </header>

      <div className="sq__stage">
        <div className="sq__side">
          <div className="lyrics">
            {lines.map((line, i) => (
              <p key={`${line.at}-${line.text}`} className={`lyrics__line${i === 0 && sung ? ' is-active' : ''}`}>
                {line.text}
              </p>
            ))}
          </div>

          <div className="nowplay">
            <img src={song.thumb} alt="" className="nowplay__art" />
            <div className="nowplay__meta">
              <p className="nowplay__title">{song.title}</p>
              <p className="nowplay__artist">Artist</p>
            </div>
            <button
              type="button"
              className={`nowplay__btn${asking ? ' is-off' : ''}`}
              onClick={toggle}
              disabled={asking}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          {/* not in the phone app — a read-only position line for the wider player */}
          <div className="sq__bar">
            <span className="sq__time">{clock(time)}</span>
            <span className="sq__track">
              <span className="sq__fill" style={{ width: `${Math.min(100, (time / song.duration) * 100)}%` }} />
            </span>
            <span className="sq__time">{clock(song.duration)}</span>
          </div>
        </div>

        <div className="sq__panel">
          {asking ? (
            <>
              <h2 className="sq__kind">Fill the Blank</h2>

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

              <div className="quiz__foot">
                <div className="quiz__cta">
                  {checked ? (
                    <>
                      <p className={`verdict${isCorrect ? '' : ' verdict--wrong'}`}>
                        {isCorrect ? 'Correct! 🎉' : 'Incorrect ✗'}
                      </p>
                      <button type="button" className="btn btn--block" onClick={() => setModal(true)}>
                        Read Explanations
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn--block" onClick={check} disabled={picked === null}>
                      Check Answers
                    </button>
                  )}
                </div>

                <div className="quiz__nav">
                  <span className="quiz__count">
                    {index + 1}/{song.questions.length}
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
            </>
          ) : (
            <div className="sq__idle">
              <CardsIcon />
              <h2>Questions will appear here</h2>
              <p>Listen to the song carefully. Questions will appear automatically at the designated time.</p>
              <span className="sq__progress">
                Progress: {index}/{song.questions.length} quiz
              </span>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Explanation">
          <div className="modal__backdrop" onClick={() => setModal(false)} />
          <div className="modal__sheet">
            <button type="button" className="modal__close" onClick={() => setModal(false)} aria-label="Close">
              ✕
            </button>
            <h2 className="modal__title">{song.title}</h2>
            <p className="modal__label">
              <span className="modal__check" aria-hidden>
                ✓
              </span>
              Explanation:
            </p>
            <p className="modal__text">{question.explanation}</p>
            <p className="modal__ask">Is this explanation helpful?</p>
            <div className="modal__actions">
              <button type="button" className="modal__btn" onClick={() => setModal(false)}>
                <Face happy={false} /> No
              </button>
              <button type="button" className="modal__btn modal__btn--primary" onClick={() => setModal(false)}>
                <Face happy /> Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */

export function SongLearning({
  step,
  onNavigate,
}: {
  step: SongStep
  onNavigate: (to: string) => void
}) {
  const [song, setSong] = useState<Song>(songs[0])
  const [score, setScore] = useState<Score | null>(null)

  if (step === 'quiz') {
    return (
      <SongQuiz
        key={song.id}
        song={song}
        onExit={() => onNavigate('/song-learning')}
        onFinish={(result) => {
          setScore(result)
          onNavigate('/song-learning/completion')
        }}
      />
    )
  }

  if (step === 'completion') {
    const total = score?.total ?? song.questions.length
    const perfect = (score?.correct ?? 0) === total
    return (
      <ResultScreen
        title={perfect ? 'Perfect lesson,' : 'Good work,'}
        subtitle={perfect ? 'Great Job!' : 'Keep practicing!'}
        correct={score?.correct ?? 0}
        total={total}
        seconds={score?.seconds ?? 0}
        xp={song.xp}
        onContinue={() => onNavigate('/song-learning')}
      />
    )
  }

  return (
    <List
      onOpen={(picked) => {
        setSong(picked)
        setScore(null)
        onNavigate('/song-learning/quiz')
      }}
      onBack={() => onNavigate('/')}
    />
  )
}

/* --------------------------------------------------------------- bits ---- */

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5h3.2v14H8zm4.8 0H16v14h-3.2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CaretIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CardsIcon() {
  return (
    <svg width="58" height="58" viewBox="0 0 48 48" fill="none" aria-hidden className="sq__idle-icon">
      <rect x="6" y="10" width="26" height="28" rx="4" stroke="currentColor" strokeWidth="2.6" />
      <rect x="16" y="6" width="26" height="28" rx="4" stroke="currentColor" strokeWidth="2.6" />
      <path
        d="M26 16.5a3 3 0 1 1 3 3v2.2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="29" cy="25.6" r="1.5" fill="currentColor" />
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
