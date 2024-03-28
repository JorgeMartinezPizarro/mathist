
import bigIntGCD from "bigint-gcd"
import { setIsSubset } from "mathjs"
import getTimeMicro from "./getTimeMicro"

export default (n: BigInt) => {
    
    
    const start = getTimeMicro()
    
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

    return {tree: array, time: getTimeMicro() - start};
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
    
    // for fibonacci-like square 1 1 1/3 and 1/2 are irreducible fractions, lets check it!
    //                           3 2 
    if (bigIntGCD(fibonacciSquare[0][0], fibonacciSquare[1][0]) > BigInt(1) || 
        bigIntGCD(fibonacciSquare[0][1], fibonacciSquare[1][1]) > BigInt(1)
    ) 
        throw new Error("The square is wrong, the fractions generated are not irreducible!")
    // The pithagorean triple must verify the pithagorean formel, a**2 + b**2 - c**2 =0
    if (
        triple[0] ** BigInt(2) + triple[1]** BigInt(2) - triple[2]** BigInt(2) !== BigInt(0) 
    ) 
        throw new Error("The triple does not satisfy the pithagorean theorem!")
    // The triple should be irreducible, let's check it!
    if (bigIntGCD(triple[0], bigIntGCD(triple[1], triple[2])) > BigInt(1)) 
        throw new Error("The triple is not irreducible!")
   
    return triple;
}

export const childrenAt = (fibonnaciSquare: BigInt[][], i: number): BigInt[][] => {
    
    if (i === 0)
        return [
            [
                fibonnaciSquare[1][0], fibonnaciSquare[0][1]
            ],
            [
                fibonnaciSquare[1][0] + fibonnaciSquare[0][1] + fibonnaciSquare[0][1], fibonnaciSquare[1][0]+fibonnaciSquare[0][1]
            ]
        ];
    
    else if (i==1) 
        return [
            [
                fibonnaciSquare[1][0], fibonnaciSquare[1][1]
            ],
            [
                fibonnaciSquare[1][0] + fibonnaciSquare[1][1] + fibonnaciSquare[1][1], fibonnaciSquare[1][0] + fibonnaciSquare[1][1]
            ]
        ];
    
    else if (i==2) 
        return [
            [
                fibonnaciSquare[0][0], fibonnaciSquare[1][1]
            ],
            [
                fibonnaciSquare[0][0] + fibonnaciSquare[1][1] + fibonnaciSquare[1][1], fibonnaciSquare[0][0] + fibonnaciSquare[1][1]
            ]
        ];
    
    throw new Error("Invalid child position, must be 0 1 or 2")
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