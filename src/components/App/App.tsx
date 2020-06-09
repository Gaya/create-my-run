import React, { useCallback, useState } from 'react';
import { RecoilRoot } from 'recoil';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import Configure from '../Configure/Configure';

import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: deepOrange,
  },
});

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <div className="App">
          <HeaderBar openDrawer={openDrawer} />
          <Configure
            isDrawerOpen={drawerOpen}
            onCloseDrawer={closeDrawer}
          />
          <RunMap />
        </div>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
