'use client'

import { TextField, Button, CircularProgress, Alert, FormGroup, Grid } from "@mui/material"
import Image from "next/image"
import { useEffect, useState } from "react"

import { MAX_DIGITS_TRIPLE } from "@/helpers/Constants"
import NumberToString from "@/helpers/NumberToString"
import Progress from "@/helpers/Progress"
import duration from "@/helpers/duration"

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
}

const PitagoreanTree = () => {
    const [tree, setTree] = useState<Tree>({tree: [], time: 0})
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false)
    const [number, setNumber] = useState<string>("")

    const [triple, setTriple] = useState<Triple>({
        triple: [BigInt(3), BigInt(4), BigInt(5)],
        square: [[BigInt(1), BigInt(1)], [BigInt(3), BigInt(2)]],
        time: 1
    })

    const size = 3

    const handleSend = () => {
        setLoading(true)
        const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
                number: number,
            }),
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

    useEffect(() => {
        fetch("/api/pitagoreanTree?LIMIT=" + size.toString())
            .then(res => res.json())
            .then(res => setTree(res))
            .catch(error => setError(error))
    }, [])

    return <>
        <p>
            <Image src="/image4.png" priority={true} height={100} width={100} alt="" />
            <Image src="/image2.png" priority={true} height={100} width={200} alt=""/>
        </p>
        <hr />
        <p>More detail about what are we computing here, in the video: <a href="https://www.youtube.com/watch?v=94mV7Fmbx88" >https://www.youtube.com/watch?v=94mV7Fmbx88</a>.</p>
        <hr />
        <p>A visualization tool for the triples: <a href="https://www.geogebra.org/calculator/hd2hcvas">https://www.geogebra.org/calculator/hd2hcvas</a></p>
        <hr/>
        <p>Write a path in base 3 to generate a pithagorean triple. The max length of the path is {MAX_DIGITS_TRIPLE}.</p>
        <hr />
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Path"
                type="string"
                value={number}
                onChange={(event => {
                    // check it is base 3
                    const regex = new RegExp("[^012$]");
                    if (event.target.value.toString().length <= MAX_DIGITS_TRIPLE && !regex.test(event.target.value))
                        try {
                            setNumber(event.target.value)
                            setTriple({
                                triple: [],
                                square: [],
                                time: 0
                            })

                        } catch (e) {

                        }
                })}
            />
            <Button onClick={handleSend} variant="contained">GENERATE</Button>
            <Progress loading={loading} />
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}
        { !error && <>
            {triple.square && triple.square.length === 2 && triple.square[0].length === 2  && triple.square[1].length === 2 && <>
                <hr />
                <p>The computation took {number.length} steps in {duration(triple.time)}</p>
                <hr />
                <p>The fibonacci-like square generated:</p>
                <hr />
                <Grid container spacing={2}>
                    {[0, 1].map(n => [0, 1].map(m => <Grid key={n + "" + m} className="multiLine" item xs={6}>
                        <NumberToString number={triple.square[n][m]} />
                    </Grid>))}
                </Grid>
            </>}
            {triple.triple && triple.triple && triple.triple.length === 3 && <>
                <hr />
                <p>The pithagorean triple generated:</p>
                <hr />
                <Grid container spacing={2}>
                    {[0, 1, 2].map(n => {
                        return <Grid key={n} className="multiLine" item xs={4}>
                        <NumberToString number={triple.triple[n]} />
                    </Grid>
                    })}
                </Grid>
            </>}
            <hr />
        </>}
        <p>Pithagorean tree of length 3 calculated in {duration(tree.time)}</p>
        <hr />
        <div style={{overflowX: "auto"}}>
            <table className="pithagorean"><tbody>{tree.tree.length > 0 && (<>
                <tr>
                    <td title={"<"+ tree.tree[0][0].triple.join(", ")+">"}>&lt;{tree.tree[0][0].triple.join(", ")}&gt;</td>
                </tr>
                <tr>
                    <td>
                        <table className="pithagorean"><tbody><tr>{tree.tree[1].map(el => <td key={el.triple.toString()} title={"<"+ el.triple.join(", ")+">"}>&lt;{el.triple.join(", ")}&gt;</td>)}</tr></tbody></table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table className="pithagorean"><tbody><tr>
                            <td key={"1"}>
                                <table className="pithagorean"><tbody><tr>{tree.tree[2].slice(0, 3).map(el => <td key={el.triple.toString()} title={"<"+ el.triple.join(", ")+">"} >&lt;{el.triple.join(", ")}&gt;</td>)}</tr></tbody></table>
                            </td>
                            <td key={"2"}>
                                <table className="pithagorean"><tbody><tr>{tree.tree[2].slice(3, 6).map(el => <td key={el.triple.toString()} title={"<"+ el.triple.join(", ")+">"}>&lt;{el.triple.join(", ")}&gt;</td>)}</tr></tbody></table>
                            </td>
                            <td key={"3"}>
                                <table className="pithagorean"><tbody><tr>{tree.tree[2].slice(6, 9).map(el => <td key={el.triple.toString()} title={"<"+ el.triple.join(", ")+">"}>&lt;{el.triple.join(", ")}&gt;</td>)}</tr></tbody></table>
                            </td>
                        </tr></tbody></table>
                    </td>
                </tr>
            </>)}</tbody></table>
        </div>
    </>
}

export default PitagoreanTree;