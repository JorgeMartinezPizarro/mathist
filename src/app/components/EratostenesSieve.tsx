'use client'

import { Button, CircularProgress, TextField, Alert, FormGroup } from "@mui/material"
import { useState } from "react"
import Image from "next/image";

import {default as d} from "@/helpers/duration"
import {MAX_ALLOCATABLE_MATRIX_30GB, MAX_DIGITS_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY} from "@/helpers/Constants"
import toHuman from "@/helpers/toHuman";
import NumberToLocale from "@/helpers/NumberToLocale";
import NumberToString from "@/helpers/NumberToString";

const EratostenesSieve = () => {

    const [primes, setPrimes] = useState<number[]>([2])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(1)

    const [durationFull, setDurationFull] = useState(0)

    const [length, setLength] = useState(1)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState<string|boolean>(false)
    
    const downloadCSV = async () => {
        try {
            const limit = parseInt(value)
            const url = "/api/primes?LIMIT="+limit+"&amount="+limit+"&excel=true"
            setError(false)
            setLoading(true)
            setDuration(0)
            setPrimes([])
            setLength(0)
            setDurationFull(0)            
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
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            setDurationFull(0)
            if (message.indexOf("Failed to fetch") !== -1)
                setError("Error generating excel, server disconnected")
            else
                setError(message.replaceAll("Error: ", ""))
            setLoading(false)
        }
    };

    const generateSieve = async () => {
        try {
            const url = "/api/primes?LIMIT="+value.toString()
            setLoading(true)
            setError(false)
            setPrimes([])
            setLength(0)
            setDurationFull(0)
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
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            if (message.indexOf("Failed to fetch") !== -1)
                setError("Error generating sieve, server disconnected")
            else 
                setError(message.replaceAll("Error: ", ""))
            setLength(0)
            setPrimes([])
        }
    }
    
    return <>
        <p><Image src="/image6.png" priority={true} height={100} width={100} alt=""/></p>
        <hr/>
        <p>Eratosthenes sieve of a given length, max is <NumberToString number={MAX_LENGTH_FOR_SIEVE_HEALTY}/> using {toHuman(MAX_LENGTH_FOR_SIEVE_HEALTY / 16)} RAM and generating 515MB of primes in around 20 seconds.</p>
        <hr/>
        <p>Tested with <NumberToString number={MAX_ALLOCATABLE_MATRIX_30GB}/> using {toHuman(MAX_ALLOCATABLE_MATRIX_30GB / 16)} RAM and generating 240GB of primes in around 12 hours, below some examples:</p>
        <hr/>
        <p>
            <a href="https://mather.ideniox.com/stored/primes-to-1m.csv" download="primes-to-1m.csv">primes-to-1m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-10m.csv" download="primes-to-10m.csv">primes-to-10m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-100m.csv" download="primes-to-100m.csv">primes-to-100m.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-1b.csv" download="primes-to-1b.csv">primes-to-1b.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-10b.csv" download="primes-to-10b.csv">primes-to-10b.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-100b.csv" download="primes-to-100b.csv">primes-to-100b.csv</a>,&nbsp;
            <a href="https://mather.ideniox.com/stored/primes-to-500b.csv" download="primes-to-500b.csv">primes-to-500b.csv</a>
        </p>
        <hr/>
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Length"
                type="text"
                disabled={loading}
                value={value}
                onChange={(event => {
                    const regex = new RegExp("[^0123456789$]");
                    if (event.target.value.length <= MAX_DIGITS_SIEVE && !regex.test(event.target.value)) {
                        setValue(event.target.value)
                        setPrimes([])
                        setDurationFull(0)
                        setDuration(0)
                        setLength(0)
                    }
                })}
            />
            <Button disabled={loading} onClick={generateSieve} variant="contained">GENERATE</Button>
            <Button disabled={loading} onClick={downloadCSV} variant="contained">DOWNLOAD</Button>
            {loading && <CircularProgress />}
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}
        {!error && durationFull !== 0 && <>
            <hr/>
            {length > 0 && <p>Generated download of <NumberToString number={length} /> primes in {d(durationFull)}</p>}
        </>}
        {!error && (primes.length > 0) && !loading && (<>
            <hr/>
            <p>Total of primes smaller or equal than <NumberToString number={BigInt(value)} /> is <NumberToString number={length} />, it took {d(duration)}</p>
            <hr/>
            <p>Last <NumberToLocale number={primes.length} singular={"prime"} /> of the sieve:</p>
            <hr/>
            <p className="inline-grid">[{primes.map((prime: number, index: number) => <>
                <NumberToString number={prime} />
                {index !== primes.length - 1 && <span>, </span>}
            </>)}]</p>         
        </>)}
        {(!error && duration > 0 && !length && !loading) && <>
            <hr/>
            <p>No primes smaller or equal than {parseInt(value)}</p>
        </>}
    </>
}

export default EratostenesSieve;
