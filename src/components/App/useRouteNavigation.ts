import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { history } from '../../utils/history';
import { randomSeed } from '../../store/route/utils';
import { updateRouteParameters } from '../../store/route/actions';

function hasRouteQueryParameters(search: string): boolean {
  const params = new URLSearchParams(search);
  const distance = params.get('distance');
  const routeType = params.get('routeType');
  const location = params.get('location');

  return !!(distance && routeType && location);
}

function useLoadRouteFromQueryParameters(): (search: string) => void {
  const dispatch = useDispatch();

  return useCallback((search: string): void => {
    const params = new URLSearchParams(search);
    const distance = params.get('distance');
    const routeType = params.get('routeType');
    const location = params.get('location');
    const r = params.get('r');
    const flipped = params.get('flipped');

    if (distance && routeType && location) {
      dispatch(updateRouteParameters({
        distance: parseInt(distance, 10),
        routeType: parseInt(routeType, 10),
        randomSeed: r ? parseInt(r, 10) : randomSeed(),
        flipped: !!(flipped && flipped !== 'false'),
        location,
      }));
    }
  }, [dispatch]);
}

function useRouteNavigation(closeDrawer: () => void): void {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const loadRouteFromQueryParameters = useLoadRouteFromQueryParameters();

  // listen to route changes
  useEffect(() => history.listen((action) => {
    loadRouteFromQueryParameters(action.location.search);
  }), [loadRouteFromQueryParameters]);

  // load initial route from query params
  const hasRoute = hasRouteQueryParameters(window.location.search);

  useEffect(() => {
    if (hasRoute && !initialLoaded) {
      loadRouteFromQueryParameters(window.location.search);
    }

    setInitialLoaded(true);
  }, [hasRoute, initialLoaded, loadRouteFromQueryParameters]);

  // initial load
  useEffect(() => {
    if (hasRoute) {
      // if has route, close drawer
      closeDrawer();
    }
  }, [closeDrawer, hasRoute]);
}

export default useRouteNavigation;
