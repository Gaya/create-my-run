import React, { useState } from 'react';

import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface StartingPointProps {
  location?: number;
  setLocation(newLocation: number): void;
}

const StartingPoint: React.FC<StartingPointProps> = ({ location }) => {
  const [locationSearch, setLocationSearch] = useState<string>('');

  const noOptionsText = locationSearch === '' ? 'Start typing to search...' : 'Nothing found...';

  return (
    <Autocomplete
      options={[]}
      value={location}
      inputValue={locationSearch}
      placeholder="Start typing to search"
      onInputChange={(event, newInputValue) => {
        setLocationSearch(newInputValue);
      }}
      loadingText="Loading locations"
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
