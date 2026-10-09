export default function differences(array: bigint[], deep: number = 2): bigint[][] {
    
    const matrix: bigint[][] = [array]
    for (var a=0;a<array.length&& a < deep;a++) {
        
        const l: bigint[] = [];

        for (var i=1; i<matrix[a].length;i++) {
            const t: bigint = matrix[a][i] - matrix[a][i-1]
            l.push(BigInt(t))
        }
        
        matrix.push(l)
    }
    
    return matrix;
}