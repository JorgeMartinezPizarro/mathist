import { useCallback, useState } from "react"

import errorMessage from "@/helpers/errorMessage"

// State of a call to our API: its last answer, whether it is running and its
// error message. The API answers errors as { error } with a 4xx or 5xx status.
export default function useApi<T>(initialData: T | null = null) {
    const [data, setData] = useState<T | null>(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const request = useCallback(async (url: string, init?: RequestInit): Promise<T | null> => {
        setLoading(true)
        setError("")
        setData(null)
        try {
            const response = await fetch(url, init)
            const body = await response.json()
            if (!response.ok || body.error) {
                throw new Error(body.error || response.statusText)
            }
            setData(body)
            return body
        } catch (e) {
            setError(errorMessage(e))
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const get = useCallback((url: string) => request(url), [request])

    const post = useCallback((url: string, payload: unknown) => request(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
    }), [request])

    // Forget the last answer, e.g. when the input it was computed for changes
    const reset = useCallback(() => {
        setData(null)
        setError("")
    }, [])

    return { data, loading, error, get, post, reset }
}
