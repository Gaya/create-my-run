import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  routeDataQuery,
  routeDistanceState,
  routeLocationState,
  routeTypeState
} from '../../state/route';
import {
  isLoading,
  safeStoredLocation
} from '../../state/utils';
import { RouteTypeValue } from '../../types';

import Distance from './Distance';
import StartingPoint from './StartingPoint';
import RouteType from './RouteType';

const routeTypes: RouteTypeValue[] = [
  {
    id: 69,
    name: 'Recreative',
  },
  {
    id: 65,
    name: 'Nature',
  },
  {
    id: 66,
    name: 'Avoid cars',
  }
];

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

interface ConfigureProps {
  isDrawerOpen: boolean;
  onCloseDrawer(): void;
}

const Configure: React.FC<ConfigureProps> = ({
  isDrawerOpen,
  onCloseDrawer,
}) => {
  const route = useRecoilValueLoadable(routeDataQuery);

  const setDistanceState = useSetRecoilState(routeDistanceState);
  const [distance, setDistance] = useState<number>(10);

  const setRouteTypeState = useSetRecoilState(routeTypeState);
  const [routeType, setRouteType] = useState<RouteTypeValue['id']>(routeTypes[0].id);

  const setRouteLocationState = useSetRecoilState(routeLocationState);
  const [location, setLocation] = useState<string | null>(safeStoredLocation()?.key || null);

  const classes = useStyles();

  const isGenerating = isLoading(route);
  const canGenerate = distance && routeType && location;

  const onGenerateRun = () => {
    if (isGenerating || !location) return;

    setDistanceState(distance);
    setRouteTypeState(routeType);
    setRouteLocationState(location);
  };

  useEffect(() => {
    if (!isGenerating && route.contents) {
      onCloseDrawer();
    }
  }, [isGenerating, route.contents, onCloseDrawer]);

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <Box width={380} padding={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Configure Run
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <StartingPoint location={location} setLocation={setLocation} />
          </Grid>

          <Grid item xs={12}>
            <Distance distance={distance} setDistance={setDistance} />
          </Grid>

          <Grid item xs={12}>
            <RouteType
              routeType={routeType}
              routeTypes={routeTypes}
              setRouteType={setRouteType}
            />
          </Grid>

          <Grid item xs={12}>
            <div className={classes.wrapper}>
              <Button
                color="primary"
                variant="contained"
                disabled={!canGenerate || isGenerating}
                onClick={onGenerateRun}
              >
                Create my Run
              </Button>
              {isGenerating && (
                <CircularProgress
                  color="primary"
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Box>

    </Drawer>
  );
}

export default Configure;
