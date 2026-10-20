// Static mock of /en/lesson-quiz/<id> — questions copied from the
// "Dangerous Extraction During the flood" lesson of "Rescue the Barn!".
export type Question = {
  prompt: string
  options: string[]
  answer: number
  explanation: string
  /** falls back to the lesson image when a question has none of its own */
  image?: string
  /** HLS clip shown instead of the image (movie quiz) */
  video?: string
}

export const lesson = {
  title: 'Dangerous  Extraction During the flood',
  image: '/assets/lessons/flood.jpg',
  xp: 50,
}

export const questions: Question[] = [
  {
    prompt:
      'Given the rising water, the first priority was ____ the smaller sheep and goats to higher ground immediately.',
    options: ['securing', 'secured', 'to secure', 'secure'],
    answer: 2,
    explanation:
      "The infinitive 'to secure' or the gerund 'securing' can complete the sentence; in formal TOEFL style, the infinitive often expresses purpose or definition.",
  },
  {
    prompt:
      'For the past two hours, the lead veterinarian ____ diligently checking the animals for injuries sustained during the storm.',
    options: ['had been', 'was', 'has been', 'is being'],
    answer: 2,
    explanation:
      "'For the past two hours' describes an action that started in the past and is still going on, so the present perfect continuous 'has been' is required.",
  },
  {
    prompt:
      '"The farmer watched from the edge of the rising water, his heart \'heavy as stone.\' What does this simile primarily describe?"',
    options: [
      'His physical exhaustion from the struggle.',
      'His profound lack of emotion or caring.',
      'His deep anxiety and overwhelming sorrow.',
      'His determination to resist the rescue efforts.',
    ],
    answer: 2,
    explanation:
      "A heart 'heavy as stone' is a common simile for grief and worry — it describes emotional weight, not tiredness or indifference.",
  },
  {
    prompt:
      "Grammatically Correct? The rescue team couldn't hardly see anything in the driving rain, impeding their movement.",
    options: ['True', 'False'],
    answer: 1,
    explanation:
      "\"Couldn't hardly\" is a double negative. The correct form is 'could hardly see' or 'couldn't see'.",
  },
  {
    prompt:
      'The tractor ____ through the flooded field, pulling the trailer with the rescued animals behind it.',
    options: ['was driven', 'drove', 'has driven', 'driving'],
    answer: 1,
    explanation:
      "The tractor is the actor here, so the simple past active 'drove' fits the narrative sequence of the story.",
  },
]
