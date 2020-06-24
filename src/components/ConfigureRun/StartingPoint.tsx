import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import {
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import {
  locationsDataQuery,
  locationSearchState,
  locationsState,
} from '../../state/location';
import { alertError } from '../Error/ErrorProvider';

interface StartingPointProps {
  location: string | null;
  setLocation(newLocation: string | undefined): void;
}

const StartingPoint: React.FC<StartingPointProps> = ({ location, setLocation }) => {
  const [locationSearch, setLocationSearchState] = useRecoilState(locationSearchState);
  const locationsSearchResults = useRecoilValueLoadable(locationsDataQuery(locationSearch));
  const [locations] = useRecoilState(locationsState);

  const isLoading = locationsSearchResults.state === 'loading';

  const locationOptions = locationsSearchResults.state === 'hasValue' ? locationsSearchResults.contents : [];
  const options = locationOptions.map((o) => o.key);

  const hasGPS = 'geolocation' in navigator;

  const findCurrentLocation = (): void => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocationSearchState([position.coords.latitude, position.coords.longitude]);
    }, () => {
      alertError("Couldn't get your location information");
    });
  };

  const locationLabelByKey = useCallback(
    (l: string): string => (locations && locations[l] ? locations[l].name : ''),
    [locations],
  );

  const [locationInput, setLocationInput] = useState<string>(location ? locationLabelByKey(location) : '');
  const [debouncedLocation] = useDebounce(locationInput, 500);

  // fill in name of location if non is present
  useEffect(() => {
    if (!location || locationInput !== '') return;

    const name = locationLabelByKey(location);
    setLocationInput(name);
  }, [location, locationInput, locationLabelByKey]);

  useEffect(() => {
    if (location) {
      const name = locationLabelByKey(location);

      if (name === debouncedLocation) {
        return;
      }
    }

    setLocationSearchState(debouncedLocation);
  }, [debouncedLocation, location, locationLabelByKey, setLocationSearchState]);

  const noOptionsText = locationInput === '' ? 'Start typing to search...' : undefined;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={locationLabelByKey}
      value={location}
      inputValue={locationInput}
      freeSolo
      filterOptions={(opts): string[] => opts}
      placeholder="Start typing to search"
      onChange={(_, newLocation): void => setLocation(newLocation || undefined)}
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
              <IconButton onClick={findCurrentLocation}>
                <LocationSearchingIcon fontSize="small" />
              </IconButton>
            </Grid>
          )}
        </Grid>
      )}
    />
  );
};

export default StartingPoint;
