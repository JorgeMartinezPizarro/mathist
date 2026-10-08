'use client'

import { useState } from "react"

import { MAX_SERIES_DIFFERENCES_SIZE } from "@/Constants"
import useApi from "@/hooks/useApi"
import ActionForm from "@/widgets/ActionForm"
import ErrorAlert from "@/widgets/ErrorAlert"
import { Field } from "@/widgets/Field"
import NumberToString from "@/widgets/NumberToString"

// value is the name the API expects
const SERIES = [
  { value: "integer", label: "Integers" },
  { value: "square", label: "Squares" },
  { value: "triangular", label: "Triangulars" },
  { value: "penthagonal", label: "Pentagonals" },
  { value: "hexagonal", label: "Hexagonals" },
  { value: "cube", label: "Cubes" },
  { value: "exponential", label: "Exponentials" },
  { value: "prime", label: "Primes" },
  { value: "fibonacci", label: "Fibonacci" },
  { value: "luca", label: "Lucas" },
  { value: "factorial", label: "Factorials" },
]

const SerieDifferences = () => {

  const [name, setName] = useState(SERIES[0].value)
  const differences = useApi<string[][]>()
  const label = SERIES.find(series => series.value === name)?.label
  // Rows with only zeros say nothing, so they are hidden
  const rows = (differences.data || []).filter(row => row.some(n => BigInt(n) !== BigInt(0)))

  return <>
    <div className="intro">
      <p>Select a series to obtain its series of differences. Some of these series of series have regularities, while others not.</p>
      <p>Here an explanation of the differences of series: <a href="https://www.youtube.com/watch?v=4AuV93LOPcE">https://www.youtube.com/watch?v=4AuV93LOPcE</a></p>
    </div>
    <ActionForm onSubmit={() => differences.get("/api/differences?name=" + name + "&length=" + MAX_SERIES_DIFFERENCES_SIZE)} loading={differences.loading}>
      <Field label="Series">
        <select
          value={name}
          disabled={differences.loading}
          onChange={event => {
            setName(event.target.value)
            differences.reset()
          }}
        >
          {SERIES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </Field>
      <button type="submit" disabled={differences.loading}>Generate</button>
    </ActionForm>
    <ErrorAlert error={differences.error} />
    {rows.length > 0 && <section className="result">
      <p>{label}: the first {MAX_SERIES_DIFFERENCES_SIZE} terms and their nth-differences up to {MAX_SERIES_DIFFERENCES_SIZE}</p>
      <div className="table-scroll">
        <table className="series">
          <tbody>
            {rows.map((row, i) => <tr key={i}>
              {row.map((n, j) => <td key={j} className={i === j ? "diagonal" : undefined}><NumberToString number={n} /></td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>}
  </>
}

export default SerieDifferences;
