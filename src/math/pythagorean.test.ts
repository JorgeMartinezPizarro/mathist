import { describe, expect, it } from 'vitest'
import PythagoreanTree from '@/math/pythagoreanTree'
import PythagoreanTriple from '@/math/pythagoreanTriple'

const triple = (a: number, b: number, c: number) => [a, b, c].map(n => BigInt(n))

const gcd = (a: bigint, b: bigint): bigint => (b === BigInt(0) ? a : gcd(b, a % b))

const expectPrimitiveTriple = ([a, b, c]: bigint[]) => {
  const shown = `<${a}, ${b}, ${c}>`
  expect(a * a + b * b, shown).toBe(c * c)
  expect(gcd(a, b), shown + ' is not primitive').toBe(BigInt(1))
}

describe('PythagoreanTree', () => {
  it('starts at <3, 4, 5> and has 3^k triples at level k', () => {
    const { tree } = PythagoreanTree(BigInt(4))
    expect(tree[0][0].triple).toEqual(triple(3, 4, 5))
    expect(tree[1].map(e => e.triple)).toEqual([triple(15, 8, 17), triple(21, 20, 29), triple(5, 12, 13)])
    tree.forEach((level, k) => expect(level).toHaveLength(3 ** k))
  })

  it('generates distinct primitive triples', () => {
    const triples = PythagoreanTree(BigInt(7)).tree.flat().map(e => e.triple)
    triples.forEach(expectPrimitiveTriple)
    expect(new Set(triples.map(t => t.join(','))).size).toBe(triples.length)
  })
})

describe('PythagoreanTriple', () => {
  it('follows a base 3 path from <3, 4, 5>', () => {
    expect(PythagoreanTriple('').triple).toEqual(triple(3, 4, 5))
    expect(PythagoreanTriple('12').triple).toEqual(triple(39, 80, 89))
  })

  it('gives primitive triples for random paths', () => {
    for (let k = 0; k < 200; k++) {
      const path = Array.from({ length: 1 + (k % 60) }, () => Math.floor(Math.random() * 3)).join('')
      expectPrimitiveTriple(PythagoreanTriple(path).triple)
    }
  })
})
