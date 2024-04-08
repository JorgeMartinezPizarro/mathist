// Here some ideas to extrapolate number operations to BigInt
// https://golb.hplar.ch/2018/09/javascript-bigint.html
import {isPrime, bignumber } from "mathjs"
import {primeFactors} from 'prime-lib';

import getTimeMicro from './getTimeMicro';

const zero: bigint = BigInt(0)
const one: bigint = BigInt(1)
const two: bigint = BigInt(2)

export default function factors(n: bigint ) {

    const start = getTimeMicro()

    if (n === one || n === zero) {
        return {
            factors: [n],
            time: getTimeMicro()-start,
        }
    } else if (n < zero) {
        throw new Error("It works only with positive integers!")
    }
    
    return {
        factors: n <= BigInt("9007199254740991") ? primeFactors(parseInt(n.toString())) : primesOf(n), 
        time: getTimeMicro() - start
    }
}

// How to get sqrt of a BigInt, found under the link below
// https://stackoverflow.com/a/53684036
function sqrt(value: bigint): bigint {
    if (value < zero) {
        throw 'square root of negative numbers is not supported'
    }
    if (value < two) {
        return value;
    }

    function newtonIteration(n: bigint, x0: bigint): bigint {
        const x1: bigint = n / x0 + x0 >> one;
        if (x0 === x1 || x0 === x1 - one) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, one);
}

const primesOf = (num: bigint, factors: bigint [] = []): bigint [] => {
    if (num < one) {
        return []
    }
    if (isPrime(bignumber(num.toString()))) {
        return [...factors, num]
    }
    
    if (num % two === zero) {
        return primesOf(num/two, [...factors, two])
    }

    const x: bigint = sqrt(num)
    
    for (var i: bigint = BigInt(3); i <= x; i += two) {
        if (num % i === zero) {
            return primesOf(num/i, [...factors, i])
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];

    

}
