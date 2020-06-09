import React, { useCallback, useState } from 'react';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import Configure from '../Configure/Configure';

import './App.css';
import useRouteNavigation from './useRouteNavigation';

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useRouteNavigation(closeDrawer);

  return (
    <div className="App">
      <HeaderBar openDrawer={openDrawer} />
      <Configure
        isDrawerOpen={drawerOpen}
        onCloseDrawer={closeDrawer}
      />
      <RunMap />
    </div>
  );
};

export default App;
