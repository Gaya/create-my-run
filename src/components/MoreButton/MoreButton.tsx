import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createStyles,
  Fab,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import GetAppIcon from '@material-ui/icons/GetApp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

import { RouteFormat } from '../../server/types';
import { setQueryParameters } from '../../utils/history';
import {
  flippedSelector,
  routeParametersSelector,
  routeSelector,
} from '../../store/route/selectors';
import { createRouteUrl } from '../../store/route/utils';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    zIndex: 2,
  },
}));

const MoreButton: React.FC = () => {
  const classes = useStyles();

  const [isOpened, setOpened] = useState(false);
  const menuAnchor = useRef<HTMLButtonElement | null>(null);

  const {
    distance,
    routeType,
    location,
    randomSeed,
  } = useSelector(routeParametersSelector);
  const route = useSelector(routeSelector);
  const flipped = useSelector(flippedSelector);

  if (route.state !== 'hasValue' || !distance || !routeType || !location || !randomSeed) {
    return null;
  }

  const handleOpen = (): void => {
    setOpened(true);
  };

  const handleClose = (): void => {
    setOpened(false);
  };

  const changeDirection = (): void => {
    setQueryParameters({
      distance,
      location,
      r: randomSeed,
      routeType,
      flipped: !flipped,
    });
    handleClose();
  };

  return (
    <>
      <Fab
        ref={menuAnchor}
        className={classes.fab}
        color="primary"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </Fab>
      <Menu
        anchorEl={menuAnchor.current}
        keepMounted
        open={isOpened}
        onClose={handleClose}
      >
        <MenuItem onClick={changeDirection}>
          <ListItemIcon>
            <SwapHorizIcon />
          </ListItemIcon>
          <ListItemText>
            Change Direction
          </ListItemText>
        </MenuItem>
        <MenuItem
          component="a"
          href={createRouteUrl(
            distance,
            routeType,
            randomSeed,
            location,
            flipped,
            RouteFormat.GPX,
          )}
          onClick={handleClose}
        >
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText>
            Basic GPX
          </ListItemText>
        </MenuItem>
        <MenuItem
          component="a"
          href={createRouteUrl(
            distance,
            routeType,
            randomSeed,
            location,
            flipped,
            RouteFormat.GARMIN,
          )}
          onClick={handleClose}
        >
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText>
            Garmin Course GPX
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MoreButton;
