import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import {
  AppBar,
  Button,
  Hidden,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExploreIcon from '@material-ui/icons/Explore';

import { routeLengthState } from '../../state/route';

interface ToolBarProps {
  openDrawer(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  changeButton: {
    marginLeft: theme.spacing(2),
  },
}));

const HeaderBar: React.FC<ToolBarProps> = ({ openDrawer }) => {
  const classes = useStyles();
  const routeLength = useRecoilValueLoadable(routeLengthState);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Create My Run
        </Typography>
        {routeLength.state === 'hasValue' && routeLength.contents && (
          <Typography variant="h6">
            {(routeLength.contents / 1000).toFixed(2)}
            {' '}
            km
          </Typography>
        )}
        <Hidden xsDown>
          <Button
            className={classes.changeButton}
            variant="outlined"
            onClick={openDrawer}
            color="inherit"
            startIcon={<ExploreIcon />}
          >
            Change
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton
            onClick={openDrawer}
            color="inherit"
          >
            <ExploreIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
