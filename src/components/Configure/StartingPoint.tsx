import React, { useState } from 'react';

import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const StartingPoint: React.FC = () => {
  const [location, setLocation] = useState<number>();
  const [locationSearch, setLocationSearch] = useState<string>('');

  const noOptionsText = locationSearch === '' ? 'Start searching...' : 'Nothing found...';

  return (
    <Autocomplete
      options={[]}
      value={location}
      inputValue={locationSearch}
      onInputChange={(event, newInputValue) => {
        setLocationSearch(newInputValue);
      }}
      noOptionsText={noOptionsText}
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
