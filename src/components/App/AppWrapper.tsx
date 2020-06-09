import React from 'react';
import { RecoilRoot } from 'recoil';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: deepOrange,
  },
});

const AppWrapper: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <RecoilRoot>
      {children}
    </RecoilRoot>
  </ThemeProvider>
);

export default AppWrapper;
