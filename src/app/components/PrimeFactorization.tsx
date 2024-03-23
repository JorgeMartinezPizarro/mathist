import { TextField, Button, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react"

export default () => {

    const [number, setNumber] = useState(false)

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
        
        <p>Enter a number below to obtain its factorization into primes</p>
        <hr />
        <img height={200} src="/image3.png" />
        <hr />
        <TextField
            className="input"
            label="Number"
            type="number"
            disabled={loading}
            value={value}
            onChange={(event => {
                if (event.target.value.length < 17)
                    setValue(event.target.value)
            })}
        />
        <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
        {items && JSON.stringify(items, null, 2)}
        {loading && <CircularProgress/>}
        <div>Done in {duration} ms</div>
    </div>

}

