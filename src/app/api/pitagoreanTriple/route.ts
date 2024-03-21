import pitagoreanTree from '@/helpers/pitagoreanTree'
import pitagoreanTriple from '@/helpers/pitagoreanTriple'
import type { NextApiRequest, NextApiResponse } from 'next'
 


export async function GET(request: Request) {
  
    const { searchParams } = new URL(request.url)
    const LIMIT = parseInt(searchParams.get('LIMIT') || "0")

    



    const {path, triple} = pitagoreanTriple(LIMIT)
  return Response.json( {path, triple} )
}