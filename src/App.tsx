import { BottomNav, Sidebar } from './components/Nav'
import { navItems, type NavKey } from './data/home'
import { Home } from './pages/Home'
import { AddLanguage } from './pages/AddLanguage'
import { AiTutor, type TutorStep } from './pages/AiTutor'
import { Community, type CommunityStep } from './pages/Community'
import { DailyChallenge, type DailyStep } from './pages/DailyChallenge'
import { FindLevel, type FindLevelStep } from './pages/FindLevel'
import { Learning } from './pages/Learning'
import { MovieLearning, type MovieStep } from './pages/MovieLearning'
import { Quiz } from './pages/Quiz'
import { SongLearning, type SongStep } from './pages/SongLearning'
import { VideoCourses, type VideoStep } from './pages/VideoCourses'
import { useRoute } from './router'
import './App.css'

const navPath: Record<NavKey, string> = {
  home: '/',
  community: '/community',
  leagues: '/leagues',
  profile: '/profile',
}

function Placeholder({ page }: { page: NavKey }) {
  const label = navItems.find((item) => item.key === page)?.label
  return (
    <div className="placeholder">
      <img src="/assets/mascot/splash1.webp" alt="" />
      <h1>{label}</h1>
      <p>This page is not sliced yet — only Home and My Learning are in scope for now.</p>
    </div>
  )
}

export default function App() {
  const { path, navigate, back } = useRoute()

  // "/learning" lives under Home, so Home stays highlighted in the nav
  const active =
    (Object.keys(navPath) as NavKey[]).find((key) => key !== 'home' && path.startsWith(navPath[key])) ??
    'home'

  const isAddLanguage = path.startsWith('/add-language')
  const movieStep: MovieStep | null = path.startsWith('/movie-learning')
    ? path.endsWith('/quiz')
      ? 'quiz'
      : path.endsWith('/completion')
        ? 'completion'
        : 'list'
    : null
  const communityStep: CommunityStep | null = path.startsWith('/community')
    ? path.endsWith('/new-post')
      ? 'new'
      : 'feed'
    : null
  const tutorStep: TutorStep | null = path.startsWith('/ai-tutor')
    ? path.endsWith('/chat')
      ? 'chat'
      : path.endsWith('/call')
        ? 'call'
        : 'hub'
    : null
  const songStep: SongStep | null = path.startsWith('/song-learning')
    ? path.endsWith('/quiz')
      ? 'quiz'
      : path.endsWith('/completion')
        ? 'completion'
        : 'list'
    : null
  const videoStep: VideoStep | null = path.startsWith('/video-courses')
    ? path.endsWith('/player')
      ? 'player'
      : path.endsWith('/reward')
        ? 'reward'
        : 'list'
    : null
  const dailyStep: DailyStep | null = path.startsWith('/daily-challenge')
    ? path.endsWith('/quiz')
      ? 'quiz'
      : path.endsWith('/completion')
        ? 'completion'
        : path.endsWith('/done')
          ? 'done'
          : 'intro'
    : null
  const isQuiz = path.startsWith('/lesson-quiz')
  const findLevelStep: FindLevelStep | null = path.startsWith('/find-level')
    ? path.endsWith('/quiz')
      ? 'quiz'
      : path.endsWith('/result')
        ? 'result'
        : 'intro'
    : null
  // all of these render on the app's white sheet
  const isLearning =
    path.startsWith('/learning') ||
    isQuiz ||
    findLevelStep !== null ||
    isAddLanguage ||
    dailyStep !== null ||
    videoStep !== null ||
    movieStep !== null ||
    songStep !== null ||
    tutorStep !== null

  // chat and the call bring their own surface, so the white sheet gets out of the way
  const isBare = tutorStep === 'chat' || tutorStep === 'call'
  // the composer is a full-screen sub-page in the app: no tab bar over it
  const noTabs = communityStep === 'new'

  return (
    <div
      className={`app${isLearning ? ' app--surface' : ''}${isBare ? ' app--bare' : ''}${
        noTabs ? ' app--notabs' : ''
      }`}
    >
      <Sidebar active={active} onChange={(key) => navigate(navPath[key])} />
      <main className="app__main">
        {communityStep ? (
          <Community step={communityStep} onNavigate={navigate} />
        ) : movieStep ? (
          <MovieLearning step={movieStep} onNavigate={navigate} />
        ) : tutorStep ? (
          <AiTutor step={tutorStep} onNavigate={navigate} />
        ) : songStep ? (
          <SongLearning step={songStep} onNavigate={navigate} />
        ) : videoStep ? (
          <VideoCourses step={videoStep} onNavigate={navigate} />
        ) : dailyStep ? (
          <DailyChallenge step={dailyStep} onNavigate={navigate} />
        ) : isAddLanguage ? (
          <AddLanguage onExit={() => navigate('/')} />
        ) : findLevelStep ? (
          <FindLevel step={findLevelStep} onNavigate={navigate} />
        ) : isQuiz ? (
          <Quiz onExit={() => navigate('/learning')} />
        ) : isLearning ? (
          <Learning onStartQuiz={() => navigate('/lesson-quiz')} onBack={back} />
        ) : active === 'home' ? (
          <Home onStartLearning={() => navigate('/learning')} onFindLevel={() => navigate('/find-level')}
            onExplore={() => navigate('/add-language')}
            onDailyChallenge={(done) =>
              navigate(done ? '/daily-challenge/done' : '/daily-challenge')
            }
            onVideoCourses={() => navigate('/video-courses')}
            onDive={(key) => {
              if (key === 'movies') navigate('/movie-learning')
              if (key === 'song') navigate('/song-learning')
              if (key === 'tutor') navigate('/ai-tutor')
            }}
          />
        ) : (
          <Placeholder page={active} />
        )}
      </main>
      <BottomNav active={active} onChange={(key) => navigate(navPath[key])} />
    </div>
  )
}
