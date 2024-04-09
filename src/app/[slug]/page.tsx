'use client'

import { useEffect, useState } from "react"
import { Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';

import About from "../components/About";
import PrimeFactorization from "../components/PrimeFactorization";
import PitagoreanTree from "../components/PitagoreanTree";
import SerieDifferences from "../components/SerieDifferences";
import EratostenesSieve from "../components/EratostenesSieve";
import { redirect } from "next/navigation";

export default function Home({ params }: { params: { slug: string } }) {
  
  const elements = [
    {name: "sieve", component: <EratostenesSieve/>},
    {name: "tree", component: <PitagoreanTree/>},
    {name: "factors", component: <PrimeFactorization/>},
    {name: "series", component: <SerieDifferences/>},
    {name: "about", component: <About/>},
  ]

  if (!elements.map(el => el.name).includes(params.slug)) {
    redirect("/" + elements[0]);
  }

  return <TabContext value={params.slug}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList aria-label="lab API tabs example" centered scrollButtons allowScrollButtonsMobile >
        {elements.map(element => <Tab key={element.name} href={"/" + element.name} label={element.name} value={element.name}/>)}
      </TabList>
    </Box>
    {elements.map(element => <TabPanel key={element.name} value={element.name}>{element.component}</TabPanel>)}
  </TabContext>
}