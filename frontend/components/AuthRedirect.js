import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function AuthRedirect({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Already authenticated, redirect to main app
      router.push('/wardrobe')
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

  // Don't render children if authenticated
  if (user) {
    return null
  }

  return children
}
