'use client'

import { Button, CircularProgress, TextField, Alert  } from "@mui/material"
import { useState } from "react"

import {default as d} from "@/helpers/duration"
import string from "@/helpers/string";
import {MAX_ALLOCATABLE_MATRIX_30GB, MAX_DIGITS_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY} from "@/helpers/Constants"
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
            const promise = await fetch(url)
            const response = await promise.json()
            const {filename, time, error, length: l} = response
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
            if (error.toString().indexOf("Failed to fetch") !== -1)
                setError("Error generating excel, server disconnected")
            else
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
            const promise = await fetch(url)
            const response = await promise.json()
            const {primes, time, length, error} = response
            
            if (error) {
                throw new Error(error.toString())
            }

            setDuration(time)
            setLength(length)
            setLoading(false)
            setPrimes(primes)
        } catch(error) {
            setLoading(false)
            if (error.toString().indexOf("Failed to fetch") !== -1)
                setError("Error generating excel, server disconnected")
            else 
                setError(error.toString().replaceAll("Error: ", ""))
            setLength(0)
            setPrimes([])
        }
    }

    return <div>
        <img src="/image6.png" height={200} />
        <hr/>
        <p>Sieve of a given length, max is {string(BigInt(MAX_LENGTH_FOR_SIEVE_HEALTY))}, using {toHuman(MAX_LENGTH_FOR_SIEVE_HEALTY / 16)} RAM and generating 515MB of primes in around 20 seconds.</p>
        <hr/>
        <p>Server max is {string(BigInt(MAX_ALLOCATABLE_MATRIX_30GB))}, using {toHuman(MAX_ALLOCATABLE_MATRIX_30GB / 16)} RAM and generating 240GB of primes in around 12 hours.</p>
        <hr/>
        <p>
            <a href="https://mather.ideniox.com/primes/primes-to-1m.csv" download="primes-to-1m.csv">primes-to-1m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/primes/primes-to-10m.csv" download="primes-to-10m.csv">primes-to-10m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/primes/primes-to-100m.csv" download="primes-to-100m.csv">primes-to-100m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/primes/primes-to-1b.csv" download="primes-to-1b.csv">primes-to-1b.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/primes/primes-to-10b.csv" download="primes-to-10b.csv">primes-to-10b.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/primes/primes-to-100b.csv" download="primes-to-100b.csv">primes-to-100b.csv</a>
        </p>
        <hr/>
        <>
            <TextField
                className="input"
                label="Length"
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
            {loading && <CircularProgress />}
            
        </>
        {error && <p><Alert severity="error">{error}</Alert></p>}
        <hr/>
        {!error && durationFull !== 0 && <>
            {length > 0 && <p>Prepared download of {string(BigInt(length))} primes in {d(durationFull)}</p>}
            {length  === -1 && <p>Getting from cache in {d(durationFull)}</p>}
            <hr/>
        </>}
        {!error && (primes.length > 0) && !loading && (<>
             <p>Total of primes smaller or equal than {string(BigInt(value))} is {string(BigInt(length))}</p>
            <hr/>
            <p>Duration {d(duration)}</p>
            <hr/>
            <p>Last teen primes of the sieve:</p>
            <hr/>
            <p>[{primes.map((prime: number) => string(BigInt(prime))).join(", ")}]</p>
            <hr />
        </>)}
    </div>
}