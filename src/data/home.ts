// Static mock of what the home screen shows for the logged-in user.
export const user = {
  name: 'hana',
  initial: 'P',
  streakDays: 0,
  gems: 1275,
  language: { name: 'English', flag: '/assets/country/uk3.svg' },
  progress: 28,
}

export type NavKey = 'home' | 'community' | 'leagues' | 'profile'

export const navItems: { key: NavKey; label: string; icon?: string }[] = [
  { key: 'home', label: 'Home', icon: '/assets/icons/menu-home.svg' },
  { key: 'community', label: 'Community', icon: '/assets/icons/menu-community.svg' },
  { key: 'leagues', label: 'Leagues', icon: '/assets/icons/menu-leagues.svg' },
  { key: 'profile', label: 'Profile' },
]

export type LearningItem = {
  key: 'movies' | 'song' | 'tutor'
  title: string
  image: string
  /** when set, the image becomes the poster for this animation */
  lottie?: string
}

export const learningItems: LearningItem[] = [
  {
    key: 'movies',
    title: 'Movies & Series',
    image: '/assets/mascot/movie.webp',
    lottie: '/assets/lottie/speakeasy-fox-movie-night.json',
  },
  {
    key: 'song',
    title: 'Learn From Song',
    image: '/assets/mascot/song.webp',
    lottie: '/assets/lottie/speakeasy-fox-karaoke.json',
  },
  {
    key: 'tutor',
    title: 'Talk with Renald',
    image: '/assets/mascot/tutor.webp',
    lottie: '/assets/lottie/speakeasy-fox-video-call.json',
  },
]
