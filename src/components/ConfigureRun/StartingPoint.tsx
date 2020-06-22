import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import {
  CircularProgress, Grid, IconButton, TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import { locationsDataQuery, locationSearchState } from '../../state/location';
import { safeStoredLocation } from '../../state/utils';
import { API_URL } from '../../constants';

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
  const options = locationOptions.map((o) => o.key);

  useEffect(() => {
    const name = safeStoredLocation()?.name || '';
    setLocationInput(name);
  }, []);

  useEffect(() => {
    setLocationSearchState(debouncedLocation);
  }, [debouncedLocation, setLocationSearchState]);

  const hasGPS = 'geolocation' in navigator;

  const findCurrentLocation = (): void => {
    navigator.geolocation.getCurrentPosition((position) => fetch(`${API_URL}/locations?latlng=${[position.coords.latitude, position.coords.longitude].join(',')}`).then((res) => res.json()).then((res) => console.log(res)));
  };

  const noOptionsText = locationInput === '' ? 'Start typing to search...' : undefined;

  const locationLabelByKey = (l: string): string => (locations.state === 'hasValue' && locations.contents && locations.contents[l] ? locations.contents[l].name : '');

  return (
    <Autocomplete
      options={options}
      getOptionLabel={locationLabelByKey}
      value={location}
      inputValue={locationInput}
      freeSolo
      filterOptions={(opts): string[] => opts}
      placeholder="Start typing to search"
      onChange={(_, newLocation): void => setLocation(newLocation)}
      onInputChange={(event, newInputValue): void => {
        setLocationInput(newInputValue);
      }}
      loading={isLoading}
      loadingText="Loading locations..."
      noOptionsText={noOptionsText}
      renderInput={(params): React.ReactElement => (
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs="auto" style={{ flexGrow: 1 }}>
            <TextField
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              fullWidth
              margin="normal"
              label="Starting point"
            />
          </Grid>
          {hasGPS && (
            <Grid item>
              <IconButton>
                <LocationSearchingIcon fontSize="small" onClick={findCurrentLocation} />
              </IconButton>
            </Grid>
          )}
        </Grid>
      )}
    />
  );
};

export default StartingPoint;
