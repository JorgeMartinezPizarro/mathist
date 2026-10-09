import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MAX_DIGITS_TRIPLE } from '@/constants'
import { GET as index } from '@/app/api/route'
import { GET as mersenne } from '@/app/api/mersenne/route'
import { GET as report } from '@/app/api/report/route'
import { GET as differences } from '@/app/api/differences/route'
import { GET as primes } from '@/app/api/primes/route'
import { GET as factors } from '@/app/api/factors/route'
import { GET as isPrimeGet, POST as isPrime } from '@/app/api/isPrime/route'
import { GET as tree } from '@/app/api/pythagoreanTree/route'
import { GET as tripleGet, POST as triple } from '@/app/api/pythagoreanTriple/route'
import { GET as randomPrimes } from '@/app/api/randomPrimes/route'

// Route handlers are plain functions, no server needed.
const SECRET = 'test-secret'
const get = (path: string) => new Request('http://localhost' + path)
const post = (path: string, body: string) => new Request('http://localhost' + path, { method: 'POST', body })

const expectError = async (res: Response, status: number, message: string) => {
  expect(res.status).toBe(status)
  const body = await res.json()
  expect(body.error).toContain(message)
  return body
}

beforeEach(() => {
  vi.stubEnv('MATHER_SECRET', SECRET)
  vi.stubEnv('MATHER_COMPUTE_HOST', '')
  // Routes log the errors they answer with, and the sieves print their progress
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('admin endpoints', () => {
  // Only the forbidden paths: with the right KEY the report runs for minutes.
  it.each([['mersenne', mersenne], ['report', report]])(
    '/api/%s answers 403 without the right KEY',
    async (name, GET) => {
      for (const query of ['', '?KEY=', '?KEY=wrong']) {
        const body = await expectError(await GET(get(`/api/${name}${query}`)), 403, 'Forbidden')
        expect(JSON.stringify(body)).not.toContain(SECRET)
      }
    },
  )

  it('a blank MATHER_SECRET disables admin access instead of matching an empty KEY', async () => {
    vi.stubEnv('MATHER_SECRET', '  ')
    await expectError(await report(get('/api/report?KEY=')), 403, 'Forbidden')
    await expectError(await report(get('/api/report')), 403, 'Forbidden')
  })

  it('with the right KEY a missing MATHER_COMPUTE_HOST is a 500', async () => {
    await expectError(await mersenne(get(`/api/mersenne?KEY=${SECRET}&maxPrime=10`)), 500, 'MATHER_COMPUTE_HOST is not set')
  })

  it('report rejects a short other than 0 or 1 before running anything', async () => {
    await expectError(await report(get(`/api/report?KEY=${SECRET}&short=2`)), 400, 'Invalid short = 2, use 0 or 1')
  })

  it('mersenne rejects an unknown mode with 400', async () => {
    await expectError(await mersenne(get(`/api/mersenne?KEY=${SECRET}&mode=foo`)), 400, 'Unknown mode foo')
  })
})

describe('public endpoints', () => {
  it('/api answers 404 listing the endpoints', async () => {
    await expectError(await index(), 404, 'pythagoreanTree')
  })

  it('differences: over the GUI limit is a 400 unless the KEY is given', async () => {
    await expectError(await differences(get('/api/differences?length=21&name=square')), 400, 'Max length allowed 20')
    expect((await differences(get(`/api/differences?length=21&name=square&KEY=${SECRET}`))).status).toBe(200)
  })

  it('primes', async () => {
    await expectError(await primes(get('/api/primes?LIMIT=abc')), 400, 'Invalid LIMIT')
    await expectError(await primes(get('/api/primes?LIMIT=1000000000&excel=1')), 400, 'Max length for generate prime download')

    const small = await (await primes(get('/api/primes?LIMIT=100'))).json()
    expect(small.primes).toEqual([53, 59, 61, 67, 71, 73, 79, 83, 89, 97])
    expect(small.length).toBe(25)

    // Without KEY a big LIMIT falls back to the last ten primes
    const big = await (await primes(get('/api/primes?LIMIT=1000000000000'))).json()
    expect(big.primes.at(-1)).toBe('999999999989')
  })

  it('factors', async () => {
    await expectError(await factors(get('/api/factors?LIMIT=abc')), 400, 'Invalid LIMIT')
    await expectError(await factors(get('/api/factors?LIMIT=1' + '0'.repeat(30))), 400, 'Max value of LIMIT')
    const res = await factors(get('/api/factors?LIMIT=360'))
    expect(res.status).toBe(200)
    expect((await res.json()).factors).toEqual([
      { prime: '2', exponent: 3 },
      { prime: '3', exponent: 2 },
      { prime: '5', exponent: 1 },
    ])
  })

  it('isPrime', async () => {
    const res = await isPrimeGet(get('/api/isPrime'))
    await expectError(res, 405, 'use POST')
    expect(res.headers.get('Allow')).toBe('POST')

    await expectError(await isPrime(post('/api/isPrime', '{roto')), 400, 'Invalid JSON body')
    await expectError(await isPrime(post('/api/isPrime', '{"number":"abc"}')), 400, 'Invalid number')
    await expectError(await isPrime(post('/api/isPrime', `{"number":"1${'0'.repeat(3000)}"}`)), 400, 'max allowed')
    expect((await (await isPrime(post('/api/isPrime', '{"number":"97"}'))).json()).isPrime).toBe(true)
  })

  it('pythagoreanTree', async () => {
    await expectError(await tree(get('/api/pythagoreanTree?LIMIT=abc')), 400, 'Invalid LIMIT')
    await expectError(await tree(get('/api/pythagoreanTree?LIMIT=99')), 400, 'Max length of Pythagorean tree')
    expect((await (await tree(get('/api/pythagoreanTree?LIMIT=3'))).json()).tree[0][0].triple).toEqual(['3', '4', '5'])
  })

  it('pythagoreanTriple', async () => {
    await expectError(await tripleGet(get('/api/pythagoreanTriple')), 405, 'use POST')
    await expectError(await triple(post('/api/pythagoreanTriple', '{}')), 400, 'Missing parameter number')
    await expectError(await triple(post('/api/pythagoreanTriple', '{"number":"123"}')), 400, 'Invalid base 3 path')
    const tooLong = `{"number":"${'0'.repeat(MAX_DIGITS_TRIPLE + 1)}"}`
    await expectError(await triple(post('/api/pythagoreanTriple', tooLong)), 400, 'Max path length is ' + MAX_DIGITS_TRIPLE)
    expect((await (await triple(post('/api/pythagoreanTriple', '{"number":"12"}'))).json()).triple).toEqual(['39', '80', '89'])
  })

  it('randomPrimes', async () => {
    await expectError(await randomPrimes(get('/api/randomPrimes?length=abc&amount=1')), 400, 'Invalid parameters')
    await expectError(await randomPrimes(get('/api/randomPrimes?length=500&amount=1')), 400, 'max total of DIGITS')
    expect((await (await randomPrimes(get('/api/randomPrimes?length=10&amount=2'))).json()).primes).toHaveLength(2)
  })
})
