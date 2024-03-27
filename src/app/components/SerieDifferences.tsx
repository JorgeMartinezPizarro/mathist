'use client'

import { useState, useEffect, useCallback } from "react"
import { CircularProgress, Autocomplete, TextField, Button } from "@mui/material"

export default function PrimesDifferences() {
  
  const [number, setNumber] = useState(false)
  const [amount, setAmount] = useState(100)
  const [duration, setDuration] = useState(0)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [value, setValue] = useState({label: "integers", value: "integers"})

    const handleSubmit = useCallback(() => {
        setLoading(true)
        fetch("/api/serie?"+ ( new URLSearchParams( {LIMIT: amount, name: value.value} ) ).toString())
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
    }, [value, amount])

  const LENGTH = 50;

  return (
    <div className="main">
        <p>Select a serie S and a length N to obtain it's serie of differences N-times. </p>
        <hr />
        <p>Some of these series of series have regularities, where others not.</p>
        <hr />
        <p>Here an explanation of the differences of series: <a href="https://www.youtube.com/watch?v=4AuV93LOPcE">https://www.youtube.com/watch?v=4AuV93LOPcE</a></p>
        <hr />
        <p>Max serie length is 10**3-1</p>
        <hr />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        isOptionEqualToValue={(option, value) => option.value === value.value && option.label === value.label}
        value={value}
        options={[
            {label: "integers", value:"integers"},
            {label: "squares", value:"squares"},
            {label: "exponentials", value:"exponentials"},
            {label: "primes", value:"primes"},
            {label: "fibonacci", value:"fibonacci"},
        ]}
        onChange={(event, values) => {
            setValue(values)
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Serie" />}
      />
      <TextField
            className="input"
            placeholder="Length of the serie"
            label="Length of the serie"
            type="number"
            disabled={loading}
            value={amount}
            onChange={(event) => {
                if (event.target.value.length < 4)
                  setAmount(parseInt(event.target.value))
            }}
        />
      <Button onClick={()=> {
        handleSubmit()
      }} variant="contained">Submit</Button>
 {loading && <CircularProgress />}
{error && JSON.stringify(error, null, 2)}
      <hr />
      Below the {LENGTH} x {LENGTH} first elements
      <hr />
      
      {number && (
        <table>
          <tbody>
            {number.slice(0, LENGTH).map(row => <tr key={JSON.stringify(row)}>{row.slice(0, LENGTH).map((nr, idx) => <td key={idx}>{nr && BigInt(nr).toString()}</td>)}</tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}
