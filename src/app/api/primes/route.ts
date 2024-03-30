import { parse } from 'json2csv';
import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'fast-csv';


import eratostenes from '@/helpers/eratostenes'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url||"".toString())
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  const amount = parseInt(searchParams.get('amount') || "0")

  console.log(LIMIT)
  BigInt.prototype.toJSON = function() { return this.toString() }
  
  try {
    return Response.json( eratostenes(LIMIT, amount) )
  } catch (e) {
    return Response.json({ error: e.toString()  }, { status: 400 });
  }
}