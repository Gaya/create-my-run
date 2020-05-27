import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core';

interface ToolBarProps {
  openDrawer(): void;
  routeLength?: number;
}

const ToolBar: React.FC<ToolBarProps> = ({ openDrawer, routeLength }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box marginRight={2}>
          <Button onClick={openDrawer} color="inherit">Change Run</Button>
        </Box>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Generate a Run
        </Typography>
        {routeLength && (
          <Typography variant="h6">
            {(routeLength / 1000).toFixed(2)} km
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ToolBar;
