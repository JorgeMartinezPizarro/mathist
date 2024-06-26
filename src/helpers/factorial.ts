export default function factorial(n: number) {
    return factorialAux(BigInt(n))
}

const factorialAux = (n: bigint): bigint => {
    let x = BigInt(1);

    for (var i = BigInt(2); BigInt(i) <= BigInt(n.toString()); i++) {
        x *= i
    }

    return x;
}