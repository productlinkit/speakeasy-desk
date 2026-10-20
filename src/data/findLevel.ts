// Static mock of the /en/find-level flow (intro → quiz → result).
import type { Question } from './quiz'

export const intro = {
  image: '/assets/mascot/11.png',
  title: "Let's Find the Right Starting Point!",
  body: 'Take this short test so we can place you in the right level — no pressure, just a quick check to make sure your learning starts at the perfect pace.',
}

export const result = {
  image: '/assets/mascot/12.png',
  emoji: '🎉',
  title: "You're All Set!",
  lead: "We've placed you at the",
  tail: "based on your test. Let's build on what you know and unlock real fluency together!",
}

const img = (n: number) => `/assets/placement/q${n}.jpg`

export const placementQuestions: Question[] = [
  {
    prompt: 'Placement Test I ____ breakfast at 8:00 AM every morning before going to work.',
    options: ['eat', 'eats', 'eating', 'eaten'],
    answer: 0,
    explanation:
      "With the subject 'I', the present simple takes the base form: 'I eat'. 'Eats' is only used with he / she / it.",
    image: img(1),
  },
  {
    prompt: 'Grammatically Correct? Yesterday, the waiter brought us the wrong menu.',
    options: ['True', 'False'],
    answer: 0,
    explanation:
      "'Yesterday' needs the past simple, and 'brought' is the correct past form of 'bring'. The sentence is correct.",
    image: img(2),
  },
  {
    prompt: 'The family ____ their holiday for months before they finally booked the tickets.',
    options: ['planned', 'had been planning', 'is planning', 'plans'],
    answer: 1,
    explanation:
      "The planning happened over a period before another past event, so the past perfect continuous 'had been planning' fits.",
    image: img(3),
  },
  {
    prompt: 'Excuse me, how much ____ these shoes?',
    options: ['is', 'are', 'be', 'was'],
    answer: 1,
    explanation: "'Shoes' is plural, so the verb must be 'are'.",
    image: img(4),
  },
  {
    prompt: 'Grammatically Correct? He finished the report although he was very tired.',
    options: ['True', 'False'],
    answer: 0,
    explanation: "'Although' correctly introduces a contrast clause here, so the sentence is correct.",
    image: img(5),
  },
  {
    prompt: 'If I ____ more time, I would learn another language.',
    options: ['have', 'had', 'will have', 'am having'],
    answer: 1,
    explanation:
      "This is a second conditional about an unreal situation, so the if-clause takes the past simple 'had'.",
    image: img(3),
  },
  {
    prompt: 'She is used to ____ early because her office is far from home.',
    options: ['wake up', 'woke up', 'waking up', 'wakes up'],
    answer: 2,
    explanation: "'Be used to' is followed by a gerund, so 'waking up' is correct.",
    image: img(1),
  },
  {
    prompt: 'Grammatically Correct? The documents was sent to the client this morning.',
    options: ['True', 'False'],
    answer: 1,
    explanation: "'Documents' is plural, so it needs 'were sent', not 'was sent'.",
    image: img(5),
  },
  {
    prompt: 'By the time we arrive, the shop ____ already closed.',
    options: ['will have', 'has', 'had', 'is'],
    answer: 0,
    explanation:
      "The action finishes before a point in the future, so the future perfect 'will have closed' is required.",
    image: img(4),
  },
]

export function levelFor(correct: number, total: number) {
  const ratio = total ? correct / total : 0
  if (ratio >= 0.75) return 'Advanced Level'
  if (ratio >= 0.35) return 'Intermediate Level'
  return 'Beginner Level'
}
