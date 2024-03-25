import { children, pitagoreanTriple } from "./pitagoreanTree"

export default (n: BigInt) => {
    const start = Date.now();

    const x = n.toString(3)


    const initialFibonacciSquare: BigInt[][] = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]

    let currentFS = [...initialFibonacciSquare]

    for (var i=x.length-1;i>=0;i--) {
        const nextSquares = children(currentFS) 
        currentFS = nextSquares[parseInt(x[i])]
    }

    return {path: x.split("").reverse().join(""), triple: pitagoreanTriple(currentFS), square: currentFS, time: Date.now()-start}


}