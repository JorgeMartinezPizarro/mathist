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

    console.log(items)

    return <div>
        <TextField
            className="input"
            type="number"
            disabled={loading}
            value={value}
            onChange={(event => {
                if (event.target.value.length < 17)
                    setValue(event.target.value)
            })}
        />
        <Button disabled={loading} onClick={submitNumber} variant="contained">Submit</Button>
        {items && JSON.stringify(items, null, 2)}
        {loading && <CircularProgress/>}
        <div>Done in {duration} ms</div>
    </div>

}
