import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import { alertError } from '../Error/ErrorProvider';

import {
  locationsBySearchSelector,
  locationsSelector,
  locationsStateSelector,
  searchSelector,
} from '../../store/location/selectors';
import { findLocationByLatLng, updateSearch } from '../../store/location/actions';

interface StartingPointProps {
  location: string | null;
  setLocation(newLocation: string | undefined): void;
}

const StartingPoint: React.FC<StartingPointProps> = ({ location, setLocation }) => {
  const dispatch = useDispatch();

  const searchQuery = useSelector(searchSelector);
  const locations = useSelector(locationsSelector);
  const locationsBySearch = useSelector(locationsBySearchSelector);
  const locationsState = useSelector(locationsStateSelector);

  const isLoading = locationsState === 'loading';

  const options = locationsBySearch[searchQuery] || [];

  const hasGPS = 'geolocation' in navigator;

  const findCurrentLocation = (): void => {
    navigator.geolocation.getCurrentPosition((position) => {
      dispatch(findLocationByLatLng([position.coords.latitude, position.coords.longitude]));
    }, () => {
      alertError("Couldn't get your location information");
    });
  };

  const locationLabelByKey = useCallback(
    (l: string): string => (locations && locations[l] ? locations[l].name : ''),
    [locations],
  );

  const noOptionsText = searchQuery === '' ? 'Start typing to search...' : undefined;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={locationLabelByKey}
      value={location}
      inputValue={searchQuery}
      freeSolo
      filterOptions={(opts): string[] => opts}
      placeholder="Start typing to search"
      onChange={(_, newLocation): void => setLocation(newLocation || undefined)}
      onInputChange={(event, newInputValue): void => {
        dispatch(updateSearch(newInputValue));
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
