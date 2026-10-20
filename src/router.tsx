import { useCallback, useEffect, useState } from 'react'

/** Minimal history router — enough for the few pages this slice has. */
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0 })
  }, [])

  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back()
    else navigate('/')
  }, [navigate])

  return { path, navigate, back }
}
