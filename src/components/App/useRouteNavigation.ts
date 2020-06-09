import { useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';

import {
  routeDistanceState,
  routeLocationState,
  routeRandomSeedState,
  routeTypeState,
} from '../../state/route';
import { history } from '../../utils/history';
import { randomSeed } from '../../state/utils';

function useRouteNavigation(): void {
  const setDistanceState = useSetRecoilState(routeDistanceState);
  const setRouteTypeState = useSetRecoilState(routeTypeState);
  const setRouteLocationState = useSetRecoilState(routeLocationState);
  const setRouteRandomSeedState = useSetRecoilState(routeRandomSeedState);

  // handle route loading on route change
  const loadRouteFromQueryParameters = useCallback((search: string) => {
    const params = new URLSearchParams(search);
    const distance = params.get('distance');
    const routeType = params.get('routeType');
    const location = params.get('location');
    const r = params.get('r');

    if (distance && routeType && location) {
      setDistanceState(parseInt(distance, 10));
      setRouteTypeState(parseInt(routeType, 10));
      setRouteLocationState(location);
      setRouteRandomSeedState(r ? parseInt(r, 10) : randomSeed());
    }
  }, [setDistanceState, setRouteLocationState, setRouteRandomSeedState, setRouteTypeState]);

  // listen to route changes
  useEffect(() => history.listen((location) => {
    loadRouteFromQueryParameters(location.search);
  }), [loadRouteFromQueryParameters]);

  // initial load
  useEffect(() => {
    loadRouteFromQueryParameters(window.location.search);
  }, [loadRouteFromQueryParameters]);
}

export default useRouteNavigation;
