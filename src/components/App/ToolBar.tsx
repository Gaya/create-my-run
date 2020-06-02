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
          <Button
            variant="outlined"
            onClick={openDrawer}
            color="inherit"
          >
            Change Route
          </Button>
        </Box>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Create my Run
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
