import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

import { ErrorContext } from './ErrorProvider';

const Error: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  const handleClose = (event?: React.SyntheticEvent, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }

    errorContext.resetError();
  };

  return (
    <Snackbar
      open={!!errorContext.error}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Alert onClose={handleClose} severity="error">{errorContext.error}</Alert>
    </Snackbar>
  );
};

export default Error;
