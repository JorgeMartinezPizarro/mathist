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
        s = BigInt(magmaSquare(s.toString())) - BigInt(2) & mersenneNumber
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("LL: Tested " + percent(BigInt(i), BigInt(p)) + " in " + duration(getTimeMicro() - start) +  " " + p +  "               ")
    }
    
    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("LL: Tested 100.000% in " + duration(getTimeMicro() - start) +  " " + p +  "               \n")

    return s === BigInt(0)
}

// Function to pad a string with leading zeros
function padZeros(str: string, length: number): string {
    return '0'.repeat(Math.max(0, length - str.length)) + str;
}

// Function to split a string into two halves
function splitHalf(str: string): [string, string] {
    const half = Math.ceil(str.length / 2);
    return [str.slice(0, half), str.slice(half)];
}

// Function to add two strings representing numbers
function add(a: string, b: string): string {
    let carry = 0;
    let result = '';
    const maxLength = Math.max(a.length, b.length);
    a = padZeros(a, maxLength);
    b = padZeros(b, maxLength);

    for (let i = maxLength - 1; i >= 0; i--) {
        const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (sum % 10).toString() + result;
        carry = Math.floor(sum / 10);
    }

    if (carry > 0) {
        result = carry.toString() + result;
    }

    return result;
}

// Function to subtract two strings representing numbers
function subtract(a: string, b: string): string {
    let borrow = 0;
    let result = '';
    const maxLength = Math.max(a.length, b.length);
    a = padZeros(a, maxLength);
    b = padZeros(b, maxLength);

    for (let i = maxLength - 1; i >= 0; i--) {
        let diff = parseInt(a[i]) - parseInt(b[i]) - borrow;
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        result = diff.toString() + result;
    }

    return result.replace(/^0+/, '');
}

// Function to multiply two strings representing numbers
function multiply(a: string, b: string): string {
    if (a.length === 0 || b.length === 0) {
        return '0';
    }

    const maxLength = Math.max(a.length, b.length);
    a = padZeros(a, maxLength);
    b = padZeros(b, maxLength);

    if (maxLength === 1) {
        return (parseInt(a) * parseInt(b)).toString();
    }

    const half = Math.ceil(maxLength / 2);
    const [aHigh, aLow] = splitHalf(a);
    const [bHigh, bLow] = splitHalf(b);

    const z0 = multiply(aLow, bLow);
    const z1 = multiply(add(aHigh, aLow), add(bHigh, bLow));
    const z2 = multiply(aHigh, bHigh);

    const step1 = z2 + '0'.repeat(maxLength);
    const step2 = subtract(subtract(z1, z2), z0) + '0'.repeat(half);
    const result = add(add(step1, step2), z0);

    return result;
}

// Function to square a large number using the Magma squaring algorithm
function magmaSquare(x: string): string {
    return multiply(x, x);
}


export { lucasLehmerTest }
