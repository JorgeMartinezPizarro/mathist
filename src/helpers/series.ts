import eratostenes from "./eratostenes";

export default (LIMIT: number, name: string) => {
let array: number[] = [];
  let aux: number[];
  
  if (name === "primes") {
    const int = Math.floor(10 * LIMIT / Math.log(LIMIT))
    
    aux = eratostenes(int**2).primes
  }
  
  for (var i=0;i<LIMIT;i++) {

    if (name === "integers") {
      array.push(i)
    }
    else if (name === "squares") {
      array.push(i**2)
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
    else {
      array.push(1)
    }
  }

  return array;
}