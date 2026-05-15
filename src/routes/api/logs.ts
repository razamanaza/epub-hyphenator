import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { getAllLines, getLines, getTotal } from '@/server/logger'

export const Route = createFileRoute('/api/logs')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url)
        const download = url.searchParams.get('download') === 'true'

        if (download) {
          const content = getAllLines().join('\n')
          const filename = `server-logs-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.txt`
          return new Response(content || '(no logs)', {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          })
        }

        const limitParam = url.searchParams.get('limit')
        const limit = limitParam
          ? Math.min(500, Math.max(1, parseInt(limitParam, 10) || 50))
          : 50

        return json({ lines: getLines(limit), total: getTotal() })
      },
    },
  },
})
