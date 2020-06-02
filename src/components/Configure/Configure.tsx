import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  Input,
  InputLabel, MenuItem,
  Select,
  Slider,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { routeDataQuery, routeDistanceState, routeTypeState } from '../../atoms/route';

const routeTypes: RouteType[] = [
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

function distanceValueText(value: number): string {
  return `${value} km`;
}

const marks = [10, 20, 30, 40, 50].map(v => ({ value: v, label: v }));

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  distanceIput: {
    width: 48,
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
  const setRouteTypeState = useSetRecoilState(routeTypeState);
  const [distance, setDistance] = useState<number>(10);
  const [routeType, setRouteType] = useState<RouteType['id']>(routeTypes[0].id);

  const classes = useStyles();

  const isGenerating = route.state === 'loading';

  const min = 1;
  const max = 50;
  const defaultDistance = 10;

  const onGenerateRun = () => {
    if (isGenerating) return;

    setDistanceState(distance);
    setRouteTypeState(routeType);
  };

  useEffect(() => {
    if (!isGenerating && route.contents) {
      onCloseDrawer();
    }
  }, [isGenerating, route.contents, onCloseDrawer]);

  const handleDistanceInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDistance(event.target.value === '' ? defaultDistance : Number(event.target.value));
  };

  const handleDistanceBlur = () => {
    if (distance < min) {
      setDistance(min);
    } else if (distance > max) {
      setDistance(max);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <Box width={400}>
        <Box margin={3}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Configure Run
          </Typography>
        </Box>
        <Box margin={3}>
          <InputLabel id="distance-slider" shrink>
            Distance (KM)
          </InputLabel>
          <Grid container alignItems="flex-start" spacing={3}>
            <Grid item xs>
              <Slider
                min={min}
                max={max}
                color="primary"
                value={distance}
                onChange={(event, value) => setDistance(Array.isArray(value) ? value[0] : value)}
                getAriaValueText={distanceValueText}
                aria-labelledby="distance-slider"
                step={0.5}
                marks={marks}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item>
              <Input
                value={distance}
                margin="dense"
                className={classes.distanceIput}
                onChange={handleDistanceInputChange}
                onBlur={handleDistanceBlur}
                inputProps={{
                  step: 0.5,
                  min: 0,
                  max: 50,
                  type: 'number',
                  'aria-labelledby': 'distance-slider',
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box margin={3}>
          <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            Route type
          </InputLabel>
          <Select
            fullWidth
            labelId="demo-simple-select-placeholder-label-label"
            id="demo-simple-select-placeholder-label"
            value={routeType}
            onChange={(event) => setRouteType(event.target.value as number)}
          >
            {routeTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box margin={3} display="flex">
        <div className={classes.wrapper}>
          <Button
            color="primary"
            variant="contained"
            disabled={isGenerating}
            onClick={onGenerateRun}
          >
            Create my Run
          </Button>
          {isGenerating && <CircularProgress color="secondary" size={24} className={classes.buttonProgress} />}
        </div>
      </Box>
    </Drawer>
  );
}

export default Configure;
