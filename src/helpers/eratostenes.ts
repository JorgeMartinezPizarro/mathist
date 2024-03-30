import Bits from "@/helpers/Bits"
import getTimeMicro from "@/helpers/getTimeMicro";

export default (LIMIT: number, amount: number, split: boolean) => {
  if (split) {
      const found = eratosthenes(LIMIT, amount).primes
      const rows = 1048576
      const columns = 16384
      const a: [][] = []
      let b: [] = []
      for (var i = 0; i<found.length;i++) {
          b.push(found[i])
          if (b.length === columns || i===found.length-1) {
              a.push(b)
              b = []
              if (a.length === rows) {
                break;
              }
          }
      }
      return a
  } 
  return eratosthenes(LIMIT, amount)
}

// enhanced eratosthenes sieve starting with only odd numbers
// it works for 100m in 500ms, for 1b in 8 seconds, found no faster way in the internet.
// it would work for up to 8b but it takes 1 minute
// with over 2.2b it generates false primes, need to review why.
function eratosthenes(lastNumber: number, amount: number) {
  let start = getTimeMicro()
  
  if (lastNumber > 2**31)
    throw new Error("Cannot allocate that much memory, " + 2**31 + " is the max number allowed")
  
  if (lastNumber < 0) 
      throw new Error("Cannot get the sieve of negative numbers")

  if (lastNumber <= 1) 
      return {primes: [], time: 0}

  let upperLimit = Math.round(Math.sqrt(lastNumber))
  var memorySize = (lastNumber - 1)/2;
  let found = [2]
    
  var isPrime = new Bits(memorySize);
  
  for (var i = 3; i <= upperLimit; i += 2)
    if (isPrime.get(i / 2) === 0)
      for (var j = i*i; j <= lastNumber; j += 2*i)
        isPrime.set(j / 2, 1)
  
  for (var i = 1; i <=memorySize; i++)
    if (isPrime.get(i) === 0) {
      found.push(i*2+1)
    }
  
    start = getTimeMicro() - start
      
  return {primes: found.slice(-amount), time: start, length: found.length};
}