import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Grid,
  Input,
  InputLabel,
  Typography,
} from '@material-ui/core';
import { useRecoilState } from 'recoil';

import { defaultDistanceState, maximumDistanceState, minimumDistanceState } from '../../state/app';
import { storeDistanceSettings } from '../../utils/localStorage';

const DistanceSettings: React.FC = () => {
  const [defaultState, setDefaultState] = useRecoilState(defaultDistanceState);
  const [minState, setMinState] = useRecoilState(minimumDistanceState);
  const [maxState, setMaxState] = useRecoilState(maximumDistanceState);

  const [defaultDistance, setDefaultDistance] = useState<number>(defaultState);
  const [minDistance, setMinDistance] = useState<number>(minState);
  const [maxDistance, setMaxDistance] = useState<number>(maxState);

  useEffect(
    () => {
      if (defaultState !== defaultDistance) {
        setDefaultState(defaultDistance);
      }

      if (minState !== minDistance) {
        setMinState(minDistance);
      }

      if (maxState !== maxDistance) {
        setMaxState(maxDistance);
      }

      storeDistanceSettings({
        defaultDistance,
        min: minDistance,
        max: maxDistance,
      });
    },
    [
      defaultDistance,
      defaultState,
      maxDistance,
      maxState,
      minDistance,
      minState,
      setDefaultState,
      setMaxState,
      setMinState,
    ],
  );

  const createHandleInputChange = (
    onChange: (value: number) => void,
  ) => (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(parseInt(event.target.value, 10));
  };

  const handleDefaultDistanceBlur = (): void => {
    if (defaultDistance < minDistance) {
      setDefaultDistance(minDistance);
    }

    if (defaultDistance > maxDistance) {
      setDefaultDistance(maxDistance);
    }
  };

  const handleMinDistanceBlur = (): void => {
    let correctedDistance = minDistance;

    if (minDistance >= maxDistance) {
      correctedDistance = maxDistance - 1;
    }

    if (minDistance > defaultDistance) {
      correctedDistance = defaultDistance;
    }

    if (correctedDistance !== minDistance) {
      setMinDistance(correctedDistance);
    }
  };

  const handleMaxDistanceBlur = (): void => {
    let correctedDistance = maxDistance;

    if (maxDistance <= minDistance) {
      correctedDistance = minDistance + 1;
    }

    if (maxDistance < defaultDistance) {
      correctedDistance = defaultDistance;
    }

    if (correctedDistance !== maxDistance) {
      setMaxDistance(correctedDistance);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>
          Distance Settings
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="default-distance" shrink>
          Default
        </InputLabel>
        <Input
          value={defaultDistance}
          margin="dense"
          onChange={createHandleInputChange(setDefaultDistance)}
          onBlur={handleDefaultDistanceBlur}
          endAdornment="km"
          fullWidth
          inputProps={{
            step: 1,
            min: minDistance,
            max: maxDistance,
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="min-distance" shrink>
          Minimum
        </InputLabel>
        <Input
          value={minDistance}
          margin="dense"
          onChange={createHandleInputChange(setMinDistance)}
          onBlur={handleMinDistanceBlur}
          endAdornment="km"
          fullWidth
          inputProps={{
            step: 1,
            min: 1,
            max: maxDistance - 1,
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="max-distance" shrink>
          Maximum
        </InputLabel>
        <Input
          value={maxDistance}
          margin="dense"
          onChange={createHandleInputChange(setMaxDistance)}
          onBlur={handleMaxDistanceBlur}
          endAdornment="km"
          fullWidth
          inputProps={{
            step: 1,
            min: minDistance + 1,
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DistanceSettings;
