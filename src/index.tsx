import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';
import AppWrapper from './components/App/AppWrapper';

import './index.css';

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById('root'),
);
