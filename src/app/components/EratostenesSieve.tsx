'use client'

import { Button, CircularProgress, TextField } from "@mui/material"
import { useCallback, useState } from "react"

import string from "@/helpers/string";
import Bits from "@/helpers/Bits";

export default () => {
    const [number, setNumber] = useState([2])

    const [value, setValue] = useState<string>("1")

    const [duration, setDuration] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)

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
        fetch(url, options)
            .then(res => res.json())
            .then(res => {
                setDuration(res.time)
                setLoading(false)
                setNumber(res.primes)
            })
            .catch(err => setLoading(false))

    }, [value])

    const max = 8
    
    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        Eratostenes sieve of a given length. Max length is 10**{max} - 1
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
        <hr />
        <p>Total of primes smaller than {string(value)} is {string(number.length.toString())}</p>
        <hr/>
        <p>Duration {duration} μs</p>
        <hr/>
        <p>Last teen primes of the sieve:</p>
        <hr />
        [{number.slice(-10).map(value => string(value)).join(", ")}]
        <hr />
        <p>Logarithmic approximation to the total of primes {string(Math.round(parseInt(value) / Math.log(parseInt(value))).toString())}</p>
    </div>

}

//
//{number && number.get(parseInt(value) - 1)}