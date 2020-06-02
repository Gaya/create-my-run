import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface ToolBarProps {
  openDrawer(): void;
  routeLength?: number;
}

const HeaderBar: React.FC<ToolBarProps> = ({ openDrawer, routeLength }) => {
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

export default HeaderBar;
