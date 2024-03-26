'use client'

import { Button, CircularProgress, TextField } from "@mui/material"
import { useCallback, useState } from "react"

import string from "@/helpers/string";

export default () => {
    const [number, setNumber] = useState([2])

    const [value, setValue] = useState<string>("1")

    const [duration, setDuration] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)

    const submitNumber = useCallback(() => {
        const a = Date.now();
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
                setDuration(Date.now() - a)
                setLoading(false)
                setNumber(res)
            })
            .catch(err => setLoading(false))

    }, [value])

    

    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        Eratostenes sieve of a given length. Max length is 10**8 - 1
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    if (event.target.value.length < 9)
                        setValue(event.target.value)
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
            {loading && <CircularProgress />}
        </div>
        <hr />
        Total of primes smaller than {string(value)} is {string(number.length.toString())}
        <hr/>
        Duration {duration} ms
        <hr/>
        Last teen primes of the sieve:
        <hr />
        [{number.slice(-10).map(value => string(value)).join(", ")}]
        <hr />
        Logarithmic approximation to the total of primes {string(Math.round(parseInt(value) / Math.log(parseInt(value))).toString())}
    </div>

}