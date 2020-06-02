import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { RoutesResponse } from '../../server/types';

import RunMap from '../RunMap/RunMap';

import './App.css';

import HeaderBar from './HeaderBar';
import Configure from './Configure';

const routeTypes: RouteType[] = [
  {
    id: 69,
    name: 'Recreative',
  },
  {
    id: 65,
    name: 'Nature',
  },
  {
    id: 66,
    name: 'Avoid cars',
  }
];

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  const [routeData, setRouteData] = useState<RoutesResponse>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const [distance, setDistance] = useState<number>(10);
  const [routeType, setRouteType] = useState<RouteType['id']>(routeTypes[0].id);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const generateRun = () => {
    if (fetching) return;

    const url = process.env.REACT_APP_API;

    setFetching(true);

    fetch(`${url}/route?distance=${distance}&routeType=${routeType}`)
      .then((res) => res.json() as Promise<RoutesResponse>)
      .then((route) => {
        setFetching(false);
        setRouteData(route);
        closeDrawer();
      })
      .catch(console.error);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar openDrawer={openDrawer} routeLength={routeData?.length} />
        <Configure
          isDrawerOpen={drawerOpen}
          onCloseDrawer={closeDrawer}
          distance={distance}
          setDistance={setDistance}
          routeTypes={routeTypes}
          routeType={routeType}
          setRouteType={setRouteType}
          isGenerating={fetching}
          onGenerateRun={generateRun}
        />
        <RunMap route={routeData} />
      </div>
    </ThemeProvider>
  );
}

export default App;
