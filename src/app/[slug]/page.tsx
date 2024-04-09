'use client'

import { useEffect, useState } from "react"
import { Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';

import HomePage from "../components/HomePage";
import PrimeFactorization from "../components/PrimeFactorization";
import PitagoreanTree from "../components/PitagoreanTree";
import SerieDifferences from "../components/SerieDifferences";
import EratostenesSieve from "../components/EratostenesSieve";
import { redirect } from "next/navigation";

export default function Home({ params }: { params: { slug: string } }) {
  
  if (!["home", "sieve", "tree", "factors", "series"].includes(params.slug)) {
    redirect("/home");
  }

  return <TabContext value={params.slug}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList aria-label="lab API tabs example" centered>
        <Tab href="/home" label="Home" value="home" />
        <Tab href="/sieve" label="Sieve" value="sieve" />
        <Tab href="/tree" label="Tree" value="tree" />
        <Tab href="/factors" label="Factors" value="factors" />
        <Tab href="/series" label="Series" value="series" />
      </TabList>
    </Box>
    <TabPanel value="home"><HomePage /></TabPanel>
    <TabPanel value="sieve"><EratostenesSieve /></TabPanel>
    <TabPanel value="tree"><PitagoreanTree /></TabPanel>
    <TabPanel value="factors"><PrimeFactorization /></TabPanel>
    <TabPanel value="series"><SerieDifferences /></TabPanel>
  </TabContext>
}