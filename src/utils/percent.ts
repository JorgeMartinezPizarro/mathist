import { isInteger } from "mathjs"

const percent = (a: bigint, b: bigint) => {
    if (a > b ) 
        throw new Error("Invalid params for percent, a must be equal or smaller than b")
    
    const t = Number(BigInt(100000) * a / b)/1000
    if (a === b) return "100.000%"
    if (t === 0 || a === BigInt(0)) return "000.000%"
    
    let string = ""
    if (isInteger(t)) {
        return new Array(3 - t.toString().length).fill(" ").join("") + t + ".000%"
    }
    
    if (t < 10) {
        string = "  " + t.toString()
    } else if (t < 100) {
        string = " " + t.toString()
    } 
    
    const size = Math.max(7 - string.length, 0)
    return string + new Array(size).fill("0").join("") + "%"
}

export default percent;