import React, { ChangeEvent } from 'react';
import {
  Grid, Input, InputLabel, Slider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function distanceValueText(value: number): string {
  return `${value} km`;
}

const marks = [10, 20, 30, 40, 50].map((v) => ({ value: v, label: v }));

const useStyles = makeStyles(() => ({
  distanceIput: {
    width: 40,
  },
}));

interface DistanceProps {
  distance: number;
  setDistance(newDistance: number): void;
  defaultDistance?: number;
  min?: number;
  max?: number;
}

const Distance: React.FC<DistanceProps> = ({
  distance,
  setDistance,
  min = 1,
  max = 50,
}) => {
  const classes = useStyles();

  const handleDistanceInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDistance(parseInt(event.target.value, 10));
  };

  const handleDistanceBlur = (): void => {
    if (distance < min) {
      setDistance(min);
    } else if (distance > max) {
      setDistance(max);
    }
  };

  return (
    <>
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
            onChange={(event, value): void => setDistance(Array.isArray(value) ? value[0] : value)}
            getAriaValueText={distanceValueText}
            aria-labelledby="distance-slider"
            step={1}
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
              step: 1,
              min,
              max,
              type: 'number',
              'aria-labelledby': 'distance-slider',
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Distance;
