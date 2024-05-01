import percent from './percent';
import duration from './duration';
import getTimeMicro from './getTimeMicro';

// Function to perform the Lucas-Lehmer test
function lucasLehmerTest(p: number) {
    const start = getTimeMicro()
    
    if (p === 2) return true; // 2^2 - 1 = 3 is prime

    if (p <= 1 || p % 2 === 0) return false; // Mersenne number for p <= 1 or even p is not prime

    const mersenneNumber = BigInt(2) ** BigInt(p) - BigInt(1);
    let s = BigInt(4);
    for (let i = 3; i <= p; i++) {
        s = (multiply(s.toString(), s.toString()) - BigInt(2)) % mersenneNumber;
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("LL: Tested " + percent(BigInt(i), BigInt(p)) + " in " + duration(getTimeMicro() - start)+  "               ")
    }

    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("LL: Tested 100.000% in " + duration(getTimeMicro() - start)+  "               \n")
    
    return s % mersenneNumber === BigInt(0)
}

function multiply(a: string, b: string): bigint {
    const len = Math.max(a.length, b.length);

    if (len <= 3) {
        return BigInt(parseInt(a) * parseInt(b));
    }

    const half = Math.floor(len / 2);
    const aHigh = a.slice(0, -half);
    const aLow = a.slice(-half);
    const bHigh = b.slice(0, -half);
    const bLow = b.slice(-half);

    const z0 = multiply(aLow, bLow);
    const z1 = multiply((BigInt(aLow) + BigInt(aHigh)).toString(), (BigInt(bLow) + BigInt(bHigh)).toString());
    const z2 = multiply(aHigh, bHigh);

    const p = (BigInt(z1) - BigInt(z2) - BigInt(z0)).toString();

    return BigInt(z2) * BigInt(10 ** (2 * half)) + BigInt(p) * BigInt(10 ** half) + BigInt(z0);
}
  
export { lucasLehmerTest }