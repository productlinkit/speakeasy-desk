// The Profile tab and everything behind its gear: settings, the account forms,
// the subscription, the receipts, the help centre and the learning goals.
//
// Copy is the live app's wherever the live app has copy. The numbers are not:
// the streak, the receipts and the expiry date here are sample data, because
// the real ones are the account holder's own billing record.

export const profileScreen = {
  chip: 'Boost Plan',
  freeChip: 'Free Plan',
  settings: 'Settings',
  edit: 'Edit Profile',
  streakHead: 'My Learning Streak',
  streakUnit: 'Days',
  streakLead: "You're on fire! Keep the momentum going",
  streakStart: 'Your streak starts with your first lesson today',
  seePlans: 'See Plans',
  week: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  timeHead: 'Weekly Time Spent',
  xpHead: 'XP Earned',
  earn: 'Earn',
}

/** what the profile reports about the account. The app counts a week at a time. */
export const stats = {
  streakDays: 3,
  /** which weekdays this week were practised, Sunday first */
  weekDone: [false, true, true, true, false, false, false],
  hours: 2,
  minutes: 48,
  xp: 1475,
}

export const guestProfile = {
  head: 'Your profile lives behind a login',
  lead: 'Streaks, XP and league standing are kept on your account. Log in and this page fills with yours.',
  login: 'Log in',
  signup: 'Create an account',
  /** what is waiting, named rather than shown as zeroes */
  waiting: [
    { label: 'Learning streak', note: 'Every day you practise, counted' },
    { label: 'Weekly time spent', note: 'How long you studied this week' },
    { label: 'XP earned', note: 'What your lessons have added up to' },
  ],
}

// ---------------------------------------------------------------- settings

export type SettingKey =
  | 'edit-profile'
  | 'account'
  | 'subscription'
  | 'transactions'
  | 'language'
  | 'help'
  | 'privacy'

export const settingGroups: { head: string; rows: { key: SettingKey; label: string }[] }[] = [
  {
    head: 'Account',
    rows: [
      { key: 'edit-profile', label: 'Edit Profile' },
      { key: 'account', label: 'Account Setting' },
      { key: 'subscription', label: 'Manage Subscription' },
      { key: 'transactions', label: 'Transaction History' },
    ],
  },
  { head: 'App', rows: [{ key: 'language', label: 'App Language' }] },
  {
    head: 'Support',
    rows: [
      { key: 'help', label: 'Help Center' },
      { key: 'privacy', label: 'Privacy Policy' },
    ],
  },
]

export const settingRoute: Record<SettingKey, string> = {
  'edit-profile': '/profile/settings/edit-profile',
  account: '/profile/settings/account',
  subscription: '/profile/settings/subscription',
  transactions: '/profile/settings/transactions',
  language: '/profile/settings/language',
  help: '/profile/settings/help',
  privacy: '/profile/settings/privacy',
}

/** which panel a "/profile/settings/…" path asks for, if it asks for one */
export function panelOf(path: string): SettingKey | null {
  const tail = path.replace(/^\/profile\/settings\/?/, '')
  return (Object.keys(settingRoute) as SettingKey[]).find((k) => k === tail) ?? null
}

export const logout = {
  label: 'Logout',
  title: 'Log out of SpeakEasy?',
  body: 'Your progress stays on your account. You can log back in whenever you like.',
  confirm: 'Log out',
  cancel: 'Stay signed in',
}

// ------------------------------------------------------------ edit profile

export const editProfile = {
  title: 'Edit Profile',
  cover: 'Change cover photo',
  avatar: 'Change profile photo',
  name: 'Full Name',
  bio: 'Bio',
  bioHint: 'Enter your bio',
  birthday: 'Birth of date',
  phone: 'Phone Number',
  gender: 'Gender',
  genderHint: 'Select gender',
  save: 'Save',
  saved: 'Profile saved.',
  /** the only field the form refuses to let go of */
  needName: 'Your name cannot be empty.',
  photoNote: 'Photo upload is not part of this slice — the initial stands in for it.',
}

export const genders: { value: 'male' | 'female' | 'other'; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const dialCodes = ['+62', '+1', '+44', '+61', '+81', '+91']

// --------------------------------------------------------- account setting

export const accountSetting = {
  title: 'Account Setting',
  email: 'Email',
  oldPassword: 'Old Password',
  newPassword: 'New Password',
  confirmPassword: 'Confirm Password',
  save: 'Save',
  saved: 'Account updated.',
  needEmail: 'That does not look like an email address.',
  needOld: 'Enter your current password first.',
  tooShort: 'A new password needs at least 8 characters.',
  mismatch: 'The two new passwords do not match.',
}

// ----------------------------------------------------------- subscription

export const subscription = {
  title: 'Manage Subscription',
  memberLead: 'You are a member of a Boost Plan.',
  plan: 'BOOST (Annual)',
  expLabel: 'Exp date:',
  /** a sample renewal date, formatted on screen so the weekday is never wrong */
  expiry: '2027-03-14',
  changeLead: 'Want to change plans? We have options for you!',
  explore: 'Explore Plan',
  cancel: 'Cancel Subscription',
  cancelTitle: 'Cancel your BOOST plan?',
  cancelBody:
    'BOOST stays on until the date below. After that, ads return and the AI Tutor goes back to its daily limit.',
  cancelConfirm: 'Cancel subscription',
  cancelKeep: 'Keep BOOST',
  cancelled: 'Cancelled. BOOST runs until',
  resume: 'Resume subscription',
  resumed: 'BOOST renews again.',
  freeLead: 'You are on the Free plan.',
  freePlan: 'FREE',
  freeNote: 'Ads between lessons, and the AI Tutor stops after five messages a day.',
}

// ------------------------------------------------------ transaction history

export type TxStatus = 'success' | 'pending' | 'failed' | 'cancelled'

export type Tx = {
  id: string
  plan: string
  amount: string
  /** yyyy-mm-dd, so the filters can compare it */
  date: string
  status: TxStatus
}

export const transactions = {
  title: 'Transaction History',
  range: 'Date Range',
  from: 'From',
  to: 'To',
  clear: 'Clear dates',
  filters: [
    { key: 'all', label: 'All' },
    { key: 'success', label: 'Success' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Fail' },
  ] as const,
  end: 'No more transactions',
  empty: 'No transactions match these filters.',
}

export const statusLabels: Record<TxStatus, string> = {
  success: 'Success',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

/** sample receipts — the shape the app shows, not anybody's real billing */
export const txRows: Tx[] = [
  { id: 'SE-2026-1104', plan: 'Annual Plan', amount: 'USD 49.99', date: '2026-11-04', status: 'success' },
  { id: 'SE-2026-1021', plan: '1 Day Plan', amount: 'USD 0.50', date: '2026-10-21', status: 'failed' },
  { id: 'SE-2026-1003', plan: 'Monthly Plan', amount: 'USD 5.99', date: '2026-10-03', status: 'success' },
  { id: 'SE-2026-0918', plan: 'Monthly Plan', amount: 'USD 5.99', date: '2026-09-18', status: 'pending' },
  { id: 'SE-2026-0722', plan: 'Monthly Plan', amount: 'USD 1.00', date: '2026-07-22', status: 'cancelled' },
]

// ------------------------------------------------------------ app language

export const appLanguage = {
  title: 'Preferences',
  head: 'What do you want to learn?',
  lead: 'Choose your preferred language for a better experience',
  save: 'Save Changes',
  saved: 'Language saved.',
}

/** the names the live app prints beside each flag */
export const languageNames: Record<string, string> = {
  CHN: 'China',
  ENG: 'English',
  FRA: 'France',
  GER: 'Germany',
  JPN: 'Japan',
  ARA: 'Arabic',
  ESP: 'Spain',
}

// ------------------------------------------------------------- help centre

export const helpCentre = {
  title: 'Help Center',
  tabs: ['Getting Started', 'Creating', 'Learning Features'],
  head: 'Top Questions',
  contact: 'Still stuck? Write to support.speakeasy@gmail.com and we answer within 24-48 hours.',
}

export const faqs: { tab: string; q: string; a: string }[] = [
  {
    tab: 'Getting Started',
    q: 'What is SpeakEasy?',
    a: "Speakeasy is a modern language learning app that helps you speak confidently through real conversations, immersive content, and AI-powered practice. Instead of just memorizing vocabulary, you'll learn through movie scenes, songs, and interactive chats - just like how people naturally learn to speak.\n\nWhether you're brushing up for travel, studying for school, or chasing fluency, Speakeasy makes the journey fun, effective, and personalized.",
  },
  {
    tab: 'Getting Started',
    q: 'How do I manage my subscription or billing?',
    a: 'You can manage your subscription by going to Settings → Manage Subscription. From there, you can view your current plan, update payment methods, or cancel your subscription.',
  },
  {
    tab: 'Getting Started',
    q: 'What should I do if I forgot my password?',
    a: 'If you forgot your password, you can reset it by tapping "Forgot Password" on the login screen. You will receive an email with instructions to reset your password.',
  },
  {
    tab: 'Getting Started',
    q: 'How can I contact support?',
    a: 'You can contact our support team at support.speakeasy@gmail.com. We typically respond within 24-48 hours.',
  },
  {
    tab: 'Creating',
    q: 'Is all content on Speakeasy free?',
    a: 'Some content is free to access, while premium content (movies, songs, and advanced lessons) requires a Boost subscription. Check the content details for more information.',
  },
  {
    tab: 'Learning Features',
    q: 'How do I report an issue or inappropriate content?',
    a: 'You can report issues or inappropriate content by contacting our support team at support.speakeasy@gmail.com or through the app settings.',
  },
]

// ---------------------------------------------------------- privacy policy

export const privacy = {
  title: 'Privacy Policy',
  updated: 'Last updated: 20/11/2025',
  lead: 'At Speakeasy, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our language learning app.',
  sections: [
    {
      head: '1. Information We Collect',
      blocks: [
        { lead: '🧠 Personal Info', body: 'When you sign up or use Speakeasy, we may collect:',
          list: ['Name, email, and profile picture', 'Language preferences and learning goals', 'Device information and app usage stats'] },
        { lead: '🎙️ Voice & Interaction Data',
          body: 'If you use voice features or interact with AI chats, we may store anonymized transcripts to improve performance.',
          list: [] },
      ],
    },
    {
      head: '2. How We Use Your Information',
      blocks: [
        { lead: '', body: 'We use your data to:',
          list: ['Personalize your learning experience', 'Track progress and unlock achievements', 'Improve app performance and AI accuracy', 'Send important updates and offers (only with your consent)'] },
      ],
    },
    {
      head: '3. Data Sharing & Security',
      blocks: [
        { lead: '', body: 'We never sell your data. We may share limited information with:',
          list: ['Service providers (e.g., cloud storage, analytics)', 'Legal authorities if required by law'] },
        { lead: '', body: 'All data is encrypted and stored securely.', list: [] },
      ],
    },
    {
      head: '4. Your Rights',
      blocks: [
        { lead: '', body: 'You can:',
          list: ['Update or delete your account anytime', 'Request a copy of your data', 'Opt out of marketing emails'] },
        { lead: '', body: 'Simply go to Settings → Privacy or contact us at support.speakeasy@gmail.com', list: [] },
      ],
    },
    {
      head: "5. Children's Privacy",
      blocks: [
        { lead: '', body: 'Speakeasy is not intended for users under 13. We do not knowingly collect personal data from children.', list: [] },
      ],
    },
    {
      head: '6. Changes to This Policy',
      blocks: [
        { lead: '', body: "We may update this policy to reflect changes in the app or legal requirements. We'll notify you through the app or email.", list: [] },
      ],
    },
    {
      head: '7. Contact Us',
      blocks: [
        { lead: '', body: 'If you have any questions or concerns, please reach out to:', list: [] },
        { lead: '', body: '📩 support.speakeasy@gmail.com', list: [] },
        { lead: '', body: '📍 Speakeasy HQ, Jl. Gatot Subroto no.19, Jakarta Selatan, DKI Jakarta, Indonesia', list: [] },
      ],
    },
  ],
}

// ----------------------------------------------------------- learning goals

export const goals = {
  title: 'Learning Goals',
  langHead: 'My Goals in…',
  summaryHead: 'Progress Summary',
  level: 'Intermediate 3',
  startLabel: 'Start Learning',
  start: 'May 21 2026',
  endLabel: 'Complete Learning by',
  end: 'Jun 24 2027',
  remainLabel: 'Date Remaining',
  percent: 36,
  /** the same goal, named on the profile tile that links here */
  tileHead: 'Learning Goal',
  planHead: 'Active Plan',
  change: 'Change Plan',
  cards: [
    { key: 'goal', head: 'Goals', icon: '🎯', value: 'Career & Business', tone: 'blue' },
    { key: 'type', head: 'Type', icon: '📔', value: 'Structured courses & lessons', tone: 'purple' },
    { key: 'date', head: 'Target Date', icon: '📅', value: 'June 24th 2027', tone: 'violet' },
    { key: 'time', head: 'Time', icon: '🕐', value: '10 Minutes / day', tone: 'deep' },
  ],
}
