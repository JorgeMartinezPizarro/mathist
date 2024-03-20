export default (n: number) => {
    return factorial(n)
}

const factorial = (n: number): number => {
    if (n == 1) return 1;
    else return n * factorial(n-1)
}