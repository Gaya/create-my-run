import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { createStyles, Fab, Theme } from '@material-ui/core';
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

  const route = useRecoilValueLoadable(routeDataQuery);

  const distance = useRecoilValue(routeDistanceState);
  const routeType = useRecoilValue(routeTypeState);
  const r = useRecoilValue(routeRandomSeedState);
  const location = useRecoilValue(routeLocationState);

  if (route.state !== 'hasValue' || !distance || !routeType || !location || !r) {
    return null;
  }

  return (
    <Fab
      className={classes.fab}
      color="primary"
      href={createRouteUrl(distance, routeType, r, location, RouteFormat.GPX)}
    >
      <GetAppIcon />
    </Fab>
  );
};

export default ExportButton;
