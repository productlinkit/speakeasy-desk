import { useEffect, useRef, useState } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'
import './LottiePlayer.css'

type LottiePlayerProps = {
  src: string
  /** animate while true; resets to the first frame when it goes false */
  playing: boolean
  /** shown until the animation is parsed, and kept if it fails to load */
  poster?: string
  className?: string
  loop?: boolean
  /** how the animation fills its box, like object-fit */
  fit?: 'contain' | 'cover'
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function LottiePlayer({
  src,
  playing,
  poster,
  className,
  loop = true,
  fit = 'contain',
}: LottiePlayerProps) {
  // lottie-web owns `stage`; React must never render children into it
  const stage = useRef<HTMLDivElement>(null)
  const anim = useRef<AnimationItem | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!stage.current) return

    const item = lottie.loadAnimation({
      container: stage.current,
      renderer: 'svg',
      loop,
      autoplay: false,
      path: src,
      rendererSettings: {
        preserveAspectRatio: fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet',
      },
    })
    anim.current = item

    const onLoaded = () => setReady(true)
    const onError = () => setFailed(true)
    item.addEventListener('DOMLoaded', onLoaded)
    item.addEventListener('data_failed', onError)

    return () => {
      item.removeEventListener('DOMLoaded', onLoaded)
      item.removeEventListener('data_failed', onError)
      item.destroy()
      anim.current = null
      setReady(false)
    }
  }, [src, loop, fit])

  useEffect(() => {
    const item = anim.current
    if (!item || !ready) return
    if (playing && !prefersReducedMotion()) item.play()
    else item.stop()
  }, [playing, ready])

  return (
    <div className={`lottie${className ? ` ${className}` : ''}`} aria-hidden>
      <div className="lottie__stage" ref={stage} />
      {(!ready || failed) && poster && <img src={poster} alt="" className="lottie__poster" />}
    </div>
  )
}
