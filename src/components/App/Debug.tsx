import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { locationSearchState, locationsState } from '../../state/location';
import { routeParams } from '../../state/route';

function useRecoilStateTracker<T>(watch: T): T {
  const [value, setValue] = useState(watch);
  useEffect(() => {
    setValue(watch);
  }, [watch]);

  return value;
}

const Debug: React.FC = () => {
  useRecoilStateTracker(useRecoilValue(routeParams));
  useRecoilStateTracker(useRecoilValue(locationSearchState));
  useRecoilStateTracker(useRecoilValue(locationsState));

  return (
    <div style={{
      position: 'absolute', bottom: 10, right: 10, zIndex: 10, padding: 10, background: 'white',
    }}
    >
      Inspect React to debug
    </div>
  );
};

export default Debug;
