import type { NextApiRequest, NextApiResponse } from 'next'
import zlib from "zlib"
 
import eratostenes from '@/helpers/eratostenes'

export async function POST(request: Request) {
  
  const body = await request.json();

  const LIMIT = parseInt(body.number)
  
  const x = eratostenes(LIMIT)

  
  
  // try it later to compress strings in case of limitations
  //const uncompressedString = JSON.stringify(x.toString())
  //console.log("Original size: " + uncompressedString.length)
  //var deflated = zlib.deflateSync(uncompressedString).toString('base64');
  
  //console.log("Compressed size: ", deflated.length)
  



  return Response.json( x )
}


