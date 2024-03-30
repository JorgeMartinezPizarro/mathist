'use client'

import string from "@/helpers/string"
import { TextField, Button, CircularProgress, Alert } from "@mui/material"
import { useEffect, useState } from "react"

export default () => {
    const [tree, setTree] = useState({tree: [], time: 0})
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false)
    const [number, setNumber] = useState(BigInt(0))

    const [triple, setTriple] = useState({
        triple: [3,4,5],
        square: [[1, 1], [3, 2]],
        time: 0
    })


    const size = 5

    const handleSend = () => {
        setLoading(true)
        const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({number: number.toString()}),
          }

        fetch("/api/pitagoreanTriple", options)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setLoading(false)
                    setError(res.error)
                } else {
                    setTriple(res)
                    setLoading(false)
                }
                
            })
            .catch(error => {
                setLoading(false)
                setError(error)
            })
    }

    const a = 60000
    
    const M = "10**"+a+" - 1"

    useEffect(() => {
        fetch("/api/pitagoreanTree?" + ( new URLSearchParams( {LIMIT: size} ) ).toString())
            .then(res => res.json())
            .then(res => setTree(res))
            .catch(error => setError(error))
    }, [])

    return <div>
        <div>
            <img src="/image4.png" height={200}  />
            <img src="/image2.png" height={200}  />
        </div>
        <hr />
        <p>The max value of the number is {M}</p>
        <hr />
        <TextField
            className="input"
            type="string"
            value={number}
            onChange={(event => {1
                // This limit make the http parameters for a GET request fails.
                if (event.target.value.toString().length <= a)
                    setNumber(BigInt(event.target.value.toString()).toString())
            })}
        />
        <Button onClick={handleSend} variant="contained">GENERATE</Button>
        {loading && <CircularProgress/>}
        <p>{error && <Alert severity="error">{error}</Alert>}</p>
        <hr />
        <p>The pithagorean triple generated by the number {string(number)}, which in base 3 means the path over the tree: {string(triple.path || 0)}  took {triple.time} μs. </p>
        <hr />
        <p>To generate the triple, it took {(triple.path||"").length} steps</p>
        <hr />
        <p>Numbers bigger than 10**25-1 are not displayed completely</p>
        <hr />
        <p>More detail about what are we computing here, in the video: <a href="https://www.youtube.com/watch?v=94mV7Fmbx88" >https://www.youtube.com/watch?v=94mV7Fmbx88</a></p>
        <hr />
        <p>The fibonacci-like square generated:</p>
        <hr />
        {triple.square && <table><tbody>
            <tr><td>{string(triple.square[0][0])}</td><td>{string(triple.square[0][1])}</td></tr>
            <tr><td>{string(triple.square[1][0])}</td><td>{string(triple.square[1][1])}</td></tr>
        </tbody></table>}
        <hr />
        <p>The pithagorean triple generated:</p>
        <hr />
        {triple.square && <div>
            &lt;
                {<span title={triple.triple[0].toString()}>{string(triple.triple[0])}</span>},&nbsp; 
                {<span title={triple.triple[1].toString()}>{string(triple.triple[1])}</span>},&nbsp;
                {<span title={triple.triple[2].toString()}>{string(triple.triple[2])}</span>}
            &gt;
        </div>}
        <hr />
        <div />
        <p>Tree of height {size} calculated in {tree.time} μs</p>
        <hr />

        <div>{
            tree.tree.map(serie => <ul key={serie.toString()}>{serie.map(triple => {
                const x = "<" + triple.triple[0] + ", " + triple.triple[1] + ", " + triple.triple[2] + ">"
                return <li key={x}>{x}</li>
            })}</ul>)
        }</div>
        
        
    </div>
}
