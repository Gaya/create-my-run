import React, { ChangeEvent, useState } from 'react';
import {
  Grid, Input, InputLabel, TextField,
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
        <InputLabel id="distance" shrink>
          Default distance
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
      <Grid item xs={12}>
        Minimal distance
      </Grid>
      <Grid item xs={12}>
        Maximum distance
      </Grid>
    </Grid>
  );
};

export default Settings;
