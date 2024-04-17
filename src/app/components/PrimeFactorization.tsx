'use client'

import { TextField, Button, Alert, FormGroup } from "@mui/material"
import { useCallback, useState } from "react"

import {default as d} from "@/helpers/duration"
import { MAX_DIGITS_FACTORIZATION } from "@/Constants"
import { PrimePower } from "@/types"
import NumberToString from "@/widgets/NumberToString"
import Progress from "@/widgets/Progress"

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
        
        const url = "/api/factors?LIMIT=" + value
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
            <Progress loading={loading} />
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
                        
                        if (message.includes("The factor " + n.prime.toString() + " is not prime"))
                            response.push(<span key={id} style={{color: "red"}}><NumberToString number={n.prime} />{n.exponent > 1 ? ("**" + n.exponent) : ""}</span>)
                        else
                            response.push(<span key={id}><NumberToString number={n.prime} />{n.exponent > 1 ? ("**" + n.exponent) : ""}</span>)
                        if (id < number.length - 1)
                            response.push(<span key={id + " delimiter"}>&nbsp;*&nbsp;</span>)
                        return response
                    })}
                </p>
                <hr />
                {message && <>
                    <Alert severity="error">
                        {message}
                    </Alert>
                <hr/></>}
                <p>Done in {d(duration)}</p>
            </>}            
            {number.length === 0 && <><p><NumberToString number={BigInt(value)} />&nbsp;=&nbsp;[?]</p></>}
        </>}
    </>

}

export default PrimeFactorization;