'use client'

import { useState } from "react";

import { MAX_DIGITS_PRIMALITY_TEST } from "@/Constants";
import duration from "@/helpers/duration";
import useApi from "@/hooks/useApi";
import { RandomPrimesReport } from "@/types";
import ActionForm from "@/widgets/ActionForm";
import ErrorAlert from "@/widgets/ErrorAlert";
import { DigitsField } from "@/widgets/Field";
import NumberGrid from "@/widgets/NumberGrid";
import NumberToLocale from "@/widgets/NumberToLocale";

interface PrimalityReport {
    isPrime: boolean;
    number: string;
    time: number;
}

const RandomPrimes = () => {

    const [candidate, setCandidate] = useState("1111111111111111111")
    const [length, setLength] = useState("40")
    const [amount, setAmount] = useState("10")
    const test = useApi<PrimalityReport>()
    const random = useApi<RandomPrimesReport>()

    return <>
        <div className="intro">
            <p>Enter a number to test if it is prime. Max value is 10**{MAX_DIGITS_PRIMALITY_TEST}-1.</p>
        </div>
        <ActionForm onSubmit={() => test.post("/api/isPrime", { number: candidate })} loading={test.loading}>
            <DigitsField
                label="Number"
                value={candidate}
                maxLength={MAX_DIGITS_PRIMALITY_TEST}
                disabled={test.loading}
                onChange={newCandidate => {
                    setCandidate(newCandidate)
                    test.reset()
                }}
            />
            <button type="submit" disabled={test.loading}>Test</button>
        </ActionForm>
        <ErrorAlert error={test.error} />
        {test.data && <section className="result">
            <p>The number entered with <NumberToLocale number={candidate.length} singular="digit" /> <strong>{test.data.isPrime ? "is prime" : "is not prime"}</strong>, it took {duration(test.data.time)}</p>
        </section>}
        <hr />
        <div className="intro">
            <p>Write length and amount to generate random primes:</p>
        </div>
        <ActionForm onSubmit={() => random.get("/api/randomPrimes?length=" + length + "&amount=" + amount)} loading={random.loading}>
            <DigitsField
                label="Length"
                value={length}
                disabled={random.loading}
                onChange={newLength => {
                    setLength(newLength)
                    random.reset()
                }}
            />
            <DigitsField
                label="Amount"
                value={amount}
                disabled={random.loading}
                onChange={newAmount => {
                    setAmount(newAmount)
                    random.reset()
                }}
            />
            <button type="submit" disabled={random.loading}>Generate</button>
        </ActionForm>
        <ErrorAlert error={random.error} />
        {random.data && <section className="result">
            <p>Generated <NumberToLocale number={random.data.amount} singular="prime" /> with <NumberToLocale number={random.data.length} singular="digit" /> in {duration(random.data.time)}</p>
            <NumberGrid numbers={random.data.primes} columns={1} />
        </section>}
    </>
}

export default RandomPrimes;
