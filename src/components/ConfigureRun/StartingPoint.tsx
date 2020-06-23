import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import {
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import {
  locationPointState,
  locationsDataQuery,
  locationSearchState,
  setOnCompleteLocation,
} from '../../state/location';
import { safeStoredLocation } from '../../utils/localStorage';
import { alertError } from '../Error/ErrorProvider';
import { routeLocationState } from '../../state/route';

interface StartingPointProps {
  location: string | null;
  setLocation(newLocation: string | null): void;
}

const StartingPoint: React.FC<StartingPointProps> = ({ location, setLocation }) => {
  const [locationInput, setLocationInput] = useState<string>(safeStoredLocation()?.name || '');
  const [debouncedLocation] = useDebounce(locationInput, 500);

  const setRouteLocation = useSetRecoilState(routeLocationState);
  const [q, setLocationSearchState] = useRecoilState(locationSearchState);
  const [latLng, setLocationPointState] = useRecoilState(locationPointState);
  const locations = useRecoilValueLoadable(locationsDataQuery({ q, latLng }));

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
    navigator.geolocation.getCurrentPosition((position) => {
      setLocationPointState([position.coords.latitude, position.coords.longitude]);
    }, () => {
      alertError("Couldn't get your location information");
    });
  };

  // update start location when searching with lat lng
  useEffect(() => {
    setOnCompleteLocation((foundLocations) => {
      if (foundLocations.length > 0) {
        setRouteLocation(foundLocations[0].key);
        setLocation(foundLocations[0].key);
        setLocationInput(foundLocations[0].name);
      }
    });
  }, [setLocation, setRouteLocation]);

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
