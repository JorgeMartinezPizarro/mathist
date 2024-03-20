import eratostenes from "./eratostenes"

export default (array: []) => {
    
    console.log(array)

    const matrix = [array]
    for (var a=0;a<array.length;a++) {
        const l = [];
        for (var i=1; i<matrix[a].length;i++) {
            l.push(matrix[a][i] - matrix[a][i-1])
        }
        matrix.push(l)
    }

    return matrix;

}