import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { routeLengthState } from '../../atoms/route';

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
          Create my Run
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
