import React, { ChangeEvent } from 'react';
import {
  Grid, Input, InputAdornment, InputLabel, Slider, useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function distanceValueText(value: number): string {
  return `${value} km`;
}

const useStyles = makeStyles(() => ({
  distanceIput: {
    width: 60,
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
  const theme = useTheme();

  const divider = 10;
  let marks = [];
  for (let i = 0; i < Math.floor(max / divider); i += 1) {
    marks.push((i + 1) * divider);
  }
  marks = marks.map((v) => ({ value: v, label: v }));

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
      <InputLabel id="distance" shrink>
        Distance
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
            aria-labelledby="distance"
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
            endAdornment={<InputAdornment style={{ paddingBottom: theme.spacing(0.5) }} position="end">km</InputAdornment>}
            inputProps={{
              step: 1,
              min,
              max,
              'aria-labelledby': 'distance',
              inputMode: 'numeric',
              pattern: '[0-9]*',
              style: { textAlign: 'right' },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Distance;
