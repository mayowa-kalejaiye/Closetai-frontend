import React, { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { Shirt, Upload, Sparkles, CheckCircle } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { uploadWardrobeItem, analyzeClothingImage } from '../../services/api'

export default function OnboardingClothes(){
  const { user } = useAuth()
  const router = useRouter()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const fileInputRef = useRef(null)

  function handleFileSelect(event){
    const files = Array.from(event.target.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  function removeFile(index){
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleUpload(){
    if(selectedFiles.length === 0) return

    setIsLoading(true)
    try{
      for(const file of selectedFiles){
        if (process.env.NODE_ENV !== 'production') console.log('Processing file:', file.name)

        // Step 1: Analyze the clothing image with computer vision
        if (process.env.NODE_ENV !== 'production') console.log('Running vision analysis...')
        const visionAnalysis = await analyzeClothingImage(file)
        if (process.env.NODE_ENV !== 'production') console.log('Vision analysis result:', visionAnalysis)

        // Step 2: Upload to wardrobe with analyzed attributes
        const formData = new FormData()
        formData.append('image', file)
        formData.append('category', visionAnalysis.category || 'unknown')
        formData.append('color', visionAnalysis.color?.name || 'unknown')
        formData.append('occasion', 'casual') // Default occasion, could be enhanced later
        formData.append('pattern', visionAnalysis.pattern || 'unknown')

        if (process.env.NODE_ENV !== 'production') console.log('Uploading with detected attributes:', {
          category: visionAnalysis.category || 'unknown',
          color: visionAnalysis.color?.name || 'unknown'
        })

        const result = await uploadWardrobeItem(formData)
        if (process.env.NODE_ENV !== 'production') console.log('Upload result:', result)
        setUploadedCount(prev => prev + 1)
      }

      // After all uploads complete, redirect to wardrobe
      router.push('/wardrobe')
    } catch(err){
      console.error('Failed to upload clothes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function skipOnboarding(){
    router.push('/wardrobe')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-32">
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg mb-4">
            <Shirt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-space-grotesk mb-2">
            Upload Your Clothes
          </h1>
          <p className="text-gray-600 font-space-grotesk mb-6">
            Add some clothes to get personalized outfit suggestions
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50 mb-4"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">Click to add clothes</p>
            <p className="text-gray-400 text-sm">Multiple photos supported</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isLoading && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadedCount}/{selectedFiles.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadedCount / selectedFiles.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
              selectedFiles.length > 0 && !isLoading
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
              `Upload ${selectedFiles.length} Item${selectedFiles.length !== 1 ? 's' : ''}`
            )}
          </button>

          <button
            onClick={skipOnboarding}
            className="w-full py-3 px-6 rounded-2xl font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
