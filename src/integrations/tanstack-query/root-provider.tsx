import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  return {
    queryClient,
    trpc: undefined, // Not using TRPC
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return <>{children}</>
}
