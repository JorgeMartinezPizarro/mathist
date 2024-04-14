import { MAX_DIGITS_FACTORIZATION } from '@/helpers/Constants';
import errorMessage from '@/helpers/errorMessage';
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
        return Response.json({ error: errorMessage(error) }, { status: 500 });
    }
}