import type { NextApiRequest, NextApiResponse } from 'next'
 
import eratostenes from '@/helpers/eratostenes'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || "integers"
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")

  let array: number[] = [];
  let aux: number[];
  
  console.log(name, LIMIT)


  if (name === "primes") {
    const int = parseInt(10 * LIMIT / Math.log(LIMIT))
    console.log(LIMIT, int)
    aux = eratostenes(int**2) 
    console.log(aux)
  }

  
  for (var i=0;i<LIMIT;i++) {

    if (name === "integers") {
      array.push(i)
    }
    else if (name === "squares") {
      array.push(i**2)
    }
    else if (name === "exponentials") {
      array.push(2**i)
    }
    else if (name === "primes") {
      array.push(aux[i])
    }
    else if (name === "fibonacci") {
      if (i===0 || i===1)
        array.push(1)
      else
        array.push(array[i-1] + array[i-2])
    }
    else {
      array.push(1)
    }
  }
  
  
  return Response.json( array )
}