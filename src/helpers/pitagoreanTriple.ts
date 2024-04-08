import getTimeMicro from "./getTimeMicro"
import { childrenAt, pitagoreanTriple as pt } from "./pitagoreanTree"

export default function pitagoreanTriple(n: bigint) {
    if (BigInt(n.toString()) < BigInt(0)) {
        throw new Error("Invalid value, must be a not negative integer value!")
    }
    const start = getTimeMicro()

    const x = n.toString(3)
    const a = x.length

    let currentFS: bigint[][] = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]

    for (var i=a-1;i>=0;i--) {
        currentFS = childrenAt(currentFS, parseInt(x[i]))
    }
    
    return {path: x.split("").reverse().join(""), triple: pt(currentFS), square: currentFS, time: getTimeMicro() - start}

}