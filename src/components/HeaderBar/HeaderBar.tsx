import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core';

import { routeLengthState } from '../../state/route';

interface ToolBarProps {
  openDrawer(): void;
}

const HeaderBar: React.FC<ToolBarProps> = ({ openDrawer }) => {
  const routeLength = useRecoilValueLoadable(routeLengthState);

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
          Create My Run
        </Typography>
        {routeLength.state === 'hasValue' && routeLength.contents && (
          <Typography variant="h6">
            {(routeLength.contents / 1000).toFixed(2)} km
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
