function karatsuba(x, y) {
    const n = Math.max(x.toString().length, y.toString().length);
    if (n <= 50) {
        return BigInt(x) * BigInt(y);
    }
  
    const m = Math.floor(n / 2);
    const [x1, x0] = splitAt(x, m);
    const [y1, y0] = splitAt(y, m);
  
    const z2 = karatsuba(x1, y1);
    const z0 = karatsuba(x0, y0);
    const z1 = karatsuba(x1 + x0, y1 + y0) - z2 - z0;
  
    return (z2 * BigInt(10) ** (BigInt(2) * BigInt(m))) + (z1 * BigInt(10) ** BigInt(m)) + z0;
  }
  
  function splitAt(num, m) {
    const numStr = num.toString();
    const len = numStr.length;
    const high = numStr.slice(0, len - m) || "0";
    const low = numStr.slice(len - m) || "0";
    return [BigInt(high), BigInt(low)];
  }

  export { karatsuba }