import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { User, Sparkles } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function OnboardingSize(){
  const { updateProfile } = useAuth()
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const bodySizes = [
    { value: 'very_slim', label: 'Very Slim', emoji: '🏃‍♂️' },
    { value: 'slim', label: 'Slim', emoji: '🤸‍♂️' },
    { value: 'average', label: 'Average', emoji: '👤' },
    { value: 'chubby', label: 'Chubby', emoji: '🤗' },
    { value: 'fat', label: 'Plus Size', emoji: '💪' }
  ]

  async function handleSubmit(){
    if(!selectedSize) return

    setIsLoading(true)
    try{
      await updateProfile({ body_size: selectedSize })
      router.push('/onboarding/clothes')
    } catch(err){
      console.error('Failed to update body size:', err)
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
            Body Type
          </h1>
          <p className="text-gray-600 font-space-grotesk mb-6">
            This helps AI create more accurate outfit suggestions
          </p>
        </div>

        {/* Size Selection */}
        <div className="space-y-3 mb-8">
          {bodySizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setSelectedSize(size.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedSize === size.value
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-4">{size.emoji}</div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{size.label}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedSize || isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
            selectedSize && !isLoading
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
