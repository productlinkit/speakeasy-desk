import { useMemo, useState } from 'react'
import { QuizRunner, type QuizResult } from '../components/QuizRunner'
import { ResultScreen } from '../components/ResultScreen'
import { user } from '../data/home'
import { genres, movieResult, movies, type Movie } from '../data/movies'
import './VideoCourses.css'

export type MovieStep = 'list' | 'quiz' | 'completion'

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

function List({ onOpen, onBack }: { onOpen: (movie: Movie) => void; onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState(genres[0])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return movies
    return movies.filter((movie) => movie.title.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="vcourses">
      <header className="vcourses__head">
        <button type="button" className="vcourses__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>Movie &amp; Series Learning</h1>
      </header>

      <p className="vcourses__lead">Select a language to start learning with movie &amp; series</p>

      <span className="vcourses__lang">
        <img src={user.language.flag} alt="" />
        {user.language.name}
      </span>

      <div className="vsearch">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movie or Series"
          aria-label="Search movie or series"
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
          {genres.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="vgenre__caret" aria-hidden>
          <CaretIcon />
        </span>
      </div>

      <h2 className="vcourses__subtitle">Choose a Movie &amp; Series</h2>

      <div className="vcourse-grid">
        {results.map((movie) => (
          <article key={movie.id} className="vcourse">
            <img src={movie.poster} alt="" className="vcourse__thumb" loading="lazy" />
            <div className="vcourse__foot">
              <p>{movie.title}</p>
              <button
                type="button"
                className="vcourse__play"
                onClick={() => onOpen(movie)}
                aria-label={`Start ${movie.title}`}
              >
                <PlayIcon />
              </button>
            </div>
          </article>
        ))}
        {results.length === 0 && <p className="vcourses__empty">No movie matches “{query}”.</p>}
      </div>
    </div>
  )
}

export function MovieLearning({
  step,
  onNavigate,
}: {
  step: MovieStep
  onNavigate: (to: string) => void
}) {
  const [movie, setMovie] = useState<Movie>(movies[0])
  const [score, setScore] = useState<QuizResult | null>(null)

  if (step === 'quiz') {
    return (
      <QuizRunner
        title={movie.title}
        questions={movie.questions}
        fallbackImage={movie.poster}
        checkLabel="Check Answers"
        onExit={() => onNavigate('/movie-learning')}
        onFinish={(result) => {
          setScore(result)
          onNavigate('/movie-learning/completion')
        }}
      />
    )
  }

  if (step === 'completion') {
    return (
      <ResultScreen
        title={movieResult.title}
        subtitle={movieResult.subtitle}
        correct={score?.correct ?? 0}
        total={score?.total ?? movie.questions.length}
        seconds={score?.seconds ?? 0}
        xp={movieResult.xp}
        onContinue={() => onNavigate('/movie-learning')}
      />
    )
  }

  return (
    <List
      onOpen={(picked) => {
        setMovie(picked)
        setScore(null)
        onNavigate('/movie-learning/quiz')
      }}
      onBack={() => onNavigate('/')}
    />
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
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
