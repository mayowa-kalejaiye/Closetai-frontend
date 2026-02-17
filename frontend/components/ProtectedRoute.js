import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      // Still loading/checking auth state
      return
    }

    if (user === false) {
      // Not authenticated, redirect to login
      router.push('/login')
    }
  }, [user, router])

  // Show loading while checking auth
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (user === false) {
    return null
  }

  return children
}
