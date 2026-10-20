import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

/** Muted, looping clip with no controls — how the movie quiz shows its scenes. */
export function ClipPlayer({ src, poster }: { src: string; poster?: string }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = video.current
    if (!el) return

    if (el.canPlayType('application/vnd.apple.mpegurl')) {
      el.src = src
      return
    }
    if (!Hls.isSupported()) return

    const hls = new Hls()
    hls.loadSource(src)
    hls.attachMedia(el)
    return () => hls.destroy()
  }, [src])

  return <video ref={video} poster={poster} autoPlay muted loop playsInline aria-hidden />
}
