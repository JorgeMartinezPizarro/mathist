'use client'

import Image from "next/image";
import { useState, useEffect } from "react"
import { Tabs, Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';

import PrimesDifferences from "./components/PrimesDifferences";
import SquaresDifferences from "./components/SquaresDifferences";
import FibonaciDifferences from "./components/FibonaciDifferences";
import ExponentialDifferences from "./components/ExponentialDifferences";
import factorial from "@/helpers/factorial";
import PrimeFactorization from "./components/PrimeFactorization";
import PitagoreanTree from "./components/PitagoreanTree";

export default function Home() {
  
const [value, setValue] = useState("6")

const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  setValue(newValue)
}



return <div>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
        <Tab label="Factorization" value="5" />
        <Tab label="Pitagorean Tree" value="6" />
        <Tab label="Primes Differences" value="1" />
        <Tab label="Squares Differences" value="2" />
        <Tab label="Fibonaci Differences" value="3" />
        <Tab label="Exponential Differences" value="4" />
      </TabList>
    </Box>
    <TabPanel value="5"><PrimeFactorization /></TabPanel>
    <TabPanel value="6"><PitagoreanTree /></TabPanel>
    <TabPanel value="1"><PrimesDifferences /></TabPanel>
    <TabPanel value="2"><SquaresDifferences /></TabPanel>
    <TabPanel value="3"><FibonaciDifferences /></TabPanel>
    <TabPanel value="4"><ExponentialDifferences /></TabPanel>
    
  </TabContext>
</div>  
  
}


