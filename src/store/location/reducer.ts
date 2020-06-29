import { LocationState } from '../types';

import { safeStoredLocation } from '../../utils/localStorage';
import { LocationActions } from './actions';

const storedLocation = safeStoredLocation();

const defaultLocationState: LocationState = {
  byLatLng: {},
  bySearch: {},
  locations: storedLocation ? { [storedLocation.key]: storedLocation } : {},
  state: 'idle',
  search: storedLocation?.name || '',
};

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
    case 'LOCATION_RECEIVE_SEARCH_LOCATIONS':
      return {
        ...state,
        state: 'idle',
        bySearch: {
          ...state.bySearch,
          [action.payload.search]: action.payload.locations.map((item) => item.key),
        },
        locations: action.payload.locations.reduce(
          (acc, item) => ({
            ...acc,
            [item.key]: item,
          }),
          state.locations,
        ),
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
