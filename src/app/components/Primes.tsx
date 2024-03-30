'use client'

import { Button, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';

const UserList = ({limit}) => {


  const [error, setError] = useState("")
    const downloadCSV = async () => {
        if (limit > 10**8) {
          setError("Invalid length " + limit + ", max allowed is 10**8")
          return
        }
        else {
          setError("")
          const url = "/api/primes?LIMIT="+limit+"&amount="+limit
          const x = await fetch(url)
          let primes = await x.json()
          primes = primes.primes
          const csvContent = "data:text/csv;charset=utf-8," +
          primes.join(",")
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "user_list.csv");
          document.body.appendChild(link);
          link.click();
        }
        
       
    };

  return (<>
    <Button onClick={downloadCSV} variant="contained">Download CSV</Button>
    {error && <Alert severity="error">{error}</Alert>}
  </>);
};

export default UserList; 