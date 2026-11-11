import { useCallback, useState } from 'react'
import { GuestBar } from './components/GuestBar'
import { BottomNav, Sidebar } from './components/Nav'
import { Splash } from './components/Splash'
import { type AuthStep } from './data/auth'
import { type NavKey } from './data/home'
import { panelOf } from './data/profile'
import { Home } from './pages/Home'
import { AiTutor, type TutorStep } from './pages/AiTutor'
import { Auth } from './pages/Auth'
import { Community, type CommunityStep } from './pages/Community'
import { DailyChallenge, type DailyStep } from './pages/DailyChallenge'
import { FindLevel, type FindLevelStep } from './pages/FindLevel'
import { Leagues, type LeaguesStep } from './pages/Leagues'
import { Learning } from './pages/Learning'
import { LearningPath } from './pages/LearningPath'
import { Practice } from './pages/Practice'
import { LearningGoals, ProfileHome, SignedOut } from './pages/Profile'
import { Settings } from './pages/Settings'
import { MovieLearning, type MovieStep } from './pages/MovieLearning'
import { Onboard, type OnboardStep } from './pages/Onboard'
import { Onboarding } from './pages/Onboarding'
import { Quiz } from './pages/Quiz'
import { SongLearning, type SongStep } from './pages/SongLearning'
import { VideoCourses, type VideoStep } from './pages/VideoCourses'
import { useRoute } from './router'
import { useSession } from './session'
import './App.css'

const navPath: Record<NavKey, string> = {
  home: '/',
  community: '/community',
  leagues: '/leagues',
  profile: '/profile',
}

export default function App() {
  const { path, search, navigate, back } = useRoute()
  const { seenIntro, member, seeIntro, signIn } = useSession()
  // The app opens on its logo, the way the real one does while it loads. Only
  // on a fresh load of the index: pressing Home in the tab bar is not a launch,
  // and a typed URL for any other page is somewhere to be, not a front door.
  const [launching, setLaunching] = useState(() => window.location.pathname === '/')
  const launched = useCallback(() => setLaunching(false), [])

  // the intro hands over to the home page, whichever way it is left
  const introDone = () => {
    seeIntro()
    navigate('/')
  }

  if (launching) return <Splash onDone={launched} />

  // The intro carousel owns the whole window: no sidebar, no tab bar. It is
  // also where "/splash" leads if anyone wants to watch it again.
  if (path === '/splash') return <Onboarding onDone={introDone} />

  // Nor do the account screens — nobody is signed in behind them yet. They
  // answer a typed URL before the intro gets a say, so a shared login link
  // opens the login form.
  const authStep: AuthStep | null =
    path === '/login' ? 'login' : path === '/signup' ? 'signup' : path === '/forgot-password' ? 'forgot' : null
  if (authStep) return <Auth step={authStep} onNavigate={navigate} onSignedIn={signIn} />

  // Everything else starts with the intro until somebody has watched it.
  if (!member && !seenIntro) return <Onboarding onDone={introDone} />

  // Neither do the questions a new account answers, nor the BOOST screens the
  // flow ends on. "/add-language" is the same wizard, reached from Home.
  const onboardStep: OnboardStep | null = path.startsWith('/boost')
    ? path.endsWith('/compare')
      ? 'compare'
      : path.endsWith('/plans')
        ? 'plans'
        : path.includes('/payment')
          ? 'payment'
          : 'boost'
    : path.startsWith('/add-language')
      ? 'questions'
      : null
  if (onboardStep)
    return <Onboard step={onboardStep} path={path} search={search} onNavigate={navigate} />

  // "/learning" lives under Home, so Home stays highlighted in the nav
  const active =
    (Object.keys(navPath) as NavKey[]).find((key) => key !== 'home' && path.startsWith(navPath[key])) ??
    'home'

  // "/" is the AI home; the course map is its own flow, and the first dashboard
  // this slice had is still reachable on "/home"
  const isPath = path === '/path'
  const isOldHome = path === '/home'
  const movieStep: MovieStep | null = path.startsWith('/movie-learning')
    ? path.endsWith('/quiz')
      ? 'quiz'
      : path.endsWith('/completion')
        ? 'completion'
        : 'list'
    : null
  const leagueStep: LeaguesStep | null = path.startsWith('/leagues')
    ? path.endsWith('/how-it-works')
      ? 'how'
      : 'board'
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
  // the Profile tab: the page itself, the settings behind its gear, and the
  // learning goals behind "See Plans"
  const profileStep: 'home' | 'settings' | 'goals' | null = !path.startsWith('/profile')
    ? null
    : path.endsWith('/learning-goals')
      ? 'goals'
      : path.startsWith('/profile/settings')
        ? 'settings'
        : 'home'
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
    dailyStep !== null ||
    videoStep !== null ||
    movieStep !== null ||
    songStep !== null ||
    tutorStep !== null

  // chat and the call bring their own surface, so the white sheet gets out of the way
  const isBare = tutorStep === 'chat' || tutorStep === 'call'
  // these are full-screen sub-pages in the app: no tab bar over them
  const noTabs =
    communityStep === 'new' ||
    leagueStep === 'how' ||
    profileStep === 'goals' ||
    (profileStep === 'settings' && panelOf(path) !== null)

  /**
   * A guest may look around the home page, but the first thing they try to use
   * takes them to the account screens. One capture-phase listener covers every
   * page at once — threading a guard through each button would be the same rule
   * written a hundred times over, and the hundred-and-first would be forgotten.
   *
   * Dead space stays dead: being bounced for clicking a heading would read as a
   * broken page rather than a locked one.
   */
  const gate = member
    ? undefined
    : (e: React.MouseEvent) => {
        const hit = (e.target as HTMLElement).closest(
          'a, button, input, select, textarea, [role="button"], [tabindex]',
        )
        // the guest strip's own buttons are the way forward, not part of the app
        if (!hit || hit.closest('[data-guest-ok]')) return
        e.preventDefault()
        e.stopPropagation()
        navigate('/login')
      }

  return (
    <div
      className={`app${isLearning ? ' app--surface' : ''}${isBare ? ' app--bare' : ''}${
        noTabs ? ' app--notabs' : ''
      }`}
      onClickCapture={gate}
    >
      <Sidebar active={active} onChange={(key) => navigate(navPath[key])} />
      <main className="app__main">
        {/* the profile page carries the same two buttons and says why, so the
            strip would be the invitation written twice */}
        {!member && !profileStep && <GuestBar onNavigate={navigate} />}
        {leagueStep ? (
          <Leagues step={leagueStep} onNavigate={navigate} />
        ) : communityStep ? (
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
        ) : findLevelStep ? (
          <FindLevel step={findLevelStep} onNavigate={navigate} />
        ) : isQuiz ? (
          <Quiz onExit={() => navigate('/learning')} />
        ) : isLearning ? (
          <Learning onStartQuiz={() => navigate('/lesson-quiz')} onBack={back} />
        ) : isPath ? (
          <LearningPath onNavigate={navigate} />
        ) : isOldHome ? (
          <Home onNavigate={navigate} onStartLearning={() => navigate('/path')}
            onFindLevel={() => navigate('/find-level')}
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
        ) : profileStep ? (
          // the one page that is about the account says so when there is none
          !member ? (
            <SignedOut onNavigate={navigate} />
          ) : profileStep === 'settings' ? (
            <Settings path={path} onNavigate={navigate} />
          ) : profileStep === 'goals' ? (
            <LearningGoals onNavigate={navigate} />
          ) : (
            <ProfileHome onNavigate={navigate} />
          )
        ) : (
          <Practice onNavigate={navigate} />
        )}
      </main>
      <BottomNav active={active} onChange={(key) => navigate(navPath[key])} />
    </div>
  )
}
