'use client'

import { useState, useEffect, useCallback } from "react"
import { CircularProgress, Autocomplete, TextField, Button } from "@mui/material"
import { MAX_SERIES_DIFFERENCES_SIZE } from "@/helpers/Constants"

export default function PrimesDifferences() {
  
  const [number, setNumber] = useState<BigInt[][]|boolean>(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const AMOUNT = 39
  const [value, setValue] = useState({label: "integers", value: "integers"})

    const handleSubmit = useCallback(() => {
        setLoading(true)
        fetch("/api/serie?LIMIT=" + (2 * MAX_SERIES_DIFFERENCES_SIZE - 1) + "&name=" + value.value)
      .then(res => res.json())
      .then(res => {
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(res),
        }
        fetch("/api/differences", options)
          .then(res => res.json())
          .then(res => {
            setNumber(res)
            setLoading(false)
          })
          .catch(err=> {
            setError(err)
            setLoading(false)
          })
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
    }, [value])

  const LENGTH = MAX_SERIES_DIFFERENCES_SIZE;

  return (
    <div className="main">
        <hr />
        <p>Select a serie S to obtain it's serie of differences. </p>
        <hr />
        <p>Some of these series of series have regularities, where others not.</p>
        <hr />
        <p>Here an explanation of the differences of series: <a href="https://www.youtube.com/watch?v=4AuV93LOPcE">https://www.youtube.com/watch?v=4AuV93LOPcE</a></p>
        <hr />
      <div className="form-container">
        <Autocomplete
          disablePortal
          disableClearable
          id="combo-box-demo"
          isOptionEqualToValue={(option, value) => option.value === value.value && option.label === value.label}
          value={value}
          options={[
              {label: "integers", value:"integers"},
              {label: "squares", value:"squares"},
              {label: "triangulars", value:"triangulars"},
              {label: "penthagonals", value:"penthagonals"},
              {label: "hexagonals", value:"hexagonals"},
              {label: "cubes", value:"cubes"},
              {label: "exponentials", value:"exponentials"},
              {label: "primes", value:"primes"},
              {label: "fibonacci", value:"fibonacci"},
              {label: "lucas", value:"lucas"},
              {label: "factorials", value:"factorials"},
          ]}
          onChange={(event, values) => {
              
            setValue(values)
            setNumber(false)
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Serie" />}
        />
        <span >
          <Button className='oddButton' onClick={()=> {
            handleSubmit()
          }} variant="contained">GENERATE</Button>
        </span>
      </div>
      {loading && <CircularProgress />}
      {error && JSON.stringify(error, null, 2)}
      
      {number && (<>
        <hr />
        <p>Below the {LENGTH} first {value.label} and it's nth-differences up to {LENGTH}</p>
        <hr />
        <table>
          <tbody>
            {number.slice(0, LENGTH).filter((el, id) => {
              for (var idx = 0; idx<el.length; idx++) {
                if (BigInt(el[idx].toString()) !== BigInt(0))
                  return true
              }
              return false
            }).map((row, i) => 
              <tr key={JSON.stringify(row)}>{row.slice(0, LENGTH).map((nr, j) => 
                <td className={i === j ? "diagonal" : ""} key={j}>{nr && BigInt(nr).toString()}</td>
              )}</tr>
            )}
          </tbody>
        </table>
      </>)}
    </div>
  );
}
