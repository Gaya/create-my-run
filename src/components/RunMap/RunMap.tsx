import React from 'react';

import { RoutesResponse } from '../../server/types';

import './RunMap.css';

interface RunMapProps {
  route?: RoutesResponse;
}

const RunMap: React.FC<RunMapProps> = ({ route }) => {
  console.log(route);

  return (
    <div className="App-Map">
      MAP
    </div>
  );
};

export default RunMap;
