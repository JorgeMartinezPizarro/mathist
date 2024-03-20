'use client'

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function FibonaciDifferences() {
    
    const [number, setNumber] = useState(false)
    const [error, setError] = useState(false)

    
    useEffect(() => {
        const a: number[] = [0, 1];
        for (var i = 2; i<51; i++) {
            a.push(a[i-1] + a[i-2])
        }
        
        fetch("/api/differences", {
            method: "POST",
            body: JSON.stringify(a)
        })
            .then(res => res.json())
            .then(res => setNumber(res))
            .catch(err=>setError(err))
    }, [])

    return (
        <div className="main">
          {error && JSON.stringify(error, null, 2)}
          {!number && !error && (
            <CircularProgress />
          )}
          {number && (
            <table>
              <tbody>
                {number.map(row => <tr key={JSON.stringify(row)}>{row.map((nr, idx) => <td key={idx}>{BigInt(nr).toString()}</td>)}</tr>)}
              </tbody>
            </table>
          )}
        </div>
    )
}