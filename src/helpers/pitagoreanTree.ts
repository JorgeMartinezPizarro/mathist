export default (n: number) => {
    
    const start = Date.now()
    const initialFibonacciSquare = [[1,1],[3,2]]

    let arrayOfSquares: number[][][] = [initialFibonacciSquare]

    for (var i=0; i<n; i++) {
        arrayOfSquares = [...arrayOfSquares, ...iterate(arrayOfSquares.slice(-(3**i)))]
    }

    const result = arrayOfSquares.map(square => pitagoreanTriple(square))
    

    let array = []
    
    for (var i = 0; i<n; i++) {

        const sum = (3**i-1) / 2
        
        const x = result.slice(sum, sum + 3**i)

        
        
        array.push(x)
    }

    console.log(array)

    return {triples: array, time: Date.now() - start};
}

const iterate = (arrayOfSquares: number[][][]): number[][][] => {

    let nextArrayOfSquares = new Array;
    
    for (var i=0; i<arrayOfSquares.length;i++) {
        nextArrayOfSquares = [...nextArrayOfSquares, ...children(arrayOfSquares[i])]
    }

    return nextArrayOfSquares;
}

export const pitagoreanTriple = (fibonacciSquare: number[][]): number[] => {
    const triple = [
        (fibonacciSquare[0][0] * fibonacciSquare[1][0]), 
        (fibonacciSquare[0][1] * fibonacciSquare[1][1]) * 2, 
        (fibonacciSquare[0][0] * fibonacciSquare[1][1]) + (fibonacciSquare[0][1] * fibonacciSquare[1][0]),
        
    ]

    if (triple[0] > Number.MAX_SAFE_INTEGER || triple[1] > Number.MAX_SAFE_INTEGER || triple[2] > Number.MAX_SAFE_INTEGER)
        throw new Error("WTF an invalid triple!")
    if (triple[0] ** 2 + triple[1]**2 - triple[2]**2 !== 0 || gcd_more_than_two_numbers(triple) > 1) 
      throw new Error("WTF an invalid triple!")
    
    return triple;
}

export const children = (fibonnaciSquare: number[][]): number[][][] => {
    
    const childOne = [
        [
            fibonnaciSquare[1][0], fibonnaciSquare[0][1]
        ],
        [
            fibonnaciSquare[1][0] + fibonnaciSquare[0][1] + fibonnaciSquare[0][1], fibonnaciSquare[1][0]+fibonnaciSquare[0][1]
        ]
    ];
    
    const childTwo = [
        [
            fibonnaciSquare[1][0], fibonnaciSquare[1][1]
        ],
        [
            fibonnaciSquare[1][0] + fibonnaciSquare[1][1] + fibonnaciSquare[1][1], fibonnaciSquare[1][0] + fibonnaciSquare[1][1]
        ]
    ];
    
    const childThree = [
        [
            fibonnaciSquare[0][0], fibonnaciSquare[1][1]
        ],
        [
            fibonnaciSquare[0][0] + fibonnaciSquare[1][1] + fibonnaciSquare[1][1], fibonnaciSquare[0][0] + fibonnaciSquare[1][1]
        ]
    ];

    return [childOne, childTwo, childThree]
}

function gcd (a: number, b: number): number {
    if(b == 0){
        return a;
    }
    return gcd(b, a%b);
}
function gcd_more_than_two_numbers (a: number[]): number {
  return a.reduce(gcd)
}