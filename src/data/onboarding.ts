// The three intro slides the app shows at /en/splash, before anyone signs in.
// Copy is the app's own; each scene is animated, with the app's painted version
// of the same scene standing in until the animation is parsed.
export type Tone = 'blue' | 'violet' | 'purple'

export type Slide = {
  key: string
  /** the animated scene */
  lottie: string
  /** shown until the animation is parsed, and kept if it fails to load */
  poster: string
  /** the animation's own canvas, so the player has an aspect ratio to size by */
  canvas: [number, number]
  /**
   * How wide the scene sits on the stage. Each one paints a different share of
   * its own canvas — measured at 90×96%, 81×79% and 91×71% — so a single width
   * would leave the first scene looking far bigger than the other two. These
   * three give all of them the same optical size.
   */
  fill: string
  title: string
  body: string
  /** the colour the stage wears while this slide is up */
  tone: Tone
}

/** the launch screen in front of the slides, as the live app paints it */
export const splash = {
  loading: 'Loading...',
  /** how long the logo holds the window before the app takes over */
  ms: 1500,
}

export const slides: Slide[] = [
  {
    key: 'welcome',
    lottie: '/assets/lottie/speakeasy-fox-wave2.json',
    poster: '/assets/mascot/splash1.webp',
    canvas: [717, 800],
    fill: '57%',
    title: 'Welcome to SpeakEasy!',
    body: 'Your journey to confident communication begins here. Set your goals, stay inspired, and make every word count.',
    tone: 'blue',
  },
  {
    key: 'adventure',
    lottie: '/assets/lottie/speakeasy-foxes-slide2.json',
    poster: '/assets/mascot/splash2.webp',
    canvas: [800, 800],
    fill: '70%',
    title: 'Your Language Adventure Awaits!',
    body: 'Discover new words, cultures, and friends from around the world. Learn, laugh, and speak with confidence every day.',
    tone: 'violet',
  },
  {
    key: 'pro',
    lottie: '/assets/lottie/speakeasy-fox-slide3.json',
    poster: '/assets/mascot/splash3.webp',
    canvas: [800, 800],
    fill: '70%',
    title: 'Ready to Speak Like a Pro?',
    body: 'Build daily habits, track your progress, and unlock your full speaking potential with us!',
    tone: 'purple',
  },
]

export const labels = {
  skip: 'Skip',
  back: 'Back',
  next: 'Next',
  /** the last slide hands over to the app */
  start: 'Get Started',
}
