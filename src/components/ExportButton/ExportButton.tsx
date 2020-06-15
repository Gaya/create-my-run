import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { Fab } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import {
  createRouteUrl, routeDataQuery,
  routeDistanceState,
  routeLocationState,
  routeRandomSeedState,
  routeTypeState,
} from '../../state/route';
import { RouteFormat } from '../../server/types';

const ExportButton: React.FC = () => {
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
      style={{
        position: 'absolute',
        bottom: 24,
        right: 14,
        zIndex: 2,
      }}
      color="primary"
      href={createRouteUrl(distance, routeType, r, location, RouteFormat.GPX)}
    >
      <GetAppIcon />
    </Fab>
  );
};

export default ExportButton;
