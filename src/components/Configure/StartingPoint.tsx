import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { locationsDataQuery, locationSearchState } from '../../state/location';
import { safeStoredLocation } from '../../state/utils';

interface StartingPointProps {
  location: string | null;
  setLocation(newLocation: string | null): void;
}

const StartingPoint: React.FC<StartingPointProps> = ({ location, setLocation }) => {
  const [locationInput, setLocationInput] = useState<string>(safeStoredLocation()?.name || '');
  const [debouncedLocation] = useDebounce(locationInput, 500);

  const setLocationSearchState = useSetRecoilState(locationSearchState);
  const locations = useRecoilValueLoadable(locationsDataQuery);

  const isLoading = locations.state === 'loading';

  const locationOptions = locations.state === 'hasValue' ? Object.values(locations.contents || {}) : [];
  const options = locationOptions.map(o => o.key);

  useEffect(() => {
    const name = safeStoredLocation()?.name || '';
    setLocationInput(name);
  }, []);

  useEffect(() => {
    setLocationSearchState(debouncedLocation);
  }, [debouncedLocation, setLocationSearchState]);

  const noOptionsText = locationInput === '' ? 'Start typing to search...' : undefined;

  const locationByKey = (l: string) => locations.state === 'hasValue' && locations.contents && locations.contents[l] ? locations.contents[l].name : '';

  return (
    <Autocomplete
      options={options}
      getOptionLabel={locationByKey}
      value={location}
      inputValue={locationInput}
      freeSolo
      filterOptions={(options) => options}
      placeholder="Start typing to search"
      onChange={(_, newLocation) => setLocation(newLocation)}
      onInputChange={(event, newInputValue) => {
        setLocationInput(newInputValue);
      }}
      loading={isLoading}
      loadingText="Loading locations..."
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          margin="normal"
          label="Starting point"
        />
      )}
    />
  );
};

export default StartingPoint;
