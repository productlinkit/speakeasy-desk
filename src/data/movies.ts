// Static mock of /en/movie-learning. Posters are the real ones from the
// SpeakEasy backend; the two clips are real HLS streams from "Clan of Dragons".
import type { Question } from './quiz'

export type Movie = {
  id: string
  title: string
  poster: string
  questions: Question[]
}

const clip = (id: string) => `https://be.speakeasy.mobi/uploads/videos_hls/${id}/playlist.m3u8`

const CLIP_A = clip('aaad45f7-8fd8-451d-a3ed-ba5ffcf3d817')
const CLIP_B = clip('8382056d-e30f-4495-b39c-62654f695758')

/** the app serves 10 unique questions per movie; this slice ships a short set */
const dragonsQuestions: Question[] = [
  {
    prompt: 'The dragon is ____ over the battlefield while smoke rises from below.',
    options: ['soaring', 'crawling', 'strolling', 'creeping'],
    answer: 0,
    explanation:
      "'Soaring' means flying high with little effort — the only option that fits a dragon above a battlefield.",
    video: CLIP_A,
  },
  {
    prompt: 'The queen ____ her army from the back of the dragon.',
    options: ['leads', 'lead', 'leading', 'led to'],
    answer: 0,
    explanation: "'The queen' is third person singular, so the present simple takes 'leads'.",
    video: CLIP_B,
  },
  {
    prompt: 'Grammatically Correct? Smoke were rising from the burning fields.',
    options: ['True', 'False'],
    answer: 1,
    explanation: "'Smoke' is uncountable and takes a singular verb: 'smoke was rising'.",
    video: CLIP_A,
  },
  {
    prompt: 'By the time the soldiers arrived, the village ____ already burned down.',
    options: ['has', 'had', 'have', 'was'],
    answer: 1,
    explanation:
      'The burning happened before another past event, so the past perfect "had burned" is used.',
    video: CLIP_B,
  },
]

/** shared placeholder set for the other titles */
const genericQuestions = (poster: string): Question[] => [
  {
    prompt: 'The hero ____ for hours before the storm finally stopped.',
    options: ['has waited', 'had been waiting', 'waits', 'is waiting'],
    answer: 1,
    explanation:
      'The waiting lasted up to a point in the past, so the past perfect continuous fits best.',
    image: poster,
  },
  {
    prompt: 'Grammatically Correct? Neither of the characters were ready for the ending.',
    options: ['True', 'False'],
    answer: 1,
    explanation: "'Neither' is singular in formal English: 'neither of the characters was ready'.",
    image: poster,
  },
  {
    prompt: 'If the crew ____ the warning, the disaster could have been avoided.',
    options: ['heard', 'had heard', 'hears', 'would hear'],
    answer: 1,
    explanation: 'This is a third conditional about the past, so the if-clause takes the past perfect.',
    image: poster,
  },
  {
    prompt: 'The scene was so tense that nobody ____ a word.',
    options: ['said', 'say', 'saying', 'says'],
    answer: 0,
    explanation: "The narration is in the past, so the past simple 'said' is correct.",
    image: poster,
  },
]

const movie = (id: string, title: string, poster: string): Movie => ({
  id,
  title,
  poster,
  questions: genericQuestions(poster),
})

export const movies: Movie[] = [
  {
    id: 'clan-of-dragons',
    title: 'Clan of Dragons',
    poster: '/assets/movies/dragons.jpg',
    questions: dragonsQuestions,
  },
  movie('megalodon', 'Megalodon', '/assets/movies/megalodon.jpg'),
  movie('interdimension', 'INTERDIMENSION', '/assets/movies/interdimension.jpg'),
  movie('detective-homes', 'DETECTIVE HOMES', '/assets/movies/detective.jpg'),
  movie('journey-to-the-west', 'Journey to the West', '/assets/movies/journey-west.jpg'),
  movie('bohemian-melody', 'Bohemian Melody', '/assets/movies/bohemian.jpg'),
  movie('la-la-love-you', 'La La Love You', '/assets/movies/lalalove.jpg'),
  movie('jurassic-chase', 'Jurassic Chase', '/assets/movies/jurassic.jpg'),
  movie('young-mage-harry', 'Young Mage Harry', '/assets/movies/young-mage.jpg'),
  movie(
    'philosophers-stone',
    "Harry Potter and the Philosopher's Stone",
    '/assets/movies/harry-potter.jpeg',
  ),
]

/** the dropdown exists in the app but only ever lists this one entry */
export const genres = ['All Genres']

export const movieResult = {
  title: 'Excellent work,',
  subtitle: 'Movie completed!',
  xp: 50,
}
