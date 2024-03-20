export default (n: BigInt ): BigInt[] => {
    
    return primesOf(n)
}

const one: BigInt = BigInt(1)
const zero: BigInt = BigInt(0)

const primesOf = (num: BigInt, factors: BigInt [] = []): BigInt [] => {
    
    const arr = Array(num)

    for (var i: BigInt = BigInt(2); i**BigInt(2)<num;i=i+one) {
        if (num % BigInt(i) == zero) {
            return primesOf(num/i, [...factors, BigInt(i)])
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];
}
