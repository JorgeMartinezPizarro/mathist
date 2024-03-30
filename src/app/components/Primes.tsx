'use client'

import React, { useEffect, useState } from 'react';

const UserList = ({limit}) => {
  
    const [primes, setPrimes] = useState([])
    
    const downloadCSV = async () => {

        const url = "/api/primes?LIMIT="+limit+"&amount="+limit
        const x = await fetch(url)
        const primes = await x.json()
        

        const csvContent = "data:text/csv;charset=utf-8," +
        primes.primes.join(",")
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_list.csv");
        document.body.appendChild(link);
        link.click();
    };

  return (
    <div className={"tits"}>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default UserList; 