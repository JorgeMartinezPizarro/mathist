

export default (n: BigInt) => {
    
    const start = Date.now()
    
    const initialFibonacciSquare = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]

    let arrayOfSquares: BigInt[][][] = [initialFibonacciSquare]

    for (var i =0; i<parseInt(n.toString()); i++) {
        arrayOfSquares = [...arrayOfSquares, ...iterate(arrayOfSquares.slice(-(3**i)))]
        
    }

    const result = arrayOfSquares.map(square => {
        return {
            triple: pitagoreanTriple(square),
            square,
        }
    })
    

    let array: BigInt[] = []

    for (var i:BigInt = BigInt(0); i<n; i++) {

        const sum = (BigInt(3)**BigInt(i)-BigInt(1)) / BigInt(2)
        
        const x: BigInt = result.slice(parseInt(sum), parseInt(sum + BigInt(3)**i))
        array.push(x)
    }

    return {tree: array, time: Date.now() - start};
}

const iterate = (arrayOfSquares: BigInt[][][]): BigInt[][][] => {

    let nextArrayOfSquares: BigInt[][][] = new Array;
    
    for (var i=0; i<arrayOfSquares.length;i++) {
        nextArrayOfSquares = [...nextArrayOfSquares, ...children(arrayOfSquares[i])]
    }

    return nextArrayOfSquares;
}

export const pitagoreanTriple = (fibonacciSquare: BigInt[][]): BigInt[] => {

    const triple: BitInt[] = [
        (fibonacciSquare[0][0] * fibonacciSquare[1][0]), 
        (fibonacciSquare[0][1] * fibonacciSquare[1][1]) * BigInt(2), 
        (fibonacciSquare[0][0] * fibonacciSquare[1][1]) + (fibonacciSquare[0][1] * fibonacciSquare[1][0]),
        
    ]

    if (
        triple[0] ** BigInt(2) + triple[1]** BigInt(2) - triple[2]** BigInt(2) !== BigInt(0) //|| 
        //gcd_more_than_two_numbers(triple) > BigInt(1) Checking it for reeeeally big values turns into infinite loops according with js ...
    ) 
      return [BigInt(0), BigInt(0), BigInt(0)]
   
    return triple;
}

export const children = (fibonnaciSquare: BigInt[][]): BigInt[][][] => {
    
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

function gcd (a: BigInt, b: BigInt): BigInt {
    if(b == BigInt(0)){
        return a;
    }
    return gcd(b, a%b);
}
function gcd_more_than_two_numbers (a: BigInt[]): BigInt {
  return a.reduce(gcd)
}