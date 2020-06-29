import { AppState } from '../types';
import { AppActions } from './actions';

import { safeStoredDistance } from '../../utils/localStorage';
import { RouteActions } from '../route/actions';

const storedDistanceSettings = safeStoredDistance();

const initialState: AppState = {
  drawerOpened: true,
  defaultDistance: storedDistanceSettings?.defaultDistance || 10,
  minimumDistance: storedDistanceSettings?.min || 1,
  maximumDistance: storedDistanceSettings?.max || 50,
};

function app(state = initialState, action: AppActions | RouteActions): AppState {
  switch (action.type) {
    case 'APP_OPEN_DRAWER':
      return {
        ...state,
        drawerOpened: true,
      };
    case 'ROUTE_RECEIVE':
    case 'APP_CLOSE_DRAWER':
      return {
        ...state,
        drawerOpened: false,
      };
    case 'APP_UPDATE_DISTANCE_SETTINGS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default app;
