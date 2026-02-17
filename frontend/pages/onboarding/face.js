import React, { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { Camera, Upload, Sparkles } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { loadAuthToken, uploadFace } from '../../services/api'

export default function OnboardingFace(){
  const { updateProfile } = useAuth()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileSelect(event){
    const file = event.target.files[0]
    if(file){
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  async function handleSubmit(){
    if(!selectedFile) return

    setIsLoading(true)
    try{
      // Upload to backend which will handle file storage
      const formData = new FormData()
      formData.append('file', selectedFile)

      const token = loadAuthToken()
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }

      // Use the centralized API helper so the configured API base URL is used
      const data = await uploadFace(selectedFile)

      if(data.face_image_url){
        await updateProfile({ face_image_url: data.face_image_url })
        router.push('/onboarding/size')
      } else {
        throw new Error('Upload failed - no image URL returned')
      }
    } catch(err){
      console.error('Failed to upload face image:', err)
      alert(`Failed to upload image: ${err.message}`)
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
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-space-grotesk mb-2">
            Upload Your Photo
          </h1>
          <p className="text-gray-600 font-space-grotesk mb-6">
            This will be used to show you wearing your AI-generated outfits
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Make sure your face is clearly visible in the photo for the best AI results.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Face preview"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">Click to upload your photo</p>
              <p className="text-gray-400 text-sm mt-1">JPG, PNG up to 10MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
            selectedFile && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
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
