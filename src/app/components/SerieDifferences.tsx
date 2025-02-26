'use client'

import { useState, useCallback } from "react"
import { TextField, Button, FormGroup, Alert, MenuItem } from "@mui/material"

import { MAX_SERIES_DIFFERENCES_SIZE } from "@/Constants"
import NumberToString from "@/widgets/NumberToString"
import Progress from "@/widgets/Progress"
import errorMessage from "@/helpers/errorMessage"

const SerieDifferences = () => {
  
  const [number, setNumber] = useState<bigint[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [value, setValue] = useState<string>("integer")

  const handleSubmit = useCallback(() => {
    setLoading(true)
    fetch("/math/api/differences?name=" + value + "&length=" + MAX_SERIES_DIFFERENCES_SIZE)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error)
        }
        setNumber(res)
        setLoading(false)
      })
      .catch(error=> {
        setError(errorMessage(error))
        setLoading(false)
      })
  }, [value])

  return (
    <>
        <p>Select a serie to obtain it&apos;s series of differences. Some of these series of series have regularities, while others not.</p>
        <hr />
        <p>Here an explanation of the differences of series: <a href="https://www.youtube.com/watch?v=4AuV93LOPcE">https://www.youtube.com/watch?v=4AuV93LOPcE</a></p>
        <hr />
      <FormGroup row={true}>
        <TextField
          value={value}
          label="Number"
          name="number"
          id="number"
          onChange={event => {
            setValue(event.target.value)
            setNumber([])
          }}
          select 
        >
          <MenuItem key={"integer"} value={"integer"}>Integers</MenuItem>
          <MenuItem key={"square"} value={"square"}>Squares</MenuItem>
          <MenuItem key={"triangular"} value={"triangular"}>Triangulars</MenuItem>
          <MenuItem key={"penthagonal"} value={"penthagonal"}>Penthagonals</MenuItem>
          <MenuItem key={"hexagonal"} value={"hexagonal"}>Hexagonals</MenuItem>
          <MenuItem key={"cube"} value={"cube"}>Cubes</MenuItem>
          <MenuItem key={"exponential"} value={"exponential"}>Exponentials</MenuItem>
          <MenuItem key={"prime"} value={"prime"}>Primes</MenuItem>
          <MenuItem key={"fibonacci"} value={"fibonacci"}>Fibonacci</MenuItem>
          <MenuItem key={"luca"} value={"luca"}>Luca</MenuItem>
          <MenuItem key={"factorial"} value={"factorial"}>Factorials</MenuItem>
        </TextField>
        <Button disabled={loading} onClick={()=> {
          handleSubmit()
        }} variant="contained">GENERATE</Button>
        <Progress loading={loading} />
      </FormGroup>
      
      {error && <><hr/><Alert severity="error">{error}</Alert></>}
      
      {number.length > 0 && (<>
        <hr />
        <p>Below the {MAX_SERIES_DIFFERENCES_SIZE} first {value} numbers and it&apos;s nth-differences up to {MAX_SERIES_DIFFERENCES_SIZE}</p>
        
      </>)}
      {number.length > 0 &&  <>
        <hr />
        <div style={{overflowX: "auto"}}>
          <table className="series">
            <tbody>
              {number.filter((el, id) => {
                for (var idx = 0; idx<el.length; idx++) {
                  if (BigInt(el[idx].toString()) !== BigInt(0))
                    return true
                }
                return false
              }).map((row, i) => 
                <tr key={JSON.stringify(row)}>{row.map((nr, j) => 
                  <td className={i === j ? "diagonal" : ""} key={j}><NumberToString number={nr} /></td>
                )}</tr>
              )}
            </tbody>
          </table>
        </div>
      </>}
    </>
  );
}

export default SerieDifferences;