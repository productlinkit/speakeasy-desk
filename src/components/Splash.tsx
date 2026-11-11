import { useEffect } from 'react'
import { splash } from '../data/onboarding'
import './Splash.css'

/**
 * The screen the app opens on.
 *
 * The real app paints its logo over a white page while the Flutter bundle
 * loads, with a bar filling under it and the word "Loading…". There is nothing
 * to wait for here, so the bar is the only honest part of it: it runs for the
 * moment the brand is on screen and then the app takes over.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, splash.ms)
    return () => window.clearTimeout(t)
  }, [onDone])

  return (
    <div className="splash" role="status" aria-label={splash.loading}>
      <img className="splash__logo" src="/logo-splash.png" alt="SpeakEasy" width={320} height={128} />
      <span className="splash__track">
        <span className="splash__fill" style={{ animationDuration: `${splash.ms}ms` }} />
      </span>
      <p className="splash__word">{splash.loading}</p>
    </div>
  )
}
