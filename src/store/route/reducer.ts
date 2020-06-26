import { RouteState } from '../types';
import { routeActions } from './actions';

const defaultRouteState: RouteState = {
  route: {
    state: 'initial',
  },
};

function route(state: RouteState = defaultRouteState, action: routeActions): RouteState {
  switch (action.type) {
    case 'ROUTE_UPDATE_PARAMETERS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default route;
