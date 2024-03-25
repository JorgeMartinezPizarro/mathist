export default (n: BigInt ): BigInt[] => {
    
    return primesOf(n)
}

const one: BigInt = BigInt(1)
const zero: BigInt = BigInt(0)

const primesOf = (num: BigInt, factors: BigInt [] = []): BigInt [] => {
    
    if (BigInt(2) % num === zero)
        return [...factors, BigInt(2)]

    for (var i: BigInt = BigInt(3); i**BigInt(2)<num;i=i+BigInt(2)) {
        if (num % i === zero) {
            return primesOf(num/i, [...factors, i])
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];

}
