import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SECTIONS, Slug, findSection } from "@/sections";
import About from "@/components/sections/About";
import PrimeFactorization from "@/components/sections/PrimeFactorization";
import PythagoreanTree from "@/components/sections/PythagoreanTree";
import SeriesDifferences from "@/components/sections/SeriesDifferences";
import EratosthenesSieve from "@/components/sections/EratosthenesSieve";
import RandomPrimes from "@/components/sections/RandomPrimes";

const PAGES: Record<Slug, ReactNode> = {
  sieve: <EratosthenesSieve />,
  tree: <PythagoreanTree />,
  factors: <PrimeFactorization />,
  series: <SeriesDifferences />,
  primes: <RandomPrimes />,
  about: <About />,
};

type Props = { params: Promise<{ slug: string }> };

// Only the known sections exist, prerendered at build time. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: findSection(slug)?.title };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const section = findSection(slug);

  if (!section) {
    notFound();
  }

  return <>
    <h1>{section.title}</h1>
    {PAGES[section.slug]}
  </>
}
