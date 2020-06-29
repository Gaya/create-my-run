import debounce from 'lodash.debounce';

import { Dispatch } from 'redux';
import { LatLng, LocationResponse, LocationsResponse } from '../../server/types';
import { API_URL } from '../../constants';
import { alertError } from '../../components/Error/ErrorProvider';

interface FindLocationByLatLng {
  type: 'LOCATION_FIND_BY_LATLNG';
  payload: LatLng;
}

export function findLocationByLatLng(latLng: LatLng): FindLocationByLatLng {
  return {
    type: 'LOCATION_FIND_BY_LATLNG',
    payload: latLng,
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

interface ReceiveSearchLocations {
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
      alertError('Something went from looking for a location.');
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
  | ReceiveSearchLocations | SearchLocationsFailed;
