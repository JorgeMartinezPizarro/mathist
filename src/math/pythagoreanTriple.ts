import getTimeMicro from "@/utils/getTimeMicro"
import { childrenAt, PythagoreanTriple as pt } from "@/math/pythagoreanTree"

export default function PythagoreanTriple(n: string) {
    
    const start = getTimeMicro()

    const a = n.length

    let currentFS: bigint[][] = [[BigInt(1),BigInt(1)],[BigInt(3),BigInt(2)]]
    
    for (var i=0;i<a;i++) {
        currentFS = childrenAt(currentFS, parseInt(n[i]))
    }
    
    return {triple: pt(currentFS), square: currentFS, time: getTimeMicro() - start}

}