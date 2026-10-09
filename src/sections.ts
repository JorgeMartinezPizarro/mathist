// The pages of the site, in menu order. Used by the navigation and the [slug] route.
export const SECTIONS = [
    { slug: "sieve", label: "Sieve", title: "Eratosthenes sieve" },
    { slug: "tree", label: "Tree", title: "Pythagorean tree" },
    { slug: "factors", label: "Factors", title: "Prime factorization" },
    { slug: "series", label: "Series", title: "Series of differences" },
    { slug: "primes", label: "Primes", title: "Primes" },
    { slug: "about", label: "About", title: "About" },
] as const

export type Slug = typeof SECTIONS[number]["slug"]

export const findSection = (slug: string) => SECTIONS.find(section => section.slug === slug)
