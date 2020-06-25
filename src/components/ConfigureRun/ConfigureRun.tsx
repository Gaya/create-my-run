import React, {
  FormEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import {
  Button,
  CircularProgress,
  Grid,
  Theme,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import {
  routeDataQuery,
  routeLocationState,
  routeParams,
} from '../../state/route';
import { isLoading, randomSeed } from '../../state/utils';
import {
  defaultDistanceSelector,
  maximumDistanceSelector,
  minimumDistanceSelector,
} from '../../store/app/selectors';

import { RouteTypeValue } from '../../types';
import Distance from './Distance';
import StartingPoint from './StartingPoint';
import RouteType from './RouteType';
import { setQueryParameters } from '../../utils/history';
import { setOnCompleteLocation } from '../../state/location';

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

interface ConfigureRunProps {
  onCompleteLoading(): void;
}

const ConfigureRun: React.FC<ConfigureRunProps> = ({ onCompleteLoading }) => {
  const params = useRecoilValue(routeParams);
  const route = useRecoilValueLoadable(routeDataQuery(params));

  const setRouteLocation = useSetRecoilState(routeLocationState);
  const location = params.location || null;

  const defaultDistance = useSelector(defaultDistanceSelector);
  const maxDistance = useSelector(maximumDistanceSelector);
  const minDistance = useSelector(minimumDistanceSelector);

  const [distance, setDistance] = useState<number>(params.distance || defaultDistance);
  const [routeType, setRouteType] = useState<RouteTypeValue['id']>(params.routeType || routeTypes[0].id);

  const classes = useStyles();

  const isGenerating = isLoading(route);
  const canGenerate = distance
    && routeType
    && location;

  const onGenerateRun = (): void => {
    if (isGenerating || !location || !canGenerate) return;

    setQueryParameters({
      distance,
      location,
      r: randomSeed(),
      routeType,
    });
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    onGenerateRun();
  };

  const wasLoadingRef = useRef<boolean>(route.state === 'loading');
  useEffect(() => {
    if (route.state === 'hasValue' && route.contents !== null && wasLoadingRef.current) {
      onCompleteLoading();
    }

    wasLoadingRef.current = route.state === 'loading';
  }, [onCompleteLoading, route.contents, route.state]);

  // update start location when searching with lat lng
  useEffect(() => {
    setOnCompleteLocation((foundLocations) => {
      if (foundLocations.length > 0) {
        setRouteLocation(foundLocations[0].key);
      }
    });
  }, [setRouteLocation]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StartingPoint location={location} setLocation={setRouteLocation} />
        </Grid>

        <Grid item xs={12}>
          <Distance
            distance={distance}
            min={minDistance}
            max={maxDistance}
            setDistance={setDistance}
          />
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
              type="submit"
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
    </form>
  );
};

export default ConfigureRun;
