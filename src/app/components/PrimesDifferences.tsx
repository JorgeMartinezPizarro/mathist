'use client'

import { useState, useEffect } from "react"
import { CircularProgress } from "@mui/material"
export default function PrimesDifferences() {
  
  const [number, setNumber] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const url = "/api/primes?"+ ( new URLSearchParams( {LIMIT: "199"} ) ).toString()
    
    fetch(url)
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
          .then(res => setNumber(res))
          .catch(err=>setError(err))
      })
      .catch(err => setError(err))
  }, [])

  useEffect(() => {
    if (!number || number.length < 3) return;

    const sum = number.reduce((acc, row) => acc + row.reduce((acc2, nr) => acc2 + nr, 0), 0)

    console.log(sum)
    
  }, [number])
  
  return (
    <div className="main">
      {error && JSON.stringify(error, null, 2)}
      {!number && !error && (
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
