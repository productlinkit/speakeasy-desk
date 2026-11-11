import { useCallback, useEffect, useState } from 'react'

/** Minimal history router — enough for the few pages this slice has. */
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname)
  /** which plan, which price list: data for the page, not part of the route */
  const [search, setSearch] = useState(() => window.location.search)

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname + window.location.search) return
    window.history.pushState({}, '', to)
    // the path alone decides which page renders, so it is stored on its own
    setPath(window.location.pathname)
    setSearch(window.location.search)
    window.scrollTo({ top: 0 })
  }, [])

  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back()
    else navigate('/')
  }, [navigate])

  return { path, search, navigate, back }
}
