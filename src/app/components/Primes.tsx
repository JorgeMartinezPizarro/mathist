'use client'

import { Button, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';

const UserList = ({limit}) => {

  const [error, setError] = useState("")
    const downloadCSV = async () => {
        if (limit > 10**17) {
          setError("Invalid length " + limit + ", max allowed is 10**8")
          return
        }
        else {
          setError("")
          const url = "/api/primes?LIMIT="+limit+"&amount="+limit
          const x = await fetch(url)
          let primes = await x.json()
          primes = primes.primes
          const m = 26**3 -1
          const t = m**2
          const rows = 1048576
          const columns = 16384
          const a: [][] = []
          let b: [] = []
          for (var i = 0; i<primes.length;i++) {
             b.push(primes[i])
             if (b.length === columns) {
              a.push(b)
              b = []
             }
             if (a.length === rows) {
              break;
             }
          }

          console.log("The file contains " + primes.length + " primes from a max of " + rows * columns )
          
          const csvContent = "data:text/csv;charset=utf-8," +
          a.map(primes => primes.join(",")).join("\r\n")
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "user_list.csv");
          document.body.appendChild(link);
          link.click();
        }
        
       
    };

  return (<>
    <Button onClick={downloadCSV} variant="contained">CSV</Button>
    {error && <Alert severity="error">{error}</Alert>}
  </>);
};

export default UserList; 