// Static mock of /en/learning ("My Learning") for the signed-in user.
export const level = {
  name: 'Intermediate 3',
  progress: 28,
  note: '18 days to go! keep going',
}

export type Course = {
  title: string
  description: string
  progress: number
  image: string
}

const ill = (name: string) => `/assets/courses/${name}.png`

export const ongoingCourses: Course[] = [
  {
    title: 'Rescue the Barn!',
    description: 'Learn English grammar through the exciting story of rescuing a farm barn from a flood',
    progress: 40,
    image: ill('barn'),
  },
  {
    title: 'The Industrial Revolution',
    description: 'Learn English grammar through the fascinating story of the Industrial Revolution',
    progress: 0,
    image: ill('industrial'),
  },
  {
    title: "The World's Toughest Climbing",
    description: 'Learn English grammar through the thrilling adventure of conquering the toughest peaks',
    progress: 0,
    image: ill('climbing'),
  },
  {
    title: 'The Hunt for The Aurora Northern Lights',
    description: 'Learn English grammar on an exciting journey to chase the Aurora Northern Lights',
    progress: 0,
    image: ill('aurora'),
  },
]

export const doneCourses: Course[] = [
  {
    title: 'The Vietnamese Pho',
    description: 'Learn English grammar through the delicious story of Pho, Vietnam’s most famous dish',
    progress: 100,
    image: ill('pho'),
  },
  {
    title: 'Sushi Date with My Wife',
    description: 'Learn English grammar through the story of a sushi date with my wife',
    progress: 100,
    image: ill('sushi'),
  },
  {
    title: 'America! We are Free!',
    description: 'Learn English grammar through the history of America’s struggle for independence',
    progress: 100,
    image: ill('america'),
  },
  {
    title: 'The Great Wall of China',
    description: 'Learn English grammar through the story of visiting The Great Wall of China',
    progress: 100,
    image: ill('great-wall'),
  },
  {
    title: 'The Game of The Century',
    description: 'Learn English grammar through the story of the epic 2022 World Cup final',
    progress: 100,
    image: ill('world-cup'),
  },
  {
    title: "Meeting New Friends at Uncle Joe's Farm",
    description: 'Learn English grammar through an adventure at Uncle Joe’s farm, meeting new friends',
    progress: 100,
    image: ill('farm'),
  },
  {
    title: 'The Sourdough is No Ordinary Bread',
    description: 'Learn English grammar through the fluffiness of extraordinary sourdough bread',
    progress: 100,
    image: ill('sourdough'),
  },
  {
    title: 'Is The Platypus an Alien?',
    description: 'Learn English grammar through the story of a magical creature: the platypus',
    progress: 100,
    image: ill('platypus'),
  },
  {
    title: 'I believe I Can Fly',
    description: 'Learn English through the history of airplane',
    progress: 100,
    image: ill('airplane'),
  },
  {
    title: 'Stretch Your Bodies!',
    description: 'Learn English grammar through movement and energy in Stretch class',
    progress: 100,
    image: ill('pilates'),
  },
  {
    title: 'Samba at Rio De Janeiro',
    description: 'Learn English grammar through the vibrant rhythm of Samba in Rio De Janeiro',
    progress: 100,
    image: ill('samba'),
  },
]
