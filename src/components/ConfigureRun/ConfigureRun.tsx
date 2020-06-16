import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';

import {
  Button,
  CircularProgress,
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { routeDataQuery } from '../../state/route';
import {
  isLoading,
  randomSeed,
  safeStoredLocation,
} from '../../state/utils';
import { RouteTypeValue } from '../../types';

import Distance from './Distance';
import StartingPoint from './StartingPoint';
import RouteType from './RouteType';
import { setQueryParameters } from '../../utils/history';

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
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  sidebarWrapper: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    maxWidth: 380,
    padding: theme.spacing(2),
  },
  submitWrapper: {
    position: 'relative',
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
  onRouteLoaded(): void;
}

const ConfigureRun: React.FC<ConfigureProps> = ({ onRouteLoaded }) => {
  const route = useRecoilValueLoadable(routeDataQuery);

  const [distance, setDistance] = useState<number>(10);
  const [routeType, setRouteType] = useState<RouteTypeValue['id']>(routeTypes[0].id);
  const [location, setLocation] = useState<string | null>(safeStoredLocation()?.key || null);

  const classes = useStyles();

  const isGenerating = isLoading(route);
  const canGenerate = distance
    && routeType
    && location;

  const onGenerateRun = (): void => {
    if (isGenerating || !location) return;

    setQueryParameters({
      distance,
      location,
      r: randomSeed(),
      routeType,
    });
  };

  useEffect(() => {
    if (!isGenerating && route.contents) {
      onRouteLoaded();
    }
  }, [isGenerating, route.contents, onRouteLoaded]);

  return (
    <Grid container spacing={3}>
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
        <div className={classes.submitWrapper}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            disabled={!canGenerate || isGenerating}
            onClick={onGenerateRun}
          >
            Generate Route!
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
  );
};

export default ConfigureRun;
