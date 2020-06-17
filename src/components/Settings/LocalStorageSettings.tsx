import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';

import { removeStoredDistanceSettings, removeStoredLocation } from '../../state/utils';

const LocalStorageSettings: React.FC = () => {
  const onRemoveLocation = (): void => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove your store location?')) {
      removeStoredLocation();
      window.location.reload();
    }
  };

  const onResetSettings = (): void => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to reset your settings to the defaults?')) {
      removeStoredDistanceSettings();
      window.location.reload();
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>
          Storage
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onRemoveLocation}
        >
          Remove Stored Location
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={onResetSettings}
        >
          Reset Settings
        </Button>
      </Grid>
    </Grid>
  );
};

export default LocalStorageSettings;
