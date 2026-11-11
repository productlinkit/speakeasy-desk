import { SessionContext, useSessionStore } from '../session'

/** Hands the one session store to every page that asks about it. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const store = useSessionStore()
  return <SessionContext.Provider value={store}>{children}</SessionContext.Provider>
}
