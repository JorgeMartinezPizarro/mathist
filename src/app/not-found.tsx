'use client'

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Button, Divider, Alert } from '@mui/material';
import { redirect } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import About from "@/app/components/About";
import PrimeFactorization from "@/app/components/PrimeFactorization";
import PitagoreanTree from "@/app/components/PitagoreanTree";
import SerieDifferences from "@/app/components/SerieDifferences";
import EratostenesSieve from "@/app/components/EratostenesSieve";
import { notFound } from 'next/navigation'

export default function Custom404() {

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const elements = [
    {name: "sieve"},
    {name: "tree"},
    {name: "factors"},
    {name: "series"},
    {name: "primes"},
    {name: "about"},
  ]

  return <div>
    <div className="header">
      <Button className="drawer" variant="contained" onClick={toggleDrawer(true)}><MenuIcon/></Button>
      <span className="title">NOT FOUND</span>
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
                    <SubdirectoryArrowRightIcon className="icon"/>
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
      <Alert severity="error">
        The requested page cannot be found in this server. Use the menu left or try with something in [{elements.map(e=>e.name).join(", ")}].
      </Alert>
    </div>
  </div>
  }