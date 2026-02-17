import React from 'react'
import TodayOutfits from '@/components/TodayOutfits'
import ProtectedRoute from '../components/ProtectedRoute'

export default function Today() {
  return (
    <ProtectedRoute>
      <TodayOutfits />
    </ProtectedRoute>
  )
}
