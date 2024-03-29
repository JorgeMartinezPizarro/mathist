import eratostenes from "./eratostenes"

export default (array: BigInt[]): BigInt[][] => {
    const matrix: BigInt[][] = [array]
    for (var a=0;a<array.length;a++) {
        const l: BigInt[] = [];

        for (var i=1; i<matrix[a].length;i++) {
            l.push(BigInt(matrix[a][i].toString()) - BigInt(matrix[a][i-1].toString()))
        }
        
        matrix.push(l)
    }

    return matrix;
}