'use client'

import { useState, useCallback } from "react"
import { CircularProgress, Autocomplete, TextField, Button, FormGroup, Alert } from "@mui/material"
import { MAX_SERIES_DIFFERENCES_SIZE } from "@/helpers/Constants"

const SerieDifferences = () => {
  
  const [number, setNumber] = useState<BigInt[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [value, setValue] = useState({label: "integer", value: "integer"})

    const handleSubmit = useCallback(() => {
      setLoading(true)
      fetch("/api/serie?LIMIT=" + (2 * MAX_SERIES_DIFFERENCES_SIZE - 1) + "&name=" + value.value)
        .then(res => res.json())
        .then(res => {

          if (res.error) {
            throw new Error(res.error)
          }
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
              if (res.error) {
                throw new Error(res.error)
              }
              setNumber(res)
              setLoading(false)
            })
            .catch(error=> {
              let message
              if (error instanceof Error) message = error.message
              else message = String(error)
              if (message.indexOf("Failed to fetch") !== -1)
                  setError("Error generating excel, server disconnected")
              else 
                  setError(message.replaceAll("Error: ", ""))
              setLoading(false)
            })
          })
      .catch(error => {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        if (message.indexOf("Failed to fetch") !== -1)
            setError("Error generating excel, server disconnected")
        else 
            setError(message.replaceAll("Error: ", ""))
        setLoading(false)
      })
    }, [value])

  return (
    <div className="main">
        <hr />
        <p>Select a serie to obtain it&apos;s series of differences. Some of these series of series have regularities, while others not.</p>
        <hr />
        <p>Here an explanation of the differences of series: <a href="https://www.youtube.com/watch?v=4AuV93LOPcE">https://www.youtube.com/watch?v=4AuV93LOPcE</a></p>
        <hr />
      <FormGroup className="form-container" row={true}>
        <Autocomplete
          disablePortal
          disableClearable
          id="combo-box-demo"
          isOptionEqualToValue={(option, value) => option.value === value.value && option.label === value.label}
          value={value}
          options={[
              {label: "integer", value:"integer"},
              {label: "square", value:"square"},
              {label: "triangular", value:"triangular"},
              {label: "penthagonal", value:"penthagonal"},
              {label: "hexagonal", value:"hexagonal"},
              {label: "cube", value:"cube"},
              {label: "exponential", value:"exponential"},
              {label: "prime", value:"prime"},
              {label: "fibonacci", value:"fibonacci"},
              {label: "luca", value:"luca"},
              {label: "factorial", value:"factorial"},
          ]}
          onChange={(event, values) => {
              
            setValue(values)
            setNumber([])
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Serie" />}
        />
        <Button disabled={loading} className='oddButton' onClick={()=> {
          handleSubmit()
        }} variant="contained">GENERATE</Button>
        {loading && <CircularProgress />}
      </FormGroup>
      
      {error && <><hr/><Alert severity="error">{error}</Alert></>}
      
      {number.length > 0 && (<>
        <hr />
        <p>Below the {MAX_SERIES_DIFFERENCES_SIZE} first {value.label} numbers and it&apos;s nth-differences up to {MAX_SERIES_DIFFERENCES_SIZE}</p>
        <hr />
        <table>
          <tbody>
            {number.slice(0, MAX_SERIES_DIFFERENCES_SIZE).filter((el, id) => {
              for (var idx = 0; idx<el.length; idx++) {
                if (BigInt(el[idx].toString()) !== BigInt(0))
                  return true
              }
              return false
            }).map((row, i) => 
              <tr key={JSON.stringify(row)}>{row.slice(0, MAX_SERIES_DIFFERENCES_SIZE).map((nr, j) => 
                <td className={i === j ? "diagonal" : ""} key={j}>{nr && nr.toString()}</td>
              )}</tr>
            )}
          </tbody>
        </table>
      </>)}
    </div>
  );
}

export default SerieDifferences;