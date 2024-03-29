// Here some ideas to extrapolate number operations to BigInt
// https://golb.hplar.ch/2018/09/javascript-bigint.html
import {isPrime, BigNumber } from "mathjs"
import {primeFactors} from 'prime-lib';

import getTimeMicro from './getTimeMicro';

const zero: BigInt = BigInt(0)
const one: BigInt = BigInt(1)
const two: BigInt = BigInt(2)

export default (n: BigInt ) => {

    const start = getTimeMicro()
    
    return {
        factors: BigInt(n.toString()) <= BigInt("9007199254740991") ? primeFactors(parseInt(n.toString())) : primesOf(n), 
        time: getTimeMicro() - start
    }
}

// How to get sqrt of a BigInt, found under the link below
// https://stackoverflow.com/a/53684036
function sqrt(value: BigInt): BigInt {
    if (value < zero) {
        throw 'square root of negative numbers is not supported'
    }
    if (value < two) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> one;
        if (x0 === x1 || x0 === (x1 - one)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, one);
}

const primesOf = (num: BigInt, factors: BigInt [] = []): BigInt [] => {
    if (isPrime(new BigNumber(num.toString()))) {
        return [...factors, num]
    }
    
    if (num % two === zero) {
        return primesOf(num/two, [...factors, two])
    }

    const x: BigInt = sqrt(num)
    for (var i: BigInt = BigInt(3); i <= x;i=i+two) {
        if (num % i === zero) {
            return primesOf(num/i, [...factors, i])
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];

    

}
