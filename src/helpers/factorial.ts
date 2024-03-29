export default (n: number) => {
    return factorial(BigInt(n))
}

const factorial = (n: BigInt): BigInt => {
    let x = BigInt(1);

    for (var i = BigInt(2); i<=n;i++) {
        x *= i
    }

    return x;
}