import string from "@/helpers/string"
import { TextField, Button, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react"

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

    const items = (number && number.map(nr => BigInt(nr).toString()))

    return <div>
        <p><a href="https://bigprimes.org/">https://bigprimes.org/</a></p>
        <p>Enter a number below to obtain its factorization into primes</p>
        <p>The max number can be entered is 10**16 - 1</p>
        <hr />
        <img height={200} src="/image3.png" />
        <img height={150} src="/image7.png" />
        <hr />
        <p>Try for {string(9684682148926909n)}</p>
        <TextField
            className="input"
            label="Number"
            type="number"
            disabled={loading}
            value={value}
            onChange={(event => {
                if (event.target.value.length <= 16)
                    setValue(event.target.value)
            })}
        />
        <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
        {items && "[" + items.map(item => string(item)).join(", ") + "]"}
        {loading && <CircularProgress/>}
        <div>Done in {duration} ms</div>
    </div>

}

