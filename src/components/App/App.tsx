import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import MoreButton from '../MoreButton/MoreButton';
import SideBar from '../SideBar/SideBar';
import Error from '../Error/Error';

import { isDrawerOpenedSelector } from '../../store/app/selectors';
import { closeDrawer, openDrawer } from '../../store/app/actions';

import useRouteNavigation from './useRouteNavigation';
import useLocationHandler from './useLocationHandler';
import Debug from './Debug';

import './App.css';

const debugMode = true;

const App: React.FC = () => {
  const isDrawerOpened = useSelector(isDrawerOpenedSelector);
  const dispatch = useDispatch();

  const onOpenDrawer = useCallback(() => dispatch(openDrawer()), [dispatch]);
  const onCloseDrawer = useCallback(() => dispatch(closeDrawer()), [dispatch]);

  useRouteNavigation(onCloseDrawer);
  useLocationHandler();

  // set window height for CSS
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  return (
    <div className="App">
      <HeaderBar openDrawer={onOpenDrawer} />
      <SideBar isDrawerOpen={isDrawerOpened} onCloseDrawer={onCloseDrawer} />
      <RunMap />
      <MoreButton />
      <Error />
      {debugMode && <Debug />}
    </div>
  );
};

export default App;
