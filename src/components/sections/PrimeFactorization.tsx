'use client'

import { useState } from "react"

import duration from "@/utils/duration"
import { MAX_DIGITS_FACTORIZATION } from "@/constants"
import useApi from "@/hooks/useApi"
import { Factorization } from "@/types"
import ActionForm from "@/components/ui/ActionForm"
import ErrorAlert from "@/components/ui/ErrorAlert"
import { DigitsField } from "@/components/ui/Field"
import NumberToString from "@/components/ui/NumberToString"

// Example shown before the first request
const INITIAL_FACTORIZATION: Factorization = { factors: [{ prime: BigInt(2), exponent: 1 }], message: "", time: 1 }

const PrimeFactorization = () => {

    const [value, setValue] = useState("2")
    const factorization = useApi<Factorization>(INITIAL_FACTORIZATION)
    const { data, loading } = factorization
    const found = data && data.factors.length > 0

    return <>
        <div className="intro">
            <p>Enter a number below to factorize it. The max number can be entered is 100 sextillion - 1.</p>
        </div>
        <ActionForm onSubmit={() => factorization.get("/api/factors?LIMIT=" + value)} loading={loading}>
            <DigitsField
                label="Number"
                value={value}
                maxLength={MAX_DIGITS_FACTORIZATION}
                disabled={loading}
                onChange={newValue => {
                    setValue(newValue)
                    factorization.reset()
                }}
            />
            <button type="submit" disabled={loading}>Factorize</button>
        </ActionForm>
        <ErrorAlert error={factorization.error} />
        {!loading && !factorization.error && <section className="result">
            <p className="formula">
                <NumberToString number={value} /> = {found
                    ? data.factors.map(({ prime, exponent }, index) => <span key={index} className={data.message.includes("The factor " + prime + " is not prime") ? "not-prime" : undefined}>
                        {index > 0 && " × "}
                        <NumberToString number={prime} />
                        {exponent > 1 && <sup>{exponent}</sup>}
                    </span>)
                    : "[?]"}
            </p>
            {found && <>
                <ErrorAlert error={data.message} />
                <p className="caption">Done in {duration(data.time)}</p>
            </>}
        </section>}
    </>
}

export default PrimeFactorization;
