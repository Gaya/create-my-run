import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { RecoilRoot } from 'recoil';

import RunMap from '../RunMap/RunMap';
import HeaderBar from '../HeaderBar/HeaderBar';
import Configure from '../Configure/Configure';

import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

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
}

export default App;
