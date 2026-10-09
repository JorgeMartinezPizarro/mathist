'use client'

import Image from "next/image"
import { useState } from "react"

import duration from "@/utils/duration"
import { MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH } from "@/constants"
import useApi from "@/hooks/useApi"
import { SieveReport } from "@/types"
import ActionForm from "@/components/ui/ActionForm"
import ErrorAlert from "@/components/ui/ErrorAlert"
import { DigitsField } from "@/components/ui/Field"
import NumberGrid from "@/components/ui/NumberGrid"
import NumberToLocale from "@/components/ui/NumberToLocale"
import NumberToString from "@/components/ui/NumberToString"

const STORED_FILES = ["1m", "10m", "100m", "1b", "10b", "100b"]

// Example shown before the first request
const INITIAL_SIEVE: SieveReport = { primes: [2], length: 1, time: 1, isPartial: false, filename: "" }

const EratosthenesSieve = () => {

    const [value, setValue] = useState("2")
    const sieve = useApi<SieveReport>(INITIAL_SIEVE)
    const download = useApi<SieveReport>()
    const loading = sieve.loading || download.loading

    const generate = () => {
        download.reset()
        sieve.get("/api/primes?LIMIT=" + value)
    }

    const downloadCSV = async () => {
        sieve.reset()
        const report = await download.get("/api/primes?LIMIT=" + value + "&excel=true")
        if (report?.filename) {
            // The server writes the file under /files, the browser saves it
            const link = document.createElement("a")
            link.href = report.filename
            link.download = "primes-to-" + value + ".csv"
            document.body.appendChild(link)
            link.click()
            link.remove()
        }
    }

    const downloadError = download.data && !download.data.filename ? "Failed to generate the file with primes." : download.error

    return <>
        <div className="illustrations">
            <Image src="/image6.png" preload height={100} width={Math.round(100 * 217 / 260)} alt="" />
        </div>
        <div className="intro">
            <p>Eratosthenes sieve of a given length up to 10 quadrillion. Over 100 million we use segmented sieve.</p>
            <p>Used to generate prime lists up to 1 trillion (up to 1t there are 450GB of primes, so I will omit that link). Below the prime files generated:</p>
            <p>
                {STORED_FILES.map((size, index) => <span key={size}>
                    {index > 0 && ", "}
                    <a href={"https://math.ideniox.com/stored/primes-to-" + size + ".csv"} download={"primes-to-" + size + ".csv"}>primes-to-{size}.csv</a>
                </span>)}
            </p>
        </div>
        <ActionForm onSubmit={generate} loading={loading}>
            <DigitsField
                label="Length"
                value={value}
                maxLength={MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH.toString().length}
                disabled={loading}
                onChange={newValue => {
                    setValue(newValue)
                    sieve.reset()
                    download.reset()
                }}
            />
            <button type="submit" disabled={loading}>Generate</button>
            <button type="button" disabled={loading} onClick={downloadCSV}>Download</button>
        </ActionForm>
        <ErrorAlert error={sieve.error || downloadError} />
        {download.data?.filename && <section className="result">
            <p>Generated download of <NumberToString number={download.data.length} /> primes in {duration(download.data.time)}</p>
        </section>}
        {sieve.data && <section className="result">
            {sieve.data.length === 0 && <p>No primes smaller or equal than <NumberToString number={value} /></p>}
            {sieve.data.length > 0 && <>
                {sieve.data.isPartial
                    ? <p>Ten primes up to <NumberToString number={value} /> found using the segmented sieve in {duration(sieve.data.time)}</p>
                    : <p>Total of primes smaller or equal than <NumberToString number={value} /> is <NumberToString number={sieve.data.length} />, it took {duration(sieve.data.time)}. Used eratosthenes sieve.</p>}
                <p className="caption">Last <NumberToLocale number={sieve.data.primes.length} singular="prime" /> of the sieve:</p>
                <NumberGrid numbers={sieve.data.primes} columns={Math.min(5, sieve.data.primes.length)} />
            </>}
        </section>}
    </>
}

export default EratosthenesSieve;
