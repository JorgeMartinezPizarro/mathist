import { createHash, timingSafeEqual } from 'node:crypto'
import { HttpError } from '@/helpers/http'

const sha256 = (value: string) => createHash('sha256').update(value).digest()

// The only place reading MATHER_SECRET. A request whose KEY param matches it
// can use the admin endpoints and skip the GUI limits. An empty or missing
// secret disables admin access instead of matching an empty KEY.
export const isAdmin = (request: Request): boolean => {
    const secret = process.env.MATHER_SECRET?.trim() || ""
    const key = new URL(request.url).searchParams.get('KEY') || ""
    return secret !== "" && timingSafeEqual(sha256(key), sha256(secret))
}

export const requireAdmin = (request: Request): void => {
    if (!isAdmin(request)) {
        throw new HttpError(403, "Forbidden")
    }
}
