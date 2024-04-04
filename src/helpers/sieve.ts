import Bits from "./Bits";

export default (lastNumber: number) => {
    
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
          if (sieve.get((i -1) / 2) === 0) {
              for (var j = i*i; j <= lastNumber; j += 2*i) {
                  sieve.set((j-1)/2, 1);
              }
          }
      }
      return sieve;
  } catch (e) {
    const error = "sieve(" + lastNumber + "), " + e.toString().replaceAll("Error: ", "");
    console.log(error)
    throw new Error(error);
  }

    
}