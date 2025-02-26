'use client'

import { Button, TextField, Alert, FormGroup } from "@mui/material"
import { useState } from "react"
import Image from "next/image";

import {default as d} from "@/helpers/duration"
import { MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH } from "@/Constants"
import toHuman from "@/helpers/toHuman";
import NumberToLocale from "@/widgets/NumberToLocale";
import NumberToString from "@/widgets/NumberToString";
import Progress from "@/widgets/Progress";
import errorMessage from "@/helpers/errorMessage";

const EratosthenesSieve = () => {

    const [primes, setPrimes] = useState<number[]>([2])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(1)

    const [isPartial, setIsPartial] = useState(false)

    const [durationFull, setDurationFull] = useState(0)

    const [length, setLength] = useState(1)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState<string|boolean>(false)
    
    const downloadCSV = async () => {
        try {
            const url = "/math/api/primes?LIMIT="+value+"&excel=true"
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
            if (filename === "") {
                throw new Error("Failed to generate the file with primes.")
            }
            const link = document.createElement("a");
            link.href = filename;
            link.download = "primes-to-" + value + ".csv";
            document.body.appendChild(link);
            link.click();        
            document.body.removeChild(link);
            setLength(l)
            setIsPartial(true)
            setLoading(false)
            setDurationFull(time)
        } catch (error) {
            setError(errorMessage(error))
            setLoading(false)
        }
    };

    const generateSieve = async () => {
        try {
            const url = "/math/api/primes?LIMIT="+value
            setLoading(true)
            setError(false)
            setPrimes([])
            setLength(0)
            setDurationFull(0)
            const promise = await fetch(url)
            const response = await promise.json()
            const {primes, time, length, error, isPartial} = response
            if (error) {
                throw new Error(error.toString())
            }
            setDuration(time)
            setLength(length)
            setLoading(false)
            setPrimes(primes)
            setIsPartial(isPartial)
        } catch(error) {
            setLoading(false)
            setError(errorMessage(error))
            setLength(0)
            setPrimes([])
        }
    }
    
    return <>
        <p><Image src="/math/image6.png" priority={true} height={100} width={100 * 217 / 260} alt=""/></p>
        <hr/>
        <p>Eratosthenes sieve of a given length up to 10 quatrillion. Over 100 million we use segmented sieve.</p>
        <hr/>
        <p>Used to generate prime lists up to 1 trillion (up to 1t there are 450GB of primes, so I will omit that link). Below the prime files generated:</p>
        <hr/>
        <p>
            <a href="https://math.ideniox.com/stored/primes-to-1m.csv" download="primes-to-1m.csv">primes-to-1m.csv</a>,&nbsp;
            <a href="https://math.ideniox.com/stored/primes-to-10m.csv" download="primes-to-10m.csv">primes-to-10m.csv</a>,&nbsp;
            <a href="https://math.ideniox.com/stored/primes-to-100m.csv" download="primes-to-100m.csv">primes-to-100m.csv</a>,&nbsp;
            <a href="https://math.ideniox.com/stored/primes-to-1b.csv" download="primes-to-1b.csv">primes-to-1b.csv</a>,&nbsp;
            <a href="https://math.ideniox.com/stored/primes-to-10b.csv" download="primes-to-10b.csv">primes-to-10b.csv</a>,&nbsp;
            <a href="https://math.ideniox.com/stored/primes-to-100b.csv" download="primes-to-100b.csv">primes-to-100b.csv</a>,&nbsp;
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
                    if (event.target.value.length <= MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH.toString().length && !regex.test(event.target.value)) {
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
            <Progress loading={loading}/>
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}
        {!error && durationFull !== 0 && <>
            <hr/>
            {length > 0 && <p>Generated download of <NumberToString number={length} /> primes in {d(durationFull)}</p>}
        </>}
        {!error && (primes.length > 0) && !loading && (<>
            <hr/>
            {!isPartial && <p>Total of primes smaller or equal than <NumberToString number={BigInt(value)} /> is <NumberToString number={length} />, it took {d(duration)}. Used eratosthenes sieve.</p>}
            {isPartial && <p>Ten primes up to <NumberToString number={BigInt(value)} /> found using the segmented sieve in {d(duration)} </p>}
            <hr/>
            <p>Last <NumberToLocale number={primes.length} singular={"prime"} /> of the sieve:</p>
            <hr/>
            <p className="inline-grid">[&nbsp;{primes.map((prime: number, index: number) => <span key={prime}>
                <span key={"number"}><NumberToString number={prime} /></span>
                {index !== primes.length - 1 && <span key={"divider"}>,&nbsp;</span>}
            </span>)}&nbsp;]</p>
        </>)}
        {(!error && duration > 0 && !length && !loading) && <>
            <hr/>
            <p>No primes smaller or equal than {parseInt(value)}</p>
        </>}
    </>
}

export default EratosthenesSieve;
