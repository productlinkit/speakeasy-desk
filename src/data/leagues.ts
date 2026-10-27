// Static mock of /en/leagues. The tiers, thresholds and copy come from the app
// (GET /learning/leagues + the "How Leagues Work" sheet); the leaderboard names
// are written for the slice, since the live board lists real learners.

export type Tier = {
  /** tier_order in the API — also picks the badge art */
  order: number
  /** the name the API returns, printed under the hero badge */
  name: string
  /** the short name the "How Leagues Work" sheet uses */
  label: string
  tagline: string
  minXp: number
  maxXp?: number
}

export const tiers: Tier[] = [
  { order: 1, name: 'Rookie League', label: 'Rookie', tagline: "You're just getting started.", minXp: 0, maxXp: 499 },
  {
    order: 2,
    name: 'Rookie Explorer',
    label: 'Explorer',
    tagline: 'Every word you learn is a new world unlocked.',
    minXp: 500,
    maxXp: 1499,
  },
  {
    order: 3,
    name: 'Rookie Challenger',
    label: 'Challenger',
    tagline: 'Dare to learn, dare to grow.',
    minXp: 1500,
    maxXp: 2999,
  },
  {
    order: 4,
    name: 'Rookie Scholar',
    label: 'Scholar',
    tagline: 'Knowledge becomes power when practiced.',
    minXp: 3000,
    maxXp: 4999,
  },
  {
    order: 5,
    name: 'Rookie Proficient',
    label: 'Proficient',
    tagline: "You're not just learning — you're mastering.",
    minXp: 5000,
    maxXp: 7499,
  },
  {
    order: 6,
    name: 'Rookie Mentor',
    label: 'Mentor',
    tagline: 'Inspiring others begins with mastering yourself.',
    minXp: 7500,
    maxXp: 10999,
  },
  { order: 7, name: 'Rookie Elite', label: 'Elite', tagline: 'Excellence is your habit.', minXp: 11000, maxXp: 15999 },
  {
    order: 8,
    name: 'Rookie Legend',
    label: 'Legend',
    tagline: 'Your journey speaks louder than words.',
    minXp: 16000,
    maxXp: 22999,
  },
  { order: 9, name: 'Rookie Mythic', label: 'Mythic', tagline: 'Few reach this peak. Fewer stay.', minXp: 23000 },
]

export const badge = (tier: Tier) => `/assets/leagues/tier${tier.order}.png`
export const emblem = (tier: Tier) => `/assets/leagues/medal-${tier.label.toLowerCase()}.png`

/** GET /learning/league for the signed-in user */
export const standing = {
  tierOrder: 2,
  userXp: 1475,
  weeklyXp: 0,
  weeklyRank: 45,
  zone: 'demotion' as 'promotion' | 'safe' | 'demotion',
  weekEnd: '2026-11-01',
}

export const tier = tiers.find((t) => t.order === standing.tierOrder) ?? tiers[0]
export const nextTier = tiers.find((t) => t.order === standing.tierOrder + 1)

/** the top ten climb a tier at the end of the week */
export const promotionRank = 10
/** the board the app asks for is capped at twenty rows */
export const boardSize = 20

export type Racer = {
  rank: number
  name: string
  xp: number
  streak: number
  you?: boolean
}

const sample: [string, number, number][] = [
  ['Salsa Maharani', 480, 12],
  ['Andre Pratama', 455, 9],
  ['Nadia Putri', 430, 21],
  ['Bimo Saputra', 410, 4],
  ['Clara Wijaya', 395, 7],
  ['Fajar Nugroho', 380, 15],
  ['Intan Permata', 360, 3],
  ['Rizky Ananda', 345, 6],
  ['Maya Larasati', 330, 11],
  ['Dimas Haryanto', 315, 2],
  ['Tania Kusuma', 290, 5],
  ['Yoga Setiawan', 270, 1],
  ['Hana Safira', 255, 8],
  ['Bagus Prayoga', 240, 0],
  ['Elsa Kurnia', 225, 3],
  ['Rangga Mahendra', 210, 1],
  ['Vina Oktaviani', 195, 4],
  ['Satria Wibowo', 180, 0],
  ['Gita Rahmawati', 165, 2],
  ['Ilham Maulana', 150, 1],
]

export const leaderboard: Racer[] = sample.map(([name, xp, streak], i) => ({
  rank: i + 1,
  name,
  xp,
  streak,
}))

/** the app pins your own row under the board when you are outside the top twenty */
export const you: Racer = {
  rank: standing.weeklyRank,
  name: 'You',
  xp: standing.weeklyXp,
  streak: 0,
  you: true,
}

export const howItWorks = [
  { text: 'Do your lessons, earn XP', icon: '/assets/icons/diamond-purple.svg', tone: 'pink' },
  // the podium is the flat nav icon, so it is painted through a mask
  { text: 'Climb up the weekly leaderboard', icon: '/assets/icons/menu-leagues.svg', tone: 'blue', mask: true },
  { text: 'Top 10 learners get promoted weekly', icon: '/assets/icons/medal.svg', tone: 'amber' },
]
