import Bits from "@/helpers/Bits";
import errorMessage from "@/helpers/errorMessage";

// Enhanced eratosthenes sieve with odd numbers
//
// Tested with values:
//
//  amount  time  RAM
//  =====   ===== ====
//
//  100m    500ms 5MB 
//  1b      10s   64MB
//  100b    50m   6GB 
//  500b    10h   30GB
//
// Beyond 535b it will throw an error.
// If your node has no enough memory it will throw an error earlier.
//
// Remove odds memory usage
//
//   1/2 = 50%
//
// Remove evens, times 3
//
//   1/2 * 5/6 = 41%
//
// Remove evens, times 3, 5 and 7
//
//   1/2 * 5/6 * 29/30 * 209/210 = 40%
//
// Conclusion: do not worth

export default function sieve(lastNumber: number): Bits {
    
  if (lastNumber === 2) {
    return new Bits(0)
  }

  try {
      // Initialization
      const memorySize = Math.round(lastNumber / 2);
      const sieve = new Bits(memorySize);
      const upperLimit = Math.round(Math.sqrt(lastNumber));
      
      // Hard process crossing all odd composite numbers
      for (var i = 3; i <= upperLimit; i += 2) {
          if (sieve.get((i -1) / 2) === false) {
              for (var j = i*i; j <= lastNumber; j += 2*i) {
                  sieve.set((j-1)/2, true);
              }
          }
      }

      return sieve;
  } catch (error) {
    const text = "sieve(" + lastNumber + "), " + errorMessage(error);
    console.log(text)
    throw new Error(text);
  }
}
