import { safeStoredLocation } from '../../utils/localStorage';

import { RouteState } from '../types';
import { RouteActions } from './actions';

const defaultRouteState: RouteState = {
  location: safeStoredLocation()?.key,
  route: {
    state: 'initial',
  },
};

function route(state: RouteState = defaultRouteState, action: RouteActions): RouteState {
  switch (action.type) {
    case 'ROUTE_RECEIVE':
      return {
        ...state,
        route: {
          state: 'hasValue',
          data: action.data,
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
