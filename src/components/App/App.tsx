import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import ExportButton from '../ExportButton/ExportButton';
import SideBar from '../SideBar/SideBar';

import { drawerOpenState } from '../../state/app';

import useRouteNavigation from './useRouteNavigation';

import './App.css';

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useRecoilState(drawerOpenState);

  const openDrawer = useCallback(() => setDrawerOpen(true), [setDrawerOpen]);
  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

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
