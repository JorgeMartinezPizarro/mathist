import { children, pitagoreanTriple } from "./pitagoreanTree"

export default (n: number) => {
    const start = Date.now();

    const x = n.toString(3)


    const initialFibonacciSquare = [[1,1],[3,2]]

    let currentFS = [...initialFibonacciSquare]

    for (var i=x.length-1;i>=0;i--) {
        const nextSquares = children(currentFS) 
        currentFS = nextSquares[parseInt(x[i])]
    }


    return {path: x.split("").reverse().join(""), triple: pitagoreanTriple(currentFS), square: currentFS, time: Date.now()-start}


}