import eratostenes from "./eratostenes";
import factorial from "./factorial";

export default (LIMIT: number, name: string) => {
let array: number[] = [];
  let aux: number[];
  
  if (name === "primes") {
    const int = Math.floor(10 * LIMIT / Math.log(LIMIT))
    
    aux = eratostenes(int**2).primes
  }
  
  for (var i=0;i<LIMIT;i++) {

    if (name === "factorials") {
      array.push(factorial(i))
    }
    else if (name === "integers") {
      array.push(i)
    }
    else if (name === "squares") {
      array.push(i**2)
    }
    else if (name === "cubes") {
      array.push(i**3)
    }
    else if (name === "triangulars") {
      array.push(i*(i+1)/2)
    }
    else if (name === "penthagonals") {
      array.push(i*(3 * i -1)/2)
    }
    else if (name === "hexagonals") {
      array.push(2 * i*(2 * i -1)/2)
    }
    else if (name === "exponentials") {
      array.push(2**i)
    }
    else if (name === "primes") {
      array.push(aux[i])
    }
    else if (name === "fibonacci") {
      if (i===0 || i===1)
        array.push(1)
      else
        array.push(array[i-1] + array[i-2])
    }
    else if (name === "lucas") {
      if (i === 0) array.push(2)
      else if (i === 1) array.push(1)
      else array.push(array[i-1] + array[i-2])
    }
    else {
      throw new Error("The serie " + name + " does not exist!")
    }
  }

  return array;
}