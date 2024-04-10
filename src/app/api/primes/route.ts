import { MAX_ALLOCATABLE_MATRIX_30GB, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY } from '@/helpers/Constants'
import eratostenes from '@/helpers/eratostenes'
import toHuman from '@/helpers/toHuman'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url||"".toString())
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  const amount = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
  const excel = searchParams.get('excel') ? true : false;

  // LIMIT CHECKS 
  // TODO: use web request origin for check or not. Extend this approach to forbid the access to api to others than localhost:3000.
  // 1b Up to 64MB RAM 516MB disk, natural limit for the web, it takes 20s to compute
  if (LIMIT > MAX_LENGTH_FOR_SIEVE_HEALTY) { 
    // SKIP IT FOR HARD TESTINGs
    return Response.json(
      { error: "Max length " + MAX_LENGTH_FOR_SIEVE_HEALTY + ", " + toHuman(MAX_LENGTH_FOR_SIEVE_HEALTY / 16) + " RAM 515MB disk. For more ask the admin."}, 
      {status: 500}
    )
  } 
  // 535b, up to 31GB RAM 240GB disk (x500), common sense limit, it takes 12h to compute
  if (LIMIT > MAX_ALLOCATABLE_MATRIX_30GB) {
    throw new Error("Max length " + MAX_ALLOCATABLE_MATRIX_30GB + ", " + toHuman(MAX_ALLOCATABLE_MATRIX_30GB / 16) + " RAM 240GB disk.");
  }

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }
  try {
    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}