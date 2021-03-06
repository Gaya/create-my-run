import React from 'react';
import { Provider } from 'react-redux';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { store } from '../../store/store';

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
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        {children}
      </ErrorProvider>
    </ThemeProvider>
  </Provider>
);

export default AppWrapper;
