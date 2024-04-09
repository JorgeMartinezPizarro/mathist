import eratostenes from "./eratostenes"

export default function differences(array: bigint[]): bigint[][] {
    const matrix: bigint[][] = [array]
    for (var a=0;a<array.length;a++) {
        const l: bigint[] = [];

        for (var i=1; i<matrix[a].length;i++) {
            l.push(matrix[a][i] - matrix[a][i-1])
        }
        
        matrix.push(l)
    }

    return matrix;
}