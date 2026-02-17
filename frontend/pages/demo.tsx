import OutfitGeneratorDemo from '../components/OutfitGeneratorDemo'
import ProtectedRoute from '../components/ProtectedRoute'

export default function DemoOne() {
  return (
    <ProtectedRoute>
      <OutfitGeneratorDemo />
    </ProtectedRoute>
  )
}
