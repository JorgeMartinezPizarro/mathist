import percent from './percent';
import duration from './duration';
import getTimeMicro from './getTimeMicro';

// TODO: add the logic here to test faster PRP before https://github.com/preda/gpuowl
// Function to perform the Lucas-Lehmer test
function lucasLehmerTest(p: number) {
    console.log("Start lucas lehmer test for p = " + p)
    const start = getTimeMicro()
    
    if (p === 2 || p === 3) return true; // 2^2 - 1 = 3 is prime, 2^3-1 = 7 is also prime

    if (p <= 1 || p % 2 === 0) return false; // Mersenne number for p <= 1 or even p is not prime

    const mersenneNumber: bigint = (BigInt(1) << BigInt(p)) - BigInt(1);

    let s = BigInt(4);
    
    for (let i = 3; i <= p; i+=1) {
        s = (s ** BigInt(2) - BigInt(2)) % mersenneNumber
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("LL: Tested " + percent(BigInt(i), BigInt(p)) + " in " + duration(getTimeMicro() - start) +  " " + p +  "               ")
    }
    
    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("LL: Tested 100.000% in " + duration(getTimeMicro() - start) +  " " + p +  "               \n")

    return s === BigInt(0)
}

export { lucasLehmerTest }
