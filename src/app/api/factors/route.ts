import factors from '@/helpers/factors'

export async function GET(request: Request) {
    
    const { searchParams } = new URL(request.url)
    const n = BigInt(searchParams.get('LIMIT') || "0")

    BigInt.prototype.toJSON = function() { return this.toString() }
    try {
        return Response.json(factors(n))
    } catch (e) {
        return Response.json({ error: e.toString() }, { status: 400 });
      }
}