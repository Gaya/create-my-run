import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Grid,
  IconButton,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ExploreIcon from '@material-ui/icons/Explore';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import Configure from '../Configure/Configure';

const useStyles = makeStyles((theme: Theme) => ({
  sidebarWrapper: {
    flexGrow: 1,
    maxWidth: 380,
    padding: theme.spacing(2),
  },
  closeWrapper: {
    flexGrow: 0,
    flexBasis: 0,
  },
}));

interface SideBarProps {
  isDrawerOpen: boolean;
  onCloseDrawer(): void;
}

const SideBar: React.FC<SideBarProps> = ({ isDrawerOpen, onCloseDrawer }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setTabValue(newValue);
  };

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <div className={classes.sidebarWrapper}>
        <Grid item className={classes.closeWrapper} container justify="flex-end" xs={12}>
          <IconButton size="small" onClick={onCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Configure onRouteLoaded={onCloseDrawer} />
        </Grid>
      </div>

      <BottomNavigation
        value={tabValue}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction label="Create Run" icon={<ExploreIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        <BottomNavigationAction label="About" icon={<InfoIcon />} />
      </BottomNavigation>
    </Drawer>
  );
};

export default SideBar;
