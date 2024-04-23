import { BitView } from "@/helpers/Bits";
import errorMessage from "@/helpers/errorMessage";
import percent from "@/helpers/percent";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";

// Return the enhanced eratosthenes sieve (CS) with odd numbers
//
// Tested with values:
//
//  amount  time  RAM
//  ======  ===== ===
//
//  10**8   500ms  5MB 
//  10**9   10s    64MB
//
// It works up to 10**9. Further use segmentation sieve.
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
// Beyond 1t it is worth to use segmentedEratosthenes instead.


export default function sieve(lastNumber: number): BitView {
    
  const startx = getTimeMicro()
  if (lastNumber === 2) {
    return new BitView(0)
  }

  try { 
      // Initialization
      const memorySize = Math.round(lastNumber / 2);
      const upperLimit = Math.round(Math.sqrt(lastNumber));
      const sieve: BitView = new BitView(memorySize);
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("CS: Sieved   0.000% in " + duration(getTimeMicro() - startx) + "        ")     
      // Hard process crossing all odd composite numbers
      for (var i = 3; i <= upperLimit; i += 2) {
        if (sieve.getBit((i -1) / 2) === 0) {
          for (var j = i * i; j <= lastNumber; j += 2 * i) {
            sieve.setBit((j - 1) / 2, true);
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
