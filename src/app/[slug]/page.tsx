import { notFound } from "next/navigation";

import ClientPage from "./ClientPage";

import About from "@/app/components/About";
import PrimeFactorization from "@/app/components/PrimeFactorization";
import PithagoreanTree from "@/app/components/PithagoreanTree";
import SerieDifferences from "@/app/components/SerieDifferences";
import EratosthenesSieve from "@/app/components/EratosthenesSieve";
import RandomPrimes from "@/app/components/RandomPrimes";
import Test from "@/app/components/Test";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const elements = [
    { name: "sieve", component: <EratosthenesSieve /> },
    { name: "tree", component: <PithagoreanTree /> },
    { name: "factors", component: <PrimeFactorization /> },
    { name: "series", component: <SerieDifferences /> },
    { name: "primes", component: <RandomPrimes /> },
    { name: "about", component: <About /> },
  ];

  const currentElement = elements.find(el => el.name === slug);

  if (!currentElement) {
    notFound();
  }

  return (
    <ClientPage
      currentElement={currentElement}
      elements={elements}
    />
  );
}