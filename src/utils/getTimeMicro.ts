export default function getTimeMicro() {
    var hrTime = process.hrtime()
    const a = hrTime[0] * 1000000 + hrTime[1] / 1000
    return Math.round(a)
}