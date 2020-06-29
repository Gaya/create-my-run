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
