export async function GET(request: Request) {
    const valid_endpoints = [
        "differeneces",
        "factors",
        "pitagoreanTree",
        "pitagoreanTriple",
        "primes",
    ];
    return Response.json({ error: "invalid endpoint /, existing endpoints " + valid_endpoints.join(", ")}, {status: 500});
  }