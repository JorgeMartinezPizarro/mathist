'use client'

import Image from "next/image";
import { useState, useEffect } from "react"
import { Tabs, Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';

import PrimeFactorization from "./components/PrimeFactorization";
import PitagoreanTree from "./components/PitagoreanTree";
import SerieDifferences from "./components/SerieDifferences";

export default function Home() {
  
const [value, setValue] = useState("2")

const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  setValue(newValue)
}



return <div>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
        <Tab label="Factorization" value="1" />
        <Tab label="Pitagorean Tree" value="2" />
        <Tab label="Serie Differences" value="3" />
      </TabList>
    </Box>
    <TabPanel value="1"><PrimeFactorization /></TabPanel>
    <TabPanel value="2"><PitagoreanTree /></TabPanel>
    <TabPanel value="3"><SerieDifferences /></TabPanel>
  </TabContext>
</div>  
  
}


