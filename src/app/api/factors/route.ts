import { MAX_DIGITS_FACTORIZATION } from '@/Constants';
import { badRequest, errorResponse, parseBigInt } from '@/helpers/http';
import factors from '@/helpers/factors'

export async function GET(request: Request) {
    
    try {
        const { searchParams } = new URL(request.url);
        const n = parseBigInt(searchParams.get('LIMIT')||"", "LIMIT");

        (BigInt.prototype as any).toJSON = function() {
            return this.toString()
        }

        if (n.toString().length > MAX_DIGITS_FACTORIZATION) {
            throw badRequest("Max value of LIMIT is " + (BigInt(10)**BigInt(MAX_DIGITS_FACTORIZATION) - BigInt(1)) + ", " + n + " provided")
        }

        return Response.json(factors(n))
    } catch (error) {
        return errorResponse(error);
    }
}