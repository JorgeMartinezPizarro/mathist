'use client'

import string from "@/helpers/string"
import {default as d} from "@/helpers/duration"
import { TextField, Button, CircularProgress, Alert } from "@mui/material"
import { useCallback, useState } from "react"
import { MAX_DIGITS_FACTORIZATION } from "@/helpers/Constants"

const PrimeFactorization = () => {

    const [number, setNumber] = useState<number[]>([2])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(0)
    
    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState(false)

    const submitNumber = useCallback(() => {
        
        const url = "/api/factors?"+ ( new URLSearchParams( {LIMIT: value} ) ).toString()
        setLoading(true)
        setError(false)
        setNumber([])
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (!res.error) {
                    setLoading(false)
                    setNumber(res.factors)
                    setDuration(res.time)
                }
                else {
                    setLoading(false)
                    setError(res.error)
                }
            })
            .catch(err => {
                setLoading(false)
                setError(err)
            })

    }, [value])

    const max = MAX_DIGITS_FACTORIZATION
    
    return <div>
        <hr />
        <p>Enter a number below to factorize it. The max number can be entered is 10**{max} - 1</p>
        <hr />
        <p>2**82589933 - 1 is the biggest known prime, a prime with 24862048 digits. Read more about it <a href="https://www.mersenne.org/primes/?press=M82589933">https://www.mersenne.org/primes/?press=M82589933</a></p>
        <hr />
        <p>Try with {string(BigInt("1111111111111111111"))}, {string(BigInt("5112599469399894959"))} or generate your own primes using: <a href="https://bigprimes.org/">https://bigprimes.org/</a></p>
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    try {
                        if (event.target.value.length <= max && parseInt(event.target.value) > 0) {
                            setValue(BigInt(event.target.value.toString()).toString())
                            setNumber([])
                            setDuration(0)
                            setError(false)
                        }
                    } catch (e) {
                        ;
                    }
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">FACTORIZE</Button>
            {loading && <CircularProgress/>}
            {error && <p><Alert severity="error">{error}</Alert></p>}
        </div>
        
        {!error && !loading && <>
            {number.length > 0 && <>
                <hr />
                <p>{string(BigInt(value)) + " = " + number.map(item => string(BigInt(item))).join(" * ") + ""}</p>
                <hr />
                <p>Done in {d(duration)}</p>
            </>}
            <hr />
            <p>{number.length === 0 && string(BigInt(value)) + " = [?]"}</p>
        </>}
    </div>

}

export default PrimeFactorization;