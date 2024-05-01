import percent from './percent';
import duration from './duration';
import getTimeMicro from './getTimeMicro';

class Complex {
    constructor(public real: number, public imag: number) {}

    add(other: Complex): Complex {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    subtract(other: Complex): Complex {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    multiply(other: Complex): Complex {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }
}

function fft(x: Complex[], inverse: boolean = false): Complex[] {
    const n = x.length;
    if (n <= 1) return x;

    const even = fft(x.filter((_, i) => i % 2 === 0), inverse);
    const odd = fft(x.filter((_, i) => i % 2 !== 0), inverse);

    const twiddleFactors = Array.from({ length: n }, (_, k) => {
        const angle = (inverse ? 2 : -2) * Math.PI * k / n;
        return new Complex(Math.cos(angle), Math.sin(angle));
    });

    const result: Complex[] = [];
    for (let k = 0; k < n / 2; k++) {
        const t = twiddleFactors[k].multiply(odd[k]);
        result[k] = even[k].add(t);
        result[k + n / 2] = even[k].subtract(t);
    }

    return result;
}

function convolution(x: Complex[], y: Complex[]): Complex[] {
    const n = Math.max(x.length, y.length);
    const m = 1 << Math.ceil(Math.log2(n) + 1);

    const paddedX = x.concat(Array(m - x.length).fill(new Complex(0, 0)));
    const paddedY = y.concat(Array(m - y.length).fill(new Complex(0, 0)));

    const fftX = fft(paddedX);
    const fftY = fft(paddedY);

    const fftResult = fftX.map((value, index) => value.multiply(fftY[index]));
    const inverseResult = fft(fftResult, true).map(value => new Complex(value.real / m, value.imag / m));

    return inverseResult;
}

function multiplyBigInts(a: bigint, b: bigint): bigint {
    const aStr = a.toString();
    const bStr = b.toString();

    const n = Math.max(aStr.length, bStr.length);
    const m = 1 << Math.ceil(Math.log2(n) + 1);

    const x = aStr.split('').map(Number).reverse().map(num => new Complex(num, 0));
    const y = bStr.split('').map(Number).reverse().map(num => new Complex(num, 0));

    const result = convolution(x, y).map(value => Math.round(value.real));

    let carry = 0n;
    let resStr = '';
    for (let i = 0; i < result.length; i++) {
        let temp = BigInt(result[i]) + carry;
        carry = temp / 10n;
        temp %= 10n;
        resStr = temp.toString() + resStr;
    }

    return BigInt(resStr);
}

// Function to perform the Lucas-Lehmer test
function lucasLehmerTest(p: number) {
    const start = getTimeMicro()
    
    if (p === 2) return true; // 2^2 - 1 = 3 is prime

    if (p <= 1 || p % 2 === 0) return false; // Mersenne number for p <= 1 or even p is not prime

    const mersenneNumber = BigInt(2) ** BigInt(p) - 1n;
    let s = 4n;
    for (let i = 3; i <= p; i++) {
        s = (multiply(s.toString(), s.toString()) - 2n) % mersenneNumber;
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("LL: Tested " + percent(BigInt(i), BigInt(p)) + " in " + duration(getTimeMicro() - start)+  "               ")
    }

    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("LL: Tested 100.000% in " + duration(getTimeMicro() - start)+  "               \n")
    
    if (s % mersenneNumber === 0n) return true;
    
    return false;
}

function multiply(a: string, b: string): bigint {
    const len = Math.max(a.length, b.length);

    if (len <= 3) {
        return (parseInt(a) * parseInt(b)).toString();
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