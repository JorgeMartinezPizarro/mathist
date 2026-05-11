'use client'

import { useState } from 'react';

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Drawer,
  Button
} from '@mui/material';

import {
  SubdirectoryArrowRight,
  Menu
} from '@mui/icons-material';

import Link from 'next/link';

export default function ClientPage({
  currentElement,
  elements,
}: any) {

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <div className="header">
        <Button
          className="drawer"
          variant="contained"
          onClick={toggleDrawer(true)}
        >
          <Menu />
        </Button>

        <span className="title">
          {currentElement.name}
        </span>
      </div>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Button
            onClick={toggleDrawer(false)}
            className="subtitle"
          >
            Mather
          </Button>

          <List>
            {elements.map((element: any) => (
              <ListItem
                key={element.name}
                disablePadding
              >
                <Link
                  href={"/" + element.name}
                  style={{
                    width: "100%",
                    textDecoration: "none"
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SubdirectoryArrowRight className="icon" />
                    </ListItemIcon>

                    <Button className="item">
                      <span>{element.name}</span>
                    </Button>

                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <div className="main">
        {currentElement.component}
      </div>
    </>
  );
}