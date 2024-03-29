'use client'

import { Button, CircularProgress, TextField, Alert  } from "@mui/material"
import { useCallback, useState } from "react"

import string from "@/helpers/string";

export default () => {
    const [number, setNumber] = useState([2])

    const [value, setValue] = useState<string>("1")

    const [duration, setDuration] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState(false)

    const submitNumber = useCallback(() => {
        const url = "/api/primes"
        const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({number: value.toString()}),
        }
        setLoading(true)
        setError(false)
        fetch(url, options)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setLoading(false)
                    setError(res.error)
                } else {
                    setDuration(res.time)
                    setLoading(false)
                    setNumber(res.primes)
                }
                
            })
            .catch(err => {
                setLoading(false)
                setError(err)
            })

    }, [value])

    const max = 9;
    
    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        <p>Eratostenes sieve of a given length. Max length is 10**{max} - 1</p>
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    if (event.target.value.length <= max)
                        setValue(event.target.value)
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
            {loading && <CircularProgress />}
            
        </div>
        <p>{error && <Alert severity="error">{error}</Alert>}</p>
        <hr />
        <p>Total of primes smaller or equal {string(value)} is {string(number.length.toString())}</p>
        <hr/>
        <p>Duration {duration} μs</p>
        <hr/>
        <p>Last teen primes of the sieve:</p>
        <hr />
        <p>[{number.slice(-10).map(value => string(BigInt(value))).join(", ")}]</p>
        <hr />
        <p>Logarithmic approximation to the total of primes {string(Math.round(parseInt(value) / Math.log(parseInt(value))).toString())}</p>
        <hr />
    </div>

}