import eratostenes from "./eratostenes"

export default (n: BigInt ): BigInt[] => {
    const m = Math.round(Math.sqrt(parseInt(n.toString())))
    const a = eratostenes(m)
    return primesOf(n, [], a)
}

const one: BigInt = BigInt(1)
const zero: BigInt = BigInt(0)

const primesOf = (num: BigInt, factors: BigInt [] = [], primes: number[]): BigInt [] => {
    for (var i: BigInt = zero; i < BigInt(primes.length);i=i+BigInt(1)) {
        const x: BigInt = BigInt(primes[parseInt(i.toString())])
        if (num % x === zero) {
            return primesOf(num/x, [...factors, x], primes)
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];

}
