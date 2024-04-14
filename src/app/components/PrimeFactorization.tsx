'use client'

import string from "@/helpers/string"
import {default as d} from "@/helpers/duration"
import { TextField, Button, CircularProgress, Alert, FormGroup } from "@mui/material"
import { useCallback, useState } from "react"
import { MAX_COMPUTATION_FACTORS, MAX_DIGITS_FACTORIZATION } from "@/helpers/Constants"
import { PrimePower } from "@/helpers/factors"
import NumberToString from "@/helpers/NumberToString"
import Progress from "@/helpers/Progress"

const PrimeFactorization = () => {

    const [number, setNumber] = useState<PrimePower[]>([
        { prime: BigInt(2), exponent: 1 }
    ])

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

    return <>
        <hr />
        <p>Enter a number below to factorize it. The max number can be entered is 10**{MAX_DIGITS_FACTORIZATION} - 1.</p>
        <hr />
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Number"
                type="text"
                disabled={loading}
                value={value}
                onChange={(event => {
                    try {
                        const regex = new RegExp("[^0123456789$]");
                        
                        if (event.target.value.length <= MAX_DIGITS_FACTORIZATION && !regex.test(event.target.value)) {
                            setValue(event.target.value)
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
            {loading ? <Progress /> : <span className="progress"/>}         
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}
        <hr/>
        {!error && !loading && <>
            {number.length > 0 && <>
                <p className="inline-grid">
                    <span key="-2"><NumberToString number={BigInt(value)} /></span>
                    <span key="-1">&nbsp;=&nbsp;</span>
                    {number.map((n, id) => {
                        let response = [];
                        if (message.includes("Factor " + n.prime.toString() + " is not prime"))
                            response.push(<span key={id} style={{color: "red"}}><NumberToString number={n.prime} />{n.exponent > 1 ? ("**" + n.exponent) : ""}</span>)
                        else
                            response.push(<span key={id}><NumberToString number={n.prime} />{n.exponent > 1 ? ("**" + n.exponent) : ""}</span>)
                        if (id < number.length - 1)
                            response.push(<span key={id + " delimiter"}>&nbsp;*&nbsp;</span>)
                        return response
                    })}
                </p>
                <hr />
                {message.includes("Factor ") && message.includes(" is not prime") && <>
                    <Alert severity="error">
                        Numbers in red are composite numbers. That happens when at least 2 prime factors are bigger than <NumberToString number={MAX_COMPUTATION_FACTORS} />
                    </Alert>
                <hr/></>}
                { message && (!message.includes("Factor ") || !message.includes(" is not prime")) && <>
                    <Alert severity="error">
                        {message}
                    </Alert>
                <hr/></>}
                <p>Done in {d(duration)}</p>
            </>}            
            {number.length === 0 && <><p>{string(BigInt(value)) + " = [?]"}</p></>}
        </>}
    </>

}

export default PrimeFactorization;