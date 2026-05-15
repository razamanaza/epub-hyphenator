import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Bug, Upload } from 'lucide-react'
import UploadForm from '../components/UploadForm'
import DebugView from '../components/DebugView'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [view, setView] = useState<'main' | 'debug'>('main')

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-4 flex justify-end">
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1 gap-1">
          <button
            onClick={() => setView('main')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors touch-manipulation ${
              view === 'main'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Main
          </button>
          <button
            onClick={() => setView('debug')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors touch-manipulation ${
              view === 'debug'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-100'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            Debug
          </button>
        </div>
      </div>

      {view === 'main' ? <UploadForm /> : <DebugView />}
    </div>
  )
}
