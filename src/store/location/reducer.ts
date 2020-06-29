import { LocationState } from '../types';

import { safeStoredLocation } from '../../utils/localStorage';
import { Locations } from '../../types';

import { LocationActions, ReceiveLatLngLocations, ReceiveSearchLocations } from './actions';

const storedLocation = safeStoredLocation();

const defaultLocationState: LocationState = {
  byLatLng: {},
  bySearch: {},
  locations: storedLocation ? { [storedLocation.key]: storedLocation } : {},
  state: 'idle',
  search: storedLocation?.name || '',
};

function locations(
  action: ReceiveLatLngLocations | ReceiveSearchLocations,
  state: LocationState,
): Locations {
  return action.payload.locations.reduce(
    (acc, item) => ({
      ...acc,
      [item.key]: item,
    }),
    state.locations,
  );
}

function location(
  state: LocationState = defaultLocationState,
  action: LocationActions,
): LocationState {
  switch (action.type) {
    case 'LOCATION_FIND_BY_LATLNG':
    case 'LOCATION_FIND_BY_SEARCH':
      return {
        ...state,
        state: 'loading',
      };
    case 'LOCATION_SEARCH_FAILED':
      return {
        ...state,
        state: 'idle',
      };
    case 'LOCATION_RECEIVE_LATLNG_LOCATIONS':
      return {
        ...state,
        search: action.payload.locations[0].name,
        state: 'idle',
        byLatLng: {
          ...state.byLatLng,
          [action.payload.latLng.join(',')]: action.payload.locations.map((item) => item.key),
        },
        locations: locations(action, state),
      };
    case 'LOCATION_RECEIVE_SEARCH_LOCATIONS':
      return {
        ...state,
        state: 'idle',
        bySearch: {
          ...state.bySearch,
          [action.payload.search]: action.payload.locations.map((item) => item.key),
        },
        locations: locations(action, state),
      };
    case 'LOCATION_UPDATE_SEARCH':
      return {
        ...state,
        search: action.payload,
      };
    default:
      return state;
  }
}

export default location;
