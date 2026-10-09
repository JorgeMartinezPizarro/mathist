// Public endpoints. The admin ones, mersenne and report, need the KEY.
const ENDPOINTS = ["differences", "factors", "isPrime", "primes", "pythagoreanTree", "pythagoreanTriple", "randomPrimes"]

export async function GET() {
    return Response.json({ error: "invalid endpoint /, existing endpoints " + ENDPOINTS.join(", ") }, { status: 404 })
}
