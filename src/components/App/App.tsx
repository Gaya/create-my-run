import React, { useEffect, useState } from 'react';

import { RoutesResponse } from '../../server/types';

import RunMap from '../RunMap/RunMap';

import './App.css';

function App() {
  const [routeData, setRouteData] = useState<RoutesResponse>();
  const [fetching, setFetching] = useState<Boolean>(false);

  useEffect(() => {
    if (fetching || routeData) return;

    setFetching(true);

    import('../../mocks/transformed.json')
      .then((result) => {
        setFetching(false);
        setRouteData(result.default as RoutesResponse);
      });
    // const url = 'http://localhost:4000';
    //
    // fetch(`${url}/route`)
    //   .then((res) => res.json() as Promise<RoutesResponse>)
    //   .then(console.log)
    //   .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Generate a Run Route
      </header>
      <RunMap route={routeData} />
    </div>
  );
}

export default App;
