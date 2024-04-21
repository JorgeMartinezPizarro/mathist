const percent = (a: bigint, b: bigint) => {
    if (a > b ) 
        throw new Error("Invalid params for percent, a must be equal or smaller than b")
    const t = Number(BigInt(100000) * a / b)/1000
    const size = Math.max(6 - t.toString().length, 0)
    return t + "%" + new Array().fill(" ").join("")
}

export default percent;