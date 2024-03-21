'use client'

import { useState, useEffect, useCallback } from "react"
import { CircularProgress, Autocomplete, TextField, Button } from "@mui/material"

export default function PrimesDifferences() {
  
  const [number, setNumber] = useState(false)
  const [amount, setAmount] = useState(25)
  const [duration, setDuration] = useState(0)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [value, setValue] = useState({label: "integers", value: "integers"})

    const handleSubmit = useCallback(() => {
        setLoading(true)
        const start = Date.now()
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
            setDuration(Date.now() - start)
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

  return (
    <div className="main">
        <p>Select a serie S and a length N to obtain it's serie of differences N-times. Some of these series of series have regularities, where others not.</p>
      {error && JSON.stringify(error, null, 2)}
      Calculated in {duration} ms
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
                setAmount(event.target.value)
            }}
        />
      <Button onClick={()=> {
        if (amount > 100) {
            setError("The length cannot be bigger than " + 100)
            setNumber(false)
        }
        else
            handleSubmit()
      }} variant="contained">Submit</Button>
      <hr />
      {loading && (
        <CircularProgress />
      )}
      {number && (
        <table>
          <tbody>
            {number.map(row => <tr key={JSON.stringify(row)}>{row.map((nr, idx) => <td key={idx}>{nr && BigInt(nr).toString()}</td>)}</tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}
