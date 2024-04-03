import Bits from "./Bits";
import { MAX_LENGTH_FOR_SIEVE_HEALTY } from "./Constants";

export default (lastNumber: number) => {
  
    // MAX_LENGTH_FOR_SIEVE_HEALTY takes 20 seconds and 516MB, enough for the web 
    if (lastNumber > MAX_LENGTH_FOR_SIEVE_HEALTY) { 
      throw new Error("Max length " + MAX_LENGTH_FOR_SIEVE_HEALTY+ " < provided length " + lastNumber)
    }
  
    try {
        
        // Initialization
        const memorySize = Math.round(lastNumber / 2);
        const sieve = new Bits(memorySize);
        const upperLimit = Math.round(Math.sqrt(lastNumber))
      
        // Hard process crossing all odd composite numbers
        for (var i = 3; i <= upperLimit; i += 2) {
            if (sieve.get((i -1) / 2) === 0) {
                for (var j = i*i; j <= lastNumber; j += 2*i) {
                    sieve.set((j-1)/2, 1)
                }
            }
        }
  
      return sieve;
    } catch (e) {
      throw new Error("Error getting sieve(" + lastNumber + "), " + e.toString().replaceAll("Error: ", ""))
    }
  }