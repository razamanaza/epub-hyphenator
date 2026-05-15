import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'

interface LogData {
  lines: Array<string>
  total: number
}

async function fetchLogs(): Promise<LogData> {
  const res = await fetch('/api/logs?limit=50')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as LogData
}

export default function DebugView() {
  const [logs, setLogs] = useState<LogData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchLogs()
      setLogs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(load, 3000)
    return () => clearInterval(id)
  }, [autoRefresh, load])

  useEffect(() => {
    if (logs) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  function downloadLogs() {
    const a = document.createElement('a')
    a.href = '/api/logs?download=true'
    a.click()
  }

  function lineColor(line: string) {
    if (line.includes('[ERROR]')) return 'text-red-400'
    if (line.includes('[WARN]')) return 'text-yellow-400'
    return 'text-green-300'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-300 text-xs font-mono truncate">
              server logs{logs ? ` · ${logs.total} total` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`text-xs px-2 py-1 rounded font-mono transition-colors min-h-[32px] ${
                autoRefresh
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-600'
              }`}
            >
              {autoRefresh ? 'live' : 'paused'}
            </button>
            <button
              onClick={load}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white active:text-white transition-colors disabled:opacity-50 touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={downloadLogs}
              className="p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Download all logs"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Log output */}
        <div className="h-80 sm:h-96 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : !logs ? (
            <p className="text-gray-500">Loading…</p>
          ) : logs.lines.length === 0 ? (
            <p className="text-gray-500">No logs yet. Process an EPUB to see logs here.</p>
          ) : (
            logs.lines.map((line, i) => (
              <div key={i} className={`${lineColor(line)} break-all py-px`}>
                {line}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-t border-gray-700">
          <p className="text-gray-500 text-xs font-mono">last 50 lines</p>
          <button
            onClick={downloadLogs}
            className="text-blue-400 text-xs font-mono hover:text-blue-300 active:text-blue-300 touch-manipulation py-1"
          >
            download all logs
          </button>
        </div>
      </div>
    </div>
  )
}
