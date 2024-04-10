'use client'

import string from "@/helpers/string"
import {default as d} from "@/helpers/duration"
import { TextField, Button, CircularProgress, Alert, FormGroup } from "@mui/material"
import { useCallback, useState } from "react"
import { MAX_COMPUTATION_FACTORS, MAX_DIGITS_FACTORIZATION } from "@/helpers/Constants"

const PrimeFactorization = () => {

    const [number, setNumber] = useState<bigint[]>([BigInt(2)])

    const [value, setValue] = useState<string>("2")

    const [duration, setDuration] = useState(1)

    const [message, setMessage] = useState<string>("")
    
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
                    setMessage(res.message)
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

    return <div>
        <hr />
        <p>Enter a number below to factorize it. The max number can be entered is 10**{MAX_DIGITS_FACTORIZATION} - 1.</p>
        <hr />
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Number"
                type="number"
                disabled={loading}
                value={value}
                onChange={(event => {
                    try {
                        if (event.target.value.length <= MAX_DIGITS_FACTORIZATION && parseInt(event.target.value) > 0) {
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
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}
        <hr/>
        {!error && !loading && <>
            {number.length > 0 && <>
                <p>
                    <span key="-2">{string(BigInt(value))}</span>
                    <span key="-1">&nbsp;=&nbsp;</span>
                    {number.map((n, id) => {
                        let response = [];
                        if (message.includes("Factor " + n.toString() + " is not prime"))
                            response.push(<span key={id} style={{color: "red"}}>{string(n)}</span>)
                        else
                            response.push(<span key={id}>{string(n)}</span>)
                        if (id < number.length - 1)
                            response.push(<span key={id + " delimiter"}>&nbsp;*&nbsp;</span>)
                        return response
                    })}
                </p>
                <hr />
                {message && <><Alert severity="error">
                    Numbers in red are composite numbers. That happens when at least 2 prime factors are bigger than {string(BigInt(MAX_COMPUTATION_FACTORS))}
                </Alert><hr/></>}
                <p>Done in {d(duration)}</p>
            </>}            
            {number.length === 0 && <><p>{string(BigInt(value)) + " = [?]"}</p></>}
        </>}
    </div>

}

export default PrimeFactorization;