import getTimeMicro from "./getTimeMicro"
import { childrenAt, pitagoreanTriple as pt } from "./pitagoreanTree"

export default function pitagoreanTriple(n: string) {
    
    const start = getTimeMicro()

    const a = n.length

    let currentFS: bigint[][] = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]
    
    for (var i=0;i<a;i++) {
        currentFS = childrenAt(currentFS, parseInt(n[i]))
    }
    
    return {triple: pt(currentFS), square: currentFS, time: getTimeMicro() - start}

}