import duration from "@/helpers/duration"
import eratosthenes from "@/helpers/eratosthenes"
import errorMessage from "@/helpers/errorMessage"
import getTimeMicro from "@/helpers/getTimeMicro"
import { lucasLehmerTest } from "@/helpers/isMersennePrime"


// Return a html table for the LLT test up to LIMIT. Values longer than 10k may take hours or days to compute.
export default function testMersenne(LIMIT: number = 1000) {
    
    let c = 0
    
    const start = getTimeMicro()
    
    const primes = eratosthenes(LIMIT, LIMIT).primes.map(n => Number(n))

    const mersennePrimes = primes.filter((prime: number): boolean => {
        try {
            return lucasLehmerTest(prime)
        } catch (e) {
            console.log(errorMessage(e))
            return false
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