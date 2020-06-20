import React, { useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import {
  createStyles,
  Fab,
  Menu,
  MenuItem,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';

import {
  createRouteUrl, routeDataQuery,
  routeDistanceState,
  routeLocationState,
  routeRandomSeedState,
  routeTypeState,
} from '../../state/route';
import { RouteFormat } from '../../server/types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    zIndex: 2,
  },
}));

const ExportButton: React.FC = () => {
  const classes = useStyles();

  const [isOpened, setOpened] = useState(false);
  const menuAnchor = useRef<HTMLButtonElement | null>(null);

  const route = useRecoilValueLoadable(routeDataQuery);

  const distance = useRecoilValue(routeDistanceState);
  const routeType = useRecoilValue(routeTypeState);
  const r = useRecoilValue(routeRandomSeedState);
  const location = useRecoilValue(routeLocationState);

  if (route.state !== 'hasValue' || !distance || !routeType || !location || !r) {
    return null;
  }

  const handleOpen = (): void => {
    setOpened(true);
  };

  const handleClose = (): void => {
    setOpened(false);
  };

  return (
    <>
      <Fab
        ref={menuAnchor}
        className={classes.fab}
        color="primary"
        onClick={handleOpen}
      >
        <GetAppIcon />
      </Fab>
      <Menu
        anchorEl={menuAnchor.current}
        keepMounted
        open={isOpened}
        onClose={handleClose}
      >
        <MenuItem
          component="a"
          href={createRouteUrl(distance, routeType, r, location, RouteFormat.GPX)}
          onClick={handleClose}
        >
          Basic GPX
        </MenuItem>
        <MenuItem
          component="a"
          href={createRouteUrl(distance, routeType, r, location, RouteFormat.GARMIN)}
          onClick={handleClose}
        >
          Garmin Course GPX
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;
