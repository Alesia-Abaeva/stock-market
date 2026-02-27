'use client'

import React from 'react'

import { getSessionAction } from '@/lib/actions/auth.actions'
import { User } from '@/shared/types/global'

type UserContextType = {
  user: User | null
  loading: boolean
}

const UserContext = React.createContext<UserContextType>({
  user: null,
  loading: true,
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSessionAction()
        if (session?.user) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>
}

export const useUser = () => React.useContext(UserContext)
