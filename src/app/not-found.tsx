'use client'

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, Drawer, Button, Alert } from '@mui/material';
import { redirect } from "next/navigation";
import { Menu, SubdirectoryArrowRight } from '@mui/icons-material';

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
      <Button className="drawer" variant="contained" onClick={toggleDrawer(true)}><Menu/></Button>
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
      <Alert severity="error">
        The requested page cannot be found in this server. Use the menu left or try with something in [{elements.map(e=>e.name).join(", ")}].
      </Alert>
    </div>
  </div>
  }