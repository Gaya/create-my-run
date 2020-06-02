import React from 'react';

import { Input, InputLabel, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const StartingPoint: React.FC = () => {
  return (
    <Autocomplete
      options={[]}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          margin="normal"
          label="Starting point"
        />
      )}
    />
  );
};

export default StartingPoint;
