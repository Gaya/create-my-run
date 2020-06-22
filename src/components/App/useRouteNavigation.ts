import { useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';

import {
  routeDistanceState, routeFlippedState,
  routeLocationState,
  routeRandomSeedState,
  routeTypeState,
  setOnCompleteRoute,
} from '../../state/route';
import { history } from '../../utils/history';
import { randomSeed } from '../../state/utils';

function useRouteNavigation(closeDrawer: () => void): void {
  const setDistanceState = useSetRecoilState(routeDistanceState);
  const setRouteTypeState = useSetRecoilState(routeTypeState);
  const setRouteLocationState = useSetRecoilState(routeLocationState);
  const setRouteRandomSeedState = useSetRecoilState(routeRandomSeedState);
  const setRouteFlippedState = useSetRecoilState(routeFlippedState);

  // handle route loading on route change
  const loadRouteFromQueryParameters = useCallback((search: string): boolean => {
    const params = new URLSearchParams(search);
    const distance = params.get('distance');
    const routeType = params.get('routeType');
    const location = params.get('location');
    const r = params.get('r');
    const flipped = params.get('flipped');

    if (distance && routeType && location) {
      setDistanceState(parseInt(distance, 10));
      setRouteTypeState(parseInt(routeType, 10));
      setRouteLocationState(location);
      setRouteRandomSeedState(r ? parseInt(r, 10) : randomSeed());
      setRouteFlippedState(!!(flipped && flipped !== 'false'));

      return true;
    }

    return false;
  }, [
    setDistanceState,
    setRouteFlippedState,
    setRouteLocationState,
    setRouteRandomSeedState,
    setRouteTypeState,
  ]);

  // listen to route changes
  useEffect(() => history.listen((location) => {
    loadRouteFromQueryParameters(location.search);
  }), [loadRouteFromQueryParameters]);

  const hasRoute = loadRouteFromQueryParameters(window.location.search);

  // initial load
  useEffect(() => {
    if (hasRoute) {
      // if has route, close drawer
      closeDrawer();
    }
  }, [closeDrawer, hasRoute]);

  // register closing drawer after route is loaded
  useEffect(() => {
    setOnCompleteRoute(closeDrawer);
  }, [closeDrawer]);
}

export default useRouteNavigation;
