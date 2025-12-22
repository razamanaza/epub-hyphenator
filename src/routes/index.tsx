import { createFileRoute } from '@tanstack/react-router'
import UploadForm from '../components/UploadForm'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <UploadForm />
    </div>
  )
}
