'use client'

import { TextField, Button, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

export default () => {
    const [tree, setTree] = useState({triples: [], time: 0})

    const [number, setNumber] = useState(0)

    const [triple, setTriple] = useState([3,4,5])


    const size = 3

    const handleSend = () => {
        fetch("/api/pitagoreanTriple?" + (new URLSearchParams( {LIMIT: number})).toString())
            .then(res => res.json())
            .then(res => setTriple(res))
    }

    useEffect(() => {
        fetch("/api/pitagoreanTree?" + ( new URLSearchParams( {LIMIT: size} ) ).toString())
            .then(res => res.json())
            .then(res => setTree(res))
            .catch(error => alert("WTF"))

        
        
    }, [])

    return <div>
        <div>
            <img src="/image.png" height={200}  />
            <img src="/image2.png" height={200}  />
        </div>
        <TextField
            className="input"
            type="number"
            value={number}
            onChange={(event => {
                if (number.toString().length < 11)
                    setNumber(event.target.value)
            })}
        />
        <Button onClick={handleSend} variant="contained">Submit</Button>
        <hr />
        {"<" + triple[0] + ", " + triple[1] + ", " + triple[2] + ">"}
        <hr />
        <div>{
            tree.triples.map(serie => <ul>{serie.map(triple => {
                const x = "<" + triple[0] + ", " + triple[1] + ", " + triple[2] + ">"
                return <li>{x}</li>
            })}</ul>)
        }</div>
        {<div>Tree of height {size} calculated in {tree.time} ms</div>}
        
    </div>
}
