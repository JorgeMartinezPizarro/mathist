import Bits from "./Bits";

// Enhanced eratosthenes sieve starting with only odd numbers
// it works for 100m in 500ms, for 1b in 8s, 4b in 32s, 8b 1m, 100b in 44m.
// beyond it, there is no way to allocate the sieve in RAM
export default function sieve(lastNumber: number) {
    
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
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    const text = "sieve(" + lastNumber + "), " + message.toString().replaceAll("Error: ", "");
    console.log(text)
    throw new Error(text);
  }

}