import factors from '@/helpers/factors'
import type { NextApiRequest, NextApiResponse } from 'next'
 

export async function GET(request: Request) {
    var hrTime = process.hrtime()
    const start = hrTime[0] * 1000000 + hrTime[1] / 1000

    const { searchParams } = new URL(request.url)
    const n = BigInt(searchParams.get('LIMIT') || "0")

    //if (n > Number.MAX_SAFE_INTEGER ) Response.json("WTF", {status: 500})
    

    const a = factors(n)

    const b = a.map(n=> n.toString())

    var hrTime = process.hrtime()
    const t = hrTime[0] * 1000000 + hrTime[1] / 1000

    return Response.json({factors: b, time: Math.round(t - start)})
}