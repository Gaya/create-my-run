import { safeStoredLocation } from '../../utils/localStorage';

import { RouteState } from '../types';
import { RouteActions } from './actions';
import { LocationActions } from '../location/actions';

const defaultRouteState: RouteState = {
  location: safeStoredLocation()?.key,
  route: {
    state: 'initial',
  },
};

function route(
  state: RouteState = defaultRouteState,
  action: RouteActions | LocationActions,
): RouteState {
  switch (action.type) {
    case 'LOCATION_RECEIVE_LATLNG_LOCATIONS':
      return {
        ...state,
        location: action.payload.locations[0].key,
      };
    case 'ROUTE_UPDATE_LOCATION':
      return {
        ...state,
        location: action.payload,
      };
    case 'ROUTE_RECEIVE':
      return {
        ...state,
        route: {
          state: 'hasValue',
          data: action.payload,
        },
      };
    case 'ROUTE_UPDATE_PARAMETERS':
      return {
        ...state,
        ...action.payload,
        route: {
          state: 'loading',
        },
      };
    default:
      return state;
  }
}

export default route;
