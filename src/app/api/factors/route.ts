import { MAX_DIGITS_FACTORIZATION } from '@/constants';
import { badRequest, errorResponse, jsonResponse, parseBigInt } from '@/server/http';
import factors from '@/math/factors'

export async function GET(request: Request) {
    
    try {
        const { searchParams } = new URL(request.url);
        const n = parseBigInt(searchParams.get('LIMIT')||"", "LIMIT");

        if (n.toString().length > MAX_DIGITS_FACTORIZATION) {
            throw badRequest("Max value of LIMIT is " + (BigInt(10)**BigInt(MAX_DIGITS_FACTORIZATION) - BigInt(1)) + ", " + n + " provided")
        }

        return jsonResponse(factors(n))
    } catch (error) {
        return errorResponse(error);
    }
}