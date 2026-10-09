import { beforeAll, describe, expect, it, vi } from 'vitest'
import isProbablePrime from '@/math/isProbablePrime'
import randomPrimes from '@/math/randomPrimes'
import countPrimes from '@/math/countPrimes'
import { classicOrSegmentedEratosthenes, lastTenEratosthenes, lastTenGenerated, segmentedEratosthenes } from '@/math/eratosthenes'

const two = BigInt(2)

beforeAll(() => {
  // The sieves print their progress, keep the test output readable
  vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
})

describe('isProbablePrime', () => {
  it.each([
    '2', '3', '5', '7', '97', '7919',
    (two ** BigInt(31) - BigInt(1)).toString(),
    (two ** BigInt(61) - BigInt(1)).toString(),
    (two ** BigInt(127) - BigInt(1)).toString(),
    '9999999999999937',
    (two ** BigInt(521) - BigInt(1)).toString(),
  ])('%s is prime', n => {
    expect(isProbablePrime(BigInt(n))).toBe(true)
  })

  it.each([
    ['0', 'zero'],
    ['1', 'one'],
    ['2047', 'strong pseudoprime to base 2'],
    ['561', 'Carmichael'],
    ['41041', 'Carmichael'],
    ['3215031751', 'strong pseudoprime to bases 2, 3, 5 and 7'],
    ['3825123056546413051', 'strong pseudoprime to the first nine prime bases'],
    ['147573952589676412927', '2**67 - 1, factored by Cole'],
    ['1000000016000000063', '1000000007 * 1000000009'],
  ])('%s is composite (%s)', n => {
    expect(isProbablePrime(BigInt(n))).toBe(false)
  })
})

describe('randomPrimes', () => {
  it.each([1, 2, 5, 10, 50, 100])('generates primes with %i digits', length => {
    const { primes } = randomPrimes(length, 5)
    expect(primes).toHaveLength(5)
    primes.forEach(p => {
      expect(p.toString(), String(p)).toHaveLength(length)
      expect(isProbablePrime(p), String(p)).toBe(true)
    })
  })
})

describe('sieves', () => {
  // pi(10**n), OEIS A006880
  it.each([
    [10, 4], [100, 25], [1000, 168], [10 ** 4, 1229], [10 ** 5, 9592], [10 ** 6, 78498], [10 ** 7, 664579],
  ])('every sieve counts pi(%i) = %i', (n, count) => {
    expect(countPrimes(n).length).toBe(count)
    expect(segmentedEratosthenes(n).length).toBe(count)
    expect(classicOrSegmentedEratosthenes(n).length).toBe(count)
  })

  // Largest prime below 10**k is 10**k - d, OEIS A033874
  it.each([3, 3, 3, 27, 9, 17, 9, 11, 63, 33, 23, 11, 29, 27, 11, 63].map((d, i) => [i + 1, d]))(
    'the largest prime below 10^%i is 10^k - %i',
    (k, d) => {
      const limit = BigInt(10) ** BigInt(k)
      const sieved = lastTenEratosthenes(limit).primes.map(p => BigInt(p))
      const generated = lastTenGenerated(limit).primes.map(p => BigInt(p))
      expect(sieved.at(-1)).toBe(limit - BigInt(d))
      expect(sieved).toEqual(generated)
    },
    30_000,
  )
})
