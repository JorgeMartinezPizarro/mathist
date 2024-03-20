import type { NextApiRequest, NextApiResponse } from 'next'
 
import eratostenes from '@/helpers/eratostenes'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  
  return Response.json( eratostenes(LIMIT) )
}