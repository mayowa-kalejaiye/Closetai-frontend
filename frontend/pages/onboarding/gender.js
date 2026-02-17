import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { User, Sparkles } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function OnboardingGender(){
  const { updateProfile } = useAuth()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(){
    if(!selectedGender) return

    setIsLoading(true)
    try{
      await updateProfile({ gender: selectedGender })
      router.push('/onboarding/face')
    } catch(err){
      console.error('Failed to update gender:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-32">
        <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-space-grotesk mb-2">
            Welcome to ClosetAI!
          </h1>
          <p className="text-gray-600 font-space-grotesk mb-6">
            Let's personalize your experience
          </p>
          <h2 className="text-xl font-semibold text-gray-800 font-space-grotesk mb-4">
            What's your gender?
          </h2>
        </div>

        {/* Gender Selection */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedGender('male')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectedGender === 'male'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">👨</div>
              <div className="font-semibold text-gray-900">Male</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedGender('female')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectedGender === 'female'
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">👩</div>
              <div className="font-semibold text-gray-900">Female</div>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedGender || isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
            selectedGender && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
    </ProtectedRoute>
  )
}
