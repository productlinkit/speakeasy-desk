import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import './VideoPlayer.css'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const clock = (s: number) => {
  if (!Number.isFinite(s)) return '00:00'
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(Math.floor(s % 60)).padStart(2, '0')
  return `${mm}:${ss}`
}

export function VideoPlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  const shell = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [speed, setSpeed] = useState(1)

  // HLS needs a helper everywhere except Safari, which plays it natively
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

  const toggle = () => {
    const el = video.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = video.current
    if (!el) return
    el.currentTime = Number(e.target.value)
    setTime(el.currentTime)
  }

  const pickSpeed = (rate: number) => {
    if (video.current) video.current.playbackRate = rate
    setSpeed(rate)
    setSpeedOpen(false)
  }

  const fullscreen = () => {
    const el = shell.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  const progress = duration ? (time / duration) * 100 : 0

  return (
    <div className="player" ref={shell}>
      <video
        ref={video}
        poster={poster}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onClick={toggle}
      />

      <button
        type="button"
        className="player__center"
        onClick={toggle}
        aria-label={playing ? `Pause ${title ?? 'video'}` : `Play ${title ?? 'video'}`}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="player__bar">
        <input
          type="range"
          className="player__seek"
          min={0}
          max={duration || 0}
          step="any"
          value={time}
          onChange={seek}
          aria-label="Seek"
          style={{ ['--progress' as string]: `${progress}%` }}
        />

        <div className="player__row">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            onClick={() => video.current && (video.current.muted = !video.current.muted)}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
          </button>
          <span className="player__time">
            {clock(time)} / {clock(duration)}
          </span>
          <button
            type="button"
            className="player__gear"
            onClick={() => setSpeedOpen(true)}
            aria-label="Playback settings"
          >
            <GearIcon />
          </button>
          <button type="button" onClick={fullscreen} aria-label="Fullscreen">
            <FullscreenIcon />
          </button>
        </div>
      </div>

      {speedOpen && (
        <div className="speed" role="dialog" aria-label="Playback speed">
          <button type="button" className="speed__backdrop" onClick={() => setSpeedOpen(false)} />
          <div className="speed__sheet">
            <p className="speed__title">
              <GearIcon /> Playback speed
            </p>
            <div className="speed__options">
              {SPEEDS.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`speed__option${rate === speed ? ' is-active' : ''}`}
                  onClick={() => pickSpeed(rate)}
                >
                  {rate}×
                </button>
              ))}
            </div>
            <button type="button" className="speed__cancel" onClick={() => setSpeedOpen(false)}>
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 5h3.2v14H7zm6.8 0H17v14h-3.2z" />
    </svg>
  )
}
function SoundIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path
        d="M15.5 9a4 4 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
function MutedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path
        d="m15.5 9.5 4 5m0-5-4 5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
      <path d="M20 13.1v-2.2l-2-.4a6.5 6.5 0 0 0-.6-1.5l1.2-1.7-1.6-1.6-1.7 1.2a6.5 6.5 0 0 0-1.5-.6l-.4-2h-2.2l-.4 2c-.5.1-1 .3-1.5.6L7.6 5.7 6 7.3l1.2 1.7c-.3.5-.5 1-.6 1.5l-2 .4v2.2l2 .4c.1.5.3 1 .6 1.5L6 16.7l1.6 1.6 1.7-1.2c.5.3 1 .5 1.5.6l.4 2h2.2l.4-2c.5-.1 1-.3 1.5-.6l1.7 1.2 1.6-1.6-1.2-1.7c.3-.5.5-1 .6-1.5l2-.4Z" />
    </svg>
  )
}
function FullscreenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
