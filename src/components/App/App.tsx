import React, { useCallback, useEffect, useState } from 'react';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import ExportButton from '../ExportButton/ExportButton';

import './App.css';
import useRouteNavigation from './useRouteNavigation';
import SideBar from '../SideBar/SideBar';

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useRouteNavigation(closeDrawer);

  // set window height for CSS
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  return (
    <div className="App">
      <HeaderBar openDrawer={openDrawer} />
      <SideBar isDrawerOpen={drawerOpen} onCloseDrawer={closeDrawer} />
      <RunMap />
      <ExportButton />
    </div>
  );
};

export default App;
