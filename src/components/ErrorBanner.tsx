import { AlertTriangle } from 'lucide-react'

interface ErrorBannerProps {
  error: string
}

export default function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
        <p className="text-red-800 text-sm font-medium">{error}</p>
      </div>
    </div>
  )
}
