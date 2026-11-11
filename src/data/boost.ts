// The BOOST screens the onboarding ends on: /en/onboarding/boost-benefits,
// /en/onboarding/compare-plans, and the plan list behind "Upgrade to BOOST now".

export const benefitsScreen = {
  art: '/assets/mascot/1.png',
  /** the app sets the word BOOST in blue inside the sentence */
  leadHead: 'BOOST',
  leadTail: " isn't just extra features—it's a fun and focused way to learn better.",
  compare: 'Compare BOOST with the Free version',
  upgrade: 'Upgrade to BOOST now',
  stay: 'Stay With Free Plan',
}

export const benefits = [
  { icon: '/assets/icons/ads.svg', label: 'Ad-free experience' },
  { icon: '/assets/icons/lamp.svg', label: 'Review your mistakes' },
  { icon: '/assets/icons/mascot3.png', label: 'No limits on AI Tutor (Chat and Video Call)' },
  { icon: '/assets/icons/boost.svg', label: 'Exclusive badge in the community forum' },
]

export const compareScreen = {
  titleHead: 'Learn a language faster with ',
  titleMark: 'BOOST',
  free: 'Free',
  paid: 'BOOST',
}

/** every row is in BOOST; `free` says whether the free plan has it too */
export const compareRows = [
  { label: 'Access Course', free: true },
  { label: 'Join community discussions', free: true },
  { label: 'Ad-free experience', free: false },
  { label: 'Review your mistakes', free: false },
  { label: 'No limits on AI Tutor (Chat and Video Call)', free: false },
  { label: 'Exclusive badge in the community forum', free: false },
]

export const plansScreen = {
  bar: 'Manage Subscription',
  titleHead: 'Choose Your ',
  titleMark: 'BOOST',
  titleTail: ' Plan',
  back: 'See BOOST Plan Benefits',
}

export type Plan = {
  /** the app's own key for it, straight off /api/v1/subscription/plans */
  type: string
  name: string
  /** the headline rate, per month */
  rate: string
  /** how often it is actually charged */
  cycle: string
  /** what leaves the account each time */
  total: string
}

/**
 * The app does not let anyone pick a currency: it serves one price list per
 * language portal, and the portal decides. /en/ is quoted in US dollars, /in/
 * — the India portal — in rupees, and the two lists are not conversions of one
 * another. The India list is a plan shorter, and its plan names arrive from the
 * API already in Hindi, so they are kept as served.
 *
 * (The live /in/ screens render their chrome in Indonesian — "Ditagih bulanan",
 * "Seumur Hidup". That is a locale mix-up, not a translation: "in" is the
 * retired ISO code for Indonesian, so the interface resolves it to Indonesian
 * while the portal means India. This slice keeps its chrome in English.)
 */
export type PriceList = {
  key: 'usd' | 'inr'
  /** what the switch calls it */
  label: string
  /** the portal the app serves this list to */
  portal: string
  code: string
  symbol: string
  plans: Plan[]
}

export const priceLists: PriceList[] = [
  {
    key: 'usd',
    label: '$ USD',
    portal: 'English portal',
    code: 'USD',
    symbol: '$',
    plans: [
      { type: 'monthly_plan', name: 'Monthly Plan', rate: '$ 5.99/mo', cycle: 'Billed monthly', total: '$ 5.99' },
      { type: '6_month_plan', name: '6-Month Plan', rate: '$ 5.00/mo', cycle: 'Billed every 6 months', total: '$ 29.99' },
      { type: 'annual_plan', name: 'Annual Plan', rate: '$ 4.17/mo', cycle: 'Billed yearly', total: '$ 49.99' },
      { type: 'free_plan', name: 'Free Plan', rate: '$ 0/mo', cycle: 'Lifetime', total: '$ 0.00' },
      { type: '1_day_plan', name: '1 Day Plan', rate: '$ 0/mo', cycle: 'Lifetime', total: '$ 0.50' },
    ],
  },
  {
    key: 'inr',
    label: '₹ INR',
    portal: 'India portal',
    code: 'INR',
    symbol: '₹',
    plans: [
      { type: 'monthly_plan', name: 'मासिक प्लान', rate: '₹ 574.99/mo', cycle: 'Billed monthly', total: '₹ 574.99' },
      { type: '6_month_plan', name: '6 महीने का प्लान', rate: '₹ 479.59/mo', cycle: 'Billed every 6 months', total: '₹ 2,877.55' },
      { type: 'annual_plan', name: 'सालाना (12 महीने)', rate: '₹ 399.71/mo', cycle: 'Billed yearly', total: '₹ 4,796.55' },
      { type: 'free_plan', name: 'मुफ़्त प्लान', rate: '₹ 0/mo', cycle: 'Lifetime', total: '₹ 0.00' },
    ],
  },
]

/** the plan screen's own labels, around the two lists */
export const priceSwitch = {
  label: 'Currency',
  note: 'The app serves one price list per portal; these are both of them.',
}

/**
 * The screen behind a chosen plan.
 *
 * The live app asks which card you want before it goes anywhere. This one does
 * not: payment hands over to Stripe, and Stripe asks. A method picker in front
 * of that would be a question asked twice, and the first answer thrown away.
 */
export const paymentScreen = {
  bar: 'Confirm your plan',
  badge: 'BOOST',
  lead: 'Unlock Boost and keep learning with us!',
  total: 'Total',
  submit: 'Continue Payment',
  /** said before the button, because it leaves the site */
  handover: 'Continue Payment takes you to Stripe. Your card details are entered there.',
  /** the real answer comes back minutes later; these are the other two */
  slice: 'Payment is simulated here. See it land another way:',
}

export type PaymentState = 'success' | 'pending' | 'failed'

/**
 * How a payment lands.
 *
 * The app has no page for any of these: it hands over to Stripe and picks the
 * answer back up inside itself, so there was nothing to read off the live site.
 * The wording follows the app's own voice — plain and active — and each screen
 * says what to do next rather than how sorry it is.
 */
export const paymentResults: Record<
  PaymentState,
  {
    title: string
    lead: string
    /** what the main button says, and where it goes */
    primary: string
    secondary: string
    /** a failed attempt has nothing to quote */
    reference: boolean
  }
> = {
  success: {
    title: 'Payment successful',
    lead: 'BOOST is on. Ads are gone, the AI Tutor has no limits, and your badge is live in the community.',
    primary: 'Start learning',
    secondary: 'See what BOOST gives you',
    reference: true,
  },
  pending: {
    title: 'Payment pending',
    lead: 'Your bank has not confirmed it yet. This usually clears within a few minutes, and BOOST switches on by itself when it does.',
    primary: 'Check again',
    secondary: 'Back to home',
    reference: true,
  },
  failed: {
    title: 'Payment failed',
    lead: 'The card was declined, so nothing was charged. Try another card, or pick a plan that suits you better.',
    primary: 'Try again',
    secondary: 'Choose another plan',
    reference: false,
  },
}

export const receipt = {
  plan: 'Plan',
  cycle: 'Billing',
  total: 'Total',
  reference: 'Reference',
  /** pressing "Check again" in a slice can only answer the one way */
  stillWaiting: 'Still waiting for your bank.',
}
