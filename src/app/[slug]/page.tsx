'use client'

import { Tab, Box } from '@mui/material';
import { TabPanel, TabList, TabContext }  from '@mui/lab';
import { redirect } from "next/navigation";

import About from "@/app/components/About";
import PrimeFactorization from "@/app/components/PrimeFactorization";
import PitagoreanTree from "@/app/components/PitagoreanTree";
import SerieDifferences from "@/app/components/SerieDifferences";
import EratostenesSieve from "@/app/components/EratostenesSieve";

const Page = ({ params }: { params: { slug: string } }) => {
  
  const elements = [
    {name: "sieve", component: <EratostenesSieve/>},
    {name: "tree", component: <PitagoreanTree/>},
    {name: "factors", component: <PrimeFactorization/>},
    {name: "series", component: <SerieDifferences/>},
    {name: "about", component: <About/>},
  ]

  if (!elements.map(el => el.name).includes(params.slug)) {
    redirect("/" + elements[0].name);
  }

  /*
   TODO: For mobile use a drawer, for large monitors use tabs:
    https://mui.com/material-ui/react-drawer/
  */

  return <TabContext value={params.slug}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList aria-label="lab API tabs example" centered>
        {elements.map(element => <Tab key={element.name} href={"/" + element.name} label={element.name} value={element.name}/>)}
      </TabList>
    </Box>
    {elements.map(element => <TabPanel key={element.name} value={element.name}>{element.component}</TabPanel>)}
  </TabContext>
}

export default Page;