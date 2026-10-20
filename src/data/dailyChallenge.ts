// Static mock of the /en/daily-challenge flow (intro → quiz → completion → done).
import type { Question } from './quiz'

export const dailyIntro = {
  image: '/assets/mascot/13.png',
  title: "Let's See What You've Got Today!",
}

export const dailyResult = {
  title: 'Daily Challenge Complete!',
  subtitle: 'Great job!',
  xp: 50,
}

export const dailyDone = {
  image: '/assets/mascot/19.png',
  title: 'Daily Challenge Completed',
  lead: 'New challenge',
  tail: 'available tomorrow. Keep the momentum going!',
}

const art = (n: number) => `/assets/placement/q${n}.jpg`

/** the app serves 4 questions a day */
export const dailyQuestions: Question[] = [
  {
    prompt: "What is the correct past tense of 'go'?",
    options: ['went', 'goed', 'gone', 'goes'],
    answer: 0,
    explanation:
      "'Go' is irregular: its past simple is 'went'. 'Gone' is the past participle, used with have/has.",
    image: art(3),
  },
  {
    prompt: 'She ____ to the office by train every morning.',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 1,
    explanation: "With he / she / it the present simple takes an -s, so 'she goes' is correct.",
    image: art(1),
  },
  {
    prompt: 'Grammatically Correct? I have been waiting here since two hours.',
    options: ['True', 'False'],
    answer: 1,
    explanation: "A span of time takes 'for': 'for two hours'. 'Since' is used with a starting point.",
    image: art(2),
  },
  {
    prompt: 'We need to buy ____ milk before the shop closes.',
    options: ['a', 'an', 'some', 'many'],
    answer: 2,
    explanation: "'Milk' is uncountable, so it takes 'some' — not 'a/an' or 'many'.",
    image: art(4),
  },
]

/* ---- "done for today", remembered per browser so the card can flip state ---- */
const STORAGE_KEY = 'speakeasy:daily-challenge'
const today = () => new Date().toISOString().slice(0, 10)

export function isDailyDone() {
  try {
    return localStorage.getItem(STORAGE_KEY) === today()
  } catch {
    return false
  }
}

export function markDailyDone() {
  try {
    localStorage.setItem(STORAGE_KEY, today())
  } catch {
    // private mode — the card simply stays in its "not done" state
  }
}
