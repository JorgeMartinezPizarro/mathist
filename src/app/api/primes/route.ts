import { MAX_SUPPORTED_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SIEVE_LENGTH } from '@/Constants'
import eratosthenes, { lastTenEratosthenes } from '@/helpers/eratosthenes'
import { badRequest, errorResponse, parseBigInt } from '@/helpers/http'
import { isAdmin } from '@/helpers/auth'
import toHuman from '@/helpers/toHuman'

export async function GET(request: Request): Promise<Response> {

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT_BI: bigint = parseBigInt(searchParams.get('LIMIT') || "", "LIMIT")
    const LIMIT = Number(LIMIT_BI)
    const amount: number = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
    const excel: boolean = searchParams.get('excel') ? true : false;
    // THE ADMIN KEY OVERCOMES THE GUI LIMITS
    const admin = isAdmin(request)

    if (isNaN(amount) || isNaN(LIMIT)) {
      throw badRequest("Invalid parameters amount = " + amount + ", LIMIT = " + LIMIT)
    };
    if (!admin && !excel && LIMIT_BI > MAX_HEALTHY_SIEVE_LENGTH) {
      return Response.json( lastTenEratosthenes(LIMIT_BI) )
    }
    if (!admin && LIMIT > MAX_HEALTHY_SIEVE_LENGTH) {
      // 500m up to 30MB RAM 245MB disk, natural limit for the web, it takes 3s to compute.
      throw badRequest("Max length for generate prime download is " + MAX_HEALTHY_SIEVE_LENGTH + ", which takes " + toHuman(MAX_HEALTHY_SIEVE_LENGTH / 16) + " RAM and 49MB disk. For more ask the admin.")
    }
    // MAX SERVER LIMIT
    if (LIMIT > MAX_SUPPORTED_SIEVE_LENGTH) {
      // up to 1t, 59GB RAM 452GB disk, it takes 36h to compute.
      throw badRequest("Max length is " + MAX_SUPPORTED_SIEVE_LENGTH + ", which takes " + toHuman(MAX_SUPPORTED_SIEVE_LENGTH / 16) + " RAM and 452GB disk.")
    }

    return Response.json( eratosthenes(LIMIT, amount, excel) )
  } catch (error) {
    return errorResponse(error);
  }
}
