'use client'

import string from "@/helpers/string"
import { TextField, Button, CircularProgress } from "@mui/material"
import { useCallback, useState } from "react"

export default () => {

    const [number, setNumber] = useState([])

    const [value, setValue] = useState<string>("")

    const [duration, setDuration] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)

    const submitNumber = useCallback(() => {
        
        const url = "/api/factors?"+ ( new URLSearchParams( {LIMIT: value} ) ).toString()
        setLoading(true)
        fetch(url)
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setNumber(res.factors)
                setDuration(res.time)
            })
            .catch(err => setLoading(false))

    }, [value])

    const max = 18

    const items = (number && number.map(nr => BigInt(nr).toString()))

    return <div>
        <p>Enter a number below to obtain its factorization into primes</p>
        <hr />
        <p>2**82589933 - 1 is the biggest known prime, a prime with 24862048 digits. Read more about it <a href="https://www.mersenne.org/primes/?press=M82589933">https://www.mersenne.org/primes/?press=M82589933</a></p>
        <hr />
        <p>The max number can be entered is 10**{max} - 1</p>
        <hr />
        <p>Try with {string(BigInt("80497510791956303"))} or generate your own primes using: <a href="https://bigprimes.org/">https://bigprimes.org/</a></p>
        <hr />
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
        {loading && <CircularProgress/>}
        <hr />
        <p>{items && string(BigInt(value)) + " = " + items.map(item => string(BigInt(item))).join(" * ") + ""}</p>
        <hr />
        <p>Done in {duration} μs</p>
        <hr />
    </div>

}