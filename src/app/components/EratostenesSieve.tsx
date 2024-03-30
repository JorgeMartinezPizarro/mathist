'use client'

import { Button, CircularProgress, TextField, Alert  } from "@mui/material"
import { useCallback, useState } from "react"
import {default as d} from "@/helpers/duration"
import string from "@/helpers/string";


export default () => {
    const [number, setNumber] = useState<number[]|boolean>([2])

    const [value, setValue] = useState<string>("1")

    const [duration, setDuration] = useState(0)

    const [length, setLength] = useState(0)

    const [loading, setLoading] = useState<boolean>(false)
    
    const [error, setError] = useState<string|boolean>(false)

    const downloadCSV = async () => {
        const limit = parseInt(value)
        if (limit > 10**10) {
          setError("Invalid length " + limit + ", max allowed is 10**10")
          return
        }
        else {
          setError("")
          const url = "/api/primes?LIMIT="+limit+"&amount="+limit+"&excel=true"
          const x = await fetch(url)
          let primes = await x.json()
          const csvContent = "data:text/csv;charset=utf-8," + primes            
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "primes-to-" + limit + ".csv");
          document.body.appendChild(link);
          link.click();        
          document.body.removeChild(link);
        }
    };

    const submitNumber = useCallback(() => {
        const url = "/api/primes?LIMIT="+value.toString()+"&amount="+10
        setLoading(true)
        setError(false)
        setNumber([])
        setLength(0)
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setLoading(false)
                    setError(res.error)
                    setLength(0)
                    setNumber([])
                } else {
                    setDuration(res.time)
                    setLength(res.length)
                    setLoading(false)
                    setNumber(res.primes)
                }
                
            })
            .catch(err => {
                setLoading(false)
                setError(err)
                setLength(0)
                setNumber([])
            })

    }, [value])

    const max = 9;
    
    return <div>
        <img src="/image6.png" height={200} />
        <hr />
        <p>Eratostenes sieve of a given length. Max length is 10**{max} - 1. The generated CSV file can be up to 478MB (max allowed is 512MB)</p>
        <hr />
        <div>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    if (event.target.value.length <= max && parseInt(event.target.value) > 0) {
                        setValue(event.target.value)
                        setNumber(false)
                    }
                })}
            />
            <Button type="submit" disabled={loading} onClick={submitNumber} variant="contained">GENERATE</Button>
            <Button disabled={loading} onClick={downloadCSV} variant="contained">DOWNLOAD</Button>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <CircularProgress />}
            
        </div>
        {error && <p><Alert severity="error">{error}</Alert></p>}
        {!error && number && !loading && (<>
            <hr />
            <p>Total of primes smaller or equal {string(BigInt(value))} is {string(BigInt(length))}</p>
            <hr/>
            <p>Duration {d(duration)}</p>
            <hr/>
            <p>Last teen primes of the sieve:</p>
            <hr />
            <p>[{number && number.slice(-10).map(value => string(BigInt(value))).join(", ")}]</p>
            <hr />
        </>)}
    </div>
}