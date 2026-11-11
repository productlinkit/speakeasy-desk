// What the home screen offers, read off the real content lists so a card can
// never promise something the page behind it does not have.
//
// The page leads with one feature — the call — and lays the rest out around it:
// the course you are mid-way through, the other ways to practise, and the
// languages on the account.
import { languageLabels, languages } from './addLanguage'
import { renald } from './tutor'

export type Tone = 'blue' | 'purple' | 'violet' | 'navy'

/** the highlight: talking to Renald out loud */
export const hero = {
  title: `Talk to ${renald.name}, out loud`,
  lead: 'Speak a sentence and he corrects you while you are still saying it.',
  cta: 'Start a call',
  /** the banner's backdrop: the fox taking a call on the road */
  scene: '/assets/lottie/speakeasy-fox-travel-call.json',
  to: '/ai-tutor/call',
}

export type Skill = {
  key: 'chat' | 'song' | 'movie' | 'video'
  title: string
  /** what you actually do there, in the learner's words */
  meta: string
  /** the animated icon */
  lottie: string
  /** shown until the animation is parsed, and kept if it fails to load */
  art: string
  tone: Tone
  to: string
}

export const skills: Skill[] = [
  {
    key: 'chat',
    lottie: '/assets/lottie/speakeasy-fox-wave2.json',
    title: 'Chat',
    meta: 'Explains word by word',
    art: '/assets/tutor/chat-fox.png',
    tone: 'purple',
    to: '/ai-tutor/chat',
  },
  {
    key: 'song',
    lottie: '/assets/lottie/speakeasy-fox-karaoke.json',
    title: 'Learn From Song',
    meta: 'Fill in the missing lyrics',
    art: '/assets/mascot/song.webp',
    tone: 'violet',
    to: '/song-learning',
  },
  {
    key: 'movie',
    lottie: '/assets/lottie/speakeasy-fox-movie-night.json',
    title: 'Movies & Series',
    meta: 'Watch a scene, then answer',
    art: '/assets/mascot/movie.webp',
    tone: 'navy',
    to: '/movie-learning',
  },
  {
    key: 'video',
    lottie: '/assets/lottie/speakeasy-fox-video-course.json',
    title: 'Video Courses',
    meta: 'Short lessons, end to end',
    art: '/assets/mascot/video-course.webp',
    tone: 'blue',
    to: '/video-courses',
  },
]

export const languageRow = languages.map((lang) => ({
  ...lang,
  name: languageLabels[lang.code] ?? lang.code,
}))
