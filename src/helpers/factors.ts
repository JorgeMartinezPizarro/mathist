// Here some ideas to extrapolate number operations to BigInt
// https://golb.hplar.ch/2018/09/javascript-bigint.html
import {isPrime, bignumber } from "mathjs"
import getTimeMicro from '@/helpers/getTimeMicro';
import { MAX_COMPUTATION_FACTORS } from "@/helpers/Constants";

const zero: bigint = BigInt(0)
const one: bigint = BigInt(1)
const two: bigint = BigInt(2)
const three: bigint = BigInt(3)

export default function factors(n: bigint ): Factorization {
    console.log("/////////////////////////////////")
    const start = getTimeMicro()

    if (n === one || n === zero) {
        return {
            message: "0 and 1 are special numbers, no primes.",
            factors: [n],
            time: getTimeMicro()-start,
        }
    } else if (n < zero) {
        throw new Error("It works only with positive integers!")
    }

    const factors: bigint[] = []
    let m = n
    let f: Factor = factor(n)
    while (f.factor > one) {
        factors.push(f.factor)
        if (f.message !== "") {
            return {
                factors,
                message: f.message,
                time: getTimeMicro() - start,
            }
        }
        m = m / f.factor
        f = factor(m)
    }

    return {
        factors,
        time: getTimeMicro() - start,
        message: ""
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
    time: number;
}

interface Factor {
    factor: bigint;
    message: string;
}

// Divide by 2, 3 5 and then iterate over the different rests mod 30
const factor = function(n: bigint): Factor {
    
    if (isPrime(bignumber(n.toString()))) return {
        factor: n, 
        message: "",
    }

    if (n==zero) return {
        factor: BigInt(0),
        message: "",
    }  

    if (n%one || n*n<2) return {
        factor: BigInt(1),
        message: "",
    };
        
    ([two, three, BigInt(5)] as bigint[]).forEach(k=> {
        if (n%k===zero) {
            return {
                factor: k,
                message: "",
            }
        }
    })
    
    var m: bigint = sqrt(n);
    for (var i: bigint=BigInt(7);i<=m;i+=BigInt(30)) {
      
     if (i > MAX_COMPUTATION_FACTORS) {
      return {
        factor: n,
        message:"Factor " + n + " is not prime"
      }
     }

     ([i, i + BigInt(4), i+BigInt(6), i+BigInt(6), i+BigInt(10), i+BigInt(12), i+BigInt(16), i+BigInt(22), i+BigInt(24)] as bigint[]).forEach(k => {
        if (n%k===zero) {
            return {
                factor: k,
                message: "",
            }
        }
     })
    }
    return {
        factor: n,
        message: ""
   }
}