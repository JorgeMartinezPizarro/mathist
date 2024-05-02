import duration from "@/helpers/duration"
import eratosthenes from "@/helpers/eratosthenes"
import getTimeMicro from "@/helpers/getTimeMicro"
import { lucasLehmerTest } from "@/helpers/isMersennePrime"

export default function testMersenne(local: boolean): string[] {
    /*const primes = [
        2, 3, 5, 7, 13, 17, 19, 31, 61, 89, 107, 127, 521, 607, 1279,
        2203, 2281, 3217, 4253, 4423, 9689, 9941, 11213, 19937, 21701, 
        23209, 44497, 86243, 110503, 132049, 216091, 756839, 859433, 1257787,
        1398269, 2976221, 3021377, 6972593
    ].slice(0, local ? 25 : 38)*/
    let c = 0
    const start = getTimeMicro()
    const n = local ? 1000 : 100000
    const primes = eratosthenes(n, n).primes.map(n => Number(n))
    const mersennePrimes = primes.filter(prime => {
        try {
            return lucasLehmerTest(prime)
        } catch (e) {

        }
    })

    return [
    "<table style='width: 630px;margin: 0 auto;'><thead><tr><th>#</th><th>n</th><th>Mn</th><th>Digits</th></tr></thead><tbody>",
    ...mersennePrimes.map(prime => "<tr>" + 
        "<td style='text-align: center;'>" + ++c + "</td><td style='text-align: center;'>" + prime + "</td><td style='text-align: center;'>2**" + prime + " - 1</td><td style='text-align: center;'>" + (BigInt(2)**BigInt(prime)).toString().length + "</td>" +
    "</tr>"),
     "</tbody></table><hr/>",
     "<p style='text-align: center;'><b>Generated " + mersennePrimes.length + " mersenne primes</b></p>",
      "<p style='text-align: center;'>Used Lucas Lehmer Primaly Test</p>",
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + "</p>",
      "<hr/>"
    ]
}