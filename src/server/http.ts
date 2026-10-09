import errorMessage from '@/utils/errorMessage'

// Error carrying the HTTP status to answer with. Anything else thrown
// inside a route is an unexpected failure and answered with a 500.
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message)
    }
}

export const badRequest = (message: string) => new HttpError(400, message)

// Response.json does not know BigInt, the math answers with them: send them as strings
export const jsonResponse = (data: unknown): Response =>
    new Response(JSON.stringify(data, (_, value) => typeof value === "bigint" ? value.toString() : value), {
        headers: { "content-type": "application/json" },
    })

export const parseBigInt = (value: unknown, name: string): bigint => {
    try {
        return BigInt(value as string)
    } catch {
        throw badRequest("Invalid " + name + " = " + value + ", an integer is expected")
    }
}

export const parseJsonBody = (request: Request): Promise<any> =>
    request.json().catch(() => {
        throw badRequest("Invalid JSON body")
    })

export const methodNotAllowed = (allowed: string): Response =>
    Response.json({ error: "Invalid method, use " + allowed }, { status: 405, headers: { Allow: allowed } })

// prefix is only added to 500s, client errors are answered as they are.
export const errorResponse = (error: unknown, prefix: string = ""): Response => {
    if (error instanceof HttpError) {
        return Response.json({ error: error.message }, { status: error.status })
    }
    return Response.json({ error: prefix + errorMessage(error) }, { status: 500 })
}
