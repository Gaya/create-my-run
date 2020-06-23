import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

import { ErrorContext } from './ErrorProvider';

const Error: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  return (
    <Snackbar
      open={!!errorContext.error}
      autoHideDuration={4000}
      onClose={errorContext.resetError}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Alert onClose={errorContext.resetError} severity="error">{errorContext.error}</Alert>
    </Snackbar>
  );
};

export default Error;
