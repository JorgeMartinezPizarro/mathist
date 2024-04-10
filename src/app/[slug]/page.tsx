'use client'

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Button } from '@mui/material';
import { redirect } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

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

  const currentElement = elements.find(el => el.name === params.slug)

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return <div>
    <div className="header">
      <Button className="drawer" variant="contained" onClick={toggleDrawer(true)}><MenuIcon/></Button>
      <span className="title">{currentElement?.name}</span>
    </div>
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box role="presentation" onClick={toggleDrawer(false)}>
        <span className="subtitle">Mather</span>
        <List>
          {elements.map((element) => (
            <ListItem key={element.name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SubdirectoryArrowRightIcon/>
                </ListItemIcon>
                <ListItemText>
                  <Button className="item" href={"/" + element.name}><span>{element.name}</span></Button>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    <div className="main">
      {currentElement?.component}
    </div>
</div>
}

export default Page;