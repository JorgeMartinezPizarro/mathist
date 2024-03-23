import { Button, CircularProgress, TextField } from "@mui/material"
import { useCallback, useState } from "react"

export default () => {
    const [number, setNumber] = useState([2])

    const [value, setValue] = useState<string>("1")

    const [duration, setDuration] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)

    const submitNumber = useCallback(() => {
        const a = Date.now();
        const url = "/api/primes?"+ ( new URLSearchParams( {LIMIT: value} ) ).toString()
        setLoading(true)
        fetch(url)
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setNumber(res)
                setDuration(Date.now() - a)
            })
            .catch(err => setLoading(false))

    }, [value])

    const n = (value: string): string => new Intl.NumberFormat().format(parseInt(value))


    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        Eratostenes sieve of a given length
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    if (event.target.value.length < 8)
                        setValue(event.target.value)
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
        </div>
        {loading && <CircularProgress />}
        Total of primes smaller than {n(value)} is {n(number.length.toString())}
        <hr/>
        Duration {duration} ms
        <hr/>
        Last teen primes of the sieve [{number.slice(-10).map(value => n(value.toString())).toString()}]
        <hr />
        Logarithmic approximation to the total of primes {n(Math.round(parseInt(value) / Math.log(parseInt(value))).toString())}
    </div>

}