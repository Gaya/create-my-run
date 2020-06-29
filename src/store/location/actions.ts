import debounce from 'lodash.debounce';
import { Dispatch } from 'redux';

import { LatLng, LocationResponse, LocationsResponse } from '../../server/types';
import { API_URL } from '../../constants';
import { alertError } from '../../components/Error/ErrorProvider';

export interface ReceiveLatLngLocations {
  type: 'LOCATION_RECEIVE_LATLNG_LOCATIONS';
  payload: {
    locations: LocationResponse[];
    latLng: LatLng;
  };
}

export function receiveLatLngLocations(
  latLng: LatLng,
  locations: LocationResponse[],
): ReceiveLatLngLocations {
  return {
    type: 'LOCATION_RECEIVE_LATLNG_LOCATIONS',
    payload: {
      locations,
      latLng,
    },
  };
}

interface FindLocationByLatLng {
  type: 'LOCATION_FIND_BY_LATLNG';
  payload: LatLng;
}

export function findLocationByLatLng(latLng: LatLng) {
  return (dispatch: Dispatch): void => {
    dispatch({
      type: 'LOCATION_FIND_BY_LATLNG',
      payload: latLng,
    });

    fetch(`${API_URL}/locations?latlng=${latLng.join(',')}`)
      .then((res) => res.json() as Promise<LocationsResponse>)
      .then((res) => res.locations)
      .then((locations) => {
        dispatch(receiveLatLngLocations(latLng, locations));
      })
      .catch(() => {
        dispatch(searchLocationsFailed());
        alertError('Something went wrong looking for your location.');
        return [];
      });
  };
}

interface FindLocationBySearch {
  type: 'LOCATION_FIND_BY_SEARCH';
  payload: string;
}

export function findLocationBySearch(search: string): FindLocationBySearch {
  return {
    type: 'LOCATION_FIND_BY_SEARCH',
    payload: search,
  };
}

export interface ReceiveSearchLocations {
  type: 'LOCATION_RECEIVE_SEARCH_LOCATIONS';
  payload: {
    locations: LocationResponse[];
    search: string;
  };
}

export function receiveSearchLocations(
  search: string,
  locations: LocationResponse[],
): ReceiveSearchLocations {
  return {
    type: 'LOCATION_RECEIVE_SEARCH_LOCATIONS',
    payload: {
      locations,
      search,
    },
  };
}

interface SearchLocationsFailed {
  type: 'LOCATION_SEARCH_FAILED';
}

function searchLocationsFailed(): SearchLocationsFailed {
  return { type: 'LOCATION_SEARCH_FAILED' };
}

const debouncedSearch = debounce((dispatch: Dispatch<LocationActions>, search: string) => {
  if (search === '') return;

  dispatch(findLocationBySearch(search));

  fetch(`${API_URL}/locations?q=${search}`)
    .then((res) => res.json() as Promise<LocationsResponse>)
    .then((res) => res.locations)
    .then((locations) => { dispatch(receiveSearchLocations(search, locations)); })
    .catch(() => {
      dispatch(searchLocationsFailed());
      alertError('Something went wrong looking for a location.');
      return [];
    });
}, 500);

interface UpdateSearch {
  type: 'LOCATION_UPDATE_SEARCH';
  payload: string;
}

export function updateSearch(search: string) {
  return (dispatch: Dispatch<LocationActions>): void => {
    dispatch({
      type: 'LOCATION_UPDATE_SEARCH',
      payload: search,
    });

    debouncedSearch(dispatch, search);
  };
}

export type LocationActions = FindLocationByLatLng | FindLocationBySearch | UpdateSearch
  | ReceiveSearchLocations | ReceiveLatLngLocations | SearchLocationsFailed;
