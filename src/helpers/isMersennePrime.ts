import percent from './percent';
import duration from './duration';
import getTimeMicro from './getTimeMicro';
import * as bigintModArith from 'bigint-mod-arith'

// Function to perform the Lucas-Lehmer test
function lucasLehmerTest(p: number) {
    const start = getTimeMicro()
    
    if (p === 2) return true; // 2^2 - 1 = 3 is prime

    if (p <= 1 || p % 2 === 0) return false; // Mersenne number for p <= 1 or even p is not prime

    const mersenneNumber = BigInt(2) ** BigInt(p) - BigInt(1);

    let s = BigInt(4);
    
    // (x**2 - 2)**2 - 2 = x**4 + 4 - 4 * x**2 - 2 = x**4 - 4 * x**2 + 2 

    for (let i = 3; i <= p; i+=1) {
        //if (s > 10**8) 
          //  s = (gaussMultiplication(s.toString(), s.toString()) - BigInt(2)) % mersenneNumber;
        //else
            //s = (s**BigInt(4) - BigInt(4) * s**BigInt(2) + BigInt(2)) % mersenneNumber
            s = (s**BigInt(2) - BigInt(2)) % mersenneNumber
        
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("LL: Tested " + percent(BigInt(i), BigInt(p)) + " in " + duration(getTimeMicro() - start) +  " " + p +  "               ")
        
    }

    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("LL: Tested 100.000% in " + duration(getTimeMicro() - start) +  " " + p +  "               \n")

    return s % mersenneNumber === BigInt(0)
}

function karatsubaMultiplication(a: string, b: string): bigint {
    const len = Math.max(a.length, b.length);

    if (len <= 6) {
        return BigInt(a) * BigInt(b);
    }

    const half = Math.floor(len / 2);
    const aHigh = a.slice(0, -half);
    const aLow = a.slice(-half);
    const bHigh = b.slice(0, -half);
    const bLow = b.slice(-half);

    const z0 = karatsubaMultiplication(aLow, bLow);
    const z2 = karatsubaMultiplication(aHigh, bHigh);

    const aSum = (BigInt(aLow) + BigInt(aHigh)).toString();
    const bSum = (BigInt(bLow) + BigInt(bHigh)).toString();

    const z1 = karatsubaMultiplication(aSum, bSum) - z2 - z0;

    return BigInt(z2) * BigInt(10) ** BigInt(2 * half) + BigInt(z1) * BigInt(10) ** BigInt(half) + BigInt(z0);
}

function gaussMultiplication(a: string, b: string): bigint {
    const len = Math.max(a.length, b.length);

    if (len <= 6) {
        return BigInt(a) * BigInt(b);
    }

    const half = Math.floor(len / 2);
    const aHigh = a.slice(0, -half);
    const aLow = a.slice(-half);
    const bHigh = b.slice(0, -half);
    const bLow = b.slice(-half);

    const z0 = gaussMultiplication(aLow, bLow);
    const z1 = gaussMultiplication((BigInt(aLow) + BigInt(aHigh)).toString(), (BigInt(bLow) + BigInt(bHigh)).toString());
    const z2 = gaussMultiplication(aHigh, bHigh);

    const p = (BigInt(z1) - BigInt(z2) - BigInt(z0)).toString();
    
    return BigInt(z2) * BigInt(10) ** BigInt(2 * half) + BigInt(p) * BigInt(10) ** BigInt(half) + BigInt(z0);
}


  
export { lucasLehmerTest }