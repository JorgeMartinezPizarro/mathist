import Bits from "@/helpers/Bits"
import getTimeMicro from "@/helpers/getTimeMicro";

export default (LIMIT: number) => {
    return eratosthenes(LIMIT)
}

function eratosthenes(lastNumber: number) {
  const start = getTimeMicro()
  if (lastNumber < 0) 
      throw new Error("Cannot get the sieve of negative numbers")
  if (lastNumber <= 1) 
      return {primes: [], time: 0}

  let upperLimit = Math.round(Math.sqrt(lastNumber))
  var memorySize = (lastNumber - 1)/2;
  const found = [2];
  
  var isPrime = new Bits(memorySize);
  
  for (var i = 3; i <= upperLimit; i += 2)
    if (isPrime.get(i / 2) === 0)
      for (var j = i*i; j <= lastNumber; j += 2*i)
        isPrime.set(j / 2, 1)
  
  for (var i = 1; i <= memorySize; i++)
    if (isPrime.get(i) === 0)
      found.push(i*2+1)
    
  return {primes: found, time: getTimeMicro() - start};
}