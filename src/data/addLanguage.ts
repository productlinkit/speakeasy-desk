// Static mock of the "Speak More, Explore More!" wizard (6 steps).
export type LanguageOption = {
  code: string
  flag: string
  /** languages already on the account cannot be added again */
  locked: boolean
}

export const languages: LanguageOption[] = [
  { code: 'CHN', flag: '/assets/country/cn3.svg', locked: true },
  { code: 'ENG', flag: '/assets/country/uk3.svg', locked: true },
  { code: 'FRA', flag: '/assets/country/fr3.svg', locked: true },
  { code: 'GER', flag: '/assets/country/de3.svg', locked: true },
  { code: 'JPN', flag: '/assets/country/jp3.svg', locked: false },
  { code: 'ARA', flag: '/assets/country/sa3.svg', locked: true },
  { code: 'ESP', flag: '/assets/country/es3.svg', locked: true },
]

export type Step = {
  question: string
  options: string[]
  /** purple encouragement banner above the question */
  banner?: string
  /** only step 3 can be skipped */
  skippable?: boolean
}

/** steps 2-6; step 1 is the language picker */
export const steps: Step[] = [
  {
    question: 'What is your main reason for learning this language?',
    options: [
      'Career & Business',
      'Travel & Tourism',
      'Watching Movies & Series',
      'Understanding Songs & Culture',
      'Conversational Fluency',
      'Fun & Gamification',
    ],
  },
  {
    question: 'What is your current level in this language?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'],
    skippable: true,
  },
  {
    question: 'How do you prefer to learn?',
    banner: 'Keep going! Every choice brings you closer to fluency! 🚀💪',
    options: [
      'Structured courses & lessons',
      'Movie & series scenarios',
      'Learning through songs & lyrics',
      'Chatting with AI tutor',
      'Interactive games & challenges',
      'All',
    ],
  },
  {
    question: 'How much time can you dedicate per session?',
    options: ['5-10 minutes', '15-30 minutes', '45+ minutes'],
  },
  {
    question: 'Are you comfortable practicing speaking out loud?',
    banner: "You've come this far—let's wrap it up! 🎉🥳",
    options: [
      'Yes, I want to improve my pronunciation!',
      'Maybe, I prefer listening first',
      "Not yet, I'm more comfortable with reading & writing",
    ],
  },
]

export const totalSteps = steps.length + 1
export const languageQuestion = 'Which language would you like to learn?'

/**
 * The names of the languages themselves.
 *
 * The app's own settings list names countries instead — China, France, Japan —
 * and that screen keeps its wording. Everywhere a sentence needs the language
 * ("Learning Chinese") these are the words.
 */
export const languageLabels: Record<string, string> = {
  CHN: 'Chinese',
  ENG: 'English',
  FRA: 'French',
  GER: 'German',
  JPN: 'Japanese',
  ARA: 'Arabic',
  ESP: 'Spanish',
}

/**
 * What to show for a language code: the flag and the name the app prints.
 *
 * Every screen that names the language being learnt goes through here, so the
 * flag in the top bar, the chip on Practice and the tick in Settings cannot
 * drift apart from what the account actually picked.
 */
export function languageOf(code: string) {
  const found = languages.find((l) => l.code === code) ?? languages[1]
  return { code: found.code, flag: found.flag, name: languageLabels[found.code] ?? found.code }
}
