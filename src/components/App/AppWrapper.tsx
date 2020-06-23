import React from 'react';
import { RecoilRoot } from 'recoil';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

import ErrorProvider from '../Error/ErrorProvider';

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
    <ErrorProvider>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </ErrorProvider>
  </ThemeProvider>
);

export default AppWrapper;
