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

// Use mod 30 to remove lot of composite checks. Can be more but the improvement is smaller with higher values
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
    }  
    if (n%two==zero) return {
        factor: BigInt(2),
        message: "",
    }  
    if (n%three==zero) return {
        factor: BigInt(3),
        message: "",
    }  
    if (n%BigInt(5)==zero) return {
        factor: BigInt(5),
        message: "",
    }  
    var m: bigint = sqrt(n);
    for (var i: bigint=BigInt(7);i<=m;i+=BigInt(30)) {

     if (i > MAX_COMPUTATION_FACTORS) {
      return {
        factor: n,
        message:"Factor " + n + " is not prime"
      }
     } 
     if (n%i==zero) return {
        factor: i,
        message: "",
     };
     if (n%(i+BigInt(4))==zero) return {
        factor: i+BigInt(4),
        message: "",
     }
     if (n%(i+BigInt(6))==zero) return {
        factor: i+BigInt(6),
        message: "",
     }
     if (n%(i+BigInt(10))==zero) return {
        factor: i+BigInt(10),
        message: "",
     }
     if (n%(i+BigInt(12))==zero) return {
        factor: i+BigInt(12),
        message: "",
     }
     if (n%(i+BigInt(16))==zero) return {
        factor: i+BigInt(16),
        message: "",
     }
     if (n%(i+BigInt(22))==zero) return {
        factor: i+BigInt(22),
        message: "",
     }
     if (n%(i+BigInt(24))==zero) return {
        factor: i+BigInt(24),
        message: "",
     }
    }
    return {
        factor: n,
        message: ""
   }
}