'use client' // Error components must be Client Components
 
import { Alert, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { useState } from 'react'
import { SubdirectoryArrowRight, Menu } from '@mui/icons-material';
import { redirect } from "next/navigation";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const elements = [
    {name: "sieve"},
    {name: "tree"},
    {name: "factors"},
    {name: "series",},
    {name: "about",},
  ]

  return <div>
    <div className="header">
      <Button className="drawer" variant="contained" onClick={toggleDrawer(true)}><Menu/></Button>
      <span className="title">Error</span>
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
        {error.toString()}
      </Alert>
      <Button onClick={reset} variant="contained">Back</Button>
    </div>
  </div>
}