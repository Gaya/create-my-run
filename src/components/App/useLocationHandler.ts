import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import {
  locationsDataQuery,
  locationSearchState,
  locationsState,
  mergeCachedLocations,
} from '../../state/location';
import { routeLocationState } from '../../state/route';

function useLocationHandler(): void {
  const [locationSearch] = useRecoilState(locationSearchState);
  const locationsSearchResults = useRecoilValueLoadable(locationsDataQuery(locationSearch));
  const [locations, setLocations] = useRecoilState(locationsState);
  const routeLocation = useRecoilValue(routeLocationState);

  useEffect(() => {
    if (locationsSearchResults.state === 'hasValue') {
      const newLocations = mergeCachedLocations(locationsSearchResults.contents, locations);

      if (Object.keys(newLocations).sort().join('.') !== Object.keys(locations).sort().join('.')) {
        setLocations(newLocations);
      }
    }
  }, [locations, locationsSearchResults, setLocations]);
}

export default useLocationHandler;
