import getTimeMicro from "./getTimeMicro"
import { childrenAt, pitagoreanTriple } from "./pitagoreanTree"

export default (n: BigInt) => {
    if (BigInt(n.toString()) < BigInt(0)) {
        throw new Error("Invalid value, must be a not negative integer value!")
    }
    const start = getTimeMicro()

    const x = n.toString(3)
    const a = x.length

    let currentFS: BigInt[][] = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]

    for (var i=a-1;i>=0;i--) {
        
        currentFS = childrenAt(currentFS, parseInt(x[i]))
    }
    
    return {path: x.split("").reverse().join(""), triple: pitagoreanTriple(currentFS), square: currentFS, time: getTimeMicro() - start}

}