import React from 'react'
import WardrobeGrid from '@/components/WardrobeGrid'
import ProtectedRoute from '../components/ProtectedRoute'

export default function Wardrobe() {
  return (
    <ProtectedRoute>
      <WardrobeGrid />
    </ProtectedRoute>
  )
}
