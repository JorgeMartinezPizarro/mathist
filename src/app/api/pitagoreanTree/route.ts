import pitagoreanTree from '@/helpers/pitagoreanTree'
import type { NextApiRequest, NextApiResponse } from 'next'
 


export async function GET(request: Request) {
  
    const { searchParams } = new URL(request.url)
    const LIMIT = parseInt(searchParams.get('LIMIT') || "0")

    const a = pitagoreanTree(LIMIT)
  return Response.json( a )
}