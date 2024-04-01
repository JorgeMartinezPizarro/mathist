'use client'

import { Button, CircularProgress, TextField, Alert  } from "@mui/material"
import { useCallback, useState } from "react"

import {default as d} from "@/helpers/duration"
import string from "@/helpers/string";
import {MAX_DIGITS_SIEVE, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE} from "@/helpers/Constants"

export default () => {
    const [number, setNumber] = useState<number[][]|boolean>([[2]])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(0)

    const [durationFull, setDurationFull] = useState(0)

    const [length, setLength] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState<string|boolean>(false)

    const downloadCSV = async () => {
        const limit = parseInt(value)
        setError("")
        setLoading(true)
        setNumber([])
        setDurationFull(0)
        try {
            const url = "/api/primes?LIMIT="+limit+"&amount="+limit+"&excel=true"
            const response = await fetch(url)
            const {filename, time, error, length: l} = await response.json()
            if (error) {
                throw new Error(error)
            }
            setLength(l)
            console.log(length + " primes found")
            const link = document.createElement("a");
            link.href = "/files/" + filename;
            link.download = "primes-to-" + limit.toString() + ".csv";
            document.body.appendChild(link);
            link.click();        
            document.body.removeChild(link);
            setLoading(false)
            setDurationFull(time)
        } catch (e) {
            setDurationFull(0)
            setError(e.toString())
            setLoading(false)
        }
    };

    const submitNumber = useCallback(() => {
        const url = "/api/primes?LIMIT="+value.toString()+"&amount="+MAX_DISPLAY_SIEVE
        setLoading(true)
        setError(false)
        setNumber([])
        setLength(0)
        setDurationFull(0)
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setLoading(false)
                    setError(res.error)
                    setLength(0)
                    setNumber([])
                } else {
                    setDuration(res.time)
                    setLength(res.length)
                    setLoading(false)
                    setNumber(res.primes)
                }
                
            })
            .catch(err => {
                setLoading(false)
                setError(err)
                setLength(0)
                setNumber([])
            })

    }, [value])

    const primes = number && number.length ? number.slice(-1)[0].slice(0, MAX_DISPLAY_SIEVE).reverse() : false

    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        <p>Eratosthenes sieve of a number, with a max of {string(BigInt(MAX_LENGTH_FOR_SIEVE))}. Download file can get up to 2GB. It takes around 1 minute to generate.</p>
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
                        setNumber(false)
                    }
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">GENERATE</Button>
            <Button disabled={loading} onClick={downloadCSV} variant="contained">DOWNLOAD</Button>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <CircularProgress />}
            
        </div>
        {error && <p><Alert severity="error">{error}</Alert></p>}
        {!error && durationFull !== 0 && <p>Prepared download of {length} primes in {d(durationFull)}</p>}
        {!error && primes && !loading && (<>
            <hr />
            <p>Total of primes smaller or equal {string(BigInt(value))} is {string(BigInt(length))}</p>
            <hr/>
            <p>Duration {d(duration)}</p>
            <hr/>
            <p>Last teen primes of the sieve:</p>
            <hr />
            <p>[{primes.map((prime: string) => string(BigInt(prime))).join(", ")}]</p>
            <hr />
        </>)}
    </div>
}