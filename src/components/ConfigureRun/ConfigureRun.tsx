import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
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
  routeLocationState,
} from '../../state/route';
import { randomSeed } from '../../state/utils';
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

import { isRouteLoadingSelector, routeParametersSelector } from '../../store/route/selectors';

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
  const isGenerating = useSelector(isRouteLoadingSelector);
  const params = useSelector(routeParametersSelector);

  const setRouteLocation = (location: string): void => { console.log(location); };
  const location = params.location || null;

  const defaultDistance = useSelector(defaultDistanceSelector);
  const maxDistance = useSelector(maximumDistanceSelector);
  const minDistance = useSelector(minimumDistanceSelector);

  const [distance, setDistance] = useState<number>(params.distance || defaultDistance);
  const [routeType, setRouteType] = useState<RouteTypeValue['id']>(params.routeType || routeTypes[0].id);

  const classes = useStyles();

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
