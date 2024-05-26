import FFT from 'fft.js'

// Helper function to perform FFT
function fftTransform(array) {
  const fft = new FFT(array.length);
  const out = fft.createComplexArray();
  const data = fft.toComplexArray(array);
  fft.transform(out, data);
  return out;
}

// Helper function to perform inverse FFT
function ifftTransform(array) {
  const fft = new FFT(array.length);
  const out = fft.createComplexArray();
  fft.inverseTransform(out, array);
  return fft.fromComplexArray(out);
}

function bigintToArray(bigint, base) {
    const result = [];
    let current = bigint;
    while (current > 0) {
      result.push(Number(current % BigInt(base)));
      current = current / BigInt(base);
    }
    return result;
  }

  function multiplyPolynomials(a, b) {
    const n = 1 << Math.ceil(Math.log2(a.length + b.length));
    const A = new Array(n).fill(0);
    const B = new Array(n).fill(0);
  
    for (let i = 0; i < a.length; i++) A[i] = a[i];
    for (let i = 0; i < b.length; i++) B[i] = b[i];
  
    const Afft = fftTransform(A);
    const Bfft = fftTransform(B);
    const Cfft = new Array(n);
  
    for (let i = 0; i < n; i++) {
      Cfft[i] = [
        Afft[i][0] * Bfft[i][0] - Afft[i][1] * Bfft[i][1],
        Afft[i][0] * Bfft[i][1] + Afft[i][1] * Bfft[i][0]
      ];
    }
  
    const C = ifftTransform(Cfft);
    return C.map((x) => Math.round(x[0]));
  }

  function arrayToBigint(array, base) {
    let carry = 0n;
    let result = 0n;
    let baseBigInt = BigInt(base);
    
    for (let i = 0; i < array.length; i++) {
      let value = BigInt(array[i]) + carry;
      carry = value / baseBigInt;
      result += (value % baseBigInt) * (baseBigInt ** BigInt(i));
    }
  
    return result;
  }

  function ssTimes(a, b) {
    const base = 1 << 16;  // Using 2^16 as the base for splitting
    const aArray = bigintToArray(a, base);
    const bArray = bigintToArray(b, base);
    const productArray = multiplyPolynomials(aArray, bArray);
    return arrayToBigint(productArray, base);
  }
  
export { ssTimes }
