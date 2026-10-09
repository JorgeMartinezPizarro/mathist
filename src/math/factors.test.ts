import { describe, expect, it } from 'vitest'
import factors from '@/math/factors'
import isProbablePrime from '@/math/isProbablePrime'
import id from '@/utils/id'
import { PrimePower } from '@/types'

const one = BigInt(1)

const multiply = (powers: PrimePower[]): bigint =>
  powers.reduce((acc, { prime, exponent }) => acc * prime ** BigInt(exponent), one)

// A factorization is right when its primes are prime, strictly increasing and
// multiply back to n. Checking the answer, not just that nothing threw.
const expectValidFactorization = (n: bigint) => {
  const f = factors(n).factors
  const shown = n + ' -> ' + f.map(p => p.prime + '^' + p.exponent).join(' * ')
  expect(multiply(f), shown).toBe(n)
  f.forEach(({ prime }, i) => {
    expect(isProbablePrime(prime), shown + ', ' + prime + ' is not prime').toBe(true)
    if (i > 0) expect(f[i - 1].prime < prime, shown + ', primes not strictly increasing').toBe(true)
  })
}

const powers = (list: [string, number][]): PrimePower[] =>
  list.map(([prime, exponent]) => ({ prime: BigInt(prime), exponent }))

describe('factors', () => {
  it('treats 0 and 1 as special numbers', () => {
    expect(factors(BigInt(0)).factors).toEqual([])
    expect(factors(one).factors).toEqual([])
    expect(factors(one).message).toContain('special numbers')
  })

  it('rejects negative numbers', () => {
    expect(() => factors(BigInt(-12))).toThrow('positive integers')
  })

  it('factors known values', () => {
    expect(factors(BigInt(360)).factors).toEqual(powers([['2', 3], ['3', 2], ['5', 1]]))
    expect(factors(BigInt(1024)).factors).toEqual(powers([['2', 10]]))
    expect(factors(BigInt(7919)).factors).toEqual(powers([['7919', 1]]))
  })

  it('factors every number up to 10^4', () => {
    for (let n = 2; n <= 10 ** 4; n++) expectValidFactorization(BigInt(n))
  })

  // Same inputs as src/tests/test-factorization.ts
  it('factors random numbers from 5 to 22 digits', () => {
    for (let digits = 5; digits <= 22; digits++) {
      for (let k = 0; k < 20; k++) expectValidFactorization(BigInt(id(digits)) + one)
    }
  }, 60_000)

  // Wheel division gives up at 10^7, so these go through brentFactor.
  describe('with primes above 10^7', () => {
    it.each([
      ['p * q', [['15119597', 1], ['16976651', 1]]],
      ['p^2', [['19890631', 2]]],
      ['p^3', [['14340847', 3]]],
      ['p * q * r', [['10935593', 1], ['13138217', 1], ['19890631', 1]]],
      ['small primes and p * q', [['2', 5], ['3', 1], ['15119597', 1], ['35507623', 1]]],
      // Brent found the repeated prime after q, it was listed twice
      ['p * q^2', [['15119597', 1], ['16976651', 2]]],
      ['p * q^2 again', [['35507623', 1], ['37755227', 2]]],
      // The root of a perfect square was taken as a prime
      ['p^2 * q^2', [['10935593', 2], ['13138217', 2]]],
      ['p^4', [['19890631', 4]]],
    ] as [string, [string, number][]][])('%s', (_, list) => {
      const expected = powers(list)
      expect(factors(multiply(expected)).factors).toEqual(expected)
    })
  })
})
