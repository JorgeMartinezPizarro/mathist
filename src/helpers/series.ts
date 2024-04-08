import eratostenes from "./eratostenes";
import factorial from "./factorial";

export default function series(LIMIT: number, name: string): BigInt[] {
  let array: BigInt[] = [];
  let aux: number[] = [];
  
  if (name === "primes") {
    const int = Math.floor( 2 * LIMIT * Math.log(LIMIT))
    aux = eratostenes(int, int).primes
  }
  
  for (var i=0;i<LIMIT;i++) {

    if (name === "factorials") {
      array.push(factorial(i))
    }
    else if (name === "integers") {
      array.push(BigInt(i))
    }
    else if (name === "squares") {
      array.push(BigInt(i**2))
    }
    else if (name === "cubes") {
      array.push(BigInt(i**3))
    }
    else if (name === "triangulars") {
      array.push(BigInt(i*(i+1)/2))
    }
    else if (name === "penthagonals") {
      array.push(BigInt(i*(3 * i -1)/2))
    }
    else if (name === "hexagonals") {
      array.push(BigInt(2 * i*(2 * i -1)/2))
    }
    else if (name === "exponentials") {
      array.push(BigInt(2**i))
    }
    else if (name === "primes") {
      array.push(BigInt(aux[i]))
    }
    else if (name === "fibonacci") {
      if (i===0 || i===1)
        array.push(BigInt(1))
      else 
        array.push(BigInt(array[i-1].toString()) + BigInt(array[i-2].toString()))
    }
    else if (name === "lucas") {
      if (i === 0)
        array.push(BigInt(2))
      else if (i === 1) 
        array.push(BigInt(1))
      else 
        array.push(BigInt(array[i-1].toString()) + BigInt(array[i-2].toString()))
    }
    else {
      throw new Error("The serie " + name + " does not exist!")
    }
  }

  return array;
}