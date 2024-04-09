// Here some ideas to extrapolate number operations to BigInt
// https://golb.hplar.ch/2018/09/javascript-bigint.html
import {isPrime, bignumber } from "mathjs"

import getTimeMicro from '@/helpers/getTimeMicro';
import { MAX_COMPUTATION_FACTORS } from "@/helpers/Constants";

const zero: bigint = BigInt(0)
const one: bigint = BigInt(1)
const two: bigint = BigInt(2)
const three: bigint = BigInt(3)

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
    
    const r =  primesOf(n);
    
    return {
        message: r.message,
        factors: r.factors, 
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

interface Factorization {

    factors: bigint[];
    message: string;
}

const primesOf = (num: bigint, factors: bigint [] = [], start: bigint = three): Factorization => {
    
    if (num < one) {
        return {factors: [], message: ""}
    }
    
    if (isPrime(bignumber(num.toString()))) {
        return {factors: [...factors, num], message: ""}
    }
    
    if (num % two === zero) {
        return primesOf(num/two, [...factors, two])
    }

    const x: bigint = sqrt(num)
    
    for (var i: bigint = start; i <= x; i += two) {
        if (num % i === zero) {
            return primesOf(num/i, [...factors, i], i)
        }
        if (i > MAX_COMPUTATION_FACTORS) {
            return {factors: [...factors, num], message: "Factor " + num.toString() + " is not prime"};
        }
    }
    
    if (num === one)
        return {factors, message:""}

    return {factors: [...factors, num], message: ""};

}
