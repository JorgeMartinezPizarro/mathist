import { TreeElement } from "@/app/components/PitagoreanTree"
import getTimeMicro from "./getTimeMicro"

export default function pitagoreanTree(n: bigint) {
    
    const start = getTimeMicro()
    
    const initialFibonacciSquare = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]

    let arrayOfSquares: bigint[][][] = [initialFibonacciSquare]

    for (var i =0; i<parseInt(n.toString()); i++) {
        arrayOfSquares = [...arrayOfSquares, ...iterate(arrayOfSquares.slice(-(3**i)))]
    }

    const result: TreeElement[] = arrayOfSquares.map(square => {
        return {
            triple: pitagoreanTriple(square),
            square,
        }
    });
    
    let array: TreeElement[][] = []

    for (var j: bigint = BigInt(0); j < n; j += BigInt(1)) {
        const sum: bigint = ( BigInt("3")**j - BigInt(1) ) / BigInt(2)
        const x: TreeElement[] = result.slice(parseInt(sum.toString()), parseInt((sum + BigInt(3)**j).toString()))
        array.push(x)
    }

    return {tree: array, time: getTimeMicro() - start};
}

const iterate = (arrayOfSquares: bigint[][][]): bigint[][][] => {

    let nextArrayOfSquares: bigint[][][] = new Array;
    
    for (var i=0; i<arrayOfSquares.length;i++) {
        nextArrayOfSquares = [...nextArrayOfSquares, ...children(arrayOfSquares[i])]
    }

    return nextArrayOfSquares;
}

export const pitagoreanTriple = (fibonacciSquare: bigint[][]): bigint[] => {

    const triple: bigint[] = [
        (fibonacciSquare[0][0] * fibonacciSquare[1][0]), 
        (fibonacciSquare[0][1] * fibonacciSquare[1][1]) * BigInt(2), 
        (fibonacciSquare[0][0] * fibonacciSquare[1][1]) + (fibonacciSquare[0][1] * fibonacciSquare[1][0]),
    ]
    
    // The pithagorean triple must verify the pithagorean formel, a**2 + b**2 - c**2 =0
    if (
        triple[0] * triple[0] + triple[1] * triple[1] - triple[2] * triple[2] !== BigInt(0) 
    ) 
        throw new Error("The triple does not satisfy the pithagorean theorem!")
    
    return triple;
}

export const childrenAt = (fibonnaciSquare: bigint[][], i: number): bigint[][] => {
    
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


export const children = (fibonnaciSquare: bigint[][]): bigint[][][] => {
    
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