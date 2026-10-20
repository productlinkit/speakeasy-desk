// Static mock of /en/community. The real feed is user-generated, so the posts
// here are written for the slice rather than copied from the live account.

export type Comment = {
  id: number
  author: string
  initial: string
  tone: string
  text: string
  when: string
}

export type Post = {
  id: number
  author: string
  /** shown in the avatar circle when there is no photo */
  initial: string
  tone: string
  title: string
  content: string
  images: string[]
  comments: Comment[]
  when: string
  /** the "Post" tab only lists what you wrote yourself */
  mine: boolean
}

let seed = 0
const next = () => (seed += 1)

export const posts: Post[] = [
  {
    id: next(),
    author: 'Salsa',
    initial: 'S',
    tone: '#8f87f1',
    title: 'My English Journey',
    content:
      'I’ve been learning English for about six months now, and I’m finally starting to use it more confidently every day. It’s not about being perfect, it’s about improving step by step. Last week I ordered coffee in English for the first time without rehearsing the sentence in my head first, and the barista understood me straight away! Small win, but it made my whole day. If you are just starting out: keep going, it really does click eventually.',
    images: ['/assets/courses/aurora.png', '/assets/courses/great-wall.png'],
    comments: [
      {
        id: next(),
        author: 'Dimas',
        initial: 'D',
        tone: '#43aaef',
        text: 'This is so encouraging, thank you for sharing! 🙌',
        when: '6mo',
      },
    ],
    when: '7mo',
    mine: false,
  },
  {
    id: next(),
    author: 'hana',
    initial: 'P',
    tone: '#f97316',
    title: 'Finished new lesson!',
    content: 'I finally finished advance 1 lessons 🙌',
    images: [],
    comments: [],
    when: '2mo',
    mine: true,
  },
  {
    id: next(),
    author: 'Dimas',
    initial: 'D',
    tone: '#43aaef',
    title: 'Food vocabulary is the best 🤤',
    content:
      'Learning English with the food topic always makes me hungry. Thankfully I can learn while eating snacks!',
    images: ['/assets/courses/pho.png'],
    comments: [
      {
        id: next(),
        author: 'hana',
        initial: 'P',
        tone: '#f97316',
        text: 'Same here 😄 the food lesson is my favourite one so far.',
        when: '2mo',
      },
      {
        id: next(),
        author: 'Rani',
        initial: 'R',
        tone: '#22c55e',
        text: 'Which lesson is this? I want to try it too.',
        when: '1mo',
      },
    ],
    when: '2mo',
    mine: false,
  },
  {
    id: next(),
    author: 'hana',
    initial: 'P',
    tone: '#f97316',
    title: 'Traveling lessons!',
    content:
      "Today I learned how to speak English on vacation — asking for directions, checking in at a hotel, ordering at a restaurant. So much fun, it feels like I'm travelling too.",
    images: ['/assets/courses/airplane.png'],
    comments: [],
    when: '2mo',
    mine: true,
  },
  {
    id: next(),
    author: 'Rani',
    initial: 'R',
    tone: '#22c55e',
    title: 'Day 30 of my streak 🔥',
    content: 'Thirty days in a row! Ten minutes every morning before work really adds up.',
    images: [],
    comments: [],
    when: '3mo',
    mine: false,
  },
]
