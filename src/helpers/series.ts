import { isInteger } from "mathjs";

import eratostenes from "@/helpers/eratostenes";
import factorial from "@/helpers/factorial";

export default function series(LIMIT: number, name: string): bigint[] {
  let array: bigint[] = [];
  let aux: number[] = [];
  
  if (name === "factorial"
   || name === "integer"
   || name === "square" 
   || name === "cube"
   || name === "triangular"
   || name === "penthagonal"
   || name === "hexagonal"
   || name === "exponential"
   || name === "prime"
   || name === "fibonacci"
   || name === "luca") {

   } else {
    throw new Error("Invalid name " + name)
   }

   if (isNaN(LIMIT) || !isInteger(LIMIT)) {
    throw new Error("Invalid length " + LIMIT)
   }

  if (name === "prime") {
    const int = Math.floor( 2 * LIMIT * Math.log(LIMIT))
    aux = eratostenes(int, int).primes.map(p => parseInt(p.toString()))
  }
  
  for (var i=0;i<LIMIT;i++) {

    if (name === "factorial") {
      array.push(factorial(i))
    }
    else if (name === "integer") {
      array.push(BigInt(i))
    }
    else if (name === "square") {
      array.push(BigInt(i**2))
    }
    else if (name === "cube") {
      array.push(BigInt(i**3))
    }
    else if (name === "triangular") {
      array.push(BigInt(i*(i+1)/2))
    }
    else if (name === "penthagonal") {
      array.push(BigInt(i*(3 * i -1)/2))
    }
    else if (name === "hexagonal") {
      array.push(BigInt(2 * i*(2 * i -1)/2))
    }
    else if (name === "exponential") {
      array.push(BigInt(2**i))
    }
    else if (name === "prime") {
      array.push(BigInt(aux[i]))
    }
    else if (name === "fibonacci") {
      if (i===0 || i===1)
        array.push(BigInt(1))
      else 
        array.push(BigInt(array[i-1].toString()) + BigInt(array[i-2].toString()))
    }
    else if (name === "luca") {
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