'use client'

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, Drawer, Button } from '@mui/material';
import { redirect } from "next/navigation";
import { SubdirectoryArrowRight, Menu } from '@mui/icons-material';

import About from "@/app/components/About";
import PrimeFactorization from "@/app/components/PrimeFactorization";
import PithagoreanTree from "@/app/components/PithagoreanTree";
import SerieDifferences from "@/app/components/SerieDifferences";
import EratosthenesSieve from "@/app/components/EratosthenesSieve";
import RandomPrimes from '@/app/components/RandomPrimes';
import { notFound } from 'next/navigation'


const Page = ({ params }: { params: { slug: string } }) => {
  
  const elements = [
    {name: "sieve", component: <EratosthenesSieve/>},
    {name: "tree", component: <PithagoreanTree/>},
    {name: "factors", component: <PrimeFactorization/>},
    {name: "series", component: <SerieDifferences/>},
    {name: "primes", component: <RandomPrimes/>},
    {name: "about", component: <About/>},
  ]

  if (!elements.map(el => el.name).includes(params.slug)) {
    notFound()
  }

  const currentElement = elements.find(el => el.name === params.slug)

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return <>
    <div className="header">
      <Button className="drawer" variant="contained" onClick={toggleDrawer(true)}><Menu/></Button>
      <span className="title">{currentElement?.name}</span>
    </div>
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box role="presentation" onClick={toggleDrawer(false)}>
        <Button onClick={toggleDrawer(false)} className="subtitle">Mather</Button>
        <List>
          {elements.map((element) => (
            <ListItem key={element.name} disablePadding>
              <ListItemButton onClick={(e) => {e.stopPropagation(); redirect("/" + element.name)}}>
                <ListItemIcon>
                  <a href={"/" + element.name}>
                    <SubdirectoryArrowRight className="icon"/>
                    <Button className="item" ><span>{element.name}</span></Button>
                  </a>
                </ListItemIcon>
                
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    <div className="main">
      {currentElement?.component}
    </div>
  </>
}

export default Page;
