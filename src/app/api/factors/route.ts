import { MAX_DIGITS_FACTORIZATION } from '@/helpers/Constants';
import factors from '@/helpers/factors'

export async function GET(request: Request) {
    
    try {
        const { searchParams } = new URL(request.url);
        let n;
        const t = searchParams.get('LIMIT')||""
        try {
            n = BigInt(t);
        } catch (e) {
            throw new Error("Invalid BigInt " + t)
        }

        (BigInt.prototype as any).toJSON = function() {
            return this.toString()
        }

        if (n > BigInt(10**MAX_DIGITS_FACTORIZATION -1)) {
            return Response.json( {error: "Max value of LIMIT is " + BigInt(10**MAX_DIGITS_FACTORIZATION -1) + ", " + n + " provided"}, {status: 500})
        }
        
        return Response.json(factors(n))
    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        return Response.json({ error: message }, { status: 500 });
    }
}