// Here some ideas to extrapolate number operations to BigInt
// https://golb.hplar.ch/2018/09/javascript-bigint.html
import {isPrime, bignumber } from "mathjs"
import {primeFactors} from 'prime-lib';

import getTimeMicro from './getTimeMicro';

const zero: BigInt = BigInt(0)
const one: BigInt = BigInt(1)
const two: BigInt = BigInt(2)

export default function factors(n: BigInt ) {

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

    function newtonIteration(n: BigInt, x0: BigInt): BigInt {
        const x1: BigInt = BigInt(n.toString()) / BigInt(x0.toString()) + BigInt(x0.toString()) >> BigInt(one.toString());
        if (x0 === x1 || x0 === BigInt((BigInt(x1.toString()) - BigInt(one.toString())).toString())) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, one);
}

const primesOf = (num: BigInt, factors: BigInt [] = []): BigInt [] => {
    if (num < one) {
        return []
    }
    if (isPrime(bignumber(num.toString()))) {
        return [...factors, num]
    }
    
    if (BigInt(num.toString()) % BigInt(two.toString()) === zero) {
        return primesOf(BigInt(num.toString())/BigInt(two.toString()), [...factors, two])
    }

    const x: BigInt = sqrt(num)
    
    for (var i: bigint = BigInt(3); i <= BigInt(x.toString()); i += BigInt(2)) {
        if (BigInt(num.toString()) % BigInt(i.toString()) === zero) {
            return primesOf(BigInt(num.toString())/BigInt(i.toString()), [...factors, i])
        }
    }
    
    if (num === one)
        return factors
    return [...factors, num];

    

}
