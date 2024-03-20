import factors from '@/helpers/factors'
import type { NextApiRequest, NextApiResponse } from 'next'
 

export async function GET(request: Request) {
    const start = Date.now();

    const { searchParams } = new URL(request.url)
    const n = BigInt(searchParams.get('LIMIT') || "0")

    if (n > Number.MAX_SAFE_INTEGER ) Response.json("WTF", {status: 500})
    

    const a = factors(n)

    const b = a.map(n=> n.toString())

    return Response.json({factors: b, time: Date.now() - start})
}