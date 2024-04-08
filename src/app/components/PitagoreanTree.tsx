'use client'

import { MAX_DIGITS_TRIPLE } from "@/helpers/Constants"
import duration from "@/helpers/duration"
import string from "@/helpers/string"
import { TextField, Button, CircularProgress, Alert } from "@mui/material"
import Image from "next/image"
import { useEffect, useState } from "react"

export interface TreeElement {
    triple: bigint[];
    square: bigint[][];
}

export interface Tree {
    tree: TreeElement[][];
    time: number;
}

export interface Triple {
    triple: bigint[];
    square: bigint[][];
    time: number;
    path: number;
}

const PitagoreanTree = () => {
    const [tree, setTree] = useState<Tree>({tree: [], time: 0})
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false)
    const [number, setNumber] = useState("0")

    const [triple, setTriple] = useState<Triple>({
        triple: [BigInt(15), BigInt(8), BigInt(17)],
        square: [[BigInt(3), BigInt(1)], [BigInt(5), BigInt(4)]],
        time: 0,
        path: 0
    })


    const size = 3

    const handleSend = () => {
        setLoading(true)
        const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({number: number.toString()}),
          }
        setError(false)
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

    const M = "10**"+MAX_DIGITS_TRIPLE+" - 1"

    useEffect(() => {
        fetch("/api/pitagoreanTree?LIMIT=" + size.toString())
            .then(res => res.json())
            .then(res => setTree(res))
            .catch(error => setError(error))
    }, [])

    return <div>
        <div>
            <Image src="/image4.png" height={200} width={0} alt="" />
            <Image src="/image2.png" height={200} width={0} alt=""/>
        </div>
        <hr />
        <p>Write a number to generate a pithagorean triple. The max value of the number is {M}</p>
        <hr />
        <TextField
            className="input"
            label="Number"
            type="string"
            value={number}
            onChange={(event => {1
                // This limit make the http parameters for a GET request fails.
                if (event.target.value.toString().length <= MAX_DIGITS_TRIPLE  && parseInt(event.target.value) >= 0)
                    try {
                        setNumber(BigInt(event.target.value.toString()).toString())
                        setTriple({
                            triple: [],
                            square: [],
                            time: 0,
                            path: 0,
                        })

                    } catch (e) {

                    }
            })}
        />
        <Button onClick={handleSend} variant="contained">GENERATE</Button>
        {loading && <CircularProgress/>}
        <p>{error && <Alert severity="error">{error}</Alert>}</p>
        <hr />
        <p>More detail about what are we computing here, in the video: <a href="https://www.youtube.com/watch?v=94mV7Fmbx88" >https://www.youtube.com/watch?v=94mV7Fmbx88</a>. A visualization tool for the triples: <a href="https://www.geogebra.org/calculator/hd2hcvas">https://www.geogebra.org/calculator/hd2hcvas</a></p>
        { !error && <>
            
            {triple.square && triple.square.length === 2 && triple.square[0].length === 2  && triple.square[1].length === 2 && <>
                <hr />
                <p>The pithagorean triple generated by the number {string(BigInt(number))}, which in base 3 means the path over the tree: {string(BigInt(triple.path))}, took {triple.path.toString().length} steps in {duration(triple.time)}</p>
                <hr />
                <p>The fibonacci-like square generated:</p>
                <hr />
                <table><tbody>
                    <tr><td>{string(triple.square[0][0])}</td><td>{string(triple.square[0][1])}</td></tr>
                    <tr><td>{string(triple.square[1][0])}</td><td>{string(triple.square[1][1])}</td></tr>
                </tbody></table>
            </>}
            
            {triple.triple && triple.triple && triple.triple.length === 3 && <div>
                <hr />
                <p>The pithagorean triple generated:</p>
                <hr />
                &lt;
                    {<span title={triple.triple[0].toString()}>{string(triple.triple[0])}</span>},&nbsp; 
                    {<span title={triple.triple[1].toString()}>{string(triple.triple[1])}</span>},&nbsp;
                    {<span title={triple.triple[2].toString()}>{string(triple.triple[2])}</span>}
                &gt;
            </div>}
            <hr />
        </>}
        <div />
        <div>
            {tree.tree.map(serie => <ul key={JSON.stringify(serie)}>{serie.map(triple => {
                const x = "<" + triple.triple[0] + ", " + triple.triple[1] + ", " + triple.triple[2] + ">"
                return <li key={x}>{x}</li>
            })}</ul>)}
        </div>
        <hr />
        <p>Tree of height {size} calculated in {duration(tree.time)}</p>
    </div>
}

export default PitagoreanTree;