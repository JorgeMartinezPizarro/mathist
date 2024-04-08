import factors from '@/helpers/factors'

export async function GET(request: Request) {
    
    const { searchParams } = new URL(request.url)
    const n = BigInt(searchParams.get('LIMIT') || "0")

    try {
        return Response.json(factors(n))
    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        return Response.json({ error: message }, { status: 400 });
    }
}