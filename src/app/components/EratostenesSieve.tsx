'use client'

import { Button, CircularProgress, TextField, Alert  } from "@mui/material"
import { useState } from "react"

import {default as d} from "@/helpers/duration"
import string from "@/helpers/string";
import {MAX_ALLOCATABLE_MATRIX, MAX_DIGITS_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY} from "@/helpers/Constants"
import toHuman from "@/helpers/toHuman";

export default () => {
    const [primes, setPrimes] = useState<number[]>([2])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(0)

    const [durationFull, setDurationFull] = useState(0)

    const [length, setLength] = useState(1)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState<string|boolean>(false)

    const downloadCSV = async () => {
        const limit = parseInt(value)
        setError(false)
        setLoading(true)
        setDuration(0)
        setPrimes([])
        setLength(0)
        setDurationFull(0)
        try {
            const url = "/api/primes?LIMIT="+limit+"&amount="+limit+"&excel=true"
            const response = await fetch(url);
            const {filename, time, error, length: l} = await response.json()
            if (error) {
                throw new Error(error.toString())
            }
            const link = document.createElement("a");
            link.href = "/files/" + filename;
            link.download = "primes-to-" + limit.toString() + ".csv";
            document.body.appendChild(link);
            link.click();        
            document.body.removeChild(link);
            setLength(l)
            setLoading(false)
            setDurationFull(time)
        } catch (error) {
            setDurationFull(0)
            setError(error.toString().replaceAll("Error: ", ""))
            setLoading(false)
        }
    };

    const generateSieve = async () => {
        const url = "/api/primes?LIMIT="+value.toString()
        setLoading(true)
        setError(false)
        setPrimes([])
        setLength(0)
        setDurationFull(0)
        try {
            const response = await fetch(url)
            const {primes, time, length, error} = await response.json()
            if (error) {
                throw new Error(error.toString())
            }
            setDuration(time)
            setLength(length)
            setLoading(false)
            setPrimes(primes)
        } catch(error) {
            setLoading(false)
            setError(error.toString().replaceAll("Error: ", ""))
            setLength(0)
            setPrimes([])
        }
    }

    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        <p>Sieve of a length with max value {string(BigInt(MAX_LENGTH_FOR_SIEVE_HEALTY))}. File can get up to 516MB and takes up to a 1 minute to generate.</p>
        <hr />
        <p>Max real is {string(BigInt(MAX_ALLOCATABLE_MATRIX))}, {toHuman(MAX_ALLOCATABLE_MATRIX / 16)} tested with following results:</p>
        <hr />
        <a href="https://mather.ideniox.com/primes/primes-to-100b.csv">primes-to-100b.csv</a>,&nbsp;
        <a href="https://mather.ideniox.com/primes/primes-to-10b.csv">primes-to-10b.csv</a>,&nbsp;
        <a href="https://mather.ideniox.com/primes/primes-to-1b.csv">primes-to-1b.csv</a>,&nbsp;
        <a href="https://mather.ideniox.com/primes/primes-to-100m.csv">primes-to-100m.csv</a>,&nbsp;
        <a href="https://mather.ideniox.com/primes/primes-to-10m.csv">primes-to-10m.csv</a>,&nbsp;
        <a href="https://mather.ideniox.com/primes/primes-to-1m.csv">primes-to-1m.csv</a>
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    if (event.target.value.length <= MAX_DIGITS_SIEVE && parseInt(event.target.value) > 0) {
                        setValue(event.target.value)
                        setPrimes([])
                        setDurationFull(0)
                        setLength(0)
                    }
                })}
            />
            <Button type="submit" disabled={loading} onClick={generateSieve} variant="contained">GENERATE</Button>
            <Button disabled={loading} onClick={downloadCSV} variant="contained">DOWNLOAD</Button>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <CircularProgress />}
            
        </div>
        {error && <p><Alert severity="error">{error}</Alert></p>}
        {!error && durationFull !== 0 && <>
            {length > 0 && <p>Prepared download of {string(BigInt(length))} primes in {d(durationFull)}</p>}
        </>}
        {!error && (primes.length > 0) && !loading && (<>
            <hr />
            <p>Total of primes smaller or equal {string(BigInt(value))} is {string(BigInt(length))}</p>
            <hr/>
            <p>Duration {d(duration)}</p>
            <hr/>
            <p>Last teen primes of the sieve:</p>
            <hr />
            <p>[{primes.map((prime: number) => string(BigInt(prime))).join(", ")}]</p>
            <hr />
        </>)}
    </div>
}