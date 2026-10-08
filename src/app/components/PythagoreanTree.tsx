'use client'

import Image from "next/image"
import { CSSProperties, useEffect, useState } from "react"

import { MAX_DIGITS_TRIPLE } from "@/Constants"
import duration from "@/helpers/duration"
import useApi from "@/hooks/useApi"
import { Tree, TreeElement, Triple } from "@/types"
import ActionForm from "@/widgets/ActionForm"
import ErrorAlert from "@/widgets/ErrorAlert"
import { DigitsField } from "@/widgets/Field"
import NumberGrid from "@/widgets/NumberGrid"
import NumberToLocale from "@/widgets/NumberToLocale"

// Levels of the tree shown under the form
const TREE_DEPTH = 3

// Example shown before the first request: the root of the tree
const INITIAL_TRIPLE: Triple = {
    triple: [3, 4, 5].map(n => BigInt(n)),
    square: [[1, 1], [3, 2]].map(row => row.map(n => BigInt(n))),
    time: 1,
}

// Every node has 3 children, so each level is split in groups of siblings
// that sit under their parent
const siblings = (level: TreeElement[]): TreeElement[][] =>
    level.length === 1 ? [level] : Array.from({ length: level.length / 3 }, (_, i) => level.slice(3 * i, 3 * i + 3))

const TreeView = ({ tree }: { tree: TreeElement[][] }) =>
    <div className="tree">
        {tree.map((level, depth) => <div key={depth} className="tree-level" style={{ "--groups": siblings(level).length } as CSSProperties}>
            {siblings(level).map((group, index) => <div key={index} className="tree-group">
                {group.map(({ triple }) => {
                    const text = "<" + triple.join(", ") + ">"
                    return <span key={text} title={text}>{text}</span>
                })}
            </div>)}
        </div>)}
    </div>

const PythagoreanTree = () => {

    const [path, setPath] = useState("")
    const triple = useApi<Triple>(INITIAL_TRIPLE)
    const tree = useApi<Tree>()
    const loadTree = tree.get

    useEffect(() => {
        loadTree("/api/pythagoreanTree?LIMIT=" + TREE_DEPTH)
    }, [loadTree])

    return <>
        <div className="illustrations">
            <Image src="/image4.png" preload height={100} width={Math.round(100 * 378 / 439)} alt="" />
            <Image src="/image2.png" preload height={100} width={Math.round(100 * 951 / 574)} alt="" />
        </div>
        <div className="intro">
            <p>More detail about what are we computing here, in the video: <a href="https://www.youtube.com/watch?v=94mV7Fmbx88">https://www.youtube.com/watch?v=94mV7Fmbx88</a>.</p>
            <p>A visualization tool for the triples: <a href="https://www.geogebra.org/calculator/hd2hcvas">https://www.geogebra.org/calculator/hd2hcvas</a></p>
            <p>Write a path in base 3 to generate a Pythagorean triple. The max length of the path is {MAX_DIGITS_TRIPLE}.</p>
        </div>
        <ActionForm onSubmit={() => triple.post("/api/pythagoreanTriple", { number: path })} loading={triple.loading}>
            <DigitsField
                label="Path"
                digits="012"
                value={path}
                maxLength={MAX_DIGITS_TRIPLE}
                disabled={triple.loading}
                onChange={newPath => {
                    setPath(newPath)
                    triple.reset()
                }}
            />
            <button type="submit" disabled={triple.loading}>Generate</button>
        </ActionForm>
        <ErrorAlert error={triple.error} />
        {triple.data && <section className="result">
            <p>The computation took <NumberToLocale number={path.length} singular="step" /> in {duration(triple.data.time)}</p>
            <p className="caption">The fibonacci-like square generated:</p>
            <NumberGrid numbers={triple.data.square.flat()} columns={2} />
            <p className="caption">The Pythagorean triple generated:</p>
            <NumberGrid numbers={triple.data.triple} columns={3} />
        </section>}
        <hr />
        <ErrorAlert error={tree.error} />
        {tree.data && <>
            <p>Pythagorean tree of length {TREE_DEPTH} calculated in {duration(tree.data.time)}</p>
            <TreeView tree={tree.data.tree} />
        </>}
    </>
}

export default PythagoreanTree;
