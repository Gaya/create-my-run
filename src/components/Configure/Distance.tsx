import React, { ChangeEvent, useState } from 'react';
import { Box, Grid, Input, InputLabel, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSetRecoilState } from 'recoil';
import { routeDistanceState } from '../../state/route';

function distanceValueText(value: number): string {
  return `${value} km`;
}

const marks = [10, 20, 30, 40, 50].map(v => ({ value: v, label: v }));

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
  defaultDistance = 10,
  min = 1,
  max = 50,
}) => {
  const classes = useStyles();

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
            onChange={(event, value) => setDistance(Array.isArray(value) ? value[0] : value)}
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
              min: 0,
              max: 50,
              type: 'number',
              'aria-labelledby': 'distance-slider',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Distance;
