'use client'

import { useState } from "react"
import { Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';

import PrimeFactorization from "./components/PrimeFactorization";
import PitagoreanTree from "./components/PitagoreanTree";
import SerieDifferences from "./components/SerieDifferences";
import EratostenesSieve from "./components/EratostenesSieve";

export default function Home() {
  
  const [value, setValue] = useState("4")

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return <div>
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
          <Tab label="Sieve" value="4" />
          <Tab label="Tree" value="2" />
          <Tab label="Factors" value="1" />
          <Tab label="Series" value="3" />
          
        </TabList>
      </Box>
      <TabPanel value="4"><EratostenesSieve /></TabPanel>
      <TabPanel value="1"><PrimeFactorization /></TabPanel>
      <TabPanel value="2"><PitagoreanTree /></TabPanel>
      <TabPanel value="3"><SerieDifferences /></TabPanel>
      
    </TabContext>
  </div>  
}