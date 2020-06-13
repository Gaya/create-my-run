import React, { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import {
  Box,
  Fab,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import { routeDataQuery } from '../../state/route';
import { LatLong } from '../../server/types';

import {
  convertCoordinatesToGPX,
  downloadGPX,
} from '../../state/utils';

const ExportButton: React.FC = () => {
  const route = useRecoilValueLoadable(routeDataQuery);
  const [coordinates, setCoordinates] = useState<LatLong[]>();

  const onExportButtonClick = (): void => {
    if (!coordinates) return;

    const gpx = convertCoordinatesToGPX(coordinates);
    downloadGPX(gpx);
  };

  useEffect(() => {
    if (route.state === 'hasValue' && route.contents) {
      setCoordinates(route.contents.coordinates);
    }
  }, [route.state, route.contents]);

  return (
    <Box
      position="absolute"
      bottom={20}
      right={20}
      zIndex={2}
    >
      <Fab
        color="primary"
        onClick={onExportButtonClick}
        disabled={!coordinates}
      >
        <GetAppIcon />
      </Fab>
    </Box>
  );
};

export default ExportButton;
