// Static mock of /en/video-courses. The HLS streams and thumbnails are the
// real ones from the SpeakEasy backend (served with open CORS).
export type VideoCourse = {
  id: string
  title: string
  thumb: string
  hls: string
  description: string
  objectives: string[]
}

const stream = (n: number) => `https://be.speakeasy.mobi/uploads/videos_hls/${n}/playlist.m3u8`

export const videoCourses: VideoCourse[] = [
  {
    id: 'train-station',
    title: 'Where is the train station',
    thumb: '/assets/videos/thumb3.png',
    hls: stream(3),
    description:
      'A dialogue-based lesson focused on navigation, where four speakers ask for and give directions to various locations in a city using simple commands and prepositions.',
    objectives: [
      'Ask for directions using "Where is…?".',
      'Give instructions using directional verbs.',
      'Describe the location of a building using prepositions.',
    ],
  },
  {
    id: 'every-day',
    title: 'What do you do every day',
    thumb: '/assets/videos/thumb2.png',
    hls: stream(2),
    description:
      'A dialogue-based lesson about daily routines, where speakers describe the things they do every morning, afternoon and evening.',
    objectives: [
      'Talk about routines using the present simple.',
      'Use adverbs of frequency such as always, usually and never.',
      'Tell the time of day an activity happens.',
    ],
  },
  {
    id: 'what-are-you-doing',
    title: 'What are you doing?',
    thumb: '/assets/videos/thumb1.png',
    hls: stream(1),
    description:
      'A dialogue-based lesson about actions happening right now, where speakers ask each other what they are doing at the moment.',
    objectives: [
      'Ask what someone is doing using the present continuous.',
      'Describe an action in progress.',
      'Contrast the present simple with the present continuous.',
    ],
  },
]

export const videoReward = {
  image: '/assets/mascot/14.png',
  xp: 50,
  title: 'XP Unlocked!',
  emoji: '🎉',
  tail: 'Well played! More XP, more progress, more confidence.',
}
