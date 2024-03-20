import differences from '@/helpers/differences';
import eratostenes from '@/helpers/eratostenes';
import type { NextApiRequest, NextApiResponse } from 'next'
 

export async function POST(request: Request) {

  const body = await request.json();

  const array = body
  const matrix = differences(array)  
  


  return Response.json(matrix)
}