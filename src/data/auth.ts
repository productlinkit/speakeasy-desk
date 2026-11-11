// The account screens at /en/login, /en/signup and /en/forgot-password.
// Copy is the app's own, read off the live screens.
export type AuthStep = 'login' | 'signup' | 'forgot'

export const screens = {
  login: {
    title: 'Sign in to your Account',
    lead: 'Enter your email and password to log in',
    submit: 'Login',
    foot: "Don't have an account?",
    footLink: 'Sign Up',
  },
  signup: {
    title: 'Sign Up',
    lead: 'Create an account to continue!',
    submit: 'Register',
    foot: 'Already have an account?',
    footLink: 'Login',
  },
  forgot: {
    title: 'Forgot Password',
    lead: "No worries! Enter your registered email address and we'll send you instructions to reset your password.",
    submit: 'Send Reset Link',
    foot: 'Remembered it?',
    footLink: 'Back to login',
  },
} as const

export const google = 'Continue with Google'
export const orLabel = 'Or'
export const forgotLink = 'Forgot Password?'

/**
 * The app puts a flag picker in front of the phone number. The project has no
 * flag set wide enough to back one honestly, so this slice names the countries
 * instead — the same choice, read aloud rather than drawn.
 */
export const dialCodes = [
  { code: 'ID', dial: '+62', name: 'Indonesia' },
  { code: 'MY', dial: '+60', name: 'Malaysia' },
  { code: 'SG', dial: '+65', name: 'Singapore' },
  { code: 'JP', dial: '+81', name: 'Japan' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'US', dial: '+1', name: 'United States' },
]

/**
 * The strip a guest sees over the home page. The app itself never shows this —
 * it signs you in before the home screen exists — but a desktop window invites
 * a look around first, so the gate needs to say what it is rather than bounce
 * people without a word. Button wording matches the account screens.
 */
export const guest = {
  head: 'You are browsing as a guest',
  lead: 'Log in to pick up your lessons, or sign up and we will set your learning plan.',
  login: screens.login.submit,
  signup: screens.login.footLink,
  /** replaces "Welcome Back" in the top bar, which a guest has not earned */
  greeting: 'Welcome to SpeakEasy!',
}
