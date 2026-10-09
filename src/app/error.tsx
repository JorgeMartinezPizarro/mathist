'use client' // Error components must be Client Components

import ErrorAlert from "@/components/ui/ErrorAlert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <>
    <h1>Error</h1>
    <ErrorAlert error={error.message || String(error)} />
    <button onClick={reset}>Try again</button>
  </>
}
