import React, { ChangeEvent, useState } from 'react';
import {
  Divider,
  Grid, Input, InputLabel, TextField, Typography,
} from '@material-ui/core';

const Settings: React.FC = () => {
  const [defaultDistance, setDefaultDistance] = useState<number>(10);
  const [minDistance, setMinDistance] = useState<number>(1);
  const [maxDistance, setMaxDistance] = useState<number>(50);

  const createHandleInputChange = (
    onChange: (value: number) => void,
  ) => (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(parseInt(event.target.value, 10));
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

export default Settings;
