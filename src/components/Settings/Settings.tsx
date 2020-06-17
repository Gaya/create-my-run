import React from 'react';
import { Divider, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import DistanceSettings from './DistanceSettings';
import LocalStorageSettings from './LocalStorageSettings';

const useStyles = makeStyles((theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const Settings: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <DistanceSettings />
      <Divider className={classes.divider} />
      <LocalStorageSettings />
    </>
  );
};

export default Settings;
