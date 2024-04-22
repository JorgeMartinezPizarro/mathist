import Bits from "@/helpers/Bits";
import errorMessage from "@/helpers/errorMessage";
import percent from "@/helpers/percent";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";

// Enhanced eratosthenes sieve with odd numbers
//
// Tested with values:
//
//  amount  time  RAM
//  =====   ===== ====
//
//  100m    500ms  5MB 
//  1b      10s    64MB
//  10b     3m     640MB
//  100b    50m    6GB 
//  1t      36h    58GB
//
// If your node has no enough memory it will throw an error.
//
// Posible improvements: 
//
// Remove times 3
//
//   5/6 = 82%
//
// Remove times 3, 5 and 7
//
//   5/6 * 29/30 * 209/210 = 80%
//
// Conclusion: do not worth to go beyond
// Beyond 1t it is worth to use segmentedEratostenes instead.


export default function sieve(lastNumber: number): Bits {
    
  const startx = getTimeMicro()
  if (lastNumber === 2) {
    return new Bits(0)
  }

  try { 
      // Initialization
      const memorySize = Math.round(lastNumber / 2);
      const upperLimit = Math.round(Math.sqrt(lastNumber));
      const sieve = new Bits(memorySize);
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("CS: Sieved   0.000% in " + duration(getTimeMicro() - startx) + "        ")     
      // Hard process crossing all odd composite numbers
      for (var i = 3; i <= upperLimit; i += 2) {
        if (sieve.get((i -1) / 2) === false) {
          for (var j = i * i; j <= lastNumber; j += 2 * i) {
            sieve.set((j - 1) / 2, true);
          }
        }
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("CS: Sieved " + percent(BigInt(Math.round(i)), BigInt(Math.round(upperLimit))) + " in " + duration(getTimeMicro() - startx) + "        ")
      }

      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("CS: Sieved 100.000% in " + duration(getTimeMicro() - startx) + "              \n")

      return sieve;
  } catch (error) {
    const text = "sieve(" + lastNumber + "), " + errorMessage(error);
    console.log(text)
    throw new Error(text);
  }
}
